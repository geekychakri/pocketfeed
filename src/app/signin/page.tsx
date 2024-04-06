import Link from "next/link";

export default function SignIn() {
  return (
    <main className="flex flex-col gap-8 items-center justify-center py-20">
      <h1 className="text-2xl font-medium tracking-tight text-gray-700">
        Logo
      </h1>
      <form className="flex flex-col gap-6 max-w-96 w-full">
        <p className="flex flex-col gap-2">
          <span className="text-xl font-medium">Hey, welcome back</span>
          <span className="text-sm text-gray-700">Good to see you again!</span>
        </p>
        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="font-medium">Email address</span>
          <input
            type="email"
            id="email"
            required
            placeholder="john@doe.com"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="font-medium">Password</span>
          <input
            type="password"
            id="password"
            required
            placeholder="••••••••"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Sign in
        </button>
        <div className="self-start flex flex-col gap-4">
          <Link href="/new-password" className="custom-underline self-start">
            Forgot your password?
          </Link>
          <span className="flex gap-1">
            <span>Don&apos;t have an account?</span>
            <Link href="/join" className="custom-underline">
              Join
            </Link>
          </span>
        </div>
      </form>
    </main>
  );
}
