import axios from "axios";
import UserService from "./UserService";
import { appConfigStore } from "@/stores/appConfig";

export default class AppConfigService {
  //
  public static async get(): Promise<any> {
    const response = await axios.get(`${import.meta.env.VITE_APP_BASEPATH}/settings/`, {
      headers: UserService.getAuthHeader(),
    });
    const appConfig = appConfigStore();
    console.log(response.data);
    appConfig.$patch({
      isDashboardPublic: response.data.isDashboardPublic,
      uploadToken: response.data.uploadToken,
    });
  }

  public static async update(config: any): Promise<void> {
    await axios.put(
      `${import.meta.env.VITE_APP_BASEPATH}/settings`,
      {
        isDashboardPublic: config.isDashboardPublic,
        uploadToken: config.uploadToken,
      },
      {
        headers: UserService.getAuthHeader(),
      }
    );
  }
}
