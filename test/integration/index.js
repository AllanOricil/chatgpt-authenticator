const { ChatGPTAuthenticator } = require('../../dist/index');

const chatGPTAuthenticator = new ChatGPTAuthenticator(
  process.env.OPEN_AI_EMAIL,
  process.env.OPEN_AI_PASSWORD
);

chatGPTAuthenticator.auth().then((token) => {
  if (typeof token === 'undefined' || token === null)
    throw new Error('could not get an accessToken');
  console.log('success');
});
