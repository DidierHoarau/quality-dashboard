import axios from "axios";
import * as fs from "fs";
import * as request from "request";
import { Config } from "./Config";

let authToken;
describe("/api/reports/", () => {
  //
  test.only("GET /api/reports/", async () => {
    const response = await axios.get(`${Config.APIURL}/reports`);
    expect(response.data).toHaveProperty("groups");
    expect(Array.isArray(response.data.groups)).toBeTruthy();
  });

  describe("POST /api/reports/:groupName/:projectName/:projectVersion/:reportName/:processorType", () => {
    //
    beforeEach(async () => {
      await axios.delete(`${Config.APIURL}/reports`);
    });

    test.only("Send a report", async () => {
      await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`
      );
      const response = await axios.get(`${Config.APIURL}/reports`);
      expect(response.data).toHaveProperty("groups");
      expect(Array.isArray(response.data.groups)).toBeTruthy();
    });
  });

  describe("DELETE /api/reports/:groupName/:projectName/:projectVersion/", () => {
    //
    beforeAll(async () => {
      await axios.delete(`${Config.APIURL}/reports`);
      await axios.delete(`${Config.APIURL}/users`);
      await axios.post(`${Config.APIURL}/users`, {
        username: "admin",
        password: "admin",
      });
      authToken = (
        await axios.post(`${Config.APIURL}/users/login`, {
          username: "admin",
          password: "admin",
        })
      ).data.token;
    });

    test("Delete a version", async () => {
      await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`
      );
      let response = await axios.get(`${Config.APIURL}/reports`);
      expect(response.data.groups[0].projects[0].versions).toHaveLength(1);
      response = await axios.delete(`${Config.APIURL}/reports/quality-dashboard/server/dev`, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      response = await axios.get(`${Config.APIURL}/reports`);
      expect(response.data.groups).toHaveLength(0);
    });

    test("Delete a version among 2", async () => {
      await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev/integration-test/jest-html-reporter`
      );
      await sendFile(
        `${__dirname}/../samples/test-report.html`,
        `${Config.APIURL}/reports/quality-dashboard/server/dev-2/integration-test/jest-html-reporter`
      );
      let response = await axios.get(`${Config.APIURL}/reports`);
      expect(response.data.groups[0].projects[0].versions).toHaveLength(2);
      response = await axios.delete(`${Config.APIURL}/reports/quality-dashboard/server/dev`, {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });
      response = await axios.get(`${Config.APIURL}/reports`);
      expect(response.data.groups[0].projects[0].versions).toHaveLength(1);
    });
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
