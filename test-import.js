(async () => {
  let YandexGPTWriter;

  console.log("=== Проверка CommonJS require ===");
  try {
    YandexGPTWriter = require('./lib');
    console.log("CommonJS require прошёл успешно");
  } catch (err) {
    console.error("CommonJS require упал:", err.message);
    console.error(err);
  }

  console.log("\n=== Проверка ESModule import ===");
  try {
    if (!YandexGPTWriter) {
      const imported = await import('./lib/index.mjs');
      YandexGPTWriter = imported.default;
      console.log("ESModule import прошёл успешно");
    }
  } catch (err) {
    console.error("ESModule import упал:", err.message);
    console.error(err);
  }

  if (!YandexGPTWriter) {
    console.error('Не удалось подключить библиотеку вообще');
    process.exit(1);
  }

  console.log("\n=== Создание экземпляра YandexGPTWriter ===");
  try {
    const writer = new YandexGPTWriter({ oauthToken: 'токен' });
    console.log("Экземпляр создан успешно:", writer);

    console.log("\n=== Проверка Text генератора ===");
    try {
      // const result = await writer.text.generate();
      // console.log("Text результат:", result);
    } catch (err) {
      console.error("Ошибка Text генерации:", err.message);
    }

    console.log("\n=== Проверка Image/Audio генерации ===");
    try {
      // const img = await writer.image.generate("Тестовое изображение");
      // console.log("Image результат:", img);

      // const audio = await writer.audio.synthesize("Тестовое аудио");
      // console.log("Audio результат:", audio);
    } catch (err) {
      console.error("Ошибка Image/Audio генерации:", err.message);
    }

  } catch (err) {
    console.error("Не удалось создать экземпляр YandexGPTWriter:", err.message);
  }
})();
