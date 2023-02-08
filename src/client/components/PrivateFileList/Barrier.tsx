import { ArrowRightIcon } from "@radix-ui/react-icons";
import { TRPCClientError } from "@trpc/client";
import { useState, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";

import { useReadOnlyPassword } from "../../hooks/useReadOnlyPassword";
import { tw } from "@client/utils/styles";

interface Props {
  username: string;
}

export default function Barrier({ username }: Props) {
  const [password, setPassword] = useState("");
  const [inputError, setInputError] = useState(false);

  const { isLoading, verifyReadOnlyPassword } = useReadOnlyPassword();

  const { status } = useSession();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await verifyReadOnlyPassword(username, password);
    } catch (e) {
      setInputError(true);
    }
  };

  return (
    <div className="max-w-sm flex-1">
      <form className="form-control" onSubmit={onSubmit}>
        <div className="mb-2 text-lg font-semibold">Download-only password</div>
        <div className="input-group">
          <input
            className={tw("input w-full", inputError && "input-error")}
            placeholder="Enter a password"
            onChange={(e) => {
              setInputError(false);
              setPassword(e.target.value);
            }}
          />
          <button className={tw("btn", isLoading && "loading")}>
            <ArrowRightIcon />
          </button>
        </div>
      </form>
      {status === "unauthenticated" && (
        <>
          <div className="divider">OR</div>
          <button
            className="btn w-full"
            onClick={() => signIn("google", { callbackUrl: `/${username}` })}
          >
            signin
          </button>
        </>
      )}
    </div>
  );
}
