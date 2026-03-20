import {
	decimal,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const roastModeEnum = pgEnum("roast_mode", [
	"sarcastic",
	"constructive",
]);

export const verdictEnum = pgEnum("verdict", [
	"needs_serious_help",
	"needs_work",
	"acceptable",
	"good",
]);

export interface AnalysisItem {
	title: string;
	description: string;
	severity: "critical" | "warning";
}

export const languageEnum = pgEnum("programming_language", [
	"javascript",
	"typescript",
	"python",
	"rust",
	"go",
	"java",
	"c",
	"cpp",
	"csharp",
	"php",
	"ruby",
	"swift",
	"kotlin",
	"sql",
	"html",
	"css",
	"json",
	"yaml",
	"markdown",
	"bash",
	"other",
]);

export const codeSubmissions = pgTable("code_submissions", {
	id: uuid("id").defaultRandom().primaryKey(),
	sessionId: text("session_id").notNull(),
	code: text("code").notNull(),
	language: languageEnum("language").notNull().default("other"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roastResults = pgTable("roast_results", {
	id: uuid("id").defaultRandom().primaryKey(),
	submissionId: uuid("submission_id").notNull(),
	score: decimal("score", { precision: 3, scale: 2 }).notNull(),
	roastMode: roastModeEnum("roast_mode").notNull().default("sarcastic"),
	feedback: text("feedback").notNull(),
	title: text("title").notNull(),
	verdict: verdictEnum("verdict").notNull(),
	analysis: jsonb("analysis").notNull().default("[]"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
	id: uuid("id").defaultRandom().primaryKey(),
	submissionId: uuid("submission_id").notNull(),
	sessionId: text("session_id").notNull(),
	rank: integer("rank").notNull(),
	score: decimal("score", { precision: 3, scale: 2 }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CodeSubmission = typeof codeSubmissions.$inferSelect;
export type NewCodeSubmission = typeof codeSubmissions.$inferInsert;
export type RoastResult = typeof roastResults.$inferSelect;
export type NewRoastResult = typeof roastResults.$inferInsert;
export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type NewLeaderboardEntry = typeof leaderboardEntries.$inferInsert;
