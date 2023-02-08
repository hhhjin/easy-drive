import { api } from "@client/utils/api";
import { atom, useAtom } from "jotai";
import { useCallback, useRef } from "react";

const mapFileListToFile = (fileList: FileList) => {
  const files: File[] = [];
  for (let i = 0; i < fileList.length; i++) {
    files.push(fileList.item(i) as File);
  }
  return files;
};

const typeAtom = atom<"public" | "private">("public");
const statusAtom = atom<"idle" | "loading">("idle");
const uploadingFilesAtom = atom<
  { id: string; name: string; size: number; status: string }[]
>([]);

const useUpload = () => {
  const [type, setType] = useAtom(typeAtom);
  const [status, setStatus] = useAtom(statusAtom);
  const [uploadingFiles, setUploadingFiles] = useAtom(uploadingFilesAtom);

  const idRef = useRef(0);

  const { mutateAsync } = api.file.create.useMutation();

  const upload = useCallback(
    async (fileList: FileList, type: "public" | "private") => {
      if (status !== "idle") return;

      const files = mapFileListToFile(fileList);

      setType(type);
      setStatus("loading");

      const uploadings = files.map(async (file) => {
        const id = (idRef.current++).toString();
        const { name, size } = file;
        try {
          setUploadingFiles((files) =>
            files.concat({ id, name, size, status: "loading" })
          );

          const { uploadUrl } = await mutateAsync({
            name,
            size,
            isPrivate: type === "private",
          });

          await fetch(uploadUrl, { method: "PUT", body: file });

          setUploadingFiles((files) =>
            files.map((f) => (f.id === id ? { ...f, status: "success" } : f))
          );
        } catch (e) {
          setUploadingFiles((files) =>
            files.map((file) =>
              file.id === id
                ? {
                    ...file,
                    status: "error",
                  }
                : file
            )
          );
        }
      });

      await Promise.all(uploadings);

      setStatus("idle");
    },
    [mutateAsync, setStatus, setType, setUploadingFiles, status]
  );

  const filterErrorFiles = useCallback(() => {
    setUploadingFiles((files) =>
      files.filter((file) => file.status === "error")
    );
  }, [setUploadingFiles]);

  return { type, status, uploadingFiles, upload, filterErrorFiles };
};

export default useUpload;
