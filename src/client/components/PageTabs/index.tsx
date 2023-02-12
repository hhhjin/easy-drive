import { useRouter } from "next/router";
import { LockClosedIcon } from "@radix-ui/react-icons";

import { tw } from "@client/utils/styles";
import Dialog from "@client/components/ui/Dialog";
import PrivatePageSettings from "../PrivatePageSettings";

interface Props {
  isMine: boolean;
  curTab: string;
}

export default function PageTabs({ isMine, curTab }: Props) {
  const router = useRouter();

  const handleTabClick = async (tab: "public" | "private") => {
    await router.push({ query: { username: router.query.username, tab } });
  };

  return (
    <>
      <div className="tabs tabs-boxed mb-4">
        <button
          className={tw("tab", curTab === "public" && "tab-active")}
          onClick={() => handleTabClick("public")}
        >
          public
        </button>
        <button
          className={tw("tab", curTab === "private" && "tab-active")}
          onClick={() => handleTabClick("private")}
        >
          private
        </button>
        {curTab === "private" && isMine && (
          <Dialog content={<PrivatePageSettings />}>
            <button className="tab gap-1">
              <LockClosedIcon />
              settings
            </button>
          </Dialog>
        )}
      </div>
    </>
  );
}
