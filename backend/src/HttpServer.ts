import express, { Express, Request, Response } from "express";
import cors from "cors";

export default interface HttpServer {
  route(
    method: "get" | "post" | "patch" | "put",
    url: string,
    cb: Function
  ): void;
  listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  private app: Express;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  route(
    method: "get" | "post" | "patch" | "put",
    url: string,
    cb: Function
  ): void {
    this.app[method](url, async (req: Request, res: Response) => {
      try {
        const output = await cb(req.params, req.body);
        res.json(output);
      } catch (error: any) {
        if (error.message) {
          return res.status(422).json({ message: error.message });
        }

        throw error;
      }
    });
  }
  listen(port: number): void {
    this.app.listen(port);
  }
}
