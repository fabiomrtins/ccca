import pgp from "pg-promise";

export default interface AccountDAO {
  saveAccount(account: any): Promise<void>;
  getAccountById(accountId: string): Promise<any>;
}

export class AccountDAODatabase implements AccountDAO {
  async saveAccount(account: any) {
    try {
      const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

      await connection.query(
        `INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`,
        [
          account.accountId,
          account.name,
          account.email,
          account.document,
          account.password,
        ]
      );

      await connection.$pool.end();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccountById(accountId: string) {
    try {
      const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

      const [account] = await connection.query(
        `SELECT * FROM ccca.account WHERE account_id = $1`,
        [accountId]
      );

      await connection.$pool.end();

      return account;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


export class AccountDAOMemory implements AccountDAO {
  accounts: any[] = [];

  async saveAccount(account: any) {
    try {
      this.accounts.push(account);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAccountById(accountId: string) {
    try {
      const account = this.accounts.find((account) => account.accountId === accountId);

      return account;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}