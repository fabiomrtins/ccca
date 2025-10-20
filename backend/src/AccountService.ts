import crypto from "node:crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

export default class AccountService {
  constructor(readonly accountDAO: AccountDAO) {}

  async signup(account: any) {
    const accountId = crypto.randomUUID();

    if (!account.name || !account.name.match(/[a-zA-Z]+ [a-zA-Z]/)) {
      throw new Error("Invalid name");
    }

    if (!account.email || !account.email.match(/.+@.+\..+/)) {
      throw new Error("Invalid e-mail");
    }

    if (!account.document || !validateCpf(account.document)) {
      throw new Error("Invalid document");
    }

    if (
      !account.password ||
      account.password.length < 8 ||
      !account.password.match(/[a-z]/) ||
      !account.password.match(/[A-Z]/) ||
      !account.password.match(/[0-9]/)
    ) {
      throw new Error("Invalid password");
    }

    try {
      await this.accountDAO.saveAccount({
        accountId,
        name: account.name,
        email: account.email,
        document: account.document,
        password: account.password,
      });

      return {
        accountId,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccount(accountId: string) {
    try {
      const account = await this.accountDAO.getAccountById(accountId);

      return account;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
