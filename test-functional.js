import fs from "fs";
import dotenv from "dotenv";
import { YandexGPTWriter } from "./lib/yandexGPTWriter.js";

dotenv.config();

(async () => {
  const oauthToken = process.env.YANDEX_OAUTH_TOKEN;
  const catalogId = process.env.YANDEX_CATALOG_ID;

  if (!oauthToken || !catalogId) {
    console.error("Установите YANDEX_OAUTH_TOKEN и YANDEX_CATALOG_ID в .env");
    process.exit(1);
  }

  const writer = new YandexGPTWriter({
    oauthToken,
    catalogId,
  });

  console.log("=== Генерация текста ===");
  try {
    writer.text.addMessage({ role: "system", text: "Ты полезный ассистент." });
    writer.text.addMessage({ role: "user", text: "Напиши короткий стих о зиме." });

    const textResult = await writer.text.generate();
    console.log("Текст сгенерирован:", textResult);

    fs.writeFileSync("output.txt", textResult);
  } catch (err) {
    console.error("Ошибка Text генерации:", err);
  }

  console.log("=== Генерация изображения ===");
  try {
    const prompt = "Красивый зимний пейзаж, снег, лес, утро, HD";
    const base64Image = await writer.image.generate(prompt);

    const imageBuffer = Buffer.from(base64Image, "base64");
    fs.writeFileSync("image.png", imageBuffer);

    console.log("Изображение сохранено в image.png");
  } catch (err) {
    console.error("Ошибка Image генерации:", err);
  }

  console.log("=== Генерация аудио ===");
  try {
    const audioText = "Привет! Это тестовое аудио от Yandex GPT.";
    const audioBuffer = await writer.audio.synthesize(audioText);x

    fs.writeFileSync("audio.mp3", audioBuffer);
    console.log("Аудио сохранено в audio.mp3");
  } catch (err) {
    console.error("Ошибка Audio генерации:", err);
  }
})();
