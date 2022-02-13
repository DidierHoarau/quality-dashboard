import axios from "axios";
import { EventService } from "./EventService";
import UserService from "./UserService";

const CACHEID_REPORT_GROUPS = "CACHE_REPORT_GROUPS";

export default class ReportService {
  //
  public static async requestGroupsUpdate(): Promise<any> {
    const groupsCached = localStorage.getItem(CACHEID_REPORT_GROUPS);
    if (groupsCached) {
      EventService.$emit("report-groups-data", JSON.parse(groupsCached));
    }
    try {
      const reponse = await axios.get(`${process.env.VUE_APP_BASEPATH}api/reports`, {
        headers: UserService.getAuthHeader(),
      });
      const newGroupsCached = { date: new Date(), data: reponse.data };
      localStorage.setItem(CACHEID_REPORT_GROUPS, JSON.stringify(newGroupsCached));
      EventService.$emit("report-groups-data", newGroupsCached);
    } catch (err) {
      EventService.$emit("alert-message", `ERR: Error getting reports: ${err.message}`);
    }
  }

  public static async deleteVersion(group: string, project: string, version: string): Promise<void> {
    await axios.delete(`api/reports/${group}/${project}/${version}`, {
      headers: UserService.getAuthHeader(),
    });
  }
}
