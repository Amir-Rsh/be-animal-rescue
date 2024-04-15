const request = require("supertest");
const app = require("../app");
const client = require("../db/connection");
const data = require("../db/testData");
const db = client.db("test");
const rescues = db.collection("rescues");
const fs = require("fs/promises");

beforeAll(async () => {
  await rescues.drop();
  await db.createCollection("rescues");
  await rescues.insertMany(data);
});
afterAll(async () => {
  await client.close();
});

describe("Tesing all the endpoints", () => {
  describe("POST /rescues", () => {
    test("201: posts a new rescue", async () => {
      const response = await request(app)
        .post("/rescues")
        .send({
          name: "rescuer5",

          email: "rescuer5@gmail.com",
          injury: "minor",
          animal: "Mammal",
          location: {
            latitude: 53.409385358983765,
            longitude: -1.472134105861187,
          },
        });
      expect(response.status).toBe(201);
    });
    test("400: gives correct error message if details not provided", async () => {
      const response = await request(app)
        .post("/rescues")
        .send({
          email: "rescuer5@gmail.com",
          injury: "minor",
          animal: "mammal",
          location: {
            latitude: 53.409385358983765,
            longitude: -1.472134105861187,
          },
        });
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe("details required not completed");
    });
  });
  describe("GET /rescues", () => {
    test("200: gets all rescues", async () => {
      const response = await request(app).get("/rescues");

      expect(response.status).toBe(200);
      expect(response.body.rescues.length).toBe(5);
    });
    test("200: gets all rescues with the queried name", async () => {
      const response = await request(app).get("/rescues?name=rescuer%20three");

      expect(response.status).toBe(200);
      expect(response.body.rescues.length).toBe(1);
    });
    test("200: gets all rescues with the queried animal", async () => {
      const response = await request(app).get("/rescues?animal=mammal");

      expect(response.status).toBe(200);
      expect(response.body.rescues.length).toBe(3);
    });
    test("200: gets all rescues with the queried animal and name", async () => {
      const response = await request(app).get(
        "/rescues?animal=mammal&name=rescuer%20four"
      );

      expect(response.status).toBe(200);
      expect(response.body.rescues.length).toBe(1);
    });
    test("404: return the correct error message when no rescue under name found", async () => {
      const response = await request(app).get(
        "/rescues?name=rescuer%20million"
      );

      expect(response.status).toBe(404);
      expect(response.body.msg).toBe(
        "there are no rescues of this type under this name"
      );
    });
  });
});
