import { createTRPCRouter } from "./trpc";
import { fileRouter } from "./routers/file";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  file: fileRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
