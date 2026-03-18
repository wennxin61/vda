const http = require('http');
const https = require('https');
const { URL } = require('url');

const PORT = process.env.PORT || 5174;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const reqUrl = new URL(req.url, `http://localhost:${PORT}`);
    if (reqUrl.pathname !== '/rss') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }

    const target = reqUrl.searchParams.get('url');
    if (!target) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing url query parameter');
      return;
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid url');
      return;
    }

    const lib = targetUrl.protocol === 'https:' ? https : http;
    const options = {
      headers: {
        'User-Agent': 'RSS-Proxy/1.0',
        'Accept': '*/*'
      }
    };

    lib.get(target, options, (upstream) => {
      const statusCode = upstream.statusCode || 200;
      const contentType = upstream.headers['content-type'] || 'application/xml';
      res.writeHead(statusCode, { 'Content-Type': contentType });
      upstream.pipe(res);
    }).on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Upstream fetch error');
    });
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Server error');
  }
});

server.listen(PORT, () => {
  console.log(`RSS proxy listening on http://localhost:${PORT}`);
});
