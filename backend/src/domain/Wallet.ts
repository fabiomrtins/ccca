import Asset from "./Asset";
import { Document } from "./Document";
import { Email } from "./Email";
import { Name } from "./Name";
import { Order } from "./Order";
import { Password } from "./Password";
import { UUID } from "./UUID";

export default class Wallet {
  private accountId: UUID;
  assets: Asset[];

  constructor(
    accountId: string,
    assets: Asset[]
  ) {
    this.accountId = new UUID(accountId);
    this.assets = assets;
  }

  static create(accountId: string) {
    const assets: Asset[] = [];
    return new Wallet(accountId, assets);
  }

  public deposit(assetId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }

    const asset = this.assets.find((asset) => asset.assetId === assetId);

    if (asset) {
      asset.quantity += quantity;
    } else {
      this.assets.push(new Asset(assetId, quantity, 0));
    }
  }

  public withdraw(assetId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }

    const asset = this.assets.find((asset) => asset.assetId === assetId);

    if (!asset) {
      throw new Error("Asset not found");
    }

    if (asset.quantity - quantity < 0) {
      throw new Error("Insufficient funds");
    }

    asset.quantity = asset.quantity - quantity;
  }

  public getBalance(assetId: string) {
    const asset = this.assets.find((asset) => asset.assetId === assetId);

    if (!asset) {
      return 0;
    }

    return asset.quantity;
  }

  public processOrder(order: Order) {
    let assetId;
    let quantity;

    if (order.side === "buy") {
      assetId = order.getPaymentAssetId()
      quantity = (order.quantity * order.price)
    } else {
      assetId = order.getMainAssetId()
      quantity = order.quantity
    }

    const asset = this.assets.find((asset) => asset.assetId === assetId);

    if (!asset || asset.quantity < quantity) {
      throw new Error("Insufficient funds")
    }

    asset.blockedQuantity += quantity;
  }


  getAccountId() {
    return this.accountId.getValue();
  }

  getAssets() {
    return this.assets;
  }
}
