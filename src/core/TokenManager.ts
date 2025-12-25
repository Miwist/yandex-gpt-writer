export class TokenManager {
  private oauthToken: string;
  private iamToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshTimer: any = null;
  private refreshing = false;
  private iamTokenApiUrl: string;

  constructor(
    oauthToken: string,
    iamTokenApiUrl = "https://iam.api.cloud.yandex.net/iam/v1/tokens"
  ) {
    this.oauthToken = oauthToken;
    this.iamTokenApiUrl = iamTokenApiUrl;
  }

  public setOauthToken(token: string) {
    this.oauthToken = token;
  }
  public setIamTokenApiUrl(url: string) {
    this.iamTokenApiUrl = url;
  }

  public async getToken(): Promise<string> {
    if (this.iamToken && this.tokenExpiry && this.tokenExpiry > Date.now()) {
      return this.iamToken;
    }

    if (this.refreshing) {
      return new Promise((resolve) => {
        const check = () => {
          if (!this.refreshing && this.iamToken) resolve(this.iamToken);
          else setTimeout(check, 100);
        };
        check();
      });
    }

    this.refreshing = true;

    try {
      const response = await fetch(this.iamTokenApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ yandexPassportOauthToken: this.oauthToken }),
      });

      const data = await response.json();

      if (!data.iamToken) {
        throw new Error(`Invalid IAM token response: ${JSON.stringify(data)}`);
      }

      this.iamToken = data.iamToken;
      this.tokenExpiry = Date.now() + 55 * 60 * 1000;
      this.scheduleRefresh();

      return this.iamToken!;
    } finally {
      this.refreshing = false;
    }
  }

  private scheduleRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    this.refreshTimer = setTimeout(() => {
      this.getToken().catch((err) =>
        console.error("Failed to refresh IAM token:", err)
      );
    }, 55 * 60 * 1000);
  }

  public destroy() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    this.iamToken = null;
    this.tokenExpiry = null;
  }
}
