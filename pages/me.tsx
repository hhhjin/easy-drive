import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { api } from "@client/utils/api";
import { tw } from "@client/utils/styles";

export default function MePage() {
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<{ username: string }>();

  const router = useRouter();

  const { data: session, status } = useSession();

  const createUsername = api.user.createUsername.useMutation();

  const onSubmit = async () => {
    const username = getValues("username");

    try {
      await createUsername.mutateAsync({ username });
      await router.replace(`/${username}`);
    } catch (e) {
      setError("username", { type: "invalid", message: "error" });
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/").catch(console.log);

    if (session?.user?.username)
      router.replace(session.user.username).catch(console.log);
  }, [router, session, status]);

  if (status === "loading") return <div className="min-h-screen bg-base-200" />;

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
              {errors.username ? (
                <div className="alert alert-error shadow-lg">
                  <span>{errors.username.message}</span>
                </div>
              ) : null}
              <label className="label">
                <span className="label-text">
                  You can access your files with this url
                </span>
              </label>
              <label className="input-group">
                <span className="">https://easy-drive.io/</span>
                <input
                  {...register("username")}
                  placeholder="username"
                  spellCheck={false}
                  className="input-bordered input flex-1"
                />
              </label>
              <button
                type="submit"
                className={tw(
                  "btn-primary btn mt-6",
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
