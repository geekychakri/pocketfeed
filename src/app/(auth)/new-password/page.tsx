"use client";
import React, { useState, useEffect } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const NewPasswordPage: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoaded, signIn, setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [router, isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  // If the user is already signed in,
  // redirect them to the home page
  // if (isSignedIn) {
  //   router.push("/");
  // }

  // Send the password reset code to the user's email
  async function create(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      })
      .then((_) => {
        setSuccessfulCreation(true);
        setError("");
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  // Reset the user's password.
  // Upon successful reset, the user will be
  // signed in and redirected to the home page
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    await signIn
      ?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })
      .then((result) => {
        // Check if 2FA is required
        if (result.status === "needs_second_factor") {
          setSecondFactor(true);
          setError("");
        } else if (result.status === "complete") {
          // Set the active session to
          // the newly created session (user is now signed in)
          setActive({ session: result.createdSessionId });
          setError("");
        } else {
          console.log(result);
        }
      })
      .catch((err) => {
        console.error("error", err.errors[0].longMessage);
        setError(err.errors[0].longMessage);
      });
  }

  return (
    <div className="px-4">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl">Reset Your Password</h1>
        <span className="text-text-secondary">
          Type in your email and we will send you a password reset code.
        </span>
      </div>
      <form
        className="flex flex-col gap-5"
        onSubmit={!successfulCreation ? create : reset}
      >
        {!successfulCreation && (
          <>
            <span className="flex flex-col gap-2">
              <label htmlFor="email">Please provide your email address</label>
              <Input
                id="email"
                type="email"
                placeholder="e.g john@doe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </span>

            <Button>Send Password Reset Code</Button>
            <span className="flex gap-1">
              <span className="text-text-secondary">
                Already have an account?
              </span>
              <Link href="/signin" className="custom-underline">
                Sign in
              </Link>
            </span>
            {error && <p>{error}</p>}
          </>
        )}

        {successfulCreation && (
          <>
            <label htmlFor="password">Enter your new password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label htmlFor="password">
              Enter the password reset code that was sent to your email
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <button>Reset</button>
            {error && <p>{error}</p>}
          </>
        )}

        {secondFactor && (
          <p>2FA is required, but this UI does not handle that</p>
        )}
      </form>
    </div>
  );
};

export default NewPasswordPage;
