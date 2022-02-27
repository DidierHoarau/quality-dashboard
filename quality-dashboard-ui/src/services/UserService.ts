import axios from "axios";
import mitt from "mitt";
import type EventAuthentication from "@types/EventAuthentication";
import { appConfigStore } from "@/stores/appConfig";
import { userAuthenticationStore } from "@/stores/userAuthentication";

const emitter = mitt<EventAuthentication>();

export default class UserService {
  //
  public static logout(): void {
    localStorage.removeItem("auth_token");
    const userAuthentication = userAuthenticationStore();
    userAuthentication.$patch({
      isAuthenticated: false,
      authToken: "",
    });
  }

  public static async login(username: string, password: string): Promise<void> {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BASEPATH}/users/login/`,
      {
        password,
        username,
      },
      { headers: UserService.getAuthHeader() }
    );
    localStorage.setItem("auth_token", response.data.token);
    const userAuthentication = userAuthenticationStore();
    userAuthentication.isAuthenticated = true;
    userAuthentication.authToken = response.data.token;
  }

  public static async addUser(username: string, password: string): Promise<void> {
    await axios.post(
      `${import.meta.env.VITE_APP_BASEPATH}/users`,
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
      `${import.meta.env.VITE_APP_BASEPATH}api/users/${tokenData.user_id}/password`,
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
      const userAuthentication = userAuthenticationStore();
      if (new Date() < new Date(tokenData.exp * 1000)) {
        userAuthentication.$patch({
          isAuthenticated: true,
          authToken: token,
        });
      } else {
        localStorage.removeItem("auth_token");
        userAuthentication.$patch({
          isAuthenticated: false,
          authToken: "",
        });
      }
    }
  }

  public static async checkInitialization(): Promise<void> {
    const response = await axios.get(`${import.meta.env.VITE_APP_BASEPATH}/users/status/`);
    const appConfig = appConfigStore();
    appConfig.isAuthInitialized = response.data.initialized;
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
