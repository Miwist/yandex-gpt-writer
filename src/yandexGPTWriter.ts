import { TokenManager } from './core/TokenManager';
import { ImageHandler } from './image/ImageHandler';
import { AudioHandler } from './audio/AudioHandler';
import { TextCompletion } from './text/TextCompletion';

export interface YandexGPTWriterConfig {
  oauthToken: string;
  catalogId?: string;
  apiUrl?: string;
  iamTokenApiUrl?: string;
}

export class YandexGPTWriter {
  public text: TextCompletion;
  public image: ImageHandler;
  public audio: AudioHandler;
  private tokenManager: TokenManager;

  constructor(config: YandexGPTWriterConfig) {
    if (!config.oauthToken) throw new Error("OAuth token is required");

    this.tokenManager = new TokenManager(config.oauthToken, config.iamTokenApiUrl);

    this.text = new TextCompletion(config, this.tokenManager);
    this.image = new ImageHandler(config, this.tokenManager);
    this.audio = new AudioHandler(config, this.tokenManager);
  }

  public async getToken(): Promise<string> {
    return this.tokenManager.getToken();
  }
}
