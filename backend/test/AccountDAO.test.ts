import { test, expect } from "@jest/globals";
import crypto from "node:crypto";
import { AccountDAODatabase } from "../src/AccountDAO";

const accountDAO = new AccountDAODatabase();

test("Should save an account in db", async () => {
    const account = {
        accountId: crypto.randomUUID(),
        name: "a",
        email: "b",
        document: "c",
        password: "d",
    };

    await accountDAO.saveAccount(account);

    const savedAccount = await accountDAO.getAccountById(account.accountId);

    expect(savedAccount.name).toBe(account.name);
    expect(savedAccount.email).toBe(account.email);
    expect(savedAccount.document).toBe(account.document);
    expect(savedAccount.password).toBe(account.password);
});
