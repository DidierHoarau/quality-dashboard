import * as fse from "fs-extra";
import * as path from "path";
import { AppApi } from "./AppApi";
import { Config } from "./Config";
import { ReportsDB } from "./db/ReportsDB";
import { UsersDB } from "./db/UsersDB";
import { SettingsDB } from "./db/SettingsDB";
import { Logger } from "./utils-std-ts/logger";
import { SystemCommand } from "./utils-std-ts/system-command";

const logger = new Logger(path.basename(__filename));

Promise.resolve().then(async () => {
  await fse.ensureDir(Config.PROCESSOR_DIR);
  await fse.ensureDir(Config.PROCESSOR_DIR_USER);
  await fse.ensureDir(Config.DB_DIR);
  await fse.ensureDir(Config.REPORT_DIR);
  await SettingsDB.init();
  await ReportsDB.init();
  await UsersDB.init();
  AppApi.start();
}).catch(err => {
  logger.error(err.message);
  process.exit(1);
});
