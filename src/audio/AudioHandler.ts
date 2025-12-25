import { TokenManager } from "../core/TokenManager";
import { YandexGPTWriterConfig } from "../core/types";

export class AudioHandler {
  private tokenManager: TokenManager;
  private ttsApiUrl: string;
  private sttApiUrl: string;
  private catalogId: string;

  constructor(config: YandexGPTWriterConfig, tokenManager?: TokenManager) {
    if (!tokenManager) {
      if (!config.oauthToken) throw new Error("OAuth token is required");
      this.tokenManager = new TokenManager(
        config.oauthToken,
        config.iamTokenApiUrl
      );
    } else {
      this.tokenManager = tokenManager;
    }

    if (!config.catalogId) throw new Error("catalogId is required");

    this.catalogId = config.catalogId;

    this.ttsApiUrl =
      config.apiUrl ||
      "https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize";
    this.sttApiUrl =
      config.apiUrl ||
      "https://stt.api.cloud.yandex.net/speech/v1/stt:recognize";
  }

  /** Text to speech: возвращает Uint8Array аудиофайла */
  public async synthesize(
    text: string,
    voice: string = "alena"
  ): Promise<Uint8Array> {
    const token = await this.tokenManager.getToken();
    const response = await fetch(this.ttsApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, voice }),
    });

    const arrayBuffer = await response.arrayBuffer();

    return new Uint8Array(arrayBuffer);
  }

  public async recognize(
    audioData: ArrayBuffer,
    language: string = "ru-RU"
  ): Promise<string> {
    const token = await this.tokenManager.getToken();

    const url =
      `${this.sttApiUrl}` +
      `?lang=${language}` +
      `&format=lpcm` +
      `&sampleRateHertz=16000` +
      `&folderId=${this.catalogId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "audio/wav",
      },
      body: audioData,
    });

    const data = await response.json();

    return data.result ?? "";
  }
}
