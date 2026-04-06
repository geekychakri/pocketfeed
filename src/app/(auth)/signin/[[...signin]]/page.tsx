"use client";

import { useState } from "react";
// import SocialOauth from "@/components/SocialOauth";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useSignIn } from "@clerk/nextjs";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
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

import Divider from "../../components/divider";

export default function SignIn() {
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
      if (err.errors[0].message === "Session already exists") {
        return router.push("/folder/Home");
      }
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
      {/*<Divider text="or continue using email" />*/}
    </>
  );
}
