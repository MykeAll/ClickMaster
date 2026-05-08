import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // --- ADMOB VALIDATION ROUTE ---
  // This is critical for Google AdMob validation. 
  // You should update the content here with your actual AdMob account info later.
  app.get("/app-ads.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send("google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"); // Placeholder ID
  });

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "online", environment: process.env.NODE_ENV || "development" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ClickMaster Pro Server] Running on http://localhost:${PORT}`);
    console.log(`[Validation] app-ads.txt available at http://localhost:${PORT}/app-ads.txt`);
  });
}

startServer();
