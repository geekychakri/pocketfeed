import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="flex justify-between px-6 py-4 font-medium">
      <div>Pocket Feed</div>
      <div className="flex gap-6">
        <Link
          href="signin"
          className="border px-4 py-2 w-24 text-center rounded-lg cursor-pointer"
        >
          Sign in
        </Link>
        <Link
          href="/join"
          className="border px-4 py-2 w-24 text-center rounded-lg cursor-pointer bg-primary text-white"
        >
          Join
        </Link>
      </div>
    </nav>
  );
}
