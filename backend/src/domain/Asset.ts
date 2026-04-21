export default class Asset {
  constructor(readonly assetId: string, public quantity: number, public blockedQuantity: number) {
    if (quantity < 0) {
      throw new Error("Quantity must be positive");
    }
  }
}
