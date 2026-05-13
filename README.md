# Бие даалт 14 — API Testing with Postman + Newman

**Хичээл:** F.CSM311 — Программ хангамжийн бүтээлт  
**Хувилбар:** 3 — Жижиг Express сервер  
**API:** Mini Book API (in-memory)

---

## Хурдан эхлэх

### 1. Сервер ажиллуулах
```bash
cd server
npm install
node index.js
# → http://localhost:3000
```

### 2. Newman суулгах
```bash
npm install -g newman newman-reporter-htmlextra
```

### 3. Тест ажиллуулах
```bash
# CLI тест
newman run postman/collection.json -e postman/env.dev.json

# HTML report үүсгэх
newman run postman/collection.json \
  -e postman/env.dev.json \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/api.html
```

---

## Файлын бүтэц

```
bie-daalt-14/
├── .github/
│   └── workflows/
│       └── api-tests.yml      # GitHub Actions CI
├── partA/
│   ├── SETUP.md               # API тайлбар
│   └── screenshot.png         # Эхний амжилттай request
├── postman/
│   ├── collection.json        # 8+ request, test assertions
│   ├── env.dev.json           # Dev environment
│   └── env.ci.json            # CI environment
├── reports/
│   └── api.html               # Newman HTML тайлан
├── server/
│   ├── index.js               # Express API сервер
│   └── package.json
├── README.md
└── REFLECTION.md
```

---

## Collection-ы агуулга

| Folder | Request | Төрөл |
|--------|---------|-------|
| Health | Health Check | Happy GET |
| Books | GET all books | Happy GET |
| Books | GET book by id | GET by id (chain) |
| Books | POST create book | POST create |
| Books | PUT update book | PUT/PATCH (chain) |
| Books | DELETE book | DELETE (chain) |
| Error Cases | GET /books/999999 | Error 404 |
| Error Cases | POST missing title | Error 400 |
| Error Cases | POST empty body | Error 400 |

**Chain:** `GET all books` → `existingBookId` → `GET by id`  
**Chain:** `POST create` → `newBookId` → `PUT update` → `DELETE`

---

## Тестийн статистик

- **Нийт request:** 9
- **Нийт assertion:** 30+
- **Assertion төрөл:** status, latency, schema/property, type, business rule, header
- **Negative test:** 3 (404, 400 missing title, 400 empty body)
- **Pre-request script:** 2 (timestamp, random suffix)

---

## Environment variables

| Variable | Dev | Тайлбар |
|----------|-----|---------|
| `baseUrl` | `http://localhost:3000` | API-ийн үндсэн хаяг |
| `existingBookId` | `1` | GET by id-д ашиглагдана |
| `newBookId` | (динамик) | POST-оос chain хийгдэнэ |

> **Анхааруулга:** Secret / token байхгүй тул placeholder шаардахгүй.

Updated API documentation