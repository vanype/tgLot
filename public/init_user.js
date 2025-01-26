// URL вашего API
const API_URL = "https://giftshop-production.up.railway.app/check-user";

// Симуляция получения Telegram ID (замените на реальный ID из контекста)

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Получение информации о пользователе
const user = tg.initDataUnsafe;


const telegramId = user?.user?.id;

// Функция для проверки пользователя
async function checkUser() {
  try {
    // Отправка запроса на сервер
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ telegram_id: telegramId }),
    });

    // Обработка ответа
    const result = await response.json();

    
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
