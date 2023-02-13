import { useReadOnlyPassword } from "@client/hooks/useReadOnlyPassword";
import Barrier from "./Barrier";
import List from "./List";

interface Props {
  username: string;
  isMine: boolean;
}

export default function PrivateFileList({ username, isMine }: Props) {
  const { readOnlyPassword } = useReadOnlyPassword();

  if (!isMine && !readOnlyPassword)
    return (
      <div className="absolute top-1/2 left-1/2 w-[24rem] -translate-x-1/2 -translate-y-1/2">
        <Barrier username={username} />
      </div>
    );

  return <List username={username} readOnlyPassword={readOnlyPassword} />;
}
