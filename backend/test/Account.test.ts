import Account from "../src/domain/Account";

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