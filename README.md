# 🎓 UCU Economics Midterm Hub (Курс 1028)

[![AWS Live Demo](https://img.shields.io/badge/AWS%20S3-Live%20Website-FF9900?logo=amazon-s3&logoColor=white)](http://ucu-economics-midterm-297580066889.s3-website-us-east-1.amazonaws.com)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](#-запуск-через-docker)
[![Course](https://img.shields.io/badge/UCU-Economics%201028-0056B3)](https://learn.ucu.edu.ua/course/view.php?id=1028)
[![Language](https://img.shields.io/badge/Language-Ukrainian-yellow)]()

> **Повна експрес-підготовка до мідтерму з економіки (теорія ігор, бізнес-стратегія, PARTS) від 0 до 100% за 12 годин.**  
> Створено спеціально для студентів УКУ, які не розв'язували задачі протягом семестру і хочуть скласти іспит на максимальний бал.

---

## 🌐 Живий сайт (AWS S3)

Сайт задеплоєно та доступний онлайн:  
👉 **[http://ucu-economics-midterm-297580066889.s3-website-us-east-1.amazonaws.com](http://ucu-economics-midterm-297580066889.s3-website-us-east-1.amazonaws.com)**

---

## 🚀 Що всередині сайту

1. **⏱️ Погодинний 12-годинний план (Roadmap):**
   - 6 структурованих блоків по 2 години з інтерактивним трекером прогресу в `localStorage`.
2. **🧠 Теорія «Без води»:**
   - Матричні ігри та метод стрілочок для пошуку Рівноваги Неша за 30 секунд.
   - Дилема в'язня, нескінченні ігри та стратегія *Grim Trigger*.
   - Розрахунок граничного дисконтного фактора $\delta$ та процентної ставки $r$.
   - Ефект 2-річної затримки виявлення порушення.
   - Дерева ігор, правило *Look forward and reason backward*, зворотна індукція (Rollback) та недостовірні погрози.
   - Фреймворк **PARTS** (Players, Added Value, Rules, Tactics, Scope) та **Value Net** за статтею *The Right Game* (Brandenburger & Nalebuff, HBR).
   - Змішані стратегії (принцип індиферентності) та просторова конкуренція брендів.
3. **🎯 10 Розв'язаних Задач Мідтерму:**
   - Усі задачі курсу розписані покроково з формулами, матрицями та поясненнями для кожного пункту.
4. **🎙️ Вбудована аудіотека (NotebookLM):**
   - Аудіо-подкасти українською мовою для Розділів 2–7 підручника *The Art of Strategy* (Avinash Dixit & Barry Nalebuff).
   - Плеєр із регулюванням швидкості (1x, 1.25x, 1.5x, 2x) та перемиканням треків.
5. **🧮 Інтерактивні розв'язувачі:**
   - 2x2 Nash Equilibrium Matrix Solver.
   - Grim Trigger Discount & Interest Rate Calculator.
6. **⚡ Екзаменаційна шпора та Бліц-тест:**
   - Конспект ключових формул на 1 сторінці.
   - Інтерактивний тест на 5 питань із поясненням кожної відповіді.

---

## 🐳 Запуск через Docker

### Варіант 1: Docker Compose (Рекомендовано)
```bash
docker compose up -d --build
```
Відкрийте браузер за адресою: [http://localhost:8088](http://localhost:8088)

### Варіант 2: Чистий Docker
```bash
docker build -t ucu-econ-midterm .
docker run -d -p 8088:80 --name ucu-econ-midterm ucu-econ-midterm
```

---

## 📁 Структура проєкту

```
├── index.html          # Головний інтерфейс навчального хабу
├── styles.css          # Стилі: Glassmorphism, темна/світла теми, адаптивність
├── script.js           # Логіка: трекер, аудіоплеєр, калькулятори, тест
├── nginx.conf          # Nginx конфігурація з підтримкою стрімінгу аудіо
├── Dockerfile          # Легковажний образ на базі nginx:alpine
├── docker-compose.yml  # Оркестрація контейнера
├── audio/              # Аудіофайли подкастів (Розділи 2-7)
└── README.md           # Документація проєкту
```

---

## 👨‍🎓 Автор
Створено для студентів Українського Католицького Університету (УКУ).
Бажаємо успіхів на мідтермі! 🚀
