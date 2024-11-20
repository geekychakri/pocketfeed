"use client";

import { useRef, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  EyeClosedIcon,
  EyeOpenIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";

import InputOTP from "@/components/InputOTP";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SpinnerRotate } from "@/components/SpinnerRotate";
import { useNavigatorOnline } from "@/hooks/useNavigatorOnline";

import { createUser } from "@/app/actions";
import SocialOauth from "@/components/SocialOauth";

export default function Join() {
  const { isLoaded, signUp, setActive } = useSignUp();
  // const [emailAddress, setEmailAddress] = useState("");
  // const [password, setPassword] = useState("");
  // const [username, setUsername] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [codeVerify, setCodeVerify] = useState(false);

  const [code, setCode] = useState("");
  const { isOffline } = useNavigatorOnline();
  const router = useRouter();

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
      toast.error(err.errors[0].longMessage);
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <div>Logo</div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-medium">Please check your email.</h1>
          <p>We’ve sent a code to {emailInputRef.current?.value}</p>
        </div>

        <form onSubmit={handleVerify} className="flex w-full flex-col gap-5">
          <InputOTP onInputOTPChange={(val) => setCode(val)} />
          <Button className="h-12">
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
      <SocialOauth />
      <div>or</div>
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
            // value={username}
            // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            //   setUsername(e.target.value)
            // }
          />
        </label>
        <label htmlFor="password" className="group flex flex-col gap-2">
          <span className="font-medium">Password (8+ chars)</span>
          <span className="flex items-center rounded-md border duration-150 focus-within:shadow-[0_0_0_2px_#fcfcfc,0_0_0_4px_#f84f39] group-hover:border-primary">
            <Input
              className="flex-1 border-none p-2 focus-visible:shadow-none"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              id="password"
              required
              placeholder="••••••••"
              name="password"
              // value={password}
              // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              //   setPassword(e.target.value)
              // }
            />
            <button
              type="button"
              className="p-2"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </span>
        </label>
        <Button type="submit">
          {signUpLoading ? (
            <span className="flex items-center gap-2">
              <SpinnerRotate />
              <span>Creating...</span>
            </span>
          ) : (
            "Create a free account"
          )}
        </Button>
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
