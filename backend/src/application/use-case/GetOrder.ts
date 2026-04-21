import { Order } from "../../domain/Order";
import { inject } from "../../infra/di/Registry";
import AccountRepository from "../../infra/repository/AccountRepository";
import OrderRepository from "../../infra/repository/OrderRepository";

export default class GetOrder {
    @inject("accountRepository")
    accountRepository!: AccountRepository
    @inject("orderRepository")
    orderRepository!: OrderRepository;

    async execute(input: Input): Promise<Output> {
        const order = await this.orderRepository.getOrderById(input.orderId)

        if (!order) {
            throw new Error("Order not found")
        }

        const output = {
            orderId: order.getOrderId(),
            accountId: order.getAccountId(),
            marketId: order.getMarketId(),
            price: order.getPrice(),
            side: order.getSide(),
            status: order.getStatus(),
            quantity: order.getQuantity(),
            timestamp: order.getTimestamp(),
        }

        return output
    }
}

type Input = {
    orderId: string;
};

type Output = {
    orderId: string;
    accountId: string;
    marketId: string;
    price: number;
    side: string;
    status: string;
    quantity: number;
    timestamp: Date;
}