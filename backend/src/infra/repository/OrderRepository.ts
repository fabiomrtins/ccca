import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";
import Asset from "../../domain/Asset";
import { inject } from "../di/Registry";
import { Order } from "../../domain/Order";
Order
export default interface OrderRepository {
  saveOrder(order: Order): Promise<void>;
  updateOrder(order: Order): Promise<void>;
  getOrderById(orderId: string): Promise<Order>;
  getOrdersByMarketIdAndStatus(marketId: string, status: "open" | "closed"): Promise<Order[]>
}

export class OrderRepositoryDatabase implements OrderRepository {
  @inject("databaseConnection")
  connection!: DatabaseConnection;

  async saveOrder(order: Order) {
    await this.connection.query(
      `INSERT INTO ccca.order (order_id, account_id, market_id, price, side, status, quantity, timestamp, fill_quantity, fill_price) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        order.getOrderId(),
        order.getAccountId(),
        order.getMarketId(),
        order.getPrice(),
        order.getSide(),
        order.getStatus(),
        order.getQuantity(),
        order.getTimestamp(),
        order.getFillQuantity(),
        order.getFillPrice(),
      ]
    );
  }

  async updateOrder(order: Order): Promise<void> {
    await this.connection.query(
      `UPDATE ccca.order SET fill_quantity = $1, fill_price = $2, status = $3 WHERE order_id = $4`,
      [order.getFillQuantity(), order.getFillPrice(), order.getStatus(), order.getOrderId()]
    );
  }

  async getOrderById(orderId: string): Promise<Order> {
    const [orderData] = await this.connection.query(
      `SELECT * FROM ccca.order WHERE order_id = $1`,
      [orderId]
    );

    if (!orderData) throw new Error("Order not found")

    const order = new Order(
      orderData.order_id,
      orderData.account_id,
      orderData.market_id,
      parseFloat(orderData.price),
      orderData.side,
      orderData.status,
      parseFloat(orderData.quantity),
      orderData.timestamp,
      parseFloat(orderData.fill_quantity),
      parseFloat(orderData.fill_price)
    )

    return order;
  }

  async getOrdersByMarketIdAndStatus(marketId: string, status: "open" | "closed"): Promise<Order[]> {
    const ordersData = await this.connection.query(
      `SELECT * FROM ccca.order WHERE market_id = $1 AND status = $2`,
      [marketId, status]
    );

    const orders: Order[] = ordersData.map((orderData: any) => {
      return new Order(
        orderData.order_id,
        orderData.account_id,
        orderData.market_id,
        parseFloat(orderData.price),
        orderData.side,
        orderData.status,
        parseFloat(orderData.quantity),
        orderData.timestamp,
        parseFloat(orderData.fill_quantity),
        parseFloat(orderData.fill_price)
      )
    })

    return orders;
  }
}
