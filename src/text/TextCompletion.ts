import {
  CompletionOptions,
  Message,
  YandexGPTWriterConfig,
} from "../core/types";
import { TokenManager } from "../core/TokenManager";

export class TextCompletion {
  private messages: Message[] = [];
  private completionOptions: CompletionOptions;
  private modelUri: string | null = null;
  private catalogId: string;
  private apiUrl: string;
  private tokenManager: TokenManager;

  constructor(config: YandexGPTWriterConfig, tokenManager: TokenManager) {
    if (!config.oauthToken) throw new Error("OAuth token is required");
    this.catalogId = config.catalogId || "";
    this.apiUrl =
      config.apiUrl ||
      "https://llm.api.cloud.yandex.net/foundationModels/v1/completion";
    this.modelUri = config.modelUri || null;
    this.completionOptions = { stream: false, temperature: 1, maxTokens: 2000 };
    this.tokenManager = tokenManager;
  }

  public addMessage(message: Message) {
    this.messages.push(message);
  }
  public setMessages(messages: Message[]) {
    this.messages = messages;
  }
  public clearMessages() {
    this.messages = [];
  }
  public getMessages() {
    return this.messages;
  }
  public setCompletionOptions(options: CompletionOptions) {
    this.completionOptions = { ...this.completionOptions, ...options };
  }

  public async generate(): Promise<Message> {
    if (!this.modelUri) {
      this.modelUri = `gpt://${this.catalogId}/yandexgpt-lite`;
    }

    const lastUser = [...this.messages]
      .reverse()
      .find((m) => m.role === "user");
    if (!lastUser || lastUser.text.trim().length < 3) {
      throw new Error(
        `User message too short to generate response: "${lastUser?.text}"`
      );
    }

    const IAM_TOKEN = await this.tokenManager.getToken();

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${IAM_TOKEN}`,
      },
      body: JSON.stringify({
        modelUri: this.modelUri,
        completionOptions: this.completionOptions,
        messages: this.messages,
      }),
    });

    const data = await response.json();
    const answer = data?.result?.alternatives?.[0]?.message;

    if (!answer) {
      throw new Error(`No answer in response: ${JSON.stringify(data)}`);
    }

    return answer;
  }
}
