import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse } from "./openai";
import { getRAGService } from "./rag";
import { getWeatherInfo } from "./weather";

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

  // Clear all permits endpoint
  app.delete("/api/permits/clear", async (req, res) => {
    try {
      await storage.clearAllPermits();
      res.json({ success: true });
    } catch (error) {
      console.error("Clear permits error:", error);
      res.status(500).json({ error: "Failed to clear permits" });
    }
  });

  // Get similar accident cases using RAG
  app.post("/api/accident-cases/similar", async (req, res) => {
    try {
      const { workTypes, workName, workDescription, equipmentName } = req.body;

      if (!workTypes || !Array.isArray(workTypes)) {
        return res.status(400).json({ error: "Invalid workTypes" });
      }

      const ragService = getRAGService();
      const similarCases = await ragService.findSimilarCases(
        workTypes,
        workName || "",
        workDescription || "",
        equipmentName || "",
        2 // Get 2 similar cases
      );

      res.json(similarCases);
    } catch (error) {
      console.error("Similar cases error:", error);
      res.status(500).json({ error: "Failed to find similar cases" });
    }
  });

  // Get accident case by ID
  app.get("/api/accident-cases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid case ID" });
      }

      const ragService = getRAGService();
      const accidentCase = ragService.getCaseById(id);

      if (!accidentCase) {
        return res.status(404).json({ error: "Case not found" });
      }

      res.json(accidentCase);
    } catch (error) {
      console.error("Get case error:", error);
      res.status(500).json({ error: "Failed to get case" });
    }
  });

  // Weather endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const { city } = req.query;

      if (!city || typeof city !== "string") {
        return res.status(400).json({ error: "City parameter is required" });
      }

      const weatherInfo = await getWeatherInfo(city);
      res.json(weatherInfo);
    } catch (error) {
      console.error("Weather API error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather information";
      res.status(500).json({ error: errorMessage });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
