const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


const mysql = require("mysql2");
const bodyParser = require("body-parser");





// Middleware для обработки JSON
app.use(bodyParser.json());

// Пул соединений MySQL
const pool = mysql.createPool({
  host: process.env.HOST, // Адрес базы данных
  user: process.env.USER,      // Пользователь базы данных
  password: process.env.PASSWORD, // Пароль пользователя
  database: process.env.DB, // Название базы данных
  waitForConnections: true,
  connectionLimit: 10,   // Максимальное количество соединений
  queueLimit: 0          // Лимит очереди соединений
});

// Проверяем соединение с базой
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Ошибка подключения к базе данных:", err.message);
  } else {
    console.log("Соединение с базой данных установлено!");
    connection.release(); // Возвращаем соединение в пул
  }
});


const fetch = require("node-fetch");


// Эндпоинт для проверки/создания пользователя
app.post("/check-user", (req, res) => {
  const { telegram_id } = req.body;

  if (!telegram_id) {
    return res.status(400).json({ error: "Телеграм ID обязателен" });
  }

  // Проверка наличия пользователя в базе
  pool.query(
    "SELECT * FROM users WHERE telegram_id = ?",
    [telegram_id],
    (err, results) => {
      if (err) {
        console.error("Ошибка выполнения запроса:", err.message);
        return res.status(500).json({ error: "Ошибка сервера" });
      }

      if (results.length > 0) {
        // Пользователь найден
        return res.status(200).json({
          message: "Пользователь найден",
          user: results[0],
        });
      } else {
        // Создание нового пользователя
        const newUser = {
          telegram_id: telegram_id,
          created_contests: 0,
          status: "user",
        };

        pool.query("INSERT INTO users SET ?", newUser, (err, result) => {
          if (err) {
            console.error("Ошибка создания пользователя:", err.message);
            return res.status(500).json({ error: "Ошибка сервера" });
          }

          return res.status(201).json({
            message: "Новый пользователь создан",
            user: {
              user_id: result.insertId,
              ...newUser,
            },
          });
        });
      }
    }
  );
});












// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
