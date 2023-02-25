import { ChatGPTAuthTokenService } from "../../dist/index.mjs";

const chatGPTAuthTokenService = new ChatGPTAuthTokenService(
  process.env.OPEN_AI_EMAIL,
  process.env.OPEN_AI_PASSWORD
);

function test(token) {
  if (typeof token === "undefined" || token === null) {
    throw new Error("could not get an accessToken");
  }
}

(async () => {
  try {
    let token = await chatGPTAuthTokenService.getToken();
    test(token);

    token = await chatGPTAuthTokenService.refreshToken();
    test(token);

    token = await chatGPTAuthTokenService.getToken();
    test(token);

    console.log("success");
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
