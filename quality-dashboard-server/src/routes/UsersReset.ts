import * as path from "path";
import { Config } from "../Config";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance } from "fastify";
import { UsersDB } from "../db/UsersDB";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance, options) {
  //
  fastify.delete(`${Config.API_BASE_PATH}/users/`, async (req, res) => {
    logger.info(`[${req.method}] ${req.url}`);
    if (process.env.NODE_ENV !== "dev") {
      console.log(process.env.NODE_ENV);
      return res.status(403).send({ error: "ERR: Reset forbidden for non dev environment" });
    }
    UsersDB.reset();
    return res.status(202).send({});
  });
}

module.exports = routes;
