import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generatePlan, generateBlog } from "./src/server/gemini.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Needed to parse JSON bodies
  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/seo/generate-plan", async (req, res) => {
    try {
      const plan = await generatePlan(req.body);
      res.json(plan);
    } catch (e: any) {
      console.error("AI Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/seo/generate-blog", async (req, res) => {
    try {
      const { input, blogPlan, isPillar, linkMap } = req.body;
      const blog = await generateBlog(input, blogPlan, isPillar, linkMap);
      res.json(blog);
    } catch (e: any) {
      console.error("AI Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
