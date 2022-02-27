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
      ignoreTrailingSlash: true,
    });

    fastify.register(require("fastify-cors"), {});
    fastify.register(require("fastify-multipart"));

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

    fastify.register(require("fastify-static"), {
      root: path.join(Config.REPORT_DIR),
      prefix: "/api/reports_data/",
    });

    fastify.listen(Config.API_PORT, function (err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      logger.info("API Listerning");
    });
  }
}
