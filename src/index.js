import ChatGPTAuthenticator from "./chat-gpt-authenticator";

export class ChatGPTAuthTokenService {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.accessToken = null;
    this.chatGPTAuthenticator = new ChatGPTAuthenticator();
  }

  async getToken() {
    try {
      if (this.accessToken) return this.accessToken;

      this.accessToken = await this.chatGPTAuthenticator.getAccessToken(
        this.email,
        this.password
      );
      return this.accessToken;
    } catch (e) {
      console.error(e);
      throw new Error("could not get token");
    }
  }

  async refreshToken() {
    try {
      this.accessToken = null;
      return this.getToken();
    } catch (e) {
      console.error(e);
      throw new Error("could not refresh token");
    }
  }
}
