import pgp from "pg-promise";
import Account from "./Account";
import Asset from "./Asset";

export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  getAccountById(accountId: string): Promise<Account>;
  updateAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  async saveAccount(account: Account) {
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
  }

  async getAccountById(accountId: string): Promise<Account> {
    const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

    const [accountData] = await connection.query(
      `SELECT * FROM ccca.account WHERE account_id = $1`,
      [accountId]
    );

    const accountAssets = await connection.query(
      `SELECT * FROM ccca.account_asset WHERE account_id = $1`,
      [accountId]
    );

    await connection.$pool.end();

    const assets: Asset[] = [];

    for (const asset of accountAssets) {
      assets.push(new Asset(asset.asset_id, parseFloat(asset.quantity)));
    }

    const account = new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.document,
      accountData.password,
      assets
    );

    return account;
  }

  async updateAccount(account: Account) {
    const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

    await connection.query(
      `DELETE FROM ccca.account_asset WHERE account_id = $1`,
      [account.accountId]
    );

    for (const asset of account.assets) {
      await connection.query(
        `INSERT INTO ccca.account_asset (account_id, asset_id, quantity) VALUES ($1, $2, $3)`,
        [account.accountId, asset.assetId, asset.quantity]
      );
    }

    await connection.$pool.end();
  }
}
