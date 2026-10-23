import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, sep } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'dist');
const port = Number(process.env.PORT || 5173);
const clients = new Set();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png' };
const liveReload = '<script>const live=new EventSource("/__reload");live.onmessage=()=>location.reload();</script>';

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/__reload') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return; }
  try {
    const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const path = resolve(root, '.' + name);
    if (!path.startsWith(root + sep) || !(await stat(path)).isFile()) { res.writeHead(404); res.end('Not found'); return; }
    let body = await readFile(path);
    if (extname(path) === '.html') body = Buffer.from(body.toString().replace('</body>', liveReload + '</body>'));
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end('Not found'); }
});

let timer;
const watcher = watch(root, { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(() => { for (const client of clients) client.write('data: reload\n\n'); }, 200);
});
server.listen(port, '127.0.0.1', () => console.log(`EngineLens → http://localhost:${port}`));
server.on('error', err => { console.error(err.message); watcher.close(); process.exit(1); });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => { watcher.close(); for (const client of clients) client.end(); server.close(() => process.exit(0)); });
