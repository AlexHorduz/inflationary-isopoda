# inflationary-isopoda <img src="https://github.com/user-attachments/assets/d15e21d4-aef4-4957-a28c-7b5a88db9036" alt="logo" width="40"/>


Цей репозиторій містить додаток для чатбота, який допомагає користувачам як за допомогою AI, так і через підтримку операторів, коли це необхідно. 

---

## 📊 Огляд сервісів

### 1. 🧠 **Intent Classification**
Сервіс Intent Classification відповідає за інтерпретацію введених користувачем даних і їхнє зіставлення з визначеними інтентами. Якщо модель AI не може відповісти на загальні питання, запит передається оператору для подальшої обробки.

### 2. 🗣️ **Speech2Text**
Сервіс Speech2Text забезпечує можливість перетворення голосових повідомлень у текст, що підвищує зручність використання чатбота. Це дозволяє користувачам взаємодіяти з ботом через голос, а введення автоматично перетворюється в текст.

### 3. 🌐 **WebInterface**
WebInterface — це фронтенд та бекенд частина застосунку. Фронтенд розроблений з використанням HTML, CSS та JavaScript. Цей інтерфейс дозволяє:

- Завантажувати існуючі чати.
- Створювати нові чати.
- Відправляти та отримувати повідомлення в реальному часі.

Інтерфейс взаємодіє з бекендом, який побудований на основі FastAPI, та обробляє всі дії користувача, такі як створення чатів та керування повідомленнями.

### 4. 🗄️ **MongoDB**
MongoDB виступає базою даних для збереження важливої інформації, включаючи:

- Історію розмов між клієнтами, оператором і AI - подальше покращення моделі.
- Інформацію за темами.
- Логіни та паролі клієнтів і операторів для безпечної аутентифікації.

![logo](https://github.com/user-attachments/assets/d15e21d4-aef4-4957-a28c-7b5a88db9036)
