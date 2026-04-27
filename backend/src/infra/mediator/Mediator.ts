export default class Mediator {
    handlers: { event: string, callback: Function }[] = [];

    register(event: string, callback: Function) {
        this.handlers.push({ event, callback });
    }

    async notifyAll(event: string, data: any) {
        const eventHandlers = this.handlers.filter(handler => handler.event === event);

        for (const handler of eventHandlers) {
            await handler.callback(data);
        }
    }
}