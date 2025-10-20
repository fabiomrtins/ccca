import { beforeEach, expect, test } from "@jest/globals";
import axios from "axios";
import sinon from "sinon";
import * as data from "../src/AccountDAO";
import AccountService from "../src/AccountService";
import { AccountDAODatabase } from "../src/AccountDAO";

let input: any = null;
let accountService: AccountService;
axios.defaults.validateStatus = () => true;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase()
  accountService = new AccountService(accountDAO);

  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should create an account", async () => {
  const outputSignup = await accountService.signup(input);

  expect(outputSignup.accountId).toBeDefined();
});

test("Should not create an account with only their name or surname", async () => {
  input["name"] = "Ferreira";

  await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Should not create an account without their e-mail's domain ( Eg: .com, .com.br )", async () => {
  input["email"] = "alice.ferreira@example";

  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid e-mail")
  );
});

test("Should not create an account with invalid document", async () => {
  input["document"] = "1111111111";

  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid document")
  );
});

test("Should not create an account with invalid password", async () => {
  input["password"] = "123456";

  await expect(() => accountService.signup(input)).rejects.toThrow(
    new Error("Invalid password")
  );
});

test("Should get data from existing account using a stub", async () => {
  const saveStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
  const getStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(input);

  const signupOutput = await accountService.signup(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await accountService.getAccount(signupOutput.accountId);

  expect(accountData.name).toBeDefined();
  expect(accountData.email).toBeDefined();
  expect(accountData.document).toBeDefined();
  expect(accountData.password).toBeDefined();

  saveStub.restore();
  getStub.restore();
});

test("Should get data from existing account using a spy", async () => {
  const saveSpy = sinon.spy(AccountDAODatabase.prototype, "saveAccount");
  const getSpy = sinon.spy(AccountDAODatabase.prototype, "getAccountById");

  const signupOutput = await accountService.signup(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await accountService.getAccount(signupOutput.accountId);

  expect(accountData.name).toBeDefined();
  expect(accountData.email).toBeDefined();
  expect(accountData.document).toBeDefined();
  expect(accountData.password).toBeDefined();

  expect(saveSpy.calledOnce).toBe(true);
  expect(getSpy.calledOnce).toBe(true);
  expect(getSpy.calledWith(signupOutput.accountId)).toBe(true);

  saveSpy.restore();
  getSpy.restore();
});

test("Should get data from existing account using mock", async () => {
  const mock = sinon.mock(AccountDAODatabase.prototype);
  mock.expects("saveAccount").once().resolves();
  mock.expects("getAccountById").once().resolves(input);
  const signupOutput = await accountService.signup(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await accountService.getAccount(signupOutput.accountId);

  expect(accountData.name).toBeDefined();
  expect(accountData.email).toBeDefined();
  expect(accountData.document).toBeDefined();
  expect(accountData.password).toBeDefined();

  mock.verify();
  mock.restore();
});

test("Should get data from existing account using fake", async () => {
  const accountDAO = new data.AccountDAOMemory()
  const accountService = new AccountService(accountDAO);

  const signupOutput = await accountService.signup(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await accountService.getAccount(signupOutput.accountId);

  expect(accountData.name).toBeDefined();
  expect(accountData.email).toBeDefined();
  expect(accountData.document).toBeDefined();
  expect(accountData.password).toBeDefined();
});
