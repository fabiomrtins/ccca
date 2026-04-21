import { beforeEach, expect, test } from "@jest/globals";
import "dotenv/config";
import DatabaseConnection, {
    PgPromiseAdapter,
} from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import GetAccount from "../src/application/use-case/GetAccount";
import Deposit from "../src/application/use-case/Deposit";
import Signup from "../src/application/use-case/Signup";
import Registry from "../src/infra/di/Registry";
import PlaceOrder from "../src/application/use-case/PlaceOrder";
import GetOrder from "../src/application/use-case/GetOrder";
import { OrderRepositoryDatabase } from "../src/infra/repository/OrderRepository";

let signUpInput: any = null;
let signup: Signup;
let deposit: Deposit;
let getAccount: GetAccount;
let connection: DatabaseConnection;
let placeOrder: PlaceOrder;
let getOrder: GetOrder;

beforeAll(() => {
    connection = new PgPromiseAdapter(process.env.PG_CONNECTION_URL || "");
    const accountDatabaseRepository = new AccountRepositoryDatabase();
    const orderRepositoryDatabase = new OrderRepositoryDatabase();
    Registry.getInstance().register("databaseConnection", connection);
    Registry.getInstance().register("accountRepository", accountDatabaseRepository);
    Registry.getInstance().register("orderRepository", orderRepositoryDatabase);
    signup = new Signup();
    getAccount = new GetAccount();
    deposit = new Deposit();
    placeOrder = new PlaceOrder();
    getOrder = new GetOrder();
});

beforeEach(() => {
    signUpInput = {
        name: "Alice Ferreira",
        email: "alice.ferreira@example.com",
        document: "97456321558",
        password: "aWERFA120",
    };
});

test("Should succesfully place a buy order", async () => {
    const outputSignup = await signup.execute(signUpInput);

    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 1000,
    };

    await deposit.execute(inputDeposit);

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);

    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets?.at(0)?.assetId).toBe(inputDeposit.assetId);
    expect(outputGetAccount.assets?.at(0)?.quantity).toBe(inputDeposit.quantity);

    const inputPlaceOrder = {
        marketId: "BTC-USD",
        accountId: outputSignup.accountId,
        price: 1000,
        quantity: 1,
        side: "buy",
    };

    const outputPlaceOrder = await placeOrder.execute(inputPlaceOrder);

    expect(outputPlaceOrder.orderId).toBeDefined();

    const order = await getOrder.execute({ orderId: outputPlaceOrder.orderId });

    expect(order.marketId).toBe(inputPlaceOrder.marketId);
    expect(order.accountId).toBe(inputPlaceOrder.accountId);
    expect(order.price).toBe(inputPlaceOrder.price);
    expect(order.quantity).toBe(inputPlaceOrder.quantity);
    expect(order.side).toBe(inputPlaceOrder.side);
});

test("Should not succesfully place a buy order without sufficient funds", async () => {
    const outputSignup = await signup.execute(signUpInput);

    const inputDeposit = {
        accountId: outputSignup.accountId,
        assetId: "USD",
        quantity: 25000,
    };

    await deposit.execute(inputDeposit);

    const outputGetAccount = await getAccount.execute(outputSignup.accountId);

    expect(outputGetAccount.assets).toHaveLength(1);
    expect(outputGetAccount.assets?.at(0)?.assetId).toBe(inputDeposit.assetId);
    expect(outputGetAccount.assets?.at(0)?.quantity).toBe(inputDeposit.quantity);

    const inputPlaceOrder = {
        marketId: "USD-BTC",
        accountId: outputSignup.accountId,
        price: 85000,
        quantity: 1,
        side: "buy",
    };

    await expect(placeOrder.execute(inputPlaceOrder)).rejects.toThrow("Insufficient funds");
});

test("Should not succesfully place a sell order without sufficient funds", async () => {
    const outputSignup = await signup.execute(signUpInput);

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

    const inputPlaceOrder = {
        marketId: "BTC-USD",
        accountId: outputSignup.accountId,
        quantity: 2,
        price: 85000,
        side: "sell",
    };

    await expect(placeOrder.execute(inputPlaceOrder)).rejects.toThrow("Insufficient funds");
});



afterAll(async () => {
    await connection.close();
});
