import HttpServer from "../http/HttpServer";
import GetAccount from "../../application/use-case/GetAccount";
import Signup from "../../application/use-case/Signup";
import { inject } from "../di/Registry";

export default class AccountController {
  @inject("httpServer")
  httpServer!: HttpServer;
  @inject("signup")
  signup!: Signup;
  @inject("getAccount")
  getAccount!: GetAccount;

  constructor() {
    this.httpServer.route("post", "/signup", async (params: any, body: any) => {
      const input = body;

      const output = await this.signup.execute(input);

      return output;
    });

    this.httpServer.route(
      "get",
      "/accounts/:accountId",
      async (params: any, body: any) => {
        const { accountId } = params;
        console.log(accountId)
        const output = await this.getAccount.execute(accountId);

        return output;
      }
    );
  }
}
