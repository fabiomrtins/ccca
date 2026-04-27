import { Order } from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import Mediator from "../../infra/mediator/Mediator";
import OrderRepository from "../../infra/repository/OrderRepository";
import WalletRepository from "../../infra/repository/WalletRepository";

export default class PlaceOrder {
    @inject("orderRepository")
    orderRepository!: OrderRepository;
    @inject("walletRepository")
    walletRepository!: WalletRepository
    @inject("mediator")
    mediator!: Mediator

    async execute(input: Input): Promise<Output> {
        const wallet = await this.walletRepository.getWalletByAccountId(input.accountId)
        const order = Order.create(input.accountId, input.marketId, input.price, input.quantity, input.side)
        wallet.processOrder(order);
        await this.orderRepository.saveOrder(order)
        await this.walletRepository.upsertWallet(wallet)

        await this.mediator.notifyAll("orderPlaced", order);

        return {
            orderId: order.getOrderId()
        }
    }
}

type Input = {
    accountId: string;
    marketId: string;
    price: number;
    quantity: number;
    side: string;
};

type Output = {
    orderId: string;
}