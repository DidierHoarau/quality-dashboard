import * as fse from "fs-extra";
import * as _ from "lodash";
import * as path from "path";
import * as sha1 from "sha1";
import { v4 as uuidv4 } from "uuid";
import { Config } from "../Config";
import { JsonTools } from "../utils-std-ts/JsonTools";
import { Logger } from "../utils-std-ts/logger";

const logger = new Logger(path.basename(__filename));
const DB_FILE_PATH = `${Config.DB_DIR}/settings.json`;
let settingsDB;

export class SettingsDB {
  //
  public static async init(): Promise<void> {
    await fse.ensureDir(Config.DB_DIR);
    if (!fse.existsSync(DB_FILE_PATH)) {
      await fse.writeJSON(DB_FILE_PATH, {});
    }
    settingsDB = await fse.readJSON(DB_FILE_PATH);
    if (!settingsDB.uploadToken) {
      settingsDB.uploadToken = "";
    }
    if (!settingsDB.isDasboardPublic) {
      settingsDB.isDasboardPublic = false;
    }
    await fse.writeJSON(DB_FILE_PATH, settingsDB, { spaces: 2 });
  }

  public static get(): Promise<any> {
    return JsonTools.clone(settingsDB);
  }
  public static async update(settings: any): Promise<void> {
    settingsDB.isDasboardPublic = settings.isDasboardPublic;
    settingsDB.uploadToken = settings.uploadToken;
    await fse.writeJSON(DB_FILE_PATH, settingsDB, { spaces: 2 });
  }

  public static async setUploadToken(token: string): Promise<any> {
    settingsDB.uploadToken = token;
    await fse.writeJSON(DB_FILE_PATH, settingsDB, { spaces: 2 });
  }
}
