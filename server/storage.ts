import { type User, type InsertUser, type WorkPermit, type InsertWorkPermit } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPermit(permit: Partial<InsertWorkPermit>): Promise<WorkPermit>;
  getPermits(status?: string): Promise<WorkPermit[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private permits: Map<string, WorkPermit>;

  constructor() {
    this.users = new Map();
    this.permits = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPermit(insertPermit: Partial<InsertWorkPermit>): Promise<WorkPermit> {
    const id = randomUUID();
    const permit: WorkPermit = {
      id,
      workType: insertPermit.workType || "",
      workName: insertPermit.workName || "",
      workArea: insertPermit.workArea || "",
      workLocation: insertPermit.workLocation || null,
      equipmentName: insertPermit.equipmentName || "",
      workerName: insertPermit.workerName || "",
      department: insertPermit.department || "",
      workPeriodStart: insertPermit.workPeriodStart || "",
      workPeriodEnd: insertPermit.workPeriodEnd || "",
      workDescription: insertPermit.workDescription || "",
      procedures: insertPermit.procedures || null,
      hazards: insertPermit.hazards || null,
      accidentTypes: insertPermit.accidentTypes || null,
      safetyMeasures: insertPermit.safetyMeasures || null,
      riskComplexity: insertPermit.riskComplexity || null,
      riskScope: insertPermit.riskScope || null,
      riskFrequency: insertPermit.riskFrequency || null,
      riskOverall: insertPermit.riskOverall || null,
      riskReason: insertPermit.riskReason || null,
      mitigationMeasures: insertPermit.mitigationMeasures || null,
      safetyChecks: insertPermit.safetyChecks || null,
      vocComment: insertPermit.vocComment || null,
      status: insertPermit.status || "pending",
    };
    this.permits.set(id, permit);
    return permit;
  }

  async getPermits(status?: string): Promise<WorkPermit[]> {
    const allPermits = Array.from(this.permits.values());
    if (status) {
      return allPermits.filter(p => p.status === status);
    }
    return allPermits;
  }
}

export const storage = new MemStorage();
