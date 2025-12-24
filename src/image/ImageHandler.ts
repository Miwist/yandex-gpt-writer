
import { TokenManager } from "../core/TokenManager";
import { YandexGPTWriterConfig } from "../core/types";

export class ImageHandler {
  private tokenManager: TokenManager;
  private catalogId?: string;

  constructor(config: YandexGPTWriterConfig) {
    if (!config.oauthToken) {
      throw new Error("OAuth token is required");
    }
    this.tokenManager = new TokenManager(
      config.oauthToken,
      config.iamTokenApiUrl
    );
    this.catalogId = config.catalogId;
  }

  public async generate(prompt: string, seed = "1863"): Promise<string> {
    if (!this.catalogId) {
      throw new Error("catalogId is required for image generation");
    }

    const token = await this.tokenManager.getToken();

    const genResponse = await fetch(
      "https://llm.api.cloud.yandex.net/foundationModels/v1/imageGenerationAsync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          modelUri: `art://${this.catalogId}/yandex-art/latest`,
          generationOptions: {
            seed: seed,
            aspectRatio: { widthRatio: "2", heightRatio: "1" },
          },
          messages: [{ text: prompt }],
        }),
      }
    );

    if (!genResponse.ok) {
      const text = await genResponse.text();
      throw new Error(`Image API Error: ${genResponse.status} ${genResponse.statusText} - ${text}`);
    }

    const { id: operationId } = await genResponse.json();

    while (true) {
      const resultResponse = await fetch(
        `https://llm.api.cloud.yandex.net/operations/${operationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        throw new Error(`Image operation error: ${resultResponse.status} ${resultResponse.statusText} - ${errorText}`);
      }

      const result = await resultResponse.json();

      if (result.done) {
        if (!result.response?.image) {
          throw new Error(`Image generation failed or returned no image: ${JSON.stringify(result)}`);
        }
        return result.response.image;
      }

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}