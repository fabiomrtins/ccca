import express, { Express, Request, Response } from "express";
import cors from "cors";
import Hapi, { Server as HapiServer } from "@hapi/hapi";
import restify, { Server as RestifyServer, Request as RestifyRequest, Response as RestifyResponse, Next } from "restify";

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

export class HapiAdapter implements HttpServer {
  private server: HapiServer;

  constructor() {
    this.server = Hapi.server({});
  }

  route(
    method: "get" | "post" | "patch" | "put",
    url: string,
    cb: Function
  ): void {
    const hapiMethod = method.toUpperCase();
    this.server.route({
      method: hapiMethod as any,
      path: url.replace(/\/:(\w+)/g, "/{$1}"),
      handler: async (request: any, h: any) => {
        try {
          const output = await cb(request.params, request.payload);
          return output;
        } catch (error: any) {
          if (error.message) {
            return h.response({ message: error.message }).code(422);
          }
          throw error;
        }
      },
    });
  }

  listen(port: number): void {
    this.server.settings.port = port;
    this.server.start();
  }
}

export class RestifyAdapter implements HttpServer {
  private server: RestifyServer;

  constructor() {
    this.server = restify.createServer();
    this.server.use(restify.plugins.bodyParser());
    this.server.use(restify.plugins.queryParser());
  }

  route(
    method: "get" | "post" | "patch" | "put",
    url: string,
    cb: Function
  ): void {
    this.server[method](url, async (req: RestifyRequest, res: RestifyResponse, next: Next) => {
      try {
        const output = await cb(req.params, req.body);
        res.send(output);
      } catch (error: any) {
        if (error.message) {
          res.send(422, { message: error.message });
        } else {
          throw error;
        }
      }
      return next();
    });
  }

  listen(port: number): void {
    this.server.listen(port);
  }
}
