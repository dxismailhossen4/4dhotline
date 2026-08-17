import { TRPCError } from "@trpc/server";
import { createHash, randomInt } from "node:crypto";
import { z } from "zod";
import {
  activateSupabaseMembershipApplication,
  approveSupabaseMembershipApplication,
  createSupabaseMembershipApplication,
  getSupabaseMembershipApplicationById,
  getSupabaseMembershipApplicationForEmail,
  listSupabaseMembershipApplications,
} from "./supabase";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const membershipApplicationInput = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(160),
  email: z.string().trim().email("Enter a valid email address.").max(320),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number with at least seven digits.")
    .max(32),
});

const applicationIdInput = z.object({ id: z.number().int().positive() });

function hashActivationCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function assertAdmin(user: { role: string } | null) {
  if (!user || user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Administrator access is required.",
    });
  }
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  membership: router({
    submitRequest: publicProcedure.input(membershipApplicationInput).mutation(async ({ input }) => {
      const application = await createSupabaseMembershipApplication(input);
      return {
        applicationId: application?.id,
        status: "pending" as const,
      };
    }),
    mine: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user.email) return null;
      return getSupabaseMembershipApplicationForEmail(ctx.user.email);
    }),
    activate: publicProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          code: z.string().trim().regex(/^\d{6}$/, "Enter the six-digit code."),
        })
      )
      .mutation(async ({ input }) => {
        const application = await activateSupabaseMembershipApplication(
          input.id,
          hashActivationCode(input.code)
        );
        if (!application || application.status !== "active") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "The application number or activation code is invalid.",
          });
        }
        return { id: application.id, status: application.status };
      }),
  }),
  admin: router({
    applications: protectedProcedure.query(async ({ ctx }) => {
      assertAdmin(ctx.user);
      return listSupabaseMembershipApplications();
    }),
    approve: protectedProcedure.input(applicationIdInput).mutation(async ({ ctx, input }) => {
      assertAdmin(ctx.user);
      const existing = await getSupabaseMembershipApplicationById(input.id);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Application not found." });
      }
      if (existing.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only pending applications can be approved.",
        });
      }

      const code = randomInt(100000, 1000000).toString();
      const application = await approveSupabaseMembershipApplication(input.id, hashActivationCode(code));
      if (!application || application.status !== "approved") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "The application could not be approved. Try again.",
        });
      }
      return { id: application.id, code };
    }),
  }),
});

export type AppRouter = typeof appRouter;
