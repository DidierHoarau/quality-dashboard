import * as path from "path";
import * as sha1 from "sha1";
import { UsersDB } from "../db/UsersDB";
import { Logger } from "../utils-std-ts/logger";
import { Auth } from "./Auth";
import { FastifyInstance, RequestGenericInterface } from "fastify";
import { Config } from "../Config";

const logger = new Logger(path.basename(__filename));

async function routes(fastify: FastifyInstance, options) {
  //
  interface ChangePasswordRequest extends RequestGenericInterface {
    Body: {
      password: string;
    };
    Params: {
      id: string;
    };
  }
  fastify.put<ChangePasswordRequest>(`${Config.API_BASE_PATH}/users/:id/password`, async (req, res) => {
    logger.info(`[${req.method}] ${req.url}`);
    if (!req.body.password) {
      return res.status(400).send({ error: 'ERR: "password" missing' });
    }
    // if (!req.user.authenticated || req.user.info.user_id !== req.params.id) {
    //   return res.status(403).send({ error: "ERR: authentication error" });
    // }
    await UsersDB.updatePassword(req.params.id, req.body.password);
    return res.status(201).send({});
  });
}

module.exports = routes;
