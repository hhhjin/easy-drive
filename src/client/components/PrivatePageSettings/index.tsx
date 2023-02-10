import { CheckIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";
import { useForm } from "react-hook-form";

export default function PrivatePageSettings() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ readOnlyPassword: string }>();

  const { data: hasReadOnlyPassword } = api.user.hasReadOnlyPassword.useQuery();

  const updateReadOnlyPassword = api.user.updateReadOnlyPassword.useMutation();

  const onSubmit = async () => {
    try {
      await updateReadOnlyPassword.mutateAsync({
        password: getValues("readOnlyPassword"),
      });
    } catch (e) {
      setError("readOnlyPassword", { message: "error" });
    }
  };

  return (
    <>
      <h3 className="mb-2 text-lg font-bold">Settings</h3>
      <form className="form-control w-full" onSubmit={handleSubmit(onSubmit)}>
        <label className="label">
          <span className="label-text flex items-center gap-1">
            {hasReadOnlyPassword ? "Change the password" : "Set a password"}
            <div
              className="tooltip tooltip-right"
              data-tip="Allow others to see or download your private files."
            >
              <QuestionMarkCircledIcon />
            </div>
          </span>
        </label>
        {errors.readOnlyPassword && (
          <span>{errors.readOnlyPassword.message}</span>
        )}
        <div className="input-group">
          <input
            {...register("readOnlyPassword")}
            type="password"
            placeholder="Type here"
            className={tw(
              "input-bordered input w-full",
              updateReadOnlyPassword.isSuccess && "input-success",
              errors.readOnlyPassword && "input-error"
            )}
          />
          <button
            type="submit"
            className={tw(
              "btn-square btn",
              updateReadOnlyPassword.isLoading && "loading"
            )}
          >
            {!updateReadOnlyPassword.isLoading && <CheckIcon />}
          </button>
        </div>
      </form>
    </>
  );
}
