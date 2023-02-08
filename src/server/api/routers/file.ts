import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { env } from "@env/server.mjs";
import { R2 } from "@server/storage";
import { verifyPassword } from "@server/utils/secret";

export const fileRouter = createTRPCRouter({
  publicList: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const { username } = input;

      const files = await ctx.db.file.findMany({
        select: { id: true, name: true, size: true },
        where: { isPrivate: false, user: { username } },
      });

      return files;
    }),
  privateList: publicProcedure
    .input(
      z.object({
        username: z.string(),
        readOnlyPassword: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { username, readOnlyPassword } = input;

      const user = await ctx.db.user.findUnique({
        select: {
          id: true,
          readOnlyPassword: readOnlyPassword ? true : false,
        },
        where: { username },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      if (readOnlyPassword) {
        if (!user.readOnlyPassword) throw new TRPCError({ code: "FORBIDDEN" });

        const verified = await verifyPassword(
          readOnlyPassword,
          user.readOnlyPassword
        );

        if (!verified) throw new TRPCError({ code: "FORBIDDEN" });

        const files = await ctx.db.file.findMany({
          where: { isPrivate: true, userId: user.id },
        });

        return files;
      }

      const userId = ctx.session?.user?.id;

      if (user.id !== userId) throw new TRPCError({ code: "FORBIDDEN" });

      const files = await ctx.db.file.findMany({
        where: { isPrivate: true, userId },
      });

      return files;
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        size: z.number(),
        isPrivate: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { name, size, isPrivate } = input;

      const { id } = await ctx.db.file.create({
        data: { name, size, isPrivate, userId },
      });

      const uploadUrl = await getSignedUrl(
        R2,
        new PutObjectCommand({
          Bucket: env.R2_BUCKET,
          Key: id,
        }),
        { expiresIn: 3600 }
      );

      return { id, uploadUrl };
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id } = input;

      const file = await ctx.db.file.findUnique({ where: { id } });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });
      if (file.userId !== userId) throw new TRPCError({ code: "FORBIDDEN" });

      await R2.send(
        new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: id })
      );

      await ctx.db.file.delete({ where: { id } });
    }),
  getDownloadUrl: publicProcedure
    .input(
      z.object({
        id: z.string(),
        readOnlyPassword: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, readOnlyPassword } = input;

      const file = await ctx.db.file.findUnique({
        select: { id: true, isPrivate: true, userId: true },
        where: { id },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      if (file.isPrivate) {
        const userId = ctx.session?.user?.id;

        if (userId !== file.userId) {
          if (!readOnlyPassword) throw new TRPCError({ code: "FORBIDDEN" });

          const user = await ctx.db.user.findUnique({
            select: { readOnlyPassword: true },
            where: { id: file.userId },
          });

          if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
          if (!user.readOnlyPassword)
            throw new TRPCError({ code: "FORBIDDEN" });

          const isValid = await verifyPassword(
            readOnlyPassword,
            user.readOnlyPassword
          );

          if (!isValid) throw new TRPCError({ code: "FORBIDDEN" });
        }
      }

      const url = await getSignedUrl(
        R2,
        new GetObjectCommand({ Bucket: env.R2_BUCKET, Key: id }),
        { expiresIn: 3600 }
      );

      return url;
    }),
});
