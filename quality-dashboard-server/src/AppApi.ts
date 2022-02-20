// import * as bodyParser from "body-parser";
// import { NextFunction, Response } from "express";
// import * as express from "express";
// import * as url from "url";
// import { Config } from "./Config";
// import { router } from "./router";
// import { Auth } from "./router/Auth";
// import { ExpressWrapper } from "./utils-std-ts/express-wrapper";
import * as path from "path";
import { Logger } from "./utils-std-ts/logger";
import Fastify from "fastify";
import { Config } from "./Config";

const logger = new Logger(path.basename(__filename));

export class AppApi {
  //
  public static start(): void {
    const fastify = Fastify({
      logger: false,
    });

    fastify.register(require("fastify-cors"), {});
    fastify.register(require("./routes/ReportsAdd"));
    fastify.register(require("./routes/ReportsDelete"));
    fastify.register(require("./routes/ReportsList"));
    fastify.register(require("./routes/UsersAdd"));
    fastify.register(require("./routes/UsersChangePassword"));
    fastify.register(require("./routes/UsersList"));
    fastify.register(require("./routes/UsersLogin"));
    fastify.register(require("./routes/UsersStatus"));
    fastify.register(require("./routes/SettingsGet"));
    fastify.register(require("./routes/SettingsUpdate"));
    if (process.env.NODE_ENV === "dev") {
      fastify.register(require("./routes/UsersReset"));
      fastify.register(require("./routes/ReportsReset"));
    }

    fastify.listen(Config.API_PORT, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      logger.info("API Listerning");
    });

    // const api = ExpressWrapper.createApi();
    // const PORT = 80;

    // api.listen(PORT, () => {
    //   logger.info(`App listening on port ${PORT}`);
    // });

    // api.use((req, res, next) => {
    //   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //   res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
    //   next();
    // });

    // api.use(`${Config.API_BASE_PATH}/reports_data`, express.static(Config.REPORT_DIR));

    // api.use((req: any, res: Response, next: NextFunction) => {
    //   res.status(404);
    //   req.customApiLogging = { startDate: new Date() };
    //   logger.info(`${req.method} ${url.parse(req.url).pathname}`);
    //   next();
    // });

    // api.use(async (req: any, res: Response, next: NextFunction) => {
    //   req.user = { authenticated: false };
    //   if (req.headers.authorization) {
    //     try {
    //       req.user = await Auth.checkToken(req.headers.authorization.split(' ')[1]);
    //     } catch (err) {
    //       logger.error(err);
    //     }
    //   }
    //   next();
    // });

    // api.use(bodyParser.json());

    // api.use(router);

    // router.use((req: any, res: Response, next: NextFunction) => {
    //   logger.debug(
    //     `API Response: ${res.statusCode}; ${new Date().getTime() - req.customApiLogging.startDate.getTime()}ms`
    //   );
    //   next();
    // });
  }
}
