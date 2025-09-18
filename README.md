# Yandex GPT Writer [RUS]

Простая и надёжная библиотека для работы с Yandex GPT через Yandex Cloud API.

1. Автоматическое обновление IAM-токена каждые 55 минут ✅
2. Поддержка Node.js ✅
3. Zero-dependency ✅

## Установка

```bash
npm install yandex-gpt-writer
```

## Опции

| Название          | Тип            | По умолчанию                                                      | Описание                                                 |
| ----------------- | -------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| oauthToken        | string         | ""                                                                | OAuth token для доступа к Yandex Cloud. **ОБЯЗАТЕЛЬНО**. |
| iamTokenApiUrl    | string         | "https://iam.api.cloud.yandex.net/iam/v1/tokens"                  | URL для получения IAM токена.                            |
| catalogId         | string         | ""                                                                | ID каталога Yandex Cloud. **ОБЯЗАТЕЛЬНО**.               |
| apiUrl            | string         | "https://llm.api.cloud.yandex.net/foundationModels/v1/completion" | URL для доступа к Yandex LLM API.                        |
| messages          | Array<object>  | []                                                                | Массив сообщений для отправки в Yandex LLM API.          |
| completionOptions | object         | { stream: false, temperature: 1, maxTokens: "2000" }              | Объект с опциями завершения.                             |
| modelUri          | string         | llm://${this.catalogId}/yandex-lite                               | URI модели Yandex LLM.                                   |
| iamToken          | string \| null | null                                                              | IAM токен (автоматически получается).                    |

## Методы

| Название                        | Описание                                                          |
| ------------------------------- | ----------------------------------------------------------------- |
| `getIamToken()`                 | Асинхронно получает IAM токен.                                    |
| `setIamTokenApiUrl()`           | Устанавливает iamTokenApiUrl.                                     |
| `setApiUrl()`                   | Устанавливает apiUrl.                                             |
| `setModelUri(modelUri)`         | Устанавливает URI модели.                                         |
| `setCompletionOptions(options)` | Устанавливает опции завершения.                                   |
| `getCompletionOptions()`        | Возвращает текущие опции завершения.                              |
| `addMessage(message)`           | Добавляет сообщение в историю сообщений.                          |
| `setMessages(messages)`         | Устанавливает историю сообщений.                                  |
| `clearMessages()`               | Очищает историю сообщений.                                        |
| `getMessages()`                 | Возвращает текущую историю сообщений.                             |
| `refreshIamToken()`                 | Принудительно обновляет IAM-токен (например, при смене OAuth-токена).сообщений.                             |
| `writeYandex()`                 | Асинхронно отправляет запрос в Yandex LLM API и возвращает ответ. |

### Пример использования

```js
import YandexGptWriter from "yandex-gpt-writer";

// 1. Создаем экземпляр класса YandexGptWriter
const writer = new YandexGptWriter();

// 2. Устанавливаем обязательные параметры
writer.oauthToken = process.env.YANDEX_OAUTH_TOKEN; // Устанавливаем OAuth токен из переменной окружения
writer.catalogId = process.env.YANDEX_CATALOG_ID; // Устанавливаем ID каталога из переменной окружения
writer.modelUri = `llm@${writer.catalogId}/yandex-lite`; // (Необязательно) или любая другая доступная модель

// 3. (Опционально) Настраиваем параметры завершения
writer.setCompletionOptions({ temperature: 0.7, maxTokens: 500 });

// 4. Добавляем сообщения в контекст
writer.addMessage({ role: "system", text: "Ты - полезный ассистент." });
writer.addMessage({
  role: "user",
  text: "Напиши небольшое стихотворение о весне.",
});

// Или устанавливаем сразу весь массив сообщений
writer.setMessages([
  { role: "system", text: "Ты - полезный ассистент." },
  { role: "user", text: "Напиши небольшое стихотворение о весне." },
]);

// 5. Запрашиваем ответ от YandexGPT
try {
  const response = await writer.writeYandex();
  console.log("Ответ YandexGPT:", response);
} catch (error) {
  console.error("Произошла ошибка:", error);
}
```
### Связаться со мной

Мой [telegram](https://t.me/miwist)


# Yandex GPT Writer [ENG]

An easy way to use Yandex GPT for your project.

## NPM install

```bash
npm install yandex-gpt-writer
```

## Options

| Title                                        | type           | Default                                                           | Description                                           |
| -------------------------------------------- | -------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| oauthToken                                   | string         | ""                                                                | OAuth token for access to Yandex Cloud. **REQUIRED**. |
| iamTokenApiUrl                               | string         | "https://iam.api.cloud.yandex.net/iam/v1/tokens"                  | URL to get IAM token.                                 |
| catalogId                                    | string         | ""                                                                | ID catalog Yandex Cloud. **REQUIRED**.                |
| apiUrl                                       | string         | "https://llm.api.cloud.yandex.net/foundationModels/v1/completion" | URL for access to Yandex LLM API.                     |
| messages                                     | Array<object>  | []                                                                |
| Array of messages to send to Yandex LLM API. |
| completionOptions                            | object         | { stream: false, temperature: 1, maxTokens: "2000" }              | An Object with completion options.                    |
| modelUri                                     | string         | llm://${this.catalogId}/yandex-lite                               | Yandex LLM model URI.                                 |
| iamToken                                     | string \| null | null                                                              | IAM token (automatically obtained).                   |

## Методы

| Title                           | Description                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| `getIamToken()`                 | Asynchronously receives an IAM token.                                    |
| `setIamTokenApiUrl()`           | Sets iamTokenApiUrl.                                                     |
| `setApiUrl()`                   | Sets apiUrl.                                                             |
| `setModelUri(modelUri)`         | Sets the URI of the model.                                               |
| `setCompletionOptions(options)` | Sets completion options.                                                 |
| `getCompletionOptions()`        | Returns the current completion options.                                  |
| `addMessage(message)`           | Adds a message to the message history.                                   |
| `setMessages(messages)`         | Sets the message history.                                                |
| `clearMessages()`               | Clears message history.                                                  |
| `getMessages()`                 | Returns the current message history.                                     |
| `writeYandex()`                 | Asynchronously sends a request to Yandex LLM API and returns a response. |

### Пример использования

```js
import YandexGptWriter from "yandex-gpt-writer";

// 1. Create an instance of the YandexGptWriter class
const writer = new YandexGptWriter();

// 2. Setting the required parameters
writer.oauthToken = process.env.YANDEX_OAUTH_TOKEN; // Set OAuth token from environment variable
writer.catalogId = process.env.YANDEX_CATALOG_ID; // SET ID catalog from environment variable
writer.modelUri = `llm@${writer.catalogId}/yandex-lite`; // (Optional) or any other available model

// 3. (Optional) Configure termination settings
writer.setCompletionOptions({ temperature: 0.7, maxTokens: 500 });

// 4. Adding messages to context
writer.addMessage({ role: "system", text: "You are a useful assistant." });
writer.addMessage({
  role: "user",
  text: "Write a short poem about spring.",
});

// Or we set the entire array of messages at once
writer.setMessages([
  { role: "system", text: "You are a useful assistant." },
  { role: "user", text: "Write a short poem about spring." },
]);

// 5. We request a response from YandexGPT
try {
  const response = await writer.writeYandex();
  console.log("YandexGPT response:", response);
} catch (error) {
  console.error("An error occurred:", error);
}
```
### Сontact me

My [telegram](https://t.me/miwist)