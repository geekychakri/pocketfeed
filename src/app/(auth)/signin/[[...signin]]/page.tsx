"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";

import { useSignIn } from "@clerk/nextjs";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SpinnerRotate } from "@/components/SpinnerRotate";

import SocialOauth from "@/components/SocialOauth";
import Divider from "../../components/divider";

import useSound from "use-sound";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const [playCaution] = useSound("sounds/caution.wav");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoginLoading(true);

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
        toast.error(JSON.stringify(signInAttempt, null, 2));
        setLoginLoading(false);
        playCaution();
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
      toast.error(err.errors[0].message);
      playCaution();
      setLoginLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* <h1 className="text-center text-2xl font-medium tracking-tight text-gray-700">
          Logo
        </h1> */}
        <p className="flex flex-col gap-2">
          <span className="text-xl font-medium">Hey, welcome back</span>
          <span className="text-text-secondary text-sm">
            Good to see you again!
          </span>
        </p>
      </div>
      <SocialOauth />
      <Divider text="or continue using email" />
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="font-medium">Email address</span>
          <Input
            type="email"
            id="email"
            required
            placeholder="john@doe.com"
            name="email"

            // value={email}
            // onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium">
            Password
          </label>

          <div className="border-shadow focus-within:outline-brand-primary flex items-center rounded-md focus-within:outline-[0.375rem] focus-within:outline-double">
            <Input
              className="flex-1 border-none shadow-none! outline-none forced-colors:rounded-tr-none forced-colors:rounded-br-none"
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="••••••••"
              name="password"
              autoComplete="current-password"
            />

            <Button
              type="button"
              className="rounded-none rounded-tr-md rounded-br-md p-4"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-pressed={showPassword}
            >
              <span className="sr-only">Show Password</span>
              {showPassword ? (
                <EyeOpenIcon aria-hidden={true} />
              ) : (
                <EyeClosedIcon aria-hidden={true} />
              )}
            </Button>
          </div>
          <div className="sr-only" aria-live="assertive">
            {showPassword
              ? "Your password is shown!"
              : "Your password is hidden!"}
          </div>
        </div>
        {/* <button className="bg-primary font-medium text-white px-4 py-2 rounded-md">
          Sign in
        </button> */}
        <Button type="submit" className="flex items-center justify-center">
          {loginLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerRotate />
              <span>Signing In...</span>
            </span>
          ) : (
            "Sign In"
          )}
        </Button>
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
