import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";
import { useForm } from "react-hook-form";
import Input from "@client/components/ui/Input";
import { TRPCClientError } from "@trpc/client";
import { updateReadOnlyPasswordSchema } from "@shared/validation";

export default function PrivatePageSettings() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ readOnlyPassword: string }>({
    resolver: zodResolver(updateReadOnlyPasswordSchema),
  });

  const { data: hasReadOnlyPassword } = api.user.hasReadOnlyPassword.useQuery();

  const updateReadOnlyPassword = api.user.updateReadOnlyPassword.useMutation();

  const onSubmit = async () => {
    try {
      await updateReadOnlyPassword.mutateAsync({
        readOnlyPassword: getValues("readOnlyPassword"),
      });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        setError("readOnlyPassword", { message: e.message });
      }
    }
  };

  return (
    <>
      <h3 className="mb-2 text-lg font-bold">Settings</h3>
      <form className="form-control w-full" onSubmit={handleSubmit(onSubmit)}>
        <label className="label">
          <span className="label-text flex items-center gap-1">
            {hasReadOnlyPassword
              ? "Change read-only-password"
              : "Set read-only-password"}
            <div
              className="tooltip tooltip-right"
              data-tip="Allow others to see or download your private files."
            >
              <QuestionMarkCircledIcon />
            </div>
          </span>
        </label>
        <Input
          {...register("readOnlyPassword")}
          type="password"
          placeholder="Type here"
          className={tw(
            "input-bordered w-full",
            updateReadOnlyPassword.isSuccess && "input-success"
          )}
          button={
            <button
              type="submit"
              className={tw(
                "btn-square btn",
                updateReadOnlyPassword.isLoading && "loading"
              )}
            >
              {!updateReadOnlyPassword.isLoading && <CheckIcon />}
            </button>
          }
          errorMsg={errors.readOnlyPassword?.message}
        />
      </form>
    </>
  );
}
