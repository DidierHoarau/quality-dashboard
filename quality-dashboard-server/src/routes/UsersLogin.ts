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
  interface LoginUserRequest extends RequestGenericInterface {
    Body: {
      username: string;
      password: string;
    };
  }
  fastify.post<LoginUserRequest>(`${Config.API_BASE_PATH}/users/login/`, async (req, res) => {
    logger.info(`[${req.method}] ${req.url}`);
    if (!req.body.username) {
      return res.status(400).send({ error: 'ERR: "username" missing' });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: 'ERR: "password" missing' });
    }
    const user = await UsersDB.getByUsername(req.body.username);
    if (!user || user.password !== sha1(req.body.password)) {
      return res.status(403).send({ error: 'ERR: "username/password" incorrect' });
    }
    return res.status(201).send({ token: await Auth.generateJWT(user) });
  });
}

module.exports = routes;
