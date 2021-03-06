import * as fse from 'fs-extra';
import { AppApi } from './AppApi';
import { Config } from './Config';
import { ReportsDB } from './db/ReportsDB';
import { UsersDB } from './db/UsersDB';

Promise.resolve().then(async () => {
  await fse.ensureDir(Config.PROCESSOR_DIR);
  await fse.ensureDir(Config.PROCESSOR_DIR_USER);
  await fse.ensureDir(Config.DB_DIR);
  await fse.ensureDir(Config.REPORT_DIR);
  await ReportsDB.init();
  await UsersDB.init();
  AppApi.start();
});
