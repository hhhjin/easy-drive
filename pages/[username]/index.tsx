import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { type GetServerSidePropsContext } from "next";

import { prisma } from "@server/db";
import PageTabs from "@client/components/PageTabs";
import Suspense from "@client/components/common/Suspense";
import PublicFileList from "@client/components/PublicFileList";
import PrivateFileList from "@client/components/PrivateFileList";

export default function UserPage({ username }: { username: string }) {
  const router = useRouter();
  const curTab = router.query.tab || "public";

  const { data: session } = useSession();
  const user = session?.user;
  const isMine = user?.username ? user.username === username : false;

  if (typeof curTab !== "string") return null;

  return (
    <div className="min-h-screen bg-base-200 pt-12">
      <div className="mx-auto flex max-w-7xl flex-col px-4">
        <PageTabs isMine={isMine} curTab={curTab} />
        <Suspense
          fallback={
            <div className="loading btn-ghost btn-lg btn flex justify-center" />
          }
        >
          {curTab === "public" && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
              <PublicFileList username={username} isMine={isMine} />
            </div>
          )}
          {curTab === "private" && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 xl:grid-cols-5">
              <PrivateFileList username={username} isMine={isMine} />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const username = ctx.query.username;

  if (typeof username !== "string") return { notFound: true };

  const user = await prisma.user.findUnique({
    select: { username: true },
    where: { username },
  });

  if (!user) return { notFound: true };

  return { props: { username } };
}
