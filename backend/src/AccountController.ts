import HttpServer from "./HttpServer";
import GetAccount from "./GetAccount";
import Signup from "./Signup";

export default class AccountController {
  constructor(
    readonly httpServer: HttpServer,
    readonly signup: Signup,
    readonly getAccount: GetAccount
  ) {
    this.httpServer.route("post", "/signup", async (params: any, body: any) => {
      const input = body;

      const output = await signup.execute(input);

      return output;
    });

    this.httpServer.route(
      "get",
      "/accounts/:accountId",
      async (params: any, body: any) => {
        const { accountId } = params;
        const output = await getAccount.execute(accountId);

        return output;
      }
    );
  }
}
