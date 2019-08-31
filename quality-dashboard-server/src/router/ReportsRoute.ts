import * as express from 'express';
import * as fse from 'fs-extra';
import * as path from 'path';
import * as targz from 'targz';
import { Config } from '../Config';
import { ReportsDB } from '../db/ReportsDB';
import { ExpressRouterWrapper as ERW } from '../utils-std-ts/express-router-wrapper';
import { Logger } from '../utils-std-ts/logger';

export const ReportsRoute = express.Router();
const logger = new Logger('ReportsRoute');

ERW.route(ReportsRoute, 'get', '/', async (req, res) => {
  return res.status(200).send(await ReportsDB.list());
});

ERW.route(ReportsRoute, 'delete', '/', async (req, res, next, stopAndSend) => {
  if (process.env.NODE_ENV !== 'dev') {
    stopAndSend(404, 'ERR: Reset forbidden for non dev environment');
  }
  ReportsDB.reset();
  return res.status(202).send({});
});

ERW.route(
  ReportsRoute,
  'post',
  '/:groupName/:projectName/:projectVersion/:reportName/:processorType',
  async (req, res) => {
    const reportFolder = `${Config.REPORT_DIR}/${req.params.groupName}/${req.params.projectName}/${req.params.projectVersion}/${req.params.reportName}`;
    if (fse.existsSync(reportFolder)) {
      await fse.remove(reportFolder);
    }
    await fse.ensureDir(reportFolder);
    if ((req as any).files && (req as any).files.report) {
      const reportName = (req as any).files.report.name;
      if (path.extname(reportName) === '.gz') {
        await (req as any).files.report.mv(`${reportFolder}/${reportName}`);
        await extractTo(`${reportFolder}/${(req as any).files.report.name}`, `${reportFolder}/report`);
      } else if (path.extname(reportName) === '.html') {
        await fse.ensureDir(`${reportFolder}/report`);
        await (req as any).files.report.mv(`${reportFolder}/report/report.html`);
      } else {
        throw new Error('Wrong report extension');
      }
    } else {
      await fse.ensureDir(`${reportFolder}/report`);
      await fse.writeJson(`${reportFolder}/report/data.json`, req.body);
    }
    let processor;
    if (fse.existsSync(`${Config.PROCESSOR_DIR_USER}/${req.params.processorType}.js`)) {
      processor = require(`${Config.PROCESSOR_DIR_USER}/${req.params.processorType}.js`);
    } else if (fse.existsSync(`${Config.PROCESSOR_DIR}/${req.params.processorType}.js`)) {
      processor = require(`${Config.PROCESSOR_DIR}/${req.params.processorType}.js`);
    }
    if (processor) {
      logger.info('Processor found');
      try {
        const result = await processor.analyse(`${reportFolder}/report`);
        logger.info(result);
        ReportsDB.add(
          req.params.groupName,
          req.params.projectName,
          req.params.projectVersion,
          req.params.reportName,
          req.params.processorType,
          result
        );
      } catch (err) {
        logger.error(err);
      }
    }
    return res.status(201).send({});
  }
);

ERW.route(ReportsRoute, 'delete', '/:groupName/:projectName/:projectVersion', async (req, res, next, stopAndSend) => {
  const versionFolder = `${Config.REPORT_DIR}/${req.params.groupName}/${req.params.projectName}/${req.params.projectVersion}`;
  if (!req.user.authenticated) {
    stopAndSend(403, 'ERR: authentication error');
  }
  if (fse.existsSync(versionFolder)) {
    await fse.remove(versionFolder);
  }
  ReportsDB.deleteVersion(req.params.groupName, req.params.projectName, req.params.projectVersion);
  return res.status(202).send({});
});

function extractTo(src: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    targz.decompress(
      {
        dest,
        src
      },
      async err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}
