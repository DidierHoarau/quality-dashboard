import * as path from "path";
import { Auth } from "./Auth";
import { Config } from "../Config";
import { SettingsDB } from "../db/SettingsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance, options) {
  //
  fastify.get(`${Config.API_BASE_PATH}/settings/`, async (req, res) => {
    logger.debug(`[${req.method}] ${req.url}`);
    const auth = await Auth.checkAuthHeader(req.headers);
    if (!auth.authenticated) {
      return res.status(200).send({
        isDashboardPublic: (await SettingsDB.get()).isDashboardPublic,
      });
    }
    return res.status(200).send(await SettingsDB.get());
  });
}

module.exports = routes;
