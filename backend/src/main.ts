import express, { Request, Response } from "express";
import cors from "cors";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import { AccountRepositoryDatabase } from "./AccountRepository";
import { PgPromiseAdapter } from "./DatabaseConnection";
import { ExpressAdapter } from "./HttpServer";
import AccountController from "./AccountController";
import "dotenv/config";

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const httpServer = new ExpressAdapter();
  const connection = new PgPromiseAdapter(process.env.PG_CONNECTION_URL || "");
  const accountRepositoryDatabase = new AccountRepositoryDatabase(connection);
  const signup = new Signup(accountRepositoryDatabase);
  const getAccount = new GetAccount(accountRepositoryDatabase);

  new AccountController(httpServer, signup, getAccount);

  httpServer.listen(5000);
}

main();
