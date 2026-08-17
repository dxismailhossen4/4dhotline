import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core identity table managed by the authenticated application session.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * A public membership application. Activation codes are stored only as hashes.
 */
export const membershipApplications = mysqlTable(
  "membershipApplications",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 32 }).notNull(),
    status: mysqlEnum("status", ["pending", "approved", "active"])
      .default("pending")
      .notNull(),
    activationCodeHash: varchar("activationCodeHash", { length: 64 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    approvedAt: timestamp("approvedAt"),
    activatedAt: timestamp("activatedAt"),
  },
  table => [
    index("membership_applications_email_idx").on(table.email),
    index("membership_applications_status_idx").on(table.status),
  ]
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type MembershipApplication = typeof membershipApplications.$inferSelect;
export type InsertMembershipApplication = typeof membershipApplications.$inferInsert;
