const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisonnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisonnect();
  });

  describe("Test GET /v1/launches", () => {
    test("Status code should be 200", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NASA 30D",
      target: "Kepler-62 f",
      launchDate: "May 27, 2051",
    };
    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NASA 30D",
      target: "Kepler-62 f",
    };
    const launchDataWithInvalidDate = {
      mission: "USS Enterprise",
      rocket: "NASA 30D",
      target: "Kepler-62 f",
      launchDate: "hello",
    };
    test("Status code should be 201", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf;
      const responseDate = new Date(response.body.launchDate).valueOf;

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
