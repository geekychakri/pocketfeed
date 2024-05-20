import Link from "next/link";

export default function Join() {
  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight">Logo</h1>
      <form className="flex flex-col gap-6 max-w-96 w-full">
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
        <label htmlFor="username" className="flex flex-col gap-2">
          <span className="font-medium">Username</span>
          <input
            type="text"
            id="username"
            required
            placeholder="johndoe"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="font-medium">Password (8+ chars)</span>
          <input
            type="password"
            id="password"
            required
            placeholder="••••••••"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          />
        </label>
        <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Create a free account
        </button>
        <span className="flex gap-1">
          <span>Already have an account?</span>
          <Link href="/signin" className="custom-underline">
            Sign in
          </Link>
        </span>
      </form>
    </>
  );
}
