import * as sha1 from "sha1";
import { UsersDB } from "../db/UsersDB";
import { Logger } from "../utils-std-ts/logger";
import { Auth } from "./Auth";
import { FastifyInstance, RequestGenericInterface } from "fastify";
import { Config } from "../Config";

const logger = new Logger("UsersRoute");

async function routes(fastify: FastifyInstance, options) {
  //
  fastify.get(`${Config.API_BASE_PATH}/`, async (req, res) => {
    const userList = await UsersDB.list();
    const response = { users: [] };
    for (const user of userList.users) {
      response.users.push({ id: user.id, username: user.password });
    }
    return res.status(200).send(response);
  });

  fastify.get(`${Config.API_BASE_PATH}/status`, async (req, res) => {
    return res.status(200).send({ initialized: await UsersDB.isInitialized() });
  });

  fastify.delete(`${Config.API_BASE_PATH}/`, async (req, res) => {
    if (process.env.NODE_ENV !== "dev") {
      return res.status(201).send({ error: "ERR: Reset forbidden for non dev environment" });
    }
    UsersDB.reset();
    return res.status(202).send({});
  });

  interface AddUserRequest extends RequestGenericInterface {
    Body: {
      username: string;
      password: string;
    };
  }
  fastify.post<AddUserRequest>(`${Config.API_BASE_PATH}/`, async (req, res) => {
    if (!req.body.username) {
      return res.status(400).send({ error: 'ERR: "username" missing' });
    }
    if (!req.body.password) {
      return res.status(400).send({ error: 'ERR: "password" missing' });
    }
    if (await UsersDB.isInitialized()) {
      return res.status(403).send({ error: "ERR: Admin user already created" });
    }
    const id = await UsersDB.add(req.body.username, req.body.password);
    return res.status(201).send({ id });
  });

  interface LoginUserRequest extends RequestGenericInterface {
    Body: {
      username: string;
      password: string;
    };
  }
  fastify.post<LoginUserRequest>(`${Config.API_BASE_PATH}/login`, async (req, res) => {
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

  interface ChangePasswordRequest extends RequestGenericInterface {
    Body: {
      password: string;
    };
    Params: {
      id: string;
    };
  }
  fastify.put<ChangePasswordRequest>(`${Config.API_BASE_PATH}/:id/password`, async (req, res) => {
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
