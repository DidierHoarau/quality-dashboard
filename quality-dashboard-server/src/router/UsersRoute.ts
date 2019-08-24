import * as express from 'express';
import { ExpressRouterWrapper as ERW } from '../utils-std-ts/express-router-wrapper';
import { UsersDB } from '../db/UsersDB';
import { Logger } from '../utils-std-ts/logger';

export const UsersRoute = express.Router();
const logger = new Logger('UsersRoute');

ERW.route(UsersRoute, 'get', '/', async (req, res) => {
  return res.status(200).send(await UsersDB.list());
});

ERW.route(UsersRoute, 'post', '/', async (req, res, next, stopAndSend) => {
  if (!req.body.username) {
    stopAndSend(400, 'ERR: "username" missint');
  }
  if (!req.body.password) {
    stopAndSend(400, 'ERR: "password" missint');
  }
  const userList = await UsersDB.list();
  for (const user of userList.users) {
    // UsersDB.delete(user.id);
  }
  const id = await UsersDB.add(req.body.username, req.body.password);
  return res.status(201).send({ id });
});
