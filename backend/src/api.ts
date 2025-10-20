import express, { Request, Response } from "express";
import cors from "cors";
import AccountService from "./AccountService";
import { AccountDAODatabase } from "./AccountDAO";

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const accountDAO = new AccountDAODatabase();
  const accountService = new AccountService(accountDAO);

  app.post("/signup", async (req: Request, res) => {
    const input = req.body;

    try {
      const output = await accountService.signup(input);

      return res.json(output);
    } catch (error: any) {
      if (error.message) {
        return res.status(422).json({ message: error.message });
      }

      throw error;
    }
  });

  app.get("/accounts/:accountId", async (req: Request, res) => {
    const { accountId } = req.params;
    try {
      const output = await accountService.getAccount(accountId);

      return res.json(output);
    } catch (error: any) {
      if (error.message) {
        return res.status(422).json({ message: error.message });
      }

      throw error;
    }
  });

  app.listen(5000);
}

main();