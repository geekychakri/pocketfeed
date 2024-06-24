"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import InputOTP from "@/components/InputOTP";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SpinnerRotate } from "@/components/SpinnerRotate";

export default function Join() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [codeVerify, setCodeVerify] = useState(false);

  const [code, setCode] = useState("");
  const router = useRouter();

  // console.log({ code });

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;
    setCodeVerify(true);

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setCodeVerify(false);
      console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div>Logo</div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium">Please check your email.</h1>
          <p>We’ve sent a code to hi@company.com</p>
        </div>

        <form onSubmit={handleVerify} className="flex w-full flex-col gap-5">
          <InputOTP onInputOTPChange={(val) => setCode(val)} />
          <Button className="h-12">
            {codeVerify ? <SpinnerRotate /> : "Verify"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-medium tracking-tight">Logo</h1>
      <form
        className="flex w-full max-w-96 flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <label htmlFor="email" className="flex flex-col gap-2">
          <span className="font-medium">Email address</span>
          <Input
            type="email"
            id="email"
            required
            placeholder="john@doe.com"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
        </label>
        <label htmlFor="username" className="flex flex-col gap-2">
          <span className="font-medium">Username</span>
          <Input
            type="text"
            id="username"
            required
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label htmlFor="password" className="flex flex-col gap-2">
          <span className="font-medium">Password (8+ chars)</span>
          <Input
            type="password"
            id="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="rounded-md bg-primary px-4 py-2 font-medium text-white">
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
