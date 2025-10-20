import { expect, jest, test } from "@jest/globals";
import axios from "axios";

let userPayload: any = null
axios.defaults.validateStatus = () => true

beforeEach(() => {
  userPayload = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should create an user", async () => {
  const response = await axios.post("http://localhost:5000/signup", userPayload);
  const responseData = response.data;

  expect(response.status).toBe(200);
  expect(responseData.accountId).toBeDefined();
});

test("Should not create an user with only their name or surname", async () => {
    userPayload["name"] = "Ferreira"

    const response = await axios.post("http://localhost:5000/signup", userPayload)
    const responseData = response.data

    expect(response.status).toBe(422);
    expect(responseData.message).toBe("Invalid name")
});

test("Should not create an user without their e-mail's domain ( Eg: .com, .com.br )", async () => {
    userPayload["email"] = "alice.ferreira@example"

    const response = await axios.post("http://localhost:5000/signup", userPayload)
    const responseData = response.data

    expect (response.status).toBe(422)
    expect (responseData.message).toBe("Invalid e-mail")
})

test("Should not create an user with invalid document", async () => {
    userPayload["document"] = "1111111111"

    const response = await axios.post("http://localhost:5000/signup", userPayload)
    const responseData = response.data

    expect (response.status).toBe(422)
    expect (responseData.message).toBe("Invalid document")
})

test("Should not create an user with invalid password", async () => {
    userPayload["password"] = "123456"

    const response = await axios.post("http://localhost:5000/signup", userPayload)
    const responseData = response.data

    expect (response.status).toBe(422)
    expect (responseData.message).toBe("Invalid password")
})

test("Should get data from existing account", async () => {
    const createAccountResponse = await axios.post("http://localhost:5000/signup", userPayload)
    const createAccountData = createAccountResponse.data

    expect(createAccountResponse.status).toBe(200);

    const getAccountResponse = await axios.get(`http://localhost:5000/accounts/${createAccountData.accountId}`)
    const accountData = getAccountResponse.data

    expect(accountData.account_id).toBeDefined()
    expect(accountData.name).toBeDefined()
    expect(accountData.email).toBeDefined()
    expect(accountData.document).toBeDefined()
    expect(accountData.password).toBeDefined()
})