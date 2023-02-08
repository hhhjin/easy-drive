import { UploadIcon } from "@radix-ui/react-icons";
import { type ChangeEvent, useRef, useEffect, useCallback } from "react";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";
import useUpload from "@client/hooks/useUpload";

interface Props {
  type: "public" | "private";
}

export default function UploadCard({ type }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, filterErrorFiles } = useUpload();

  const apiCtx = api.useContext();

  const handleUploadFiles = useCallback(
    async (fileList: FileList) => {
      await upload(fileList, type);
      if (type === "public") {
        await apiCtx.file.publicList.invalidate();
      } else {
        await apiCtx.file.privateList.invalidate();
      }
      filterErrorFiles();
    },
    [
      apiCtx.file.privateList,
      apiCtx.file.publicList,
      filterErrorFiles,
      type,
      upload,
    ]
  );

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.currentTarget.files;
    if (!fileList) return;
    await handleUploadFiles(fileList);
  };

  useEffect(() => {
    const on = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const onDrop = async (e: DragEvent) => {
      on(e);
      const fileList = e.dataTransfer?.files;
      if (!fileList) return;
      await handleUploadFiles(fileList);
    };
    window.addEventListener("dragenter", on);
    window.addEventListener("dragleave", on);
    window.addEventListener("dragover", on);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", on);
      window.removeEventListener("dragleave", on);
      window.removeEventListener("dragover", on);
      window.removeEventListener("drop", onDrop);
    };
  }, [handleUploadFiles, type, upload]);

  return (
    <>
      <button
        className={tw(
          "relative w-full pb-[100%]",
          "rounded-2xl border-2 border-dashed border-slate-300 hover:border-transparent",
          "leading-6 text-slate-900 hover:bg-black/40 hover:text-white",
          "cursor-pointer "
        )}
        onClick={() => {
          if (!inputRef.current) return;
          inputRef.current.click();
        }}
      >
        <div className="absolute flex h-full w-full flex-col items-center justify-center">
          <UploadIcon />
          Upload
          <input
            type="file"
            multiple
            className="hidden"
            ref={inputRef}
            onChange={handleInputChange}
          />
        </div>
      </button>
    </>
  );
}
