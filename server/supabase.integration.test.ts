import { describe, expect, it } from "vitest";
import { supabase } from "./supabase";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabasePublishableKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

describe("Supabase publishable connection", () => {
  it("accepts the configured publishable key at the Auth settings endpoint", async () => {
    expect(supabaseUrl).toMatch(/^https:\/\/[a-z0-9]+\.supabase\.co$/);
    expect(supabasePublishableKey).toMatch(/^sb_publishable_/);

    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: supabasePublishableKey!,
      },
    });

    expect(response.ok).toBe(true);
  }, 15_000);

  it("accepts the configured server-side secret key at the Auth settings endpoint", async () => {
    expect(supabaseServiceRoleKey).toMatch(/^sb_secret_/);

    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        apikey: supabaseServiceRoleKey!,
      },
    });

    expect(response.ok).toBe(true);
  }, 15_000);

  it("can query the server-only membership table without inserting test data", async () => {
    const { error } = await supabase
      .from("membership_applications")
      .select("id", { head: true, count: "exact" })
      .limit(1);

    expect(error).toBeNull();
  }, 15_000);
});
