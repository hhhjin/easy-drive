import useUpload from "@client/hooks/useUpload";
import { api } from "@client/utils/api";
import UploadCard from "@client/components/UploadCard";
import FileUploadingCard from "@client/components/DraftFileCard";
import FileCard from "../FileCard";

interface Props {
  username: string;
  isMine: boolean;
}

export default function PublicFileList({ username, isMine }: Props) {
  const { data: files } = api.file.publicList.useQuery(
    { username },
    { suspense: true }
  );

  const { type, uploadingFiles } = useUpload();

  if (!files) return null;

  return (
    <>
      {isMine && <UploadCard type="public" />}
      {type === "public" &&
        uploadingFiles.map((file) => (
          <FileUploadingCard key={file.id} file={file} />
        ))}
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={{ ...file, isPrivate: false }}
          isMine={isMine}
        />
      ))}
    </>
  );
}
