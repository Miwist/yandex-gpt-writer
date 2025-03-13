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
  }

  async getIamToken() {
    if (this.iamToken) {
      return this.iamToken;
    }

    return new Promise((resolve, reject) => {
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

      const req = https.request(this.iamTokenApiUrl, options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            if (parsedData && parsedData.iamToken) {
              this.iamToken = parsedData.iamToken;
              resolve(this.iamToken);
            } else {
              reject(new Error(`Failed to retrieve IAM token: ${data}`));
            }
          } catch (error) {
            reject(
              new Error(`Error parsing IAM token response: ${error.message}`)
            );
          }
        });
      });

      req.on("error", (error) => {
        reject(new Error(`IAM token request failed: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });
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
    this.iamTokenApiUrl;
  }

  setApiUrl(apiUrl) {
    this.apiUrl = apiUrl;
  }

  getApiUrl() {
    this.getApiUrl
  }

  setCompletionOptions(options) {
    this.completionOptions = { ...this.completionOptions, ...options };
  }

  getCompletionOptions() {
    this.completionOptions;
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
    this.messages;
  }

  async writeYandex() {
    if (!this.modelUri) {
      this.setModelUri(`gpt://${this.catalogId}/yandexgpt-lite`);
    }

    if (!this.apiUrl) {
      throw new Error(
        "API URL is not defined.  Make sure REACT__API_URL is set in your environment."
      );
    }

    if (!this.catalogId) {
      throw new Error(
        "Catalog ID is not defined.  Make sure REACT_YANDEX_CATALOG_ID is set in your environment."
      );
    }

    const IAM_TOKEN = await this.getIamToken();

    const promt = {
      modelUri: this.modelUri,
      completionOptions: this.completionOptions,
      messages: this.messages,
    };

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(promt);

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
}

module.exports = YandexGPTWriter;
