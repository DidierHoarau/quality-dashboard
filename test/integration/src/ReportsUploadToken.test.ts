import axios from "axios";
import * as fs from "fs/promises";
import FormData from 'form-data';
import { Config } from "./Config";

let authToken;
const uploadToken = 'abcd';

describe("/api/reports/ (with upload token)", () => {
  //
  beforeEach(async () => {
    await axios.delete(`${Config.APIURL}/reports`);

    await axios.delete(`${Config.APIURL}/users/`);
    const responseCreate = await axios.post(`${Config.APIURL}/users/`, {
      username: "admin",
      password: "admin",
    });
    const responseLogin = await axios.post(`${Config.APIURL}/users/login/`, {
      username: "admin",
      password: "admin",
    });
    authToken = responseLogin.data.token;

    const settings = { isDashboardPublic: true, uploadToken };
    let response = await axios
      .put(`${Config.APIURL}/settings/`, settings, { headers: { Authorization: `Bearer ${authToken}` } })
      .catch((err) => {
        return err.response;
      });
  });

  describe("POST /api/reports/:groupName/:projectName/:projectVersion/", () => {
    //
    test("Should be work if valid upload token", async () => {
      const response = await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`,
        uploadToken
      ).catch((err) => {
        return err.response;
      });
      expect(response.status).toEqual(201);
    });

    test("Should be rejected if token missing", async () => {
      const response = await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`
      ).catch((err) => {
        return err.response;
      });
      expect(response.status).toEqual(403);
    });

    test("Should be rejected if token wrong", async () => {
      const response = await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`,
        "wrong_token"
      ).catch((err) => {
        return err.response;
      });
      expect(response.status).toEqual(403);
    });

  });
});

async function sendFile(filepath: string, url: string, token: string = ''): Promise<any> {

    const reportBuffer = await fs.readFile(filepath);
    const form = new FormData();
    const headers = {
      ...form.getHeaders(),
    }
    if (token) {
      headers["upload-token"] = token;
    }
    form.append('report', reportBuffer, 'report.html');
    return axios.post(url, form, {
        headers
      });
}
