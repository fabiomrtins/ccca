import Account from "../../domain/Account";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";

export default class Signup {
  @inject("accountRepository")
  accountRepository!: AccountRepository;

  async execute(input: Input): Promise<Output> {
    const account = Account.create(
      input.name,
      input.email,
      input.document,
      input.password
    );

    await this.accountRepository.saveAccount(account);

    return {
      accountId: account.accountId,
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
