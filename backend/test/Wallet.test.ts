import Account from "../src/domain/Account";
import Wallet from "../src/domain/Wallet";

let input: any;
beforeEach(() => {
  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should make two deposits", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  const wallet = Wallet.create(account.getAccountId());

  wallet.deposit("USD", 1000);
  wallet.deposit("USD", 1000);

  expect(wallet.getBalance("USD")).toBe(2000);
});

test("Should make a withdraw", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  const wallet = Wallet.create(account.getAccountId());

  wallet.deposit("USD", 1000);
  wallet.withdraw("USD", 525)

  expect(wallet.getBalance("USD")).toBe(475);
});

test("Should not deposit negative asset's quantity", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  const wallet = Wallet.create(account.getAccountId());

  expect(() => wallet.deposit("BTC", -2)).toThrow(
    new Error("Quantity must be positive")
  );
});

test("Should not withdraw negative asset's quantity", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  const wallet = Wallet.create(account.getAccountId());

  wallet.deposit("BTC", 1);

  expect(() => wallet.withdraw("BTC", -2)).toThrow(
    new Error("Quantity must be positive")
  );
});

test("Should not withdraw without enough funds", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  const wallet = Wallet.create(account.getAccountId());

  wallet.deposit("BTC", 1);

  expect(() => wallet.withdraw("BTC", 2)).toThrow(
    new Error("Insufficient funds")
  );
});
