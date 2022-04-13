import * as path from "path";

let DATA_PATH_PREFIX = "/opt";
let UTILS_PATH_PREFIX = "/opt/app";

if (process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
  DATA_PATH_PREFIX = path.resolve(".data");
  UTILS_PATH_PREFIX = path.resolve(".");
}

let BASEPATH = process.env.BASEPATH || '/api';
if (BASEPATH.length > 0 && BASEPATH.slice(-1) === '/') {
  BASEPATH = BASEPATH.substring(0,BASEPATH.length-1);
}
if (BASEPATH.length > 1 && BASEPATH.substring(0,1) !== '/') {
  BASEPATH = `/${BASEPATH}`;
}

export class Config {
  //
  public static readonly REPORT_DIR: string = `${DATA_PATH_PREFIX}/data/reports`;
  public static readonly DB_DIR: string = `${DATA_PATH_PREFIX}/data/db`;
  public static readonly PROCESSOR_DIR_USER: string = `${UTILS_PATH_PREFIX}/plugins-user/processors`;
  public static readonly PROCESSOR_DIR: string = `${UTILS_PATH_PREFIX}/plugins/processors`;
  public static readonly API_BASE_PATH: string = BASEPATH;
  public static readonly API_CORS: string = process.env.API_CORS || '*';
  public static readonly API_PORT: number = 8080;
  public static readonly AUTH_TOKEN_VALIDITY: number = Number(process.env.AUTH_TOKEN_VALIDITY) || 3600;
}
