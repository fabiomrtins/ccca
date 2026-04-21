import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import Asset from "../../domain/Asset";
import { inject } from "../di/Registry";
import { Order } from "../../domain/Order";
Order
export default interface OrderRepository {
  saveOrder(order: Order): Promise<void>;
  getOrderById(orderId: string): Promise<Order>;
}

export class OrderRepositoryDatabase implements OrderRepository {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async saveOrder(order: Order) {
    await this.connection.query(
      `INSERT INTO ccca.order (order_id, account_id, market_id, price, side, status, quantity, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        order.getOrderId(),
        order.getAccountId(),
        order.getMarketId(),
        order.getPrice(),
        order.getSide(),
        order.getStatus(),
        order.getQuantity(),
        order.getTimestamp(),
      ]
    );
  }

  async getOrderById(orderId: string): Promise<Order> {
    const [orderData] = await this.connection.query(
      `SELECT * FROM ccca.order WHERE order_id = $1`,
      [orderId]
    );

    if (!orderData) throw new Error("Order not found")

    const order = new Order(orderData.order_id, orderData.account_id, orderData.market_id, parseFloat(orderData.price), orderData.side, orderData.status, parseFloat(orderData.quantity), orderData.timestamp)

    return order;
  }
}
