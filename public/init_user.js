// URL вашего API с плейсхолдером для telegram_id
const API_URL = "https://giftshop-production.up.railway.app/check-user/{telegram_id}";

// Симуляция получения Telegram ID (замените на реальный ID из контекста)
const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe;

const telegramId = user?.user?.id;

// Функция для проверки пользователя
async function checkUser() {
  try {
    // Динамически создаем URL с добавленным telegramId
    const urlWithId = API_URL.replace("{telegram_id}", telegramId);

    // Отправка запроса на сервер
    const response = await fetch(urlWithId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telegram_id: telegramId }),
    });

    // Обработка ответа
    const result = await response.json();
    console.log(result); // Можете обработать результат, как вам нужно

  } catch (error) {
    console.error("Ошибка:", error);
    document.getElementById("message").innerText =
      "Ошибка подключения к серверу.";
  }
}

// Автоматический запуск функции при загрузке страницы
(async () => {
  await checkUser();
})();
