export default class YandexGPTWriter {
  constructor();
  setOauthToken(oauthToken: string): void;
  setCatalogId(catalogId: string): void;
  setModelUri(modelUri: string): void;
  setIamTokenApiUrl(iamTokenApiUrl: string): void;
  getIamTokenApiUrl(): string;
  setApiUrl(apiUrl: string): void;
  getApiUrl(): string;
  setCompletionOptions(options: Record<string, any>): void;
  getCompletionOptions(): Record<string, any>;
  addMessage(message: any): void;
  setMessages(messages: any[]): void;
  clearMessages(): void;
  getMessages(): any[];
  writeYandex(): Promise<any>;
  destroy(): void;
}
