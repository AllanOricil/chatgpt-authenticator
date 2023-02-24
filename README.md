[![CI Workflow](https://github.com/AllanOricil/chat-gpt-authenticator/actions/workflows/ci.yml/badge.svg)](https://github.com/AllanOricil/chat-gpt-authenticator/actions/workflows/ci.yml)

# ChatGPT Authenticator

This node library is based on this python [implementation](https://github.com/acheong08/OpenAIAuth/blob/main/src/OpenAIAuth.py).

## How to use

````js
const { ChatGPTAuthenticator } = require('chat-gpt-authenticator');

const chatGPTAuthenticator = new ChatGPTAuthenticator(
  'email',
  'passowrd'
);

//then
chatGPTAuthenticator.auth()
.then((token) => {
  console.log(token);
});

//async/await
(async () => {
  const token = await chatGPTAuthenticator.auth();
  console.log(token);
})();
````