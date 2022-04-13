import * as jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Config } from "../Config";
import { SettingsDB } from "../db/SettingsDB";

const AUTH_KEY = uuidv4();

export class Auth {
  //
  public static async generateJWT(user: any): Promise<string> {
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + Config.AUTH_TOKEN_VALIDITY,
        user_id: user.id,
      },
      AUTH_KEY
    );
  }

  public static async checkToken(token: string): Promise<any> {
    try {
      const info = jwt.verify(token, AUTH_KEY);
      return { authenticated: true, info };
    } catch (err) {
      return {
        authenticated: false,
      };
    }
  }

  public static async checkAuthHeader(headers: any): Promise<AuthInto> {
    let validUploadToken = false;
    const settingsUploadToken = (await SettingsDB.get()).uploadToken
    if (!settingsUploadToken || headers["upload-token"] === settingsUploadToken) {
      validUploadToken = true;
    }
    try {
      if (!headers.authorization) throw new Error("Unauthenticated");
      const info = jwt.verify(headers.authorization.replace("Bearer ", ""), AUTH_KEY);
      return { authenticated: true, validUploadToken, info };
    } catch (err) {
      return {
        authenticated: false,
        validUploadToken
      };
    }
  }
}

export type AuthInto = {
  authenticated: boolean;
  validUploadToken: boolean;
  info?: any;
};
