import pgPromise from "pg-promise";

export const dbConnection = await pgPromise({
  connect: "postgres://postgres:123456@localhost:5433/app",
});
