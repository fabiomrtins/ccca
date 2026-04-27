import Book from "../src/domain/Book";
import { Order } from "../src/domain/Order";

test("Should test order book", async () => {
    const accountId = crypto.randomUUID();
    const marketId = "BTC-USD";
    const events: Order[] = [];

    const book = new Book(marketId)
    book.register("orderFilled", async (order: Order) => {
        events.push(order)
    })
    const buyOrder = Order.create(accountId, marketId, 85000, 1, "buy");
    const sellOrder = Order.create(accountId, marketId, 85000, 1, "sell");

    await book.insert(buyOrder);
    await book.insert(sellOrder);

    expect(buyOrder.getStatus()).toBe("closed");
    expect(sellOrder.getStatus()).toBe("closed");
    expect(buyOrder.getFillQuantity()).toBe(1);
    expect(sellOrder.getFillQuantity()).toBe(1);
    expect(events).toHaveLength(2)
    expect(events[0].getFillPrice()).toBe(85000)
    expect(events[1].getFillPrice()).toBe(85000)
})