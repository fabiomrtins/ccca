import { beforeEach, expect, test } from "@jest/globals";
import axios from "axios";
import "dotenv/config";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import GetAccount from "../src/application/use-case/GetAccount";
import Deposit from "../src/application/use-case/Deposit";
import Signup from "../src/application/use-case/Signup";
import Withdraw from "../src/application/use-case/Withdraw";
import Registry from "../src/infra/di/Registry";
import { WalletRepositoryDatabase } from "../src/infra/repository/WalletRepository";

let input: any = null;
let signup: Signup;
let deposit: Deposit;
let withdraw: Withdraw;
let getAccount: GetAccount;
let connection: DatabaseConnection;

axios.defaults.validateStatus = () => true;

beforeAll(() => {
  connection = new PgPromiseAdapter(process.env.PG_CONNECTION_URL || "");
  const accountRepositoryDatabase = new AccountRepositoryDatabase();
  const walletDatabaseRepository = new WalletRepositoryDatabase();
  Registry.getInstance().register("databaseConnection", connection);
  Registry.getInstance().register("accountRepository", accountRepositoryDatabase);
  Registry.getInstance().register("walletRepository", walletDatabaseRepository);
  signup = new Signup();
  getAccount = new GetAccount();
  deposit = new Deposit();
  withdraw = new Withdraw();
});

beforeEach(() => {
  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should withdraw asset from account", async () => {
  const assetId = "BTC";
  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: assetId,
    quantity: 1,
  };

  await deposit.execute(inputDeposit);

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: assetId,
    quantity: 1,
  };

  await withdraw.execute(inputWithdraw);

  const outputGetAccount = await getAccount.execute(outputSignup.accountId);

  expect(outputGetAccount.assets).toHaveLength(1);
  expect(outputGetAccount.assets?.at(0)?.assetId).toBe(inputDeposit.assetId);
  expect(outputGetAccount.assets?.at(0)?.quantity).toBe(0);
});

test("Should not withdraw asset from account that does not have it", async () => {
  const outputSignup = await signup.execute(input);

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 1,
  };

  await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(
    new Error("Asset not found")
  );
});

test("Should not withdraw asset from account that does not have enough funds", async () => {
  const outputSignup = await signup.execute(input);

  const inputDeposit = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 1,
  };

  await deposit.execute(inputDeposit);

  const inputWithdraw = {
    accountId: outputSignup.accountId,
    assetId: "BTC",
    quantity: 2,
  };

  await expect(() => withdraw.execute(inputWithdraw)).rejects.toThrow(
    new Error("Insufficient funds")
  );
});

afterAll(async () => {
  await connection.close();
});
