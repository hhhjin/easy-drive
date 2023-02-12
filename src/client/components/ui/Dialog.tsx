import { type ReactNode } from "react";
import * as D from "@radix-ui/react-dialog";

interface Props {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;
}

export default function Dialog({ children, content, open }: Props) {
  return (
    <D.Root open={open}>
      <D.Trigger asChild>{children}</D.Trigger>
      <D.Portal>
        <D.Overlay className="absolute inset-0 bg-black/70" />
        <D.Content className="modal-box fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          {content}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
