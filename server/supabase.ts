import { createClient } from "@supabase/supabase-js";

type MembershipStatus = "pending" | "approved" | "active";

type MembershipApplicationRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: MembershipStatus;
  activation_code_hash: string | null;
  created_at: string;
  approved_at: string | null;
  activated_at: string | null;
};

export type SupabaseMembershipApplication = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: MembershipStatus;
  activationCodeHash: string | null;
  createdAt: Date;
  approvedAt: Date | null;
  activatedAt: Date | null;
};

function requiredEnv(key: "VITE_SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required Supabase environment variable: ${key}`);
  return value;
}

const supabase = createClient(
  requiredEnv("VITE_SUPABASE_URL"),
  requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function mapApplication(row: MembershipApplicationRow): SupabaseMembershipApplication {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    activationCodeHash: row.activation_code_hash,
    createdAt: new Date(row.created_at),
    approvedAt: row.approved_at ? new Date(row.approved_at) : null,
    activatedAt: row.activated_at ? new Date(row.activated_at) : null,
  };
}

function throwOnSupabaseError(error: { message: string; code?: string } | null) {
  if (error) throw new Error(`Supabase membership operation failed: ${error.message}`);
}

export async function createSupabaseMembershipApplication(input: {
  name: string;
  email: string;
  phone: string;
}) {
  const { data, error } = await supabase
    .from("membership_applications")
    .insert({
      name: input.name.trim(),
      email: normalizeEmail(input.email),
      phone: input.phone.trim(),
    })
    .select()
    .single<MembershipApplicationRow>();
  throwOnSupabaseError(error);
  return mapApplication(data!);
}

export async function listSupabaseMembershipApplications() {
  const { data, error } = await supabase
    .from("membership_applications")
    .select()
    .order("created_at", { ascending: false })
    .returns<MembershipApplicationRow[]>();
  throwOnSupabaseError(error);
  return (data ?? []).map(mapApplication);
}

export async function getSupabaseMembershipApplicationById(id: number) {
  const { data, error } = await supabase
    .from("membership_applications")
    .select()
    .eq("id", id)
    .maybeSingle<MembershipApplicationRow>();
  throwOnSupabaseError(error);
  return data ? mapApplication(data) : null;
}

export async function getSupabaseMembershipApplicationForEmail(email: string) {
  const { data, error } = await supabase
    .from("membership_applications")
    .select()
    .eq("email", normalizeEmail(email))
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<MembershipApplicationRow>();
  throwOnSupabaseError(error);
  return data ? mapApplication(data) : null;
}

export async function approveSupabaseMembershipApplication(id: number, codeHash: string) {
  const { data, error } = await supabase
    .from("membership_applications")
    .update({
      status: "approved",
      activation_code_hash: codeHash,
      approved_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "pending")
    .select()
    .maybeSingle<MembershipApplicationRow>();
  throwOnSupabaseError(error);
  return data ? mapApplication(data) : null;
}

export async function activateSupabaseMembershipApplication(id: number, codeHash: string) {
  const { data, error } = await supabase
    .from("membership_applications")
    .update({
      status: "active",
      activation_code_hash: null,
      activated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("status", "approved")
    .eq("activation_code_hash", codeHash)
    .select()
    .maybeSingle<MembershipApplicationRow>();
  throwOnSupabaseError(error);
  return data ? mapApplication(data) : null;
}

export { supabase };
