import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import Asset from "../../domain/Asset";
import { inject } from "../di/Registry";

export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  getAccountById(accountId: string): Promise<Account>;
  updateAccount(account: Account): Promise<void>;
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

    const accountAssets = await this.connection.query(
      `SELECT * FROM ccca.account_asset WHERE account_id = $1`,
      [accountId]
    );

    const assets: Asset[] = [];

    for (const asset of accountAssets) {
      assets.push(new Asset(asset.asset_id, parseFloat(asset.quantity), parseFloat(asset.blocked_quantity)));
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
    await this.connection.query(
      `DELETE FROM ccca.account_asset WHERE account_id = $1`,
      [account.getAccountId()]
    );

    for (const asset of account.assets) {
      await this.connection.query(
        `INSERT INTO ccca.account_asset (account_id, asset_id, quantity, blocked_quantity) VALUES ($1, $2, $3, $4)`,
        [account.getAccountId(), asset.assetId, asset.quantity, asset.blockedQuantity]
      );
    }
  }
}
