import AccountDAO from "./AccountDAO";
import AccountAssetDAO from "./AccountAssetDAO";

export default class Deposit {
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
      const newAccountAsset = input;
      return await this.accountAssetDAO.saveAccountAsset(newAccountAsset);
    }

    input.quantity += parseFloat(accountAsset.quantity);
    await this.accountAssetDAO.updateAccountAsset(input);
  }
}

type Input = {
  accountId: string;
  assetId: string;
  quantity: number;
};