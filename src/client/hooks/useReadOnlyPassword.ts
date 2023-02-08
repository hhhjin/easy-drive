import { api } from "@client/utils/api";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

const readOnlyPasswordAtom = atom<string | undefined>(undefined);

export const useReadOnlyPassword = () => {
  const [readOnlyPassword, setReadOnlyPassword] = useAtom(readOnlyPasswordAtom);

  const verify = api.user.verifyReadOnlyPassword.useMutation();

  const verifyReadOnlyPassword = useCallback(
    async (username: string, password: string) => {
      await verify.mutateAsync({ username, password });
      setReadOnlyPassword(password);
    },
    [setReadOnlyPassword, verify]
  );

  return {
    readOnlyPassword,
    isLoading: verify.isLoading,
    verifyReadOnlyPassword,
  };
};
