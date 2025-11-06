import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const workPermits = pgTable("work_permits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workType: text("work_type").notNull(),
  workArea: text("work_area").notNull(),
  workLocation: text("work_location").notNull(),
  equipmentName: text("equipment_name").notNull(),
  workerName: text("worker_name").notNull(),
  workPeriodStart: text("work_period_start").notNull(),
  workPeriodEnd: text("work_period_end").notNull(),
  workDescription: text("work_description").notNull(),
  procedures: text("procedures").notNull(),
  hazards: text("hazards").notNull(),
  accidentTypes: text("accident_types").notNull(),
  safetyMeasures: text("safety_measures").notNull(),
  riskComplexity: integer("risk_complexity").notNull(),
  riskScope: integer("risk_scope").notNull(),
  riskFrequency: integer("risk_frequency").notNull(),
  riskOverall: integer("risk_overall").notNull(),
  riskReason: text("risk_reason").notNull(),
  mitigationMeasures: text("mitigation_measures").notNull(),
});

export const insertWorkPermitSchema = createInsertSchema(workPermits).omit({
  id: true,
});

export const workPermitInputSchema = z.object({
  workType: z.string().min(1, "작업유형을 입력해주세요"),
  workArea: z.string().min(1, "작업지역을 입력해주세요"),
  workLocation: z.string().min(1, "작업장소를 입력해주세요"),
  equipmentName: z.string().min(1, "설비명을 입력해주세요"),
  workerName: z.string().min(1, "작업자명을 입력해주세요"),
  workPeriodStart: z.string().min(1, "작업시작일을 입력해주세요"),
  workPeriodEnd: z.string().min(1, "작업종료일을 입력해주세요"),
  workDescription: z.string().min(10, "작업내용을 최소 10자 이상 입력해주세요"),
});

export type InsertWorkPermit = z.infer<typeof insertWorkPermitSchema>;
export type WorkPermit = typeof workPermits.$inferSelect;
export type WorkPermitInput = z.infer<typeof workPermitInputSchema>;

export interface GeneratedPermit {
  procedures: string[];
  hazards: string[];
  accidentTypes: string[];
  safetyMeasures: string[];
  riskAssessment: {
    complexity: number;
    scope: number;
    frequency: number;
    overall: number;
    reason: string;
  };
  mitigationMeasures: string[];
}
