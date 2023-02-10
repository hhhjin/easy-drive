import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { useReadOnlyPassword } from "@client/hooks/useReadOnlyPassword";
import { tw } from "@client/utils/styles";

interface Props {
  username: string;
}

export default function Barrier({ username }: Props) {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ readOnlyPassword: string }>();

  const { isLoading, verifyReadOnlyPassword } = useReadOnlyPassword();

  const { status } = useSession();

  const onSubmit = async () => {
    try {
      await verifyReadOnlyPassword(username, getValues("readOnlyPassword"));
    } catch (e) {
      setError("readOnlyPassword", { message: "error" });
    }
  };

  return (
    <div className="max-w-sm flex-1">
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 text-lg font-semibold">Read Only</div>
        {errors.readOnlyPassword && (
          <span>{errors.readOnlyPassword.message}</span>
        )}
        <div className="input-group">
          <input
            {...register("readOnlyPassword")}
            type="password"
            placeholder="Enter a password"
            className={tw(
              "input w-full",
              errors.readOnlyPassword && "input-error"
            )}
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
