import { type ReactNode } from "react";
import * as T from "@radix-ui/react-tooltip";

interface Props {
  content: ReactNode;
  children: ReactNode;
}

export default function Tooltip({ content, children }: Props) {
  return (
    <T.Provider delayDuration={400}>
      <T.Root>
        <T.Trigger asChild>{children}</T.Trigger>
        <T.Portal>
          <T.Content
            className="max-w-[240px] rounded bg-black/70 px-2 py-1 text-sm text-gray-200"
            align="end"
            sideOffset={24}
          >
            {content}
            <T.Arrow className="fill-black/70" />
          </T.Content>
        </T.Portal>
      </T.Root>
    </T.Provider>
  );
}
