"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/folder/Home");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight text-gray-700">
        Logo
      </h1>
      <form
        className="flex w-full max-w-96 flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <p className="flex flex-col gap-2">
          <span className="text-xl font-medium">Hey, welcome back</span>
          <span className="text-sm text-gray-700">Good to see you again!</span>
        </p>
        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="font-medium">Email address</span>
          {/* <input
            type="email"
            id="email"
            required
            placeholder="john@doe.com"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          /> */}
          <Input
            type="email"
            id="email"
            required
            placeholder="john@doe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="font-medium">Password</span>
          {/* <input
            type="password"
            id="password"
            required
            placeholder="••••••••"
            className="px-4 py-2 rounded-md border focus:border-primary outline-none duration-100"
          /> */}
          <Input
            type="password"
            id="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {/* <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Sign in
        </button> */}
        <Button type="submit">Sign in</Button>
        <div className="flex flex-col gap-4 self-start">
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
    </>
  );
}
