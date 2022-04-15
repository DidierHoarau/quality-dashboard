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
      return res.status(400).send({ error: "ERR: \"password\" missing" });
    }
    const auth = await Auth.checkAuthHeader(req.headers);
    if (!auth.authenticated || req.params.id !== auth.info.user_id) {
      return res.status(403).send({});
    }
    await UsersDB.updatePassword(req.params.id, req.body.password);
    return res.status(201).send({});
  });
}

module.exports = routes;
