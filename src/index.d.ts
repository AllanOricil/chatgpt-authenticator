declare module "chat-gpt-authenticator" {
  export class ChatGPTAuthTokenService {
    constructor(email: string, password: string);
    getToken(): Promise<string>;
    refreshToken(): Promise<string>;
  }
}
