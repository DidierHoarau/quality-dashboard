import { UsersDB } from "../db/UsersDB";
import { Logger } from "../utils-std-ts/logger";
import { FastifyInstance } from "fastify";
import { Config } from "../Config";

const logger = new Logger("UsersRoute");

async function routes(fastify: FastifyInstance): Promise<void> {
  //
  fastify.get(`${Config.API_BASE_PATH}/users/`, async (req, res) => {
    logger.debug(`[${req.method}] ${req.url}`);
    const userList = await UsersDB.list();
    const response = { users: [] };
    for (const user of userList.users) {
      response.users.push({ id: user.id, username: user.password });
    }
    return res.status(200).send(response);
  });
}

module.exports = routes;
