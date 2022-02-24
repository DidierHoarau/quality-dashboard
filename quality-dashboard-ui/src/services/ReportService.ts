import axios from "axios";
import UserService from "./UserService";
import { reportsStore } from "@/stores/reports";

const CACHEID_REPORT_GROUPS = "CACHE_REPORT_GROUPS";

export default class ReportService {
  //
  public static async requestGroupsUpdate(): Promise<any> {
    const groupsCached = localStorage.getItem(CACHEID_REPORT_GROUPS);
    const reports = reportsStore();
    if (groupsCached) {
      reports.$patch({
        groups: JSON.parse(groupsCached).data.groups,
      });
    }
    try {
      const reponse = await axios.get(`${import.meta.env.VITE_APP_BASEPATH}/reports/`, {
        headers: UserService.getAuthHeader(),
      });
      const newGroupsCached = { date: new Date(), data: reponse.data };
      localStorage.setItem(CACHEID_REPORT_GROUPS, JSON.stringify(newGroupsCached));
      const reports = reportsStore();
      reports.$patch({
        groups: newGroupsCached.data.groups,
      });
    } catch (err) {
      // EventService.$emit("alert-message", `ERR: Error getting reports: ${err.message}`);
    }
  }

  public static async deleteVersion(group: string, project: string, version: string): Promise<void> {
    await axios.delete(`${import.meta.env.VITE_APP_BASEPATH}/reports/${group}/${project}/${version}/`, {
      headers: UserService.getAuthHeader(),
    });
  }
}
