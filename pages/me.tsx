import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";
import { createUsernameSchema } from "@shared/validation";
import Input from "@client/components/ui/Input";

export default function MePage() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ username: string }>({
    resolver: zodResolver(createUsernameSchema),
  });

  const router = useRouter();

  const { data: session, status } = useSession();

  const createUsername = api.user.createUsername.useMutation();

  const onSubmit = async () => {
    const username = getValues("username");
    try {
      await createUsername.mutateAsync({ username });
      await router.replace(`/${username}`);
    } catch (e) {
      if (e instanceof TRPCClientError) {
        setError("username", { message: e.message });
      }
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/").catch(console.log);

    if (session?.user?.username)
      router.replace(session.user.username).catch(console.log);
  }, [router, session, status]);

  if (status === "loading" || session?.user?.username)
    return <div className="min-h-screen bg-base-200" />;

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Welcome!</h1>
          <p className="py-6">
            It&apos;s your first visit! To use easy-drive, you must first
            register your username.
          </p>
        </div>
        <div className="card w-full max-w-lg flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            <form className="form-control" onSubmit={handleSubmit(onSubmit)}>
              <Input
                {...register("username")}
                placeholder="username"
                className="input-bordered lowercase"
                label="Your Drive URL"
                left="https://easy-drive.io/"
                help="Username can only contain 4 to 12 characters, including (a-z), (0-9), (_), and (.)"
                errorMsg={errors.username?.message}
              />
              <button
                type="submit"
                className={tw(
                  "btn-primary btn",
                  createUsername.isLoading && "loading"
                )}
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
