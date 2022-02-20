let DATA_PATH_PREFIX = "/opt";
if (process.env.NODE_ENV && process.env.NODE_ENV === "dev") {
  DATA_PATH_PREFIX = ".data";
}

export class Config {
  //
  public static readonly REPORT_DIR: string = `${DATA_PATH_PREFIX}/data/reports`;
  public static readonly DB_DIR: string = `${DATA_PATH_PREFIX}/data/db`;
  public static readonly PROCESSOR_DIR_USER: string = `${DATA_PATH_PREFIX}/app/plugins-user/processors`;
  public static readonly PROCESSOR_DIR: string = `${DATA_PATH_PREFIX}/app/plugins/processors`;
  public static readonly API_BASE_PATH: string = "/api";
  public static readonly API_PORT: number = 8080;
}
