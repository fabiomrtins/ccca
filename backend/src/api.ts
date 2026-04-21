import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import GetAccount from "./application/use-case/GetAccount";
import AccountController from "./infra/controller/AccountController";
import Signup from "./application/use-case/Signup";
import Registry from "./infra/di/Registry";

async function main() {
  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter(process.env.PG_CONNECTION_URL || "");
  const accountRepositoryDatabase = new AccountRepositoryDatabase();
  const signup = new Signup();
  const getAccount = new GetAccount();

  Registry.getInstance().register("httpServer", httpServer)
  Registry.getInstance().register("databaseConnection", connection)
  Registry.getInstance().register("accountRepository", accountRepositoryDatabase)
  Registry.getInstance().register("signup", signup)
  Registry.getInstance().register("getAccount", getAccount)

  new AccountController();

  httpServer.listen(5000);
}

main();
