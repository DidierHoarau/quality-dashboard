import * as fse from 'fs-extra';
import * as _ from 'lodash';
import { Config } from '../Config';
import { JsonTools } from '../utils-std-ts/JsonTools';
import { Logger } from '../utils-std-ts/logger';

const logger = new Logger('ReportsDB');
const DB_FILE_PATH = `${Config.DB_DIR}/reports.json`;
let reportsDB;

export class ReportsDB {
  //
  public static async init(): Promise<void> {
    await fse.ensureDir(Config.DB_DIR);
    if (!fse.existsSync(DB_FILE_PATH)) {
      reportsDB = {};
    } else {
      reportsDB = await fse.readJSON(DB_FILE_PATH);
    }
    if (!reportsDB.groups) {
      reportsDB.groups = [];
    }
    cleanGroups();
    await fse.writeJSON(DB_FILE_PATH, reportsDB, { spaces: 2 });
  }

  public static async reset(): Promise<void> {
    reportsDB = { groups: [] };
    await fse.writeJSON(DB_FILE_PATH, reportsDB, { spaces: 2 });
  }

  public static async list(): Promise<any> {
    return JsonTools.clone(reportsDB);
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
    await fse.writeJSON(DB_FILE_PATH, reportsDB, { spaces: 2 });
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
    cleanGroups();
    await fse.writeJSON(DB_FILE_PATH, reportsDB, { spaces: 2 });
  }
}

function cleanGroups() {
  const newGroups = [];
  for (const group of reportsDB.groups) {
    const newProjects = [];
    for (const project of group.projects) {
      if (project.versions.length > 0) {
        newProjects.push(project);
      }
    }
    if (newProjects.length > 0) {
      newGroups.push({ name: group.name, projects: newProjects });
    }
  }
  reportsDB.groups = newGroups;
}

function arrayFindOrCreate(array: any[], query: any, defaultContent: any): any {
  let item = _.find(array, query);
  if (!item) {
    item = defaultContent;
    array.push(item);
  }
  return item;
}
