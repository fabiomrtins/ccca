import { beforeEach, expect, test } from "@jest/globals";
import axios from "axios";
import sinon from "sinon";
import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import { AccountRepositoryDatabase } from "../src/AccountRepository";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../src/DatabaseConnection";
import 'dotenv/config'

let input: any = null;
let signup: Signup;
let getAccount: GetAccount;
let connection: DatabaseConnection;

axios.defaults.validateStatus = () => true;

beforeAll(() => {
  
  connection = new PgPromiseAdapter(process.env.PG_CONNECTION_URL || "");
  const accountRepository = new AccountRepositoryDatabase(connection);
  signup = new Signup(accountRepository);
  getAccount = new GetAccount(accountRepository);
});

beforeEach(() => {
  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
    assets: [],
  };
});

test("Should create an account", async () => {
  const outputSignup = await signup.execute(input);

  expect(outputSignup.accountId).toBeDefined();
});

test("Should get data from existing account using a stub", async () => {
  const saveStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "saveAccount")
    .resolves();
  const getStub = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountById")
    .resolves(input);

  const signupOutput = await signup.execute(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await getAccount.execute(signupOutput.accountId);

  expect(accountData.name).toBeDefined();
  expect(accountData.email).toBeDefined();
  expect(accountData.document).toBeDefined();
  expect(accountData.password).toBeDefined();

  saveStub.restore();
  getStub.restore();
});

test("Should get data from existing account using a spy", async () => {
  const saveSpy = sinon.spy(AccountRepositoryDatabase.prototype, "saveAccount");
  const getSpy = sinon.spy(
    AccountRepositoryDatabase.prototype,
    "getAccountById"
  );

  const signupOutput = await signup.execute(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await getAccount.execute(signupOutput.accountId);

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
  const mock = sinon.mock(AccountRepositoryDatabase.prototype);
  mock.expects("saveAccount").once().resolves();
  mock.expects("getAccountById").once().resolves(input);
  const signupOutput = await signup.execute(input);
  expect(signupOutput.accountId).toBeDefined();

  const accountData = await getAccount.execute(signupOutput.accountId);

  expect(accountData.name).toBeDefined();
  expect(accountData.email).toBeDefined();
  expect(accountData.document).toBeDefined();
  expect(accountData.password).toBeDefined();

  mock.verify();
  mock.restore();
});

afterAll(async () => {
  await connection.close();
});
