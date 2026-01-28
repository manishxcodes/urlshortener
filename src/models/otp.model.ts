import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const otpsTable = pgTable("otp", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    otpHash: varchar("otp_hash", { length: 255 }).notNull(),
    expiresAt: timestamp("exprires_at").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    verifiedAt: timestamp("verified_at"),
    createdAt: timestamp("created_at").defaultNow()
});