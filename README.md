[![CI Workflow](https://github.com/AllanOricil/chat-gpt-authenticator/actions/workflows/ci.yml/badge.svg)](https://github.com/AllanOricil/chat-gpt-authenticator/actions/workflows/ci.yml)

# ChatGPT Authenticator

This node library is based on this python [implementation](https://github.com/acheong08/OpenAIAuth/blob/main/src/OpenAIAuth.py).

## How to use

Create an Open AI account in this [link](https://platform.openai.com/login/).

### Methods

```js
//requests a new token or return a token that has already been fetched
chatGPTAuthTokenService.getToken() : <Promise>

//requests a new token
chatGPTAuthTokenService.refreshToken() : <Promise>
```

### ES Modules

```js
import { ChatGPTAuthTokenService } from "chat-gpt-authenticator";

const chatGptAuthTokenService = new ChatGPTAuthTokenService(
  "OPEN_AI_EMAIL",
  "OPEN_AI_PASSWORD"
);

(async () => {
  const token = await chatGptAuthTokenService.getToken();
  console.log(token);

  token = await chatGPTAuthTokenService.refreshToken();
  console.log(token);
})();
```

### Common JS

```js
const { ChatGPTAuthTokenService } = require("chat-gpt-authenticator");

const chatGPTAuthTokenService = new ChatGPTAuthTokenService(
  "OPEN_AI_EMAIL",
  "OPEN_AI_PASSWORD"
);

(async () => {
  let token = await chatGPTAuthTokenService.getToken();
  console.log(token);

  token = await chatGPTAuthTokenService.refreshToken();
  console.log(token);
})();
```
