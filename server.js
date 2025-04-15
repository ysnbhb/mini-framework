import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const rootDir = __dirname;

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url);

  let filePath = path.join(rootDir, urlPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        const indexPath = path.join(rootDir, "index.html");
        fs.readFile(indexPath, (errIndex, indexContent) => {
          if (errIndex) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("500 Internal Server Error");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(indexContent);
          }
        });
      } else {
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes = {
          ".html": "text/html",
          ".css": "text/css",
          ".js": "application/javascript",
          ".json": "application/json",
          ".png": "image/png",
          ".jpg": "image/jpeg",
          ".jpeg": "image/jpeg",
          ".gif": "image/gif",
          ".svg": "image/svg+xml",
          ".ico": "image/x-icon",
        };
        const contentType = contentTypes[ext];

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);
      }
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
