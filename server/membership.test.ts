import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { assertAdmin, membershipApplicationInput } from "./routers";

describe("membership registration contract", () => {
  it("accepts a complete public application", () => {
    expect(
      membershipApplicationInput.parse({
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "+1 555 010 1000",
      })
    ).toMatchObject({ email: "ada@example.com" });
  });

  it("rejects an invalid public email address", () => {
    expect(() => membershipApplicationInput.parse({ name: "Ada", email: "not-an-email", phone: "5550101" })).toThrow();
  });
});

describe("administrator authorization", () => {
  it("allows an administrator", () => {
    expect(() => assertAdmin({ role: "admin" })).not.toThrow();
  });

  it("blocks a non-administrator", () => {
    expect(() => assertAdmin({ role: "user" })).toThrow(TRPCError);
  });
});
