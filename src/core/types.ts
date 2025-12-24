export interface CompletionOptions {
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

export interface YandexGPTWriterConfig {
  oauthToken: string;
  catalogId?: string;
  apiUrl?: string;
  modelUri?: string;
  iamTokenApiUrl?: string;
}
