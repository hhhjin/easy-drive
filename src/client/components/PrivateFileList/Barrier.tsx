import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { TRPCClientError } from "@trpc/client";

import { useReadOnlyPassword } from "@client/hooks/useReadOnlyPassword";
import { tw } from "@client/utils/styles";
import Input from "@client/components/ui/Input";

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
      if (e instanceof TRPCClientError) {
        setError("readOnlyPassword", { message: e.message });
      }
    }
  };

  return (
    <div>
      <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 text-lg font-semibold">Read Only Password</div>
        <Input
          {...register("readOnlyPassword", { required: true })}
          type="password"
          placeholder="Enter a password"
          button={
            <button className={tw("btn", isLoading && "loading")}>
              {!isLoading && <ArrowRightIcon className="h-6 w-6" />}
            </button>
          }
          errorMsg={errors.readOnlyPassword?.message}
        />
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
