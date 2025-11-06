import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint for accident cases
  app.post("/api/chat/accident-cases", async (req, res) => {
    try {
      const { message } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Invalid message" });
      }

      const response = await getChatResponse(message);
      res.json({ response });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  // Create work permit endpoint
  app.post("/api/permits", async (req, res) => {
    try {
      const {
        workType,
        workName,
        workArea,
        equipmentName,
        workerName,
        department,
        workStartDate,
        workEndDate,
        workDescription,
        safetyChecks,
        vocComment,
        status,
      } = req.body;

      const permit = await storage.createPermit({
        workType,
        workName,
        workArea,
        equipmentName,
        workerName,
        department,
        workPeriodStart: workStartDate,
        workPeriodEnd: workEndDate,
        workDescription,
        safetyChecks: JSON.stringify(safetyChecks),
        vocComment,
        status,
      });

      res.json(permit);
    } catch (error) {
      console.error("Create permit error:", error);
      res.status(500).json({ error: "Failed to create permit" });
    }
  });

  // Get permits endpoint
  app.get("/api/permits", async (req, res) => {
    try {
      const { status } = req.query;
      const permits = await storage.getPermits(status as string);
      res.json(permits);
    } catch (error) {
      console.error("Get permits error:", error);
      res.status(500).json({ error: "Failed to get permits" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
