import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createUsernameSchema,
  updateReadOnlyPasswordSchema,
} from "@shared/validation";
import { hashPassword, verifyPassword } from "@server/utils/secret";

export const userRouter = createTRPCRouter({
  createUsername: protectedProcedure
    .input(createUsernameSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const username = input.username.toLowerCase();

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

      if (!user)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid username",
        });

      if (!user.readOnlyPassword) throw new TRPCError({ code: "FORBIDDEN" });

      const isValid = await verifyPassword(password, user.readOnlyPassword);

      if (!isValid) throw new TRPCError({ code: "FORBIDDEN" });
    }),
  updateReadOnlyPassword: protectedProcedure
    .input(updateReadOnlyPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { readOnlyPassword } = input;

      const hashedPassword = await hashPassword(readOnlyPassword);

      await ctx.db.user.update({
        data: { readOnlyPassword: hashedPassword },
        where: { id: userId },
      });
    }),
});
