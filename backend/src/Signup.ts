import crypto from "node:crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "./AccountDAO";

export default class Signup {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(account: Input): Promise<Output> {
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
  }
}

type Input = {
  name: string;
  email: string;
  document: string;
  password: string;
};

type Output = {
  accountId: string;
};
