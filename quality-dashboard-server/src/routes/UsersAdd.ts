import * as path from "path";
import { UsersDB } from "../db/UsersDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance, RequestGenericInterface } from "fastify";
import { Config } from "../Config";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance): Promise<void> {
  //
  interface AddUserRequest extends RequestGenericInterface {
    Body: {
      username: string;
      password: string;
    };
  }
  fastify.post<AddUserRequest>(`${Config.API_BASE_PATH}/users/`, async (req, res) => {
    logger.info(`[${req.method}] ${req.url}`);
    if (!req.body.username) {
      return res.status(400).send({ error: "ERR: \"username\" missing" });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: "ERR: \"password\" missing" });
    }
    if (await UsersDB.isInitialized()) {
      return res.status(403).send({ error: "ERR: Admin user already created" });
    }
    const id = await UsersDB.add(req.body.username, req.body.password);
    return res.status(201).send({ id });
  });
}

module.exports = routes;
