import axios from "axios";
import { Config } from "./Config";

let token;

describe("/api/settings/", () => {
  //
  beforeAll(async () => {
    await axios.delete(`${Config.APIURL}/users/`);
    const responseCreate = await axios.post(`${Config.APIURL}/users/`, {
      username: "admin",
      password: "admin",
    });
    const responseLogin = await axios.post(`${Config.APIURL}/users/login/`, {
      username: "admin",
      password: "admin",
    });
    token = responseLogin.data.token;
  });

  describe("GET /api/settings/", () => {
    //
    test("Non Admin not able to get the settings", async () => {
      const response = await axios.get(`${Config.APIURL}/settings/`).catch((err) => {
        return err.response;
      });
      expect(response.status).toEqual(403);
    });

    test("Admin can get the settings", async () => {
      const response = await axios.get(`${Config.APIURL}/settings/`, { headers: { Authorization: `Bearer ${token}` } });
      expect(response.status).toEqual(200);
      expect(response.data).toHaveProperty("isDasboardPublic");
      expect(response.data).toHaveProperty("uploadToken");
    });
  });

  describe("PUT /api/settings/", () => {
    //
    test("Non Admin not able not update settings", async () => {
      const settings = { isDasboardPublic: true, uploadToken: "abc" };
      const response = await axios.put(`${Config.APIURL}/settings/`, settings).catch((err) => {
        return err.response;
      });
      expect(response.status).toEqual(403);
    });

    test("Admin can update settings", async () => {
      const settings = { isDasboardPublic: true, uploadToken: "abc" };
      let response = await axios
        .put(`${Config.APIURL}/settings/`, settings, { headers: { Authorization: `Bearer ${token}` } })
        .catch((err) => {
          return err.response;
        });
      expect(response.status).toEqual(202);
      response = await axios.get(`${Config.APIURL}/settings/`, { headers: { Authorization: `Bearer ${token}` } });
      expect(response.data.isDasboardPublic).toEqual(settings.isDasboardPublic);
      expect(response.data.uploadToken).toEqual(settings.uploadToken);
    });
  });
});
