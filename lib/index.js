const https = require("https");

class YandexGPTWriter {
  constructor() {
    this.oauthToken = "";
    this.iamTokenApiUrl = "https://iam.api.cloud.yandex.net/iam/v1/tokens";
    this.catalogId = "";
    this.apiUrl =
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
    this.messages = [];
    this.completionOptions = {
      stream: false,
      temperature: 1,
      maxTokens: "2000",
    };
    this.modelUri = null;
    this.iamToken = null;
    this.tokenExpiry = null;
    this.refreshTimer = null;
    this.refreshing = false;
  }

  async getIamToken() {
    if (this.iamToken && this.tokenExpiry > Date.now()) {
      return this.iamToken;
    }

    if (this.refreshing) {
      return new Promise((resolve) => {
        const check = () => {
          if (!this.refreshing) {
            resolve(this.iamToken);
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      });
    }

    this.refreshing = true;

    try {
      const postData = JSON.stringify({
        yandexPassportOauthToken: this.oauthToken,
      });

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      };

      const data = await new Promise((resolve, reject) => {
        const req = https.request(this.iamTokenApiUrl, options, (res) => {
          let body = "";
          res.on("data", (chunk) => (body += chunk));
          res.on("end", () => resolve(body));
          res.on("error", reject);
        });
        req.on("error", reject);
        req.write(postData);
        req.end();
      });

      const parsed = JSON.parse(data);
      if (!parsed.iamToken) {
        throw new Error(`Invalid IAM token response: ${data}`);
      }

      this.iamToken = parsed.iamToken;
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;

      this.scheduleTokenRefresh();

      return this.iamToken;
    } catch (error) {
      this.iamToken = null;
      this.tokenExpiry = null;
      throw new Error(`Failed to retrieve IAM token: ${error.message}`);
    } finally {
      this.refreshing = false;
    }
  }

  scheduleTokenRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = setTimeout(async () => {
      try {
        await this.getIamToken();
      } catch (error) {
        console.error("Failed to auto-refresh IAM token:", error.message);
        this.refreshTimer = setTimeout(
          () => this.scheduleTokenRefresh(),
          5 * 60 * 1000
        );
      }
    }, 55 * 60 * 1000);
  }

  async refreshIamToken() {
    this.iamToken = null;
    this.tokenExpiry = null;

    return await this.getIamToken();
  }

  setOauthToken(oauthToken) {
    this.oauthToken = oauthToken;
  }

  setCatalogId(catalogId) {
    this.catalogId = catalogId;
  }

  setModelUri(modelUri) {
    this.modelUri = modelUri;
  }

  setIamTokenApiUrl(iamTokenApiUrl) {
    this.iamTokenApiUrl = iamTokenApiUrl;
  }

  getIamTokenApiUrl() {
    return this.iamTokenApiUrl;
  }

  setApiUrl(apiUrl) {
    this.apiUrl = apiUrl;
  }

  getApiUrl() {
    return this.apiUrl;
  }

  setCompletionOptions(options) {
    this.completionOptions = { ...this.completionOptions, ...options };
  }

  getCompletionOptions() {
    return this.completionOptions;
  }

  addMessage(message) {
    this.messages.push(message);
  }

  setMessages(messages) {
    this.messages = messages;
  }

  clearMessages() {
    this.messages = [];
  }

  getMessages() {
    return this.messages;
  }

  async writeYandex() {
    if (!this.modelUri) {
      this.setModelUri(`gpt://${this.catalogId}/yandexgpt-lite`);
    }

    if (!this.apiUrl) {
      throw new Error(
        "API URL is not defined. Make sure REACT__API_URL is set in your environment."
      );
    }

    if (!this.catalogId) {
      throw new Error(
        "Catalog ID is not defined. Make sure REACT_YANDEX_CATALOG_ID is set in your environment."
      );
    }

    const IAM_TOKEN = await this.getIamToken();

    const prompt = {
      modelUri: this.modelUri,
      completionOptions: this.completionOptions,
      messages: this.messages,
    };

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(prompt);

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${IAM_TOKEN}`,
        },
      };

      const req = https.request(this.apiUrl, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            const answerMessage =
              parsedData?.result?.alternatives?.[0]?.message;

            if (answerMessage) {
              resolve(answerMessage);
            } else {
              reject(new Error(`No answer found in response: ${data}`));
            }
          } catch (error) {
            reject(new Error(`Error parsing response: ${error.message}`));
          }
        });
      });

      req.on("error", (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });
  }

  destroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
    this.iamToken = null;
    this.tokenExpiry = null;
  }
}

module.exports = YandexGPTWriter;
