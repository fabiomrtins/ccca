import { UUID } from "./UUID";

export class Order {
    private orderId: UUID;
    private accountId: UUID;

    constructor(
        orderId: string,
        accountId: string,
        readonly marketId: string,
        readonly price: number,
        readonly side: string,
        private status: string,
        readonly quantity: number,
        readonly timestamp: Date,
        private fillQuantity: number,
        private fillPrice: number,
    ) {
        this.orderId = new UUID(orderId)
        this.accountId = new UUID(accountId)
    }

    static create(accountId: string, marketId: string, price: number, quantity: number, side: string) {
        const orderId = UUID.create();
        const status = "open";
        const timestamp = new Date();

        return new Order(orderId.getValue(), accountId, marketId, price, side, status, quantity, timestamp, 0, 0)
    }

    fill(quantity: number, price: number) {
        if (this.getAvailableQuantity() < quantity) throw new Error("Insufficient quantity")

        this.fillQuantity += quantity
        this.fillPrice = price

        if (this.getAvailableQuantity() === 0) {
            this.status = "closed"
        }
    }

    getMainAssetId() {
        const [mainAssetId, paymentAssetId] = this.marketId.split("-")
        return mainAssetId
    }

    getPaymentAssetId() {
        const [mainAssetId, paymentAssetId] = this.marketId.split("-")
        return paymentAssetId
    }

    getOrderId() {
        return this.orderId.getValue();
    }

    getAccountId() {
        return this.accountId.getValue();
    }

    getMarketId() {
        return this.marketId;
    }

    getPrice() {
        return this.price;
    }

    getSide() {
        return this.side;
    }

    getStatus() {
        return this.status;
    }

    getQuantity() {
        return this.quantity;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getFillQuantity() {
        return this.fillQuantity;
    }

    getFillPrice() {
        return this.fillPrice;
    }

    getAvailableQuantity() {
        return this.quantity - this.fillQuantity
    }
}