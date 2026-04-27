import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import { inject } from "../di/Registry";
export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  getAccountById(accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async saveAccount(account: Account) {
    await this.connection.query(
      `INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`,
      [
        account.getAccountId(),
        account.getName(),
        account.getEmail(),
        account.getDocument(),
        account.getPassword(),
      ]
    );
  }

  async getAccountById(accountId: string): Promise<Account> {
    const [accountData] = await this.connection.query(
      `SELECT * FROM ccca.account WHERE account_id = $1`,
      [accountId]
    );

    const account = new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.document,
      accountData.password
    );

    return account;
  }
}
