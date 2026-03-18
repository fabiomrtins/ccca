import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(statements: string, data: any): Promise<any>;
  close(): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<{}>;

  constructor(connectionUrl: string) {
    this.connection = pgp()(connectionUrl);
  }

  async query(statements: string, data: any): Promise<any> {
    const output = await this.connection.query(statements, data);

    return output;
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
