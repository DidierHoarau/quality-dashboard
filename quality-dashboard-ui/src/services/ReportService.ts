import axios from "axios";
import { EventService } from "./EventService";
import UserService from "./UserService";

export default class ReportService {
  //
  public static async getGroups(): Promise<any> {
    return await axios.get(`${process.env.VUE_APP_BASEPATH}api/reports`, {
      headers: UserService.getAuthHeader(),
    });
  }

  public static async deleteVersion(group: string, project: string, version: string): Promise<void> {
    await axios.delete(`api/reports/${group}/${project}/${version}`, {
      headers: UserService.getAuthHeader(),
    });
  }
}
