import * as path from "path";
import { Config } from "../Config";
import { ReportsDB } from "../db/ReportsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";
import { SettingsDB } from "../db/SettingsDB";
import { Auth } from "./Auth";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance, options) {
  //
  fastify.get(`${Config.API_BASE_PATH}/reports/`, async (req, res) => {
    logger.debug(`[${req.method}] ${req.url}`);
    const auth = await Auth.checkAuthHeader(req.headers);
    const isDashboardPublic = (await SettingsDB.get()).isDashboardPublic;
    if (!isDashboardPublic && !auth.authenticated) {
      return res.status(403).send({});
    }
    return res.status(200).send(await ReportsDB.list());
  });
}

module.exports = routes;
