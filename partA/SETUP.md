# Part A — Setup

## Сонгосон API
**Хувилбар 3 — Жижиг өөрийн Express сервер**

## Тайлбар (Brief)
`server/index.js` — In-memory номын санг удирдах жижиг REST API.  
Номыг CRUD үйлдлээр удирдах боломжтой. 4+ endpoint байгаа бөгөөд validation (400) болон not-found (404) case-г бүрэн дэмждэг.

## Endpoint-ууд
| Method | Path | Тайлбар |
|--------|------|---------|
| GET | /api/health | Health check |
| GET | /api/books | Бүх ном |
| GET | /api/books/:id | Нэг ном (404 if not found) |
| POST | /api/books | Шинэ ном үүсгэх (400 validation) |
| PUT | /api/books/:id | Ном шинэчлэх |
| DELETE | /api/books/:id | Ном устгах (204) |

## Auth
Auth шаардахгүй — энгийн local сервер.

## Base URL
```
http://localhost:3000
```

## Ажиллуулах
```bash
cd server
npm install
node index.js
# → Book API running on http://localhost:3000
```
 
