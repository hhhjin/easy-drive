import { useRouter } from "next/router";
import { LockClosedIcon } from "@radix-ui/react-icons";

import { tw } from "@client/utils/styles";
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
      <div className="tabs tabs-boxed z-10 mb-4">
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
          <label htmlFor="set-password" className="tab gap-1">
            <LockClosedIcon />
            settings
          </label>
        )}
      </div>
      {isMine && (
        <>
          <input type="checkbox" id="set-password" className="modal-toggle" />
          <label htmlFor="set-password" className="modal">
            <label className="modal-box relative" htmlFor="">
              <PrivatePageSettings />
            </label>
          </label>
        </>
      )}
    </>
  );
}
