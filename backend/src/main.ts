import express, { Request, Response } from "express";
import crypto from "node:crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

const app = express();  
app.use(express.json());
const connection = pgp()("postgres://postgres:123456@localhost:5433/app");

interface UserDTO {
  name: string;
  email: string;
  document: string;
  password: string;
}

app.post("/signup", async (req: Request, res) => {
  const body: UserDTO = req.body;
  const accountId = crypto.randomUUID();

  if (!body.name || !body.name.match(/[a-zA-Z]+ [a-zA-Z]/)) {
    return res.status(422).send({ message: "Invalid name"})
  }

  if (!body.email || !body.email.match(/.+@.+\..+/)) {
    return res.status(422).send({ message: "Invalid e-mail"})
  }

  if (!body.document || !validateCpf(body.document)) {
    return res.status(422).send({ message: "Invalid document"})
  }

  if (!body.password || body.password.length < 8 || !body.password.match(/[a-z]/) || !body.password.match(/[A-Z]/) || !body.password.match(/[0-9]/)) {
    return res.status(422).send({ message: "Invalid password"})
  }

  try {
    await connection.query(
      `INSERT INTO ccca.account (account_id, name, email, document, password) VALUES ($1, $2, $3, $4, $5)`,
      [accountId, body.name, body.email, body.document, body.password]
    );

    return res.json({
        accountId
    });
  } catch (error) {
    console.error(error)
    throw error;
  }
});

app.get("/accounts/:accountId", async (req: Request, res) => {
    const { accountId } = req.params
    try {
        const [account] = await connection.query(`SELECT * FROM ccca.account WHERE account_id = $1`, [accountId])

        return res.json(account)
    } catch (error) {
        console.error(error)
        throw error
    }
})

app.listen(5000);
