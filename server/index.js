// server/index.js — Mini Book API (Lab 14, Хувилбар 3)
// ≤ 50 мөр: 4+ endpoint, body validation (400), not-found (404)

const express = require('express');
const app = express();
app.use(express.json());

// In-memory өгөгдлийн сан
let books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin', year: 2008 },
  { id: 2, title: 'The Pragmatic Programmer', author: 'David Thomas', year: 1999 },
];
let nextId = 3;

// GET /api/books — бүх номыг авах (Happy GET)
app.get('/api/books', (req, res) => {
  res.json({ success: true, data: books, total: books.length });
});

// GET /api/books/:id — нэг ном авах (GET by id / 404)
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
  res.json({ success: true, data: book });
});

// POST /api/books — шинэ ном үүсгэх (body validation → 400)
app.post('/api/books', (req, res) => {
  const { title, author, year } = req.body || {};
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ success: false, error: 'title is required and must be a non-empty string' });
  }
  if (!author || typeof author !== 'string' || author.trim() === '') {
    return res.status(400).json({ success: false, error: 'author is required and must be a non-empty string' });
  }
  if (year !== undefined && (typeof year !== 'number' || year < 1000 || year > new Date().getFullYear())) {
    return res.status(400).json({ success: false, error: 'year must be a valid number' });
  }
  const book = { id: nextId++, title: title.trim(), author: author.trim(), year: year || null };
  books.push(book);
  res.status(201).json({ success: true, data: book });
});

// PUT /api/books/:id — ном засах (404 + validation)
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ success: false, error: 'Book not found' });
  const { title, author, year } = req.body || {};
  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ success: false, error: 'title must be a non-empty string' });
    }
    book.title = title.trim();
  }
  if (author !== undefined) book.author = author.trim();
  if (year !== undefined) book.year = year;
  res.json({ success: true, data: book });
});

// DELETE /api/books/:id — ном устгах (404)
app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ success: false, error: 'Book not found' });
  books.splice(idx, 1);
  res.status(204).send();
});

// GET /api/health — health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Book API running on http://localhost:${PORT}`));
}
module.exports = app;
