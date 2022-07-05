import axios from "axios";
import * as fs from "fs";
import * as request from "request";
import { Config } from "./Config";

let authToken;
describe("/api/reports/", () => {
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

    const settings = { isDashboardPublic: true, uploadToken: '' };
    await axios
      .put(`${Config.APIURL}/settings/`, settings, { headers: { Authorization: `Bearer ${authToken}` } })
      .catch((err) => {
        return err.response;
      });
    await sendFile(
      `${__dirname}/../samples/test-report.html`,
      `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`
    );
  });

  test("GET /api/reports/", async () => {
    const response = await axios.get(`${Config.APIURL}/reports`);
    expect(response.data).toHaveProperty("groups");
    expect(Array.isArray(response.data.groups)).toBeTruthy();
  });
});

function sendFile(filepath: string, url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = request.post(url, (err, resp, body) => {
      if (err) {
        reject("Error!");
      } else if (resp.statusCode > 299) {
        reject(body);
      } else {
        resolve(body);
      }
    });
    const form = req.form();
    form.append("report", fs.createReadStream(filepath), {
      filename: filepath,
      contentType: "text/plain",
    });
  });
}
