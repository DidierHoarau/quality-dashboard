import * as path from "path";
import { Config } from "../Config";
import { ReportsDB } from "../db/ReportsDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, FastifyRequest, RequestGenericInterface } from "fastify";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance, options) {
  //
  fastify.get(`${Config.API_BASE_PATH}/reports/`, async (req, res) => {
    return res.status(200).send(await ReportsDB.list());
  });
}

module.exports = routes;
