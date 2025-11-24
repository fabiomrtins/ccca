import AccountDAO from "./AccountDAO";
import AccountAssetDAO from "./AccountAssetDAO";

export default class Withdraw {
  constructor(
    readonly accountDAO: AccountDAO,
    readonly accountAssetDAO: AccountAssetDAO
  ) {}

  async execute(input: Input): Promise<void> {
    if (input.quantity <= 0) {
      throw new Error("Quantity must be positive");
    }

    const account = await this.accountDAO.getAccountById(input.accountId);

    if (!account) {
      throw new Error("Account not found");
    }

    const accountAsset =
      await this.accountAssetDAO.getAccountAssetsByAccountIdAndAssetId(
        input.accountId,
        input.assetId
      );

    if (!accountAsset) {
      throw new Error("Asset not found");
    }

    if (accountAsset.quantity - input.quantity < 0) {
      throw new Error("Insufficient funds");
    }
    const updateAccountAsset = input;

    updateAccountAsset.quantity =
      parseFloat(accountAsset.quantity) - input.quantity;
    await this.accountAssetDAO.updateAccountAsset(updateAccountAsset);
  }
}

type Input = {
  accountId: string;
  assetId: string;
  quantity: number;
};
