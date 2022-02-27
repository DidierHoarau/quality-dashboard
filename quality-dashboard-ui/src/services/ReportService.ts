import axios from "axios";
import UserService from "./UserService";
import AlertService from "./AlertService";
import { reportsStore } from "@/stores/reports";

const CACHEID_REPORT_GROUPS = "CACHE_REPORT_GROUPS";

export default class ReportService {
  //
  public static async refresh(): Promise<any> {
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
    } catch (err: any) {
      AlertService.send({ text: `ERR: Error getting reports: ${err.message}`, type: "error" });
    }
  }

  public static async deleteVersion(group: string, project: string, version: string): Promise<void> {
    axios
      .delete(`${import.meta.env.VITE_APP_BASEPATH}/reports/${group}/${project}/${version}/`, {
        headers: UserService.getAuthHeader(),
      })
      .catch((err) => {
        AlertService.send({ text: `ERR: Error getting reports: ${err.message}`, type: "error" });
      });
  }
}
