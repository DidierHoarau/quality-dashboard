import * as fse from "fs-extra";
import * as path from "path";
import * as targz from "targz";
import { Config } from "../Config";
import { ReportsDB } from "../db/ReportsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";

const logger = new Logger("ReportsRoute");

async function routes(fastify: FastifyInstance, options) {
  //
  fastify.get(`${Config.API_BASE_PATH}/reports`, async (req, res) => {
    return res.status(200).send(await ReportsDB.list());
  });

  fastify.delete(`${Config.API_BASE_PATH}/`, async (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
      return res.status(404).send({ error: "ERR: Reset forbidden for non dev environment" });
    }
    ReportsDB.reset();
    return res.status(202).send({});
  });

  interface AddReportRequest extends RequestGenericInterface {
    Params: {
      groupName: string;
      projectName: string;
      projectVersion: string;
      reportName: string;
      processorType: string;
    };
    Querystring: {
      data_json: string;
    };
  }
  fastify.post<AddReportRequest>(
    `${Config.API_BASE_PATH}/:groupName/:projectName/:projectVersion/:reportName/:processorType`,
    async (req, res) => {
      const reportFolder = `${Config.REPORT_DIR}/${req.params.groupName}/${req.params.projectName}/${req.params.projectVersion}/${req.params.reportName}`;
      if (fse.existsSync(reportFolder)) {
        await fse.remove(reportFolder);
      }
      await fse.ensureDir(reportFolder);
      if ((req as any).files && (req as any).files.report) {
        const reportName = (req as any).files.report.name;
        if (path.extname(reportName) === ".gz") {
          await (req as any).files.report.mv(`${reportFolder}/${reportName}`);
          await extractTo(`${reportFolder}/${(req as any).files.report.name}`, `${reportFolder}/report`);
        } else if (path.extname(reportName) === ".html") {
          await fse.ensureDir(`${reportFolder}/report`);
          await (req as any).files.report.mv(`${reportFolder}/report/report.html`);
        } else {
          throw new Error("Wrong report extension");
        }
      } else {
        await fse.ensureDir(`${reportFolder}/report`);
        await fse.writeJson(`${reportFolder}/report/data.json`, req.body);
      }
      if (req.params.processorType === "json" && req.query && req.query.data_json) {
        await fse.ensureDir(`${reportFolder}/report`);
        const reportData = JSON.parse(req.query.data_json);
        if ((req as any).files && (req as any).files.report) {
          reportData.link = "report.html";
        }
        await fse.writeJson(`${reportFolder}/report/data.json`, reportData);
      }

      let processor;
      if (fse.existsSync(`${Config.PROCESSOR_DIR_USER}/${req.params.processorType}.js`)) {
        processor = require(`${Config.PROCESSOR_DIR_USER}/${req.params.processorType}.js`);
      } else if (fse.existsSync(`${Config.PROCESSOR_DIR}/${req.params.processorType}.js`)) {
        processor = require(`${Config.PROCESSOR_DIR}/${req.params.processorType}.js`);
      }
      if (processor) {
        logger.info("Processor found");
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

  interface DeleteRequest extends RequestGenericInterface {
    Params: {
      groupName: string;
      projectName: string;
      projectVersion: string;
    };
  }
  fastify.delete<DeleteRequest>(`${Config.API_BASE_PATH}/:groupName/:projectName/:projectVersion`, async (req, res) => {
    const versionFolder = `${Config.REPORT_DIR}/${req.params.groupName}/${req.params.projectName}/${req.params.projectVersion}`;
    // if (!req.user.authenticated) {
    //   return res.status(403).send({ error: "ERR: authentication error" });
    // }
    if (fse.existsSync(versionFolder)) {
      await fse.remove(versionFolder);
    }
    ReportsDB.deleteVersion(req.params.groupName, req.params.projectName, req.params.projectVersion);
    return res.status(202).send({});
  });
}

module.exports = routes;

function extractTo(src: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    targz.decompress(
      {
        dest,
        src,
      },
      async (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}
