import axios from "axios";
import router from "../router";
import { EventService } from "./EventService";

export default class UserService {
  //
  public static logout(): void {
    localStorage.removeItem("auth_token");
    EventService.$emit("user-authenticated", false);
  }

  public static async login(username: string, password: string): Promise<void> {
    const response = await axios.post(
      `${process.env.VUE_APP_BASEPATH}api/users/login`,
      {
        password,
        username,
      },
      { headers: UserService.getAuthHeader() }
    );
    localStorage.setItem("auth_token", response.data.token);
    EventService.$emit("user-authenticated", true);
  }

  public static async addUser(username: string, password: string): Promise<void> {
    await axios.post(
      `${process.env.VUE_APP_BASEPATH}api/users`,
      {
        password,
        username,
      },
      { headers: UserService.getAuthHeader() }
    );
  }

  public static async updatePassword(password: string): Promise<void> {
    const token = localStorage.getItem("auth_token") as string;
    const tokenData = JSON.parse(atob(token.split(".")[1]));
    await axios.put(
      `${process.env.VUE_APP_BASEPATH}api/users/${tokenData.user_id}/password`,
      {
        password,
      },
      { headers: UserService.getAuthHeader() }
    );
  }

  public static async checkAuthentication(): Promise<void> {
    if (localStorage.getItem("auth_token")) {
      const token = localStorage.getItem("auth_token") as string;
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      if (new Date() < new Date(tokenData.exp * 1000)) {
        EventService.$emit("user-authenticated", true);
      } else {
        localStorage.removeItem("auth_token");
        EventService.$emit("user-authenticated", false);
      }
    }
  }

  public static async checkInitialization(): Promise<void> {
    const response = await axios.get(`${process.env.VUE_APP_BASEPATH}api/users/status`);
    EventService.$emit("user-initialized", response.data.initialized);
  }

  public static getAuthHeader(): any {
    const idToken = localStorage.getItem("auth_token");
    if (idToken) {
      return { Authorization: `Bearer ${idToken}` };
    } else {
      return {};
    }
  }
}
