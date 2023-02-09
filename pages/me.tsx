import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { api } from "@client/utils/api";

export default function MePage() {
  const [errorMsg, setErrorMsg] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { data: session, status } = useSession();

  const createUsername = api.user.createUsername.useMutation();

  const handleCreateClick = async () => {
    if (inputRef.current === null) return;

    const username = inputRef.current.value;

    try {
      await createUsername.mutateAsync({ username });
      await router.replace(`/${username}`);
    } catch (e) {
      setErrorMsg("todo");
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
            register your user name.
          </p>
        </div>
        <div className="card w-full max-w-lg flex-shrink-0 bg-base-100 shadow-2xl">
          <div className="card-body">
            {errorMsg ? (
              <div className="alert alert-error shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 flex-shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              </div>
            ) : null}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  You can access your files with this url
                </span>
              </label>
              <label className="input-group">
                <span className="">https://easy-drive.io/</span>
                <input
                  ref={inputRef}
                  placeholder="username"
                  spellCheck={false}
                  className="input-bordered input flex-1"
                />
              </label>
            </div>
            <div className="form-control mt-6">
              <button
                className={`btn-primary btn ${
                  createUsername.isLoading ? "loading" : ""
                }`}
                onClick={handleCreateClick}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
