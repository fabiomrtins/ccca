import { beforeEach, expect, test } from "@jest/globals";
import axios from "axios";
import { AccountDAODatabase } from "../src/AccountDAO";
import Signup from "../src/Signup";
import GetAccount from "../src/GetAccount";
import Deposit from "../src/Deposit";
import { AccountAssetDAODatabase } from "../src/AccountAssetDAO";

let input: any = null;
let signup: Signup;
let deposit: Deposit;
let getAccount: GetAccount;
axios.defaults.validateStatus = () => true;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const accountAssetDAO = new AccountAssetDAODatabase();
  signup = new Signup(accountDAO);
  getAccount = new GetAccount(accountDAO, accountAssetDAO);
  deposit = new Deposit(accountDAO, accountAssetDAO);

  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should make a valid deposit", async () => {
  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 1,
  };

  await deposit.execute(inputDeposit);

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputGetAccount.assets).toHaveLength(1);
  expect(outputGetAccount.assets?.at(0)?.assetId).toBe(inputDeposit.assetId);
  expect(outputGetAccount.assets?.at(0)?.quantity).toBe(inputDeposit.quantity);
});

test("Should make two valid deposits of the same asset", async () => {
  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 1,
  };

  await deposit.execute(inputDeposit);
  await deposit.execute(inputDeposit);

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputGetAccount.assets).toHaveLength(1);
  expect(outputGetAccount.assets?.at(0)?.assetId).toBe(inputDeposit.assetId);
  expect(outputGetAccount.assets?.at(0)?.quantity).toBe(2);
});

test("Should not make a deposit with invalid quantity", async () => {
  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 0,
  };

  await expect(() => deposit.execute(inputDeposit)).rejects.toThrow(
    new Error("Quantity must be positive")
  );
});
