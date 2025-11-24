import express, { Request, Response } from "express";
import cors from "cors";
import { AccountDAODatabase } from "./AccountDAO";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import { AccountAssetDAODatabase } from "./AccountAssetDAO";

async function main() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  const accountDAO = new AccountDAODatabase();
  const accountAssetDAO = new AccountAssetDAODatabase();
  const signup = new Signup(accountDAO);
  const getAccount = new GetAccount(accountDAO, accountAssetDAO);

  app.post("/signup", async (req: Request, res) => {
    const input = req.body;

    try {
      const output = await signup.execute(input);

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
      const output = await getAccount.execute(accountId);

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
