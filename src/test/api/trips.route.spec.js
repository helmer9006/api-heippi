import supertest from "supertest";
import app from "./../../app.js";

describe("Test API-SOYYO entity", () => {
  //TEST ENDPOINT  api/users/getAllUsers
  describe("GET api/users/getAllUsers", () => {
    let response;
    beforeEach(async () => {
      response = await supertest(app).get("/api/users/getAllUsers").send();
    });

    // validate route is ok
    it("route ok", async () => {
      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toContain("json");
    });

    // validate array
    it("returned array", async () => {
      expect(response.body.response).toBeInstanceOf(Array);
    });
  });
});
