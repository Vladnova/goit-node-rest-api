import mongoose from "mongoose";
import app from "../app.js";
import request from "supertest";

const { DB_TEST_HOST, PORT = 3000 } = process.env;

describe("test /api/users/login", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test login with correct data", async () => {
    const loginData = {
      email: "vlad@gmail.com",
      password: "123456",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe(loginData.email);
    expect(body.user.subscription).toBeDefined();
    expect(typeof body.user.subscription).toBe("string");
    expect(typeof body.user.email).toBe("string");
  });
});
