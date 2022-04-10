import * as path from "path";

let DATA_PATH_PREFIX = "/opt";
let UTILS_PATH_PREFIX = "/opt/app";
const BASEPATH = process.env.BASEPATH || '/api';

if (process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
  DATA_PATH_PREFIX = path.resolve(".data");
  UTILS_PATH_PREFIX = path.resolve(".");
}

export class Config {
  //
  public static readonly REPORT_DIR: string = `${DATA_PATH_PREFIX}/data/reports`;
  public static readonly DB_DIR: string = `${DATA_PATH_PREFIX}/data/db`;
  public static readonly PROCESSOR_DIR_USER: string = `${UTILS_PATH_PREFIX}/plugins-user/processors`;
  public static readonly PROCESSOR_DIR: string = `${UTILS_PATH_PREFIX}/plugins/processors`;
  public static readonly API_BASE_PATH: string = `${BASEPATH}`;
  public static readonly API_PORT: number = 8080;
}
