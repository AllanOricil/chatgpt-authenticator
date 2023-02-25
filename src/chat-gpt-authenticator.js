import nodeFetch from "node-fetch";
import fetchCookie from "fetch-cookie";
import setCookie from "set-cookie-parser";

export default class ChatGPTAuthenticator {
  constructor() {
    this.fetch = fetchCookie(nodeFetch);
  }

  async requestToken(email, password) {
    const response = await this.fetch(
      "https://explorer.api.openai.com/api/auth/csrf",
      {
        method: "GET",
        headers: {
          Host: "explorer.api.openai.com",
          Accept: "*/*",
          Connection: "keep-alive",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
          "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
          Referer: "https://explorer.api.openai.com/auth/login",
          "Accept-Encoding": "gzip, deflate, br",
        },
      }
    );

    if (
      response.headers.get("content-type")?.indexOf("application/json") !== -1
    ) {
      if (response.status === 200) {
        const data = await response.json();
        return this.stepOne(
          { email: encodeURIComponent(email), password: encodeURI(password) },
          data.csrfToken
        );
      }
      throw new Error("status != 200");
    } else {
      throw new Error("response cannot be parsed");
    }
  }

  async stepOne(credentials, csrfToken) {
    const response = await this.fetch(
      "https://explorer.api.openai.com/api/auth/signin/auth0?prompt=login",
      {
        method: "POST",
        body: `callbackUrl=%2F&csrfToken=${csrfToken}&json=true`,
        keepAlive: true,
        headers: {
          Host: "explorer.api.openai.com",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          Accept: "*/*",
          "Sec-Gpc": "1",
          "Accept-Language": "en-US,en;q=0.8",
          Origin: "https://explorer.api.openai.com",
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          Referer: "https://explorer.api.openai.com/auth/login",
          "Accept-Encoding": "gzip, deflate",
        },
      }
    );

    if (
      response.headers.get("content-type")?.indexOf("application/json") !== -1
    ) {
      if (response.status === 200) {
        const data = await response.json();
        if (
          data?.url ===
          "https://explorer.api.openai.com/api/auth/error?error=OAuthSignin"
        ) {
          throw new Error("You have been rate limited. Please try again.");
        }

        return this.stepTwo(credentials, data.url);
      }
      throw new Error("status != 200");
    } else {
      throw new Error("response cannot be parsed");
    }
  }

  async stepTwo(credentials, url) {
    const response = await this.fetch(url, {
      method: "GET",
      credentials: "include",
      keepAlive: true,
      headers: {
        Host: "auth0.openai.com",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Connection: "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://explorer.api.openai.com/",
      },
    });

    if (response.status === 302 || response.status === 200) {
      const page = await response.text();
      const state = ChatGPTAuthenticator.getState(page);
      return this.stepThree(credentials, state);
    }
    throw new Error("status != 302 or 200");
  }

  async stepThree(credentials, state) {
    const response = await this.fetch(
      `https://auth0.openai.com/u/login/identifier?state=${state}`,
      {
        method: "GET",
        headers: {
          Host: "auth0.openai.com",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          Connection: "keep-alive",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://explorer.api.openai.com/",
        },
      }
    );

    if (response.status === 200) {
      return this.stepFour(credentials, state);
    }
    throw new Error("status != 200");
  }

  async stepFour(credentials, state) {
    const response = await this.fetch(
      `https://auth0.openai.com/u/login/identifier?state=${state}`,
      {
        method: "POST",
        body: `state=${state}&username=${credentials.email}&js-available=false&webauthn-available=true&is-brave=false&webauthn-platform-available=true&action=default`,
        headers: {
          Host: "auth0.openai.com",
          Origin: "https://auth0.openai.com",
          Connection: "keep-alive",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
          Referer: `https://auth0.openai.com/u/login/identifier?state=${state}`,
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status === 302 || response.status === 200) {
      return this.stepFive(credentials, state);
    }
    throw new Error("status != 302 and 200");
  }

  async stepFive({ email, password }, state) {
    const response = await this.fetch(
      `https://auth0.openai.com/u/login/password?state=${state}`,
      {
        method: "POST",
        credentials: "include",
        redirect: "manual",
        body: `state=${state}&username=${email}&password=${password}&action=default`,
        headers: {
          Host: "auth0.openai.com",
          Origin: "https://auth0.openai.com",
          Connection: "keep-alive",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
          Referer: `https://auth0.openai.com/u/login/password?state=${state}`,
          "Accept-Language": "en-US,en;q=0.9",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (response.status === 302 || response.status === 200) {
      const page = await response.text();
      const newState = ChatGPTAuthenticator.getState(page);
      return this.stepSix(state, newState);
    }
    throw new Error("status != 302 and 200");
  }

  async stepSix(oldState, newState) {
    const url = `https://auth0.openai.com/authorize/resume?state=${newState}`;
    const response = await this.fetch(url, {
      method: "GET",
      credentials: "include",
      redirect: "manual",
      keepAlive: true,
      headers: {
        Host: "auth0.openai.com",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        Connection: "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        Referer: `https://auth0.openai.com/u/login/password?state=${oldState}`,
      },
    });

    if (response.status === 302) {
      const redirectUrl = response.headers.get("location");
      return this.stepSeven(redirectUrl, url);
    }
    throw new Error("status != 302");
  }

  async stepSeven(redirectUrl, previousUrl) {
    const response = await this.fetch(redirectUrl, {
      method: "GET",
      credentials: "include",
      redirect: "manual",
      keepAlive: true,
      headers: {
        Host: "explorer.api.openai.com",
        Accept: "application/json",
        Connection: "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
        Referer: previousUrl,
      },
    });

    if (response.status === 302) {
      const accessToken = ChatGPTAuthenticator.getCookie(
        response,
        "__Secure-next-auth.session-token"
      );
      if (typeof accessToken === "undefined" || accessToken === null) {
        throw new Error("could not get an accessToken");
      }
      return accessToken;
    }
    throw new Error("status != 302");
  }

  static getState(html) {
    const state = html.match(/state=(.*)/g)[0];
    return state.split('"')[0].split("=")[1];
  }

  static getCookie(response, name) {
    const readerCookies = setCookie.splitCookiesString(
      response.headers.get("set-cookie")
    );
    const parseCookies = setCookie.parse(readerCookies);
    return parseCookies.find((cookie) => cookie.name === name)?.value;
  }
}
