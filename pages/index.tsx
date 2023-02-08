import { signIn } from "next-auth/react";

export default function HomePage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Easy Drive</h1>
          <p className="py-6">Access your files with a easy-to-remember url.</p>
          <button
            className="btn-primary btn"
            onClick={async () => {
              await signIn("google", { callbackUrl: "/me" });
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
