"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSignUp } from "@clerk/nextjs";
import {
  EyeClosedIcon,
  EyeOpenIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { toast } from "sonner";
import useSound from "use-sound";

// const SocialOauth = dynamic(() => import("@/components/social-oauth"), {
//   ssr: false,
//   loading: () => (
//     <div className="flex h-28 items-center justify-center">
//       {/* <SpinnerRotate /> */}
//     </div>
//   ),
// });

import SocialOauth from "@/components/social-oauth";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";
import Input from "@/components/ui/custom-input";

import { createUser } from "@/app/actions";
import { useNavigatorOnline } from "@/hooks/useNavigatorOnline";

import Divider from "../../components/divider";

export default function Join() {
  const { isLoaded, signUp, setActive } = useSignUp();
  // const [emailAddress, setEmailAddress] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationExpiredError, setIsVerificationExpiredError] =
    useState(false);
  const [email, setEmail] = useState("");

  const [codeVerify, setCodeVerify] = useState(false);

  const [code, setCode] = useState("");
  const { isOffline } = useNavigatorOnline();
  const router = useRouter();

  const [playCaution] = useSound("sounds/caution.wav");

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  // console.log({ code });

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const emailAddress = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (isOffline) {
      toast.error("You're offline!");
      return;
    }

    setSignUpLoading(true);
    setEmail(emailAddress);

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
      toast.error(err.errors[0].message);
      setSignUpLoading(false);
      playCaution();
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCodeVerify(true);

    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/folder/Home");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(completeSignUp, null, 2));
        setCodeVerify(false);
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setCodeVerify(false);
      console.error("Error:", JSON.stringify(err, null, 2));
      playCaution();

      //handle verification expired
      if (err.errors[0].code === "verification_expired") {
        setIsVerificationExpiredError(true);
      }
      toast.error(err.errors[0].longMessage, {
        onAutoClose: () => {
          if (err.errors[0].code === "verification_expired") {
            setVerifying(false);
            setIsVerificationExpiredError(false);
          }
        },
        onDismiss: () => {
          if (err.errors[0].code === "verification_expired") {
            setVerifying(false);
            setIsVerificationExpiredError(false);
          }
        },
      });
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-medium">Please check your email.</h1>
          <p className="text-text-secondary">
            <span>We’ve sent a code to</span>
            &nbsp;
            <span className="text-text-primary">{email}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="flex w-full flex-col gap-5">
          {/* <InputOTP onInputOTPChange={(val) => setCode(val)} /> */}
          <div className="flex flex-col gap-2">
            <label htmlFor="verification-code">Verification code</label>
            <Input
              id="verification-code"
              onChange={(e) => setCode(e.target.value)}
              placeholder="6 digit code"
              maxLength={6}
              minLength={6}
              required
              disabled={isVerificationExpiredError || codeVerify}
            />
          </div>
          <Button
            className={`border-shadow bg-cta text-background-primary hover:bg-cta-hover flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={isVerificationExpiredError || codeVerify}
          >
            {codeVerify ? (
              <span className="flex items-center gap-2">
                <SpinnerRotate />
                <span>Verifying...</span>
              </span>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-xl">Sign up</h1>
      <SocialOauth />
      <Divider text="or continue using email" />

      <form
        className="flex w-full max-w-96 flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col gap-2">
          <span className="font-medium">Email address</span>
          <Input
            type="email"
            id="email"
            required
            placeholder="john@doe.com"
            name="email"
            ref={emailInputRef}
            // className="border-shadow"
            // value={emailAddress}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setEmailAddress(e.target.value)
            // }
          />
        </label>
        <label htmlFor="username" className="flex flex-col gap-2">
          <span className="font-medium">Username</span>
          <Input
            type="text"
            id="username"
            required
            placeholder="johndoe"
            name="username"
            // className="border-shadow"
            // value={username}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setUsername(e.target.value)
            // }
          />
        </label>
        {/* <label htmlFor="password" className="flex flex-col gap-2">
          <span className="font-medium">Password</span>
          <span className="border-shadow focus-within:outline-brand-primary flex items-center rounded-md focus-within:outline-[0.375rem] focus-within:outline-double">
            <Input
              className="flex-1 rounded-md border-none shadow-none! outline-none"
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="••••••••"
              name="password"
            />

            <button
              type="button"
              className="p-4"
              onClick={() => setShowPassword((prev) => !prev)}
              // aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              <span className="sr-only">Show Password</span>
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </span>
        </label> */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium">
            Password
          </label>

          <div className="border-shadow focus-within:outline-brand-primary flex items-center rounded-md focus-within:outline-2">
            <Input
              className="flex-1 border-none shadow-none! outline-none forced-colors:rounded-tr-none forced-colors:rounded-br-none"
              type={showPassword ? "text" : "password"}
              id="password"
              required
              placeholder="••••••••"
              name="password"
              autoComplete="new-password"
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

        <div id="clerk-captcha" data-cl-size="flexible"></div>
        <Button
          type="submit"
          className="bg-cta text-background-primary hover:bg-cta-hover flex items-center justify-center"
        >
          {signUpLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerRotate />
              <span>Creating</span>
            </span>
          ) : (
            "Create a free account"
          )}
        </Button>
        <span className="flex gap-1">
          <span>Already have an account?</span>
          <Link href="/signin" className="custom-underline font-medium">
            Sign in
          </Link>
        </span>
      </form>
    </>
  );
}
