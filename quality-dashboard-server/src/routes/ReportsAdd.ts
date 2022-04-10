import * as fse from "fs-extra";
import * as path from "path";
import * as targz from "targz";
import * as util from "util";
import { pipeline } from "stream";
import { Config } from "../Config";
import { ReportsDB } from "../db/ReportsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";
import { Auth } from "./Auth";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance): Promise<void> {
  //
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
    `${Config.API_BASE_PATH}/reports/:groupName/:projectName/:projectVersion/:reportName/:processorType`,
    async (req, res) => {
      logger.info(`[${req.method}] ${req.url}`);
      const auth = await Auth.checkAuthHeader(req.headers);

      if (!auth.authenticated && !auth.validUploadToken ) {
        return res.status(403).send({});
      }

      const reportFolder = `${Config.REPORT_DIR}/${req.params.groupName}/${req.params.projectName}/${req.params.projectVersion}/${req.params.reportName}`;
      if (fse.existsSync(reportFolder)) {
        await fse.remove(reportFolder);
      }
      await fse.ensureDir(reportFolder);

      const pump = util.promisify(pipeline);
      const data = await (req as any).file();

      if (data.filename) {
        const reportName = data.filename;
        if (path.extname(reportName) === ".gz") {
          await pump(data.file, fse.createWriteStream(`${reportFolder}/_report.tar.gz`));
          await extractTo(`${reportFolder}/_report.tar.gz`, `${reportFolder}/report`).catch(err => {
            logger.error(`Failed to extract report: ${err.message}`);
            throw new Error(`Failed to extract report: ${err.message}`)
          });
        } else if (path.extname(reportName) === ".html") {
          await fse.ensureDir(`${reportFolder}/report`);
          await pump(data.file, fse.createWriteStream(`${reportFolder}/report/report.html`));
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
      if (!processor) {
        logger.error("Processor not found");
        return res.status(404).send({ error: "ERR: Procesor not found" });
      }
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

      return res.status(201).send({});
    }
  );
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
          logger.error(err)
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}
