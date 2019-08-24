import * as fse from 'fs-extra';
import * as _ from 'lodash';
import * as sha1 from 'sha1';
import * as uuidv1 from 'uuid/v1';
import { Config } from '../Config';
import { Logger } from '../utils-std-ts/logger';

const logger = new Logger('UsersDB');
const DB_FILE_PATH = `${Config.DB_DIR}/users.json`;
let usersDB;

export class UsersDB {
  public static async init(): Promise<void> {
    await fse.ensureDir(Config.DB_DIR);
    if (!fse.existsSync(DB_FILE_PATH)) {
      await fse.writeJSON(DB_FILE_PATH, {});
    }
    usersDB = await fse.readJSON(DB_FILE_PATH);
    if (!usersDB.users) {
      usersDB.users = [];
    }
    await fse.writeJSON(DB_FILE_PATH, usersDB, { spaces: 2 });
  }

  public static async list(): Promise<any> {
    return JSON.parse(JSON.stringify(usersDB));
  }

  public static async delete(): Promise<any> {
    return JSON.parse(JSON.stringify(usersDB));
  }

  public static async add(username: string, password: string): Promise<void> {
    const user = {
      id: uuidv1(),
      password: sha1(password),
      username
    };
    usersDB.users.push(user);
    await fse.writeJSON(DB_FILE_PATH, usersDB, { spaces: 2 });
    logger.info(`User added: ${user.id}`);
    return user.id;
  }

  public static async deleteVersion(groupName: string, projectName: string, projectVersion: string): Promise<void> {
    const group = _.find(usersDB.users, { name: groupName });
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
    await fse.writeJSON(DB_FILE_PATH, usersDB, { spaces: 2 });
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
