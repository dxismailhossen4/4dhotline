import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertMembershipApplication,
  InsertUser,
  membershipApplications,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("The membership database is unavailable.");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  textFields.forEach(field => {
    if (user[field] !== undefined) {
      const value = user[field] ?? null;
      values[field] = value;
      updateSet[field] = value;
    }
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createMembershipApplication(input: {
  name: string;
  email: string;
  phone: string;
}) {
  const db = await requireDb();
  const created = await db
    .insert(membershipApplications)
    .values({
      name: input.name.trim(),
      email: normalizeEmail(input.email),
      phone: input.phone.trim(),
    })
    .$returningId();

  return created[0];
}

export async function listMembershipApplications() {
  const db = await requireDb();
  return db
    .select()
    .from(membershipApplications)
    .orderBy(desc(membershipApplications.createdAt));
}

export async function getMembershipApplicationById(id: number) {
  const db = await requireDb();
  const result = await db
    .select()
    .from(membershipApplications)
    .where(eq(membershipApplications.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function getMembershipApplicationForEmail(email: string) {
  const db = await requireDb();
  const result = await db
    .select()
    .from(membershipApplications)
    .where(eq(membershipApplications.email, normalizeEmail(email)))
    .orderBy(desc(membershipApplications.createdAt))
    .limit(1);
  return result[0] ?? null;
}

export async function approveMembershipApplication(id: number, codeHash: string) {
  const db = await requireDb();
  await db
    .update(membershipApplications)
    .set({
      status: "approved",
      activationCodeHash: codeHash,
      approvedAt: new Date(),
    })
    .where(
      and(
        eq(membershipApplications.id, id),
        eq(membershipApplications.status, "pending")
      )
    );
  return getMembershipApplicationById(id);
}

export async function activateMembershipApplication(id: number, codeHash: string) {
  const db = await requireDb();
  await db
    .update(membershipApplications)
    .set({
      status: "active",
      activationCodeHash: null,
      activatedAt: new Date(),
    })
    .where(
      and(
        eq(membershipApplications.id, id),
        eq(membershipApplications.status, "approved"),
        eq(membershipApplications.activationCodeHash, codeHash)
      )
    );
  return getMembershipApplicationById(id);
}
