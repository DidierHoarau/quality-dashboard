import * as express from 'express';
import * as sha1 from 'sha1';
import { UsersDB } from '../db/UsersDB';
import { ExpressRouterWrapper as ERW } from '../utils-std-ts/express-router-wrapper';
import { Logger } from '../utils-std-ts/logger';
import { Auth } from './Auth';

export const UsersRoute = express.Router();
const logger = new Logger('UsersRoute');

ERW.route(UsersRoute, 'get', '/', async (req, res) => {
  const userList = await UsersDB.list();
  const response = { users: [] };
  for (const user of userList.users) {
    response.users.push({ id: user.id, username: user.password });
  }
  return res.status(200).send(response);
});

ERW.route(UsersRoute, 'get', '/status', async (req, res) => {
  return res.status(200).send({ initialized: await UsersDB.isInitialized() });
});

ERW.route(UsersRoute, 'delete', '/', async (req, res, next, stopAndSend) => {
  if (process.env.NODE_ENV !== 'dev') {
    stopAndSend(404, 'ERR: Reset forbidden for non dev environment');
  }
  UsersDB.reset();
  return res.status(202).send({});
});

ERW.route(UsersRoute, 'post', '/', async (req, res, next, stopAndSend) => {
  if (!req.body.username) {
    stopAndSend(400, 'ERR: "username" missing');
  }
  if (!req.body.password) {
    stopAndSend(400, 'ERR: "password" missing');
  }
  if (await UsersDB.isInitialized()) {
    stopAndSend(403, 'ERR: Admin user already created');
  }
  const id = await UsersDB.add(req.body.username, req.body.password);
  return res.status(201).send({ id });
});

ERW.route(UsersRoute, 'post', '/login', async (req, res, next, stopAndSend) => {
  if (!req.body.username) {
    stopAndSend(400, 'ERR: "username" missing');
  }
  if (!req.body.password) {
    stopAndSend(400, 'ERR: "password" missing');
  }
  const user = await UsersDB.getByUsername(req.body.username);
  if (!user || user.password !== sha1(req.body.password)) {
    stopAndSend(403, 'ERR: "username/password" incorrect');
  }
  return res.status(201).send({ token: await Auth.generateJWT(user) });
});

ERW.route(UsersRoute, 'put', '/:id/password', async (req, res, next, stopAndSend) => {
  if (!req.body.password) {
    stopAndSend(400, 'ERR: "password" missing');
  }
  if (!req.user.authenticated || req.user.info.user_id !== req.params.id) {
    stopAndSend(403, 'ERR: authentication error');
  }
  await UsersDB.updatePassword(req.params.id, req.body.password);
  return res.status(201).send({});
});
