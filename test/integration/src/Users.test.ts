import axios from "axios";
import { Config } from "./Config";

describe("/api/users/", () => {
  //
  test("GET /api/users/", async () => {
    const response = await axios.get(`${Config.APIURL}/users/`);
    expect(response.data).toHaveProperty("users");
    expect(Array.isArray(response.data.users)).toBeTruthy();
  });

  describe("DELETE /api/users/", () => {
    //
    test("Not initialized by default", async () => {
      await axios.delete(`${Config.APIURL}/users/`);
      const response = await axios.get(`${Config.APIURL}/users/status/`);
      expect(response.data).toHaveProperty("initialized");
      expect(response.data.initialized).toBeFalsy();
    });

    test("Reset Users", async () => {
      await axios.delete(`${Config.APIURL}/users/`);
    });
  });

  describe("POST /api/users/", () => {
    //
    beforeEach(async () => {
      await axios.delete(`${Config.APIURL}/users/`);
    });

    test("Create first User without Auth", async () => {
      const responseCreate = await axios.post(`${Config.APIURL}/users/`, {
        username: "admin",
        password: "admin",
      });
      expect(responseCreate.data).toHaveProperty("id");
      const responseList = await axios.get(`${Config.APIURL}/users/`);
      expect(responseList.data.users).toHaveLength(1);
      expect(responseList.data.users[0]).toHaveProperty("id");
      expect(responseList.data.users[0]).toHaveProperty("username");
      expect(responseList.data.users[0]).not.toHaveProperty("password");
      expect(responseList.data.users[0].id).toEqual(responseCreate.data.id);
    });

    test("Can not create 2 users", (done) => {
      axios
        .post(`${Config.APIURL}/users/`, {
          username: "admin",
          password: "admin",
        })
        .then((response) => {
          expect(response.data).toHaveProperty("id");
          axios
            .post(`${Config.APIURL}/users/`, {
              username: "admin2",
              password: "admin2",
            })
            .then(() => {
              done(new Error("Should not be able to created 2 user"));
            })
            .catch((err) => {
              done();
            });
        });
    });

    test("Initialized after 1 user created", async () => {
      let response = await axios.get(`${Config.APIURL}/users/status/`);
      expect(response.data.initialized).toBeFalsy();
      await axios.post(`${Config.APIURL}/users/`, {
        username: "admin",
        password: "admin",
      });
      response = await axios.get(`${Config.APIURL}/users/status/`);
      expect(response.data).toHaveProperty("initialized");
      expect(response.data.initialized).toBeTruthy();
    });
  });

  describe("POST /api/users/login", () => {
    //
    beforeEach(async () => {
      await axios.delete(`${Config.APIURL}/users/`);
    });

    test("Login", async () => {
      await axios.post(`${Config.APIURL}/users/`, {
        username: "admin",
        password: "admin",
      });
      const responseLogin = await axios.post(`${Config.APIURL}/users/login/`, {
        username: "admin",
        password: "admin",
      });
      expect(responseLogin.data).toHaveProperty("token");
    });
  });
});
