import * as path from "path";
import * as sha1 from "sha1";
import { UsersDB } from "../db/UsersDB";
import { Logger } from "../utils-std-ts/logger";
import { Auth } from "./Auth";
import { FastifyInstance, RequestGenericInterface } from "fastify";
import { Config } from "../Config";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance): Promise<void> {
  //
  fastify.get(`${Config.API_BASE_PATH}/users/status/`, async (req, res) => {
    return res.status(200).send({ initialized: await UsersDB.isInitialized() });
  });
}

module.exports = routes;
