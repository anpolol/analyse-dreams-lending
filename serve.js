#!/usr/bin/env node
// Локальный dev-сервер лендинга: раздаёт репозиторий как статику с теми же
// правилами, что и продовый nginx.conf (/lk -> /lk/, фолбэки на index.html),
// но без кэша — правки видны по Cmd+R, ничего пересобирать не нужно.
//
// Запуск: npm start   (или: node serve.js [--port=8080])
// Порт 8080 — не случайно: локальные magic-ссылки бэкенда (APP_ENV=local)
// ведут на http://localhost:8080/lk.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const portArg = process.argv.slice(2).find(a => a.startsWith('--port='));
const PORT = Number((portArg && portArg.slice('--port='.length)) || process.env.PORT || 8080);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function send(res, status, type, body) {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function sendFile(res, file, status = 200) {
  fs.readFile(file, (err, data) => {
    if (err) return send(res, 500, 'text/plain; charset=utf-8', 'dev server error: ' + err.code);
    const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
    res.writeHead(status, {
      'Content-Type': type,
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}

function isFile(p) {
  try {
    return fs.statSync(p).isFile();
  } catch (e) {
    return false;
  }
}

const server = http.createServer((req, res) => {
  // Путь берём из сырого req.url: new URL() «схлопывает» сегменты ../,
  // и проверка на выход за корень перестаёт видеть обход.
  const rawPath = (req.url || '').split('?')[0];
  let pathname;
  try {
    pathname = decodeURIComponent(rawPath);
  } catch (e) {
    return send(res, 400, 'text/plain; charset=utf-8', 'bad request');
  }

  const segments = pathname.split('/');
  if (segments.includes('..')) {
    return send(res, 403, 'text/plain; charset=utf-8', 'forbidden');
  }
  // Служебные файлы (.git, .env, .dockerignore) не раздаём — в продовый
  // образ они и так не попадают (.dockerignore), локально — тоже не должны.
  if (segments.some(s => s.length > 1 && s.startsWith('.'))) {
    return send(res, 404, 'text/plain; charset=utf-8', 'not found');
  }

  // Как в nginx.conf: /lk -> 301 /lk/
  if (pathname === '/lk') {
    res.writeHead(301, { Location: '/lk/', 'Cache-Control': 'no-store' });
    return res.end();
  }

  const file = path.resolve(ROOT, '.' + pathname);
  // Защита от обхода корня на случай нестандартных кодировок пути.
  if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
    return send(res, 403, 'text/plain; charset=utf-8', 'forbidden');
  }

  if (isFile(file)) return sendFile(res, file);

  // Директория (например /blog/) — её index.html.
  if (isFile(path.join(file, 'index.html'))) return sendFile(res, path.join(file, 'index.html'));

  // Фолбэки как в nginx.conf: неизвестное под /lk/ — кабинет, остальное — лендинг.
  if (pathname.startsWith('/lk/')) return sendFile(res, path.join(ROOT, 'lk', 'index.html'));
  return sendFile(res, path.join(ROOT, 'index.html'));
});

server.listen(PORT, () => {
  console.log('Лендинг:      http://localhost:' + PORT + '/');
  console.log('Личный кабинет: http://localhost:' + PORT + '/lk/');
  console.log('Блог:         http://localhost:' + PORT + '/blog/');
  console.log('Остановить — Ctrl+C. Кэш выключен: правки видны по Cmd+R.');
});
