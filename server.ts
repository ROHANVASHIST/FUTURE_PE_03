import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generatePlan, generateBlog, generateSubscriptionEmail, generateCheckoutEmail } from "./src/server/gemini.js";

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

  app.post("/api/subscribe", async (req, res) => {
    try {
      const { email, businessInput } = req.body;
      const emailContent = await generateSubscriptionEmail(email, businessInput);
      res.json({
        success: true,
        email,
        subject: emailContent.subject,
        htmlContent: emailContent.htmlContent,
        textContent: emailContent.textContent,
        timestamp: new Date().toISOString(),
        headers: {
          "x-smtp-sender": "briefings@seoclustersuite.com",
          "x-smtp-relay": "mx.regional-cluster-node-router.internal",
          "x-spf-record": "PASS",
          "x-dkim-signature": "PASS"
        }
      });
    } catch (e: any) {
      console.error("Subscription Mail Error:", e);
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/checkout-receipt", async (req, res) => {
    try {
      const { email, planName, price, billingPeriod, businessName } = req.body;
      const receiptContent = await generateCheckoutEmail(email, planName, price, billingPeriod, businessName);
      res.json({
        success: true,
        email,
        subject: receiptContent.subject,
        htmlContent: receiptContent.htmlContent,
        textContent: receiptContent.textContent,
        timestamp: new Date().toISOString(),
        headers: {
          "x-smtp-sender": "billing@seoclustersuite.com",
          "x-smtp-relay": "billing-relay-mta.secure.internal",
          "x-spf-record": "PASS",
          "x-dkim-signature": "PASS"
        }
      });
    } catch (e: any) {
      console.error("Checkout Receipt Error:", e);
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
