import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const LEADS_FILE = path.join(process.cwd(), "leads.json");

// Helper to read/write leads
const getLeads = () => {
  if (!fs.existsSync(LEADS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
  } catch (e) {
    return [];
  }
};

const saveLead = (lead: any) => {
  const leads = getLeads();
  const newLead = { 
    ...lead, 
    id: Date.now(), 
    createdAt: new Date().toISOString(),
    isRead: false 
  };
  leads.push(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  
  // Notification Log (Visible to user in the terminal)
  console.log("\n🔔 NEW LEAD RECEIVED:");
  console.log(`👤 Name: ${newLead.name}`);
  console.log(`📧 Email: ${newLead.email}`);
  console.log(`🏢 Company: ${newLead.company}`);
  console.log(`💬 Pain Point: ${newLead.biggestProblem}`);
  console.log("------------------------------\n");
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/leads", (req, res) => {
    const lead = req.body;
    saveLead(lead);
    res.json({ success: true });
  });

  app.get("/api/leads", (req, res) => {
    const adminKey = process.env.ADMIN_SECRET_KEY;
    const providedKey = req.headers["x-admin-key"];

    if (!adminKey || providedKey !== adminKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    res.json(getLeads());
  });

  app.patch("/api/leads/:id/read", (req, res) => {
    const adminKey = process.env.ADMIN_SECRET_KEY;
    const providedKey = req.headers["x-admin-key"];

    if (!adminKey || providedKey !== adminKey) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const leads = getLeads();
    const updatedLeads = leads.map((l: any) => 
      l.id === parseInt(id) ? { ...l, isRead: true } : l
    );
    fs.writeFileSync(LEADS_FILE, JSON.stringify(updatedLeads, null, 2));
    res.json({ success: true });
  });

  // Vite integration
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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    if (!process.env.ADMIN_SECRET_KEY) {
      console.warn("⚠️  WARNING: ADMIN_SECRET_KEY is not set in environment variables.");
      console.warn("⚠️  Admin leads page will return 401 Unauthorized until this is set.");
      console.warn("👉 Go to Settings -> Secrets and add ADMIN_SECRET_KEY");
    } else {
      console.log("✅ Admin security key detected and active.");
    }
  });
}

startServer();
