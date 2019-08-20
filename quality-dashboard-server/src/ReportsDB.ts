import * as fse from 'fs-extra';
import * as _ from 'lodash';
import { Config } from './Config';

const DB_FILE_PATH = `${Config.DB_DIR}/reports.json`;
let reportsDB;

export class ReportsDB {
  public static async init(): Promise<void> {
    await fse.ensureDir(Config.DB_DIR);
    if (!fse.existsSync(DB_FILE_PATH)) {
      fse.writeJSON(DB_FILE_PATH, {});
    }
    reportsDB = await fse.readJSON(DB_FILE_PATH);
    if (!reportsDB.groups) {
      reportsDB.groups = [];
    }
    fse.writeJSON(DB_FILE_PATH, reportsDB, { spaces: 2 });
  }

  public static async list(): Promise<any> {
    return JSON.parse(JSON.stringify(reportsDB));
  }

  public static async add(
    groupName: string,
    projectName: string,
    projectVersion: string,
    reportName: string,
    processorType: string,
    content: any
  ): Promise<void> {
    const group = arrayFindOrCreate(reportsDB.groups, { name: groupName }, { name: groupName, projects: [] });
    const project = arrayFindOrCreate(group.projects, { name: projectName }, { name: projectName, versions: [] });
    const version = arrayFindOrCreate(
      project.versions,
      { name: projectVersion },
      { name: projectVersion, reports: [] }
    );
    const report = arrayFindOrCreate(version.reports, { name: reportName }, { name: reportName });
    report.result = content;
    report.processor = processorType;
    report.date = new Date();
    fse.writeJSON(DB_FILE_PATH, reportsDB, { spaces: 2 });
  }
}

function arrayFindOrCreate(array: any[], query: any, defaultContent: any): any {
  let item = _.find(array, query);
  if (!item) {
    item = defaultContent;
    array.push(item);
  }
  return item;
}
