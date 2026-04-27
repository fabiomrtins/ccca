import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class Withdraw {
  @inject("accountRepository")
  accountRepository!: AccountRepository;
  @inject("walletRepository")
  walletRepository!: WalletRepository


  async execute(input: Input): Promise<void> {
    const wallet = await this.walletRepository.getWalletByAccountId(
      input.accountId
    );

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.withdraw(input.assetId, input.quantity);

    await this.walletRepository.upsertWallet(wallet);
  }
}

type Input = {
  accountId: string;
  assetId: string;
  quantity: number;
};
