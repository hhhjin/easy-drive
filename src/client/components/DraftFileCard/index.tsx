import { tw } from "@client/utils/styles";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface Props {
  file: {
    id: string;
    name: string;
    size: number;
    status: string;
  };
}

export default function FileUploadingCard({ file }: Props) {
  const status = file.status;

  return (
    <div
      style={{ paddingBottom: "100%" }}
      className="card overflow-hidden bg-base-100 shadow-xl"
    >
      <div className="card-body absolute h-full w-full items-center justify-center">
        <h2 className="card-title">{file.name}</h2>
        <div
          className={tw(
            "absolute flex h-full w-full flex-col items-center justify-center gap-4",
            (status === "loading" || status === "error") && "bg-black/40"
          )}
        >
          {status === "loading" && (
            <div className="loading btn-ghost btn text-base-100" />
          )}
          {status === "error" && (
            <button className="btn-ghost btn text-red-400">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
