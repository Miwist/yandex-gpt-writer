export interface CompletionOptions {
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface Message {
  role: 'user' | 'system' | 'assistant';
  text: string;
}

export interface YandexGPTWriterConfig {
  oauthToken: string;
  catalogId?: string;
  apiUrl?: string;
  modelUri?: string;
  iamTokenApiUrl?: string;
  /** URL синтеза речи (TTS). Не путать с apiUrl текстовой модели. */
  ttsApiUrl?: string;
  /** URL распознавания речи (STT). */
  sttApiUrl?: string;
}
