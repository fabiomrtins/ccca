import pgp from "pg-promise";

export default interface AccountAssetDAO {
  saveAccountAsset(asset: any): Promise<void>;
  updateAccountAsset(asset: any): Promise<void>;
  getAccountAssetsByAccountId(accountId: string): Promise<any>;
  getAccountAssetsByAccountIdAndAssetId(
    accountId: string,
    assetId: string
  ): Promise<any>;
}

export class AccountAssetDAODatabase implements AccountAssetDAO {
  async saveAccountAsset(accountAsset: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

    await connection.query(
      `INSERT INTO ccca.account_asset (account_id, asset_id, quantity) VALUES ($1, $2, $3)`,
      [accountAsset.accountId, accountAsset.assetId, accountAsset.quantity]
    );

    await connection.$pool.end();
  }

  async updateAccountAsset(accountAsset: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

    await connection.query(
      `UPDATE ccca.account_asset SET quantity = $1 WHERE account_id = $2 and asset_id = $3`,
      [accountAsset.quantity, accountAsset.accountId, accountAsset.assetId]
    );

    await connection.$pool.end();
  }

  async getAccountAssetsByAccountId(accountId: string): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

    const accountAssets = await connection.query(
      `SELECT * FROM ccca.account_asset WHERE account_id = $1`,
      [accountId]
    );

    await connection.$pool.end();

    return accountAssets;
  }

  async getAccountAssetsByAccountIdAndAssetId(
    accountId: string,
    assetId: string
  ): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

    const [accountAsset] = await connection.query(
      `SELECT * FROM ccca.account_asset WHERE account_id = $1 and asset_id = $2`,
      [accountId, assetId]
    );

    await connection.$pool.end();

    return accountAsset;
  }
}
