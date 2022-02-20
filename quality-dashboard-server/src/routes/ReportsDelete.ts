import * as fse from "fs-extra";
import * as path from "path";
import * as targz from "targz";
import { Config } from "../Config";
import { ReportsDB } from "../db/ReportsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance, options) {
  //

  interface DeleteRequest extends RequestGenericInterface {
    Params: {
      groupName: string;
      projectName: string;
      projectVersion: string;
    };
  }
  fastify.delete<DeleteRequest>(
    `${Config.API_BASE_PATH}/reports/:groupName/:projectName/:projectVersion/`,
    async (req, res) => {
      const versionFolder = `${Config.REPORT_DIR}/${req.params.groupName}/${req.params.projectName}/${req.params.projectVersion}`;
      // if (!req.user.authenticated) {
      //   return res.status(403).send({ error: "ERR: authentication error" });
      // }
      if (fse.existsSync(versionFolder)) {
        await fse.remove(versionFolder);
      }
      ReportsDB.deleteVersion(req.params.groupName, req.params.projectName, req.params.projectVersion);
      return res.status(202).send({});
    }
  );
}

module.exports = routes;
