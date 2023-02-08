import FileCard from "@client/components/FileCard";
import useUpload from "@client/hooks/useUpload";
import { api } from "@client/utils/api";
import FileUploadingCard from "@client/components/DraftFileCard";
import UploadCard from "@client/components/UploadCard";

interface Props {
  username: string;
  readOnlyPassword?: string;
}

export default function List({ username, readOnlyPassword }: Props) {
  const { data: files } = api.file.privateList.useQuery(
    { username, readOnlyPassword },
    { suspense: true }
  );

  const { uploadingFiles } = useUpload();

  if (!files) return null;

  return (
    <>
      {!readOnlyPassword && <UploadCard type="private" />}
      {uploadingFiles.map((file) => (
        <FileUploadingCard key={file.id} file={file} />
      ))}
      {files.map((file) => (
        <FileCard key={file.id} file={file} isMine={!readOnlyPassword} />
      ))}
    </>
  );
}
