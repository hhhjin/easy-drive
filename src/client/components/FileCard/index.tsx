import { useRef, useState } from "react";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";
import { useReadOnlyPassword } from "@client/hooks/useReadOnlyPassword";

interface Props {
  file: {
    id: string;
    name: string;
    size: number;
    isPrivate: boolean;
  };
  isMine: boolean;
}

export default function FileCard({ file, isMine }: Props) {
  const [isHover, setIsHover] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const { readOnlyPassword } = useReadOnlyPassword();

  const apiCtx = api.useContext();
  const getDownloadUrl = api.file.getDownloadUrl.useMutation();
  const deleteFile = api.file.delete.useMutation();

  const handleDownloadClick = async () => {
    const a = downloadLinkRef.current;
    if (!a) return;

    setIsDownloading(true);

    const url = await getDownloadUrl.mutateAsync({
      id: file.id,
      readOnlyPassword: isMine ? undefined : readOnlyPassword,
    });

    const res = await fetch(url, { method: "GET" });
    const blob = await res.blob();

    a.setAttribute("href", URL.createObjectURL(blob));
    a.setAttribute("download", file.name);

    a.click();

    setIsDownloading(false);
  };

  const handleDeleteClick = async () => {
    await deleteFile.mutateAsync({ id: file.id });

    if (file.isPrivate) {
      await apiCtx.file.privateList.invalidate();
    } else {
      await apiCtx.file.publicList.invalidate();
    }
  };

  return (
    <div
      style={{ paddingBottom: "100%" }}
      className="card overflow-hidden bg-base-100 shadow-xl"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="card-body absolute h-full w-full items-center justify-center">
        <h2 className="card-title">{file.name}</h2>
        {isHover && (
          <div className="absolute flex h-full w-full flex-col items-center justify-center gap-4 bg-black/40">
            <a className="hidden" ref={downloadLinkRef} />
            <button
              className={tw(
                "btn-primary btn",
                isDownloading && "loading",
                deleteFile.isLoading && "btn-disabled"
              )}
              onClick={handleDownloadClick}
            >
              Download
            </button>
            {isMine && (
              <button
                className={tw(
                  "btn-secondary btn",
                  isDownloading && "btn-disabled",
                  deleteFile.isLoading && "loading"
                )}
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
