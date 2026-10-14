import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { build, out } from "./build.mjs";

await build();
const port = Number(process.env.PORT || 8080);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  ".bib": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    try {
      const parsed = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(parsed.pathname);
      let target = path.resolve(out, "." + pathname);
      if (target !== out && !target.startsWith(out + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      try {
        const info = await stat(target);
        if (info.isDirectory()) {
          if (!pathname.endsWith("/")) {
            res.writeHead(301, { Location: pathname + "/" + parsed.search }).end();
            return;
          }
          target = path.join(target, "index.html");
        }
        const body = await readFile(target);
        res.writeHead(200, {
          "Content-Type": mime[path.extname(target)] || "application/octet-stream",
          "Cache-Control": "no-cache",
          "X-Content-Type-Options": "nosniff",
        });
        res.end(body);
      } catch {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(await readFile(path.join(out, pathname.startsWith("/fr/") ? "fr/404.html" : "404.html")));
      }
    } catch {
      res.writeHead(400).end("Bad request");
    }
  })
  .listen(port, "127.0.0.1", () => console.log(`Local: http://127.0.0.1:${port}`));
