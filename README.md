# Yandex GPT Writer [RUS|ENG]

Простая и надёжная библиотека для работы с Yandex GPT через Yandex Cloud API.
An easy-to-use and reliable library for working with Yandex GPT via Yandex Cloud API.

1. Автоматическое обновление IAM-токена каждые 55 минут ✅
2. Поддержка Node.js / ESModule / CommonJS ✅

## Совместимость

Библиотека поддерживает как **ESModule**, так и **CommonJS**.

## Требования / Requirements

1. Node.js v16+ (рекомендуется v18+)
2. OAuth токен Yandex Cloud
3. Yandex Cloud OAuth token

## Установка

```bash
npm install yandex-gpt-writer
```

## Опции

| Название / Title  | Тип / Type    | По умолчанию / Default                                                                                                               | Описание / Description                                                                               |
| ----------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| oauthToken        | string        | ""                                                                                                                                   | OAuth token для доступа к Yandex Cloud. **ОБЯЗАТЕЛЬНО** / OAuth token for Yandex Cloud. **REQUIRED** |
| iamTokenApiUrl    | string        | "[https://iam.api.cloud.yandex.net/iam/v1/tokens](https://iam.api.cloud.yandex.net/iam/v1/tokens)"                                   | URL для получения IAM токена / URL to get IAM token                                                  |
| catalogId         | string        | ""                                                                                                                                   | ID каталога Yandex Cloud. **ОБЯЗАТЕЛЬНО** / Catalog ID. **REQUIRED**                                 |
| apiUrl            | string        | "[https://llm.api.cloud.yandex.net/foundationModels/v1/completion](https://llm.api.cloud.yandex.net/foundationModels/v1/completion)" | URL для доступа к Yandex LLM API / URL for Yandex LLM API                                            |
| messages          | Array<object> | []                                                                                                                                   | Массив сообщений для отправки в Yandex LLM / Array of messages                                       |
| completionOptions | object        | { stream: false, temperature: 1, maxTokens: "2000" }                                                                                 | Опции текстовой генерации / Completion options                                                       |
| modelUri          | string        | llm://${this.catalogId}/yandex-lite                                                                                                  | URI модели Yandex LLM / Model URI                                                                    |
| iamToken          | string | null | null                                                                                                                                 | IAM токен (автоматически получается) / IAM token (auto)                                              |
| imageOptions      | object        | { size: "1024x1024", style: "photorealistic" }                                                                                       | Опции генерации изображений / Image generation options                                               |
| audioOptions      | object        | { voice: "alyona", speed: 1.0, format: "wav" }                                                                                       | Опции синтеза речи / Audio synthesis options                                                         |

## Методы

| Название / Title              | Описание / Description                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| getIamToken()                 | Асинхронно получает IAM токен / Asynchronously gets IAM token                        |
| refreshIamToken()             | Принудительно обновляет IAM-токен / Force refresh IAM token                          |
| setIamTokenApiUrl(url)        | Устанавливает iamTokenApiUrl / Set IAM token API URL                                 |
| setApiUrl(url)                | Устанавливает apiUrl / Set API URL                                                   |
| setModelUri(uri)              | Устанавливает URI модели / Set model URI                                             |
| setCompletionOptions(options) | Устанавливает опции завершения / Set completion options                              |
| getCompletionOptions()        | Возвращает текущие опции завершения / Get completion options                         |
| addMessage(message)           | Добавляет сообщение в историю / Add message to history                               |
| setMessages(messages)         | Устанавливает всю историю сообщений / Set message history                            |
| clearMessages()               | Очищает историю сообщений / Clear message history                                    |
| getMessages()                 | Возвращает текущую историю сообщений / Get current messages                          |
| writeYandex()                 | Асинхронно отправляет запрос в Yandex LLM API / Async send request to Yandex LLM API |


### Пример использования

```js
import YandexGptWriter from "yandex-gpt-writer";

// 1. Создаем экземпляр класса YandexGptWriter
const writer = new YandexGPTWriter({
  oauthToken,
  catalogId,
  apiUrl?,
  iamTokenApiUrl?
});

// 2. (Опционально) Настраиваем параметры завершения
writer.setCompletionOptions({ temperature: 0.7, maxTokens: 500 });

// 3. Добавляем сообщения в контекст
writer.text.addMessage({ role: "system", text: "Ты - полезный ассистент." });
writer.text.addMessage({
  role: "user",
  text: "Напиши небольшое стихотворение о весне.",
});

// Или устанавливаем сразу весь массив сообщений Message[]
writer.text.setMessages([
  { role: "system", text: "Ты - полезный ассистент." },
  { role: "user", text: "Напиши небольшое стихотворение о весне." },
]);

// 4. Запрашиваем ответ от YandexGPT
try {
  const response = await writer.text.generate();
  console.log("Ответ YandexGPT:", response);
} catch (error) {
  console.error("Произошла ошибка:", error);
}
```

### Методы Image / Image Methods

| Название / Title                 | Описание / Description                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- |
| image.generate(prompt)           | Генерирует изображение по текстовому описанию / Generate image from prompt                              |
| image.generateFromFile(filePath) | (Опционально) Генерация или модификация изображения из файла / Generate or modify image from local file |
| image.setOptions(options)        | Устанавливает параметры генерации / Set image generation options                                        |
| image.getOptions()               | Возвращает текущие параметры генерации / Get current options                                            |

Пример:

```js
const imageUrl = await writer.image.generate("Красивый закат над морем в стиле масляной живописи");
console.log("URL сгенерированного изображения:", imageUrl);
```

### Методы Audio / Audio Methods

| Название / Title               | Описание / Description                                        |
| ------------------------------ | ------------------------------------------------------------- |
| audio.synthesize(text, voice?) | Синтезирует аудио из текста / Synthesize audio from text      |
| audio.setOptions(options)      | Устанавливает параметры синтеза / Set audio synthesis options |
| audio.getOptions()             | Возвращает текущие параметры синтеза / Get current options    |

Пример: 

```js
const audioBuffer = await writer.audio.synthesize("Привет, это тестовая аудио запись", "alyona");
console.log("Длина аудиобуфера:", audioBuffer.length);
```

### Связаться со мной

Мой [telegram](https://t.me/miwist)
