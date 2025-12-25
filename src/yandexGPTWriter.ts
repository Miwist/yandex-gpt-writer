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

  constructor(config: YandexGPTWriterConfig) {
    this.text = new TextCompletion(config);
    this.image = new ImageHandler(config);
    this.audio = new AudioHandler(config);
  }
}
