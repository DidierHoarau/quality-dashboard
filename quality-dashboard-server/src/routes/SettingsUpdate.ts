import * as path from "path";
import { Auth } from "./Auth";
import { Config } from "../Config";
import { SettingsDB } from "../db/SettingsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance): Promise<void> {
  //
  interface UpdateSettingsRequest extends RequestGenericInterface {
    Body: {
      isDashboardPublic: boolean;
      uploadToken: string;
    };
  }
  fastify.put<UpdateSettingsRequest>(`${Config.API_BASE_PATH}/settings/`, async (req, res) => {
    logger.info(`[${req.method}] ${req.url}`);
    const auth = await Auth.checkAuthHeader(req.headers);
    if (!auth.authenticated) {
      return res.status(403).send({});
    }
    await SettingsDB.update({ isDashboardPublic: req.body.isDashboardPublic, uploadToken: req.body.uploadToken });
    return res.status(202).send({});
  });
}

module.exports = routes;
