import Account from "../src/Account";

let input: any;
beforeEach(() => {
  input = {
    name: "Alice Ferreira",
    email: "alice.ferreira@example.com",
    document: "97456321558",
    password: "aWERFA120",
  };
});

test("Should not create an account with only their name or surname", async () => {
  expect(() =>
    Account.create("John", "john.doe@gmail.com", "71428793860", "aWERFA120")
  ).toThrow(new Error("Invalid name"));
});

test("Should not create an account without their e-mail's domain ( Eg: .com, .com.br )", async () => {
  input["email"] = "alice.ferreira@example";

  expect(() =>
    Account.create("John Doe", "john.doe@example", "71428793860", "aWERFA120")
  ).toThrow(new Error("Invalid e-mail"));
});

test("Should not create an account with invalid document", async () => {
  expect(() =>
    Account.create(
      "John Doe",
      "john.doe@example.com",
      "1111111111",
      "aWERFA120"
    )
  ).toThrow(new Error("Invalid document"));
});

test("Should not create an account with invalid password", async () => {
  expect(() =>
    Account.create("John Doe", "john.doe@example.com", "71428793860", "123456F")
  ).toThrow(new Error("Invalid password"));
});

test("Should make two deposits", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  account.deposit("USD", 1000);
  account.deposit("USD", 1000);

  expect(account.getBalance("USD")).toBe(2000);
});

test("Should make a withdraw", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  account.deposit("USD", 1000);
  account.withdraw("USD", 525)

  expect(account.getBalance("USD")).toBe(475);
});

test("Should not deposit negative asset's quantity", async () => {
  const account = Account.create(
    "John Doe",
    "john.doe@example.com",
    "71428793860",
    "aWERFA120"
  );

  expect(() => account.deposit("BTC", -2)).toThrow(
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

  account.deposit("BTC", 1);

  expect(() => account.withdraw("BTC", -2)).toThrow(
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

  account.deposit("BTC", 1);

  expect(() => account.withdraw("BTC", 2)).toThrow(
    new Error("Insufficient funds")
  );
});
