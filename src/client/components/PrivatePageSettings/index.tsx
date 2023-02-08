import { useRef } from "react";
import { CheckIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";

export default function PrivatePageSettings() {
  const passwordRef = useRef<HTMLInputElement>(null);

  const { data: hasReadOnlyPassword } = api.user.hasReadOnlyPassword.useQuery();

  const updatePassword = api.user.updateReadOnlyPassword.useMutation();

  return (
    <>
      <h3 className="mb-2 text-lg font-bold">Settings</h3>
      <form
        className="form-control w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!passwordRef.current) return;
          await updatePassword.mutateAsync({
            password: passwordRef.current.value,
          });
        }}
      >
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
        <div className="input-group">
          <input
            type="password"
            placeholder="Type here"
            className={tw(
              "input-bordered input w-full",
              updatePassword.isSuccess && "input-success",
              updatePassword.isError && "input-error"
            )}
            ref={passwordRef}
          />
          <button
            type="submit"
            className={tw(
              "btn-square btn",
              updatePassword.isLoading && "loading"
            )}
          >
            {!updatePassword.isLoading && <CheckIcon />}
          </button>
        </div>
      </form>
    </>
  );
}
