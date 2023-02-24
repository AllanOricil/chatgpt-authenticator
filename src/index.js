import ChatGPTAuthenticator from "./chat-gpt-authenticator";

export class ChatGPTAuthTokenService {
  constructor(email, password) {
    this._email = email;
    this._password = password;
    this._accessToken = undefined;
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
      const chatGPTAuthenticator = new ChatGPTAuthenticator(
        this._email,
        this._password
      );
      this._accessToken = await chatGPTAuthenticator.requestToken();
      return this._accessToken;
    } catch (e) {
      throw new Error("could not refresh token");
    }
  }
}
