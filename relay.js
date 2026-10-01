// check-host relay — deploy on Railway (Node 18+). Env: SECRET (required), PORT (auto)
import http from "node:http";
const SECRET = process.env.SECRET;
http.createServer(async (req, res) => {
  if (!SECRET || req.headers["x-secret"] !== SECRET) { res.writeHead(403); return res.end("forbidden"); }
  if (!/^\/(check-ping\?|check-result\/[\w-]+$|nodes\/hosts$)/.test(req.url)) { res.writeHead(404); return res.end("nf"); }
  try {
    const r = await fetch("https://check-host.net" + req.url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      },
    });
    res.writeHead(r.status, { "content-type": "application/json" });
    res.end(await r.text());
  } catch (e) { res.writeHead(502); res.end(String(e.message)); }
}).listen(process.env.PORT || 3000);
