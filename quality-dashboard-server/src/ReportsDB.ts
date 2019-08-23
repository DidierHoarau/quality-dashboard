import * as fse from 'fs-extra';
import * as _ from 'lodash';
import { Config } from './Config';
import { Logger } from './utils-std-ts/logger';

const logger = new Logger('ReportsRoute');
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

  public static async deleteVersion(groupName: string, projectName: string, projectVersion: string): Promise<void> {
    const group = _.find(reportsDB.groups, { name: groupName });
    if (!group) {
      throw new Error(`Version not found: ${groupName}/${projectName}/${projectVersion}`);
    }
    const project = _.find(group.projects, { name: projectName });
    if (!project) {
      throw new Error(`Version not found: ${groupName}/${projectName}/${projectVersion}`);
    }
    const versionIndex = _.findIndex(project.versions, { name: projectVersion });
    if (versionIndex < 0) {
      throw new Error(`Version not found: ${groupName}/${projectName}/${projectVersion}`);
    }
    logger.info(`Deleting version: ${groupName}/${projectName}/${projectVersion}`);
    project.versions.splice(versionIndex, 1);
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
