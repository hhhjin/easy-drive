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
      <div className="absolute top-0 left-0 flex h-screen w-screen items-center justify-center">
        <Barrier username={username} />
      </div>
    );

  return <List username={username} readOnlyPassword={readOnlyPassword} />;
}
