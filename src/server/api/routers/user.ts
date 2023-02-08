import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { hashPassword, verifyPassword } from "@server/utils/secret";

export const userRouter = createTRPCRouter({
  createUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().min(2).max(12),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { username } = input;

      await ctx.db.user.updateMany({
        data: { username },
        where: { id: userId },
      });
    }),
  hasReadOnlyPassword: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      select: { readOnlyPassword: true },
      where: { id: userId },
    });

    if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

    if (!user.readOnlyPassword) return false;

    return true;
  }),
  verifyReadOnlyPassword: publicProcedure
    .input(z.object({ password: z.string(), username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { password, username } = input;

      const user = await ctx.db.user.findUnique({
        select: { readOnlyPassword: true },
        where: { username },
      });

      if (!user) throw new TRPCError({ code: "BAD_REQUEST" });

      if (!user.readOnlyPassword) throw new TRPCError({ code: "NOT_FOUND" });

      const isValid = await verifyPassword(password, user.readOnlyPassword);

      if (!isValid) return false;

      return true;
    }),
  updateReadOnlyPassword: protectedProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { password } = input;

      const hashedPassword = await hashPassword(password);

      await ctx.db.user.update({
        data: { readOnlyPassword: hashedPassword },
        where: { id: userId },
      });
    }),
});
