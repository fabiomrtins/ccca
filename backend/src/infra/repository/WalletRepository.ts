import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import Asset from "../../domain/Asset";
import { inject } from "../di/Registry";
import Wallet from "../../domain/Wallet";

export default interface WalletRepository {
  getWalletByAccountId(accountId: string): Promise<Wallet>;
  upsertWallet(wallet: Wallet): Promise<void>;
}

export class WalletRepositoryDatabase implements WalletRepository {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async getWalletByAccountId(accountId: string): Promise<Wallet> {
    const [accountData] = await this.connection.query(
      `SELECT * FROM ccca.account WHERE account_id = $1`,
      [accountId]
    );

    if (!accountData) {
      throw new Error("Account not found");
    }

    const accountAssets = await this.connection.query(
      `SELECT * FROM ccca.account_asset WHERE account_id = $1`,
      [accountId]
    );

    const assets: Asset[] = [];

    for (const asset of accountAssets) {
      assets.push(new Asset(asset.asset_id, parseFloat(asset.quantity), parseFloat(asset.blocked_quantity)));
    }

    const wallet = new Wallet(accountData.account_id, assets)

    return wallet;
  }

  async upsertWallet(wallet: Wallet) {
    await this.connection.query(
      `DELETE FROM ccca.account_asset WHERE account_id = $1`,
      [wallet.getAccountId()]
    );

    for (const asset of wallet.assets) {
      await this.connection.query(
        `INSERT INTO ccca.account_asset (account_id, asset_id, quantity, blocked_quantity) VALUES ($1, $2, $3, $4)`,
        [wallet.getAccountId(), asset.assetId, asset.quantity, asset.blockedQuantity]
      );
    }
  }
}
