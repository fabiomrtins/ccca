import { beforeEach, expect, test } from "@jest/globals";
import axios from "axios";

let input: any = null;
axios.defaults.validateStatus = () => true;

beforeEach(() => {
  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should create an account", async () => {
  const responseSignup = await axios.post(
    "http://localhost:5000/signup",
    input
  );
  const responseSignupData = responseSignup.data;

  expect(responseSignup.status).toBe(200);
  expect(responseSignupData.accountId).toBeDefined();
});

test("Should not create an account with only their name or surname", async () => {
  input["name"] = "Ferreira";

  const responseSignup = await axios.post(
    "http://localhost:5000/signup",
    input
  );
  const responseSignupData = responseSignup.data;

  expect(responseSignup.status).toBe(422);
  expect(responseSignupData.message).toBe("Invalid name");
});