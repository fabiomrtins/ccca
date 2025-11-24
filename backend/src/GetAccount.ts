import AccountAssetDAO from "./AccountAssetDAO";
import AccountDAO from "./AccountDAO";

export default class GetAccount {
  constructor(
    readonly accountDAO: AccountDAO,
    readonly accountAssetDAO: AccountAssetDAO
  ) {}

  async execute(accountId: string): Promise<Output> {
    const account = await this.accountDAO.getAccountById(accountId);

    const accountAssets =
      await this.accountAssetDAO.getAccountAssetsByAccountId(accountId);

    account.assets = accountAssets.map((accountAsset: any) => {
      return {
        assetId: accountAsset.asset_id,
        quantity: parseFloat(accountAsset.quantity),
      };
    });

    return account;
  }
}

type Output = {
  account_id: string;
  name: string;
  email: string;
  document: string;
  password: string;
  assets: { assetId: string; quantity: number }[];
};
