import ChatGPTAuthenticator from "./chat-gpt-authenticator";

const chatGPTAuthenticator = new ChatGPTAuthenticator();

export class ChatGPTAuthTokenService {
  constructor(email, password) {
    this._accessToken = undefined;
    this.email = email;
    this.password = password;
  }

  async getToken() {
    try {
      if (
        typeof this._accessToken !== "undefined" &&
        this._accessToken != null
      ) {
        return this._accessToken;
      }
      this._accessToken = await this.refreshToken();
      return this._accessToken;
    } catch (e) {
      throw new Error("could not get token");
    }
  }

  async refreshToken() {
    try {
      this._accessToken = await chatGPTAuthenticator.requestToken(
        this.email,
        this.password
      );
      return this._accessToken;
    } catch (e) {
      throw new Error("could not refresh token");
    }
  }
}
