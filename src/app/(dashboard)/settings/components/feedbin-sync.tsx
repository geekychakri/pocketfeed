"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

import { SpinnerRotate } from "@/components/spinner-rotate";
import CustomButton from "@/components/ui/custom-button";
import Input from "@/components/ui/custom-input";

import { disconnectFeedbin } from "@/app/actions/disconnect-feedbin";
import { saveFeedbinCreds } from "@/app/actions/save-feedbin-creds";
import { fetcher, internalErrorToast } from "@/lib/utils";
import { useFeedPanel } from "@/store/feed-panel";

type ActionStateType = {
  type: string;
  message: string;
  feedbinEmail: string;
  errors?: {
    feedbinEmail?: string[];
    feedbinPassword?: string[];
  };
  formData?: FormData;
  userDid?: string;
};

const initialState: ActionStateType = {
  type: "",
  message: "",
  feedbinEmail: "",
};

type SWRDataType = {
  hasFeedbinAccount: boolean;
  feedbinEmail: string;
};

export default function FeedbinSync() {
  return (
    <div className="border-dashed-b flex flex-col gap-4 p-4">
      <h2 className="text-brand-primary font-medium">Feedbin Sync</h2>
      <p className="text-text-secondary flex flex-col gap-1">
        <span>Connect your Feedbin account to sync your subscriptions.</span>
        <span className="text-sm font-medium">
          <span className="text-brand-primary">Note:</span> Feedbin uses HTTP
          Basic authentication. Your credentials are securely encrypted, used
          only for authentication, and never shared with third parties.
        </span>
      </p>
      <FeedbinSyncForm />
    </div>
  );
}

const FeedbinSyncForm = () => {
  const [state, dispatch, isPending] = useActionState(
    saveFeedbinCreds,
    initialState,
  );

  const setFeedPanelName = useFeedPanel((state) => state.setFeedPanelName);

  const [showPassword, setShowPassword] = useState(false);

  const { mutate: globalMutate } = useSWRConfig();

  const { data, isLoading, error, mutate } = useSWR<SWRDataType>(
    "/api/check-feedbin-connect",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times.
        if (retryCount >= 3) return;
      },
    },
  );

  const shouldReset = useRef(false);

  useEffect(() => {
    if (state.type === "success") {
      shouldReset.current = true;
      mutate(
        {
          hasFeedbinAccount: true,
          feedbinEmail: state.feedbinEmail,
        },
        {
          revalidate: false,
        },
      );
      globalMutate(`/api/get-user-feeds?did=${state.userDid}`);
      setFeedPanelName("feedbin");
    } else if (state.type === "error") {
      shouldReset.current = true;
      toast.warning(state.message, {
        id: "error",
      });
    } else if (state.type === "internal-error") {
      shouldReset.current = true;
      internalErrorToast(state.message);
    }
  }, [state, mutate, globalMutate, setFeedPanelName]);

  useLayoutEffect(() => {
    return () => {
      if (shouldReset.current) {
        shouldReset.current = false;
        startTransition(() => {
          dispatch(null);
        });
      }
    };
  }, [dispatch]);

  if (error) {
    return <p className="text-danger font-medium">Something went wrong!</p>;
  }

  if (isLoading) {
    return (
      <p className="animate-pulse font-medium">
        Checking feedbin connection...
      </p>
    );
  }

  return (
    <>
      {data?.hasFeedbinAccount ? (
        <DisconnectFeedbin feedbinEmail={data.feedbinEmail} />
      ) : (
        <form
          action={(formData) => dispatch(formData)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="feedbin-email" className="text-sm font-medium">
              Feedbin Email
            </label>
            <Input
              type="email"
              id="feedbin-email"
              name="feedbin-email"
              placeholder="Your Feedbin Email"
              defaultValue={
                (state.formData?.get("feedbin-email") || "") as string
              }
              required
            />
            {state.errors?.feedbinEmail && (
              <p className="text-danger text-sm">
                {state.errors.feedbinEmail[0]}
              </p>
            )}
          </div>

          <label
            htmlFor="feedbin-password"
            className="flex flex-col gap-2 text-sm font-medium"
          >
            Feedbin Password
            <div className="border-shadow focus-within:outline-brand-primary flex items-center rounded-md outline-offset-2 focus-within:outline-2">
              <Input
                id="feedbin-password"
                type={showPassword ? "text" : "password"}
                name="feedbin-password"
                placeholder="Your Feedbin Password"
                className="h-11 flex-1 border-none! px-4 font-normal outline-none!"
                defaultValue={
                  (state.formData?.get("feedbin-password") || "") as string
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prevState) => !prevState)}
                className="text-text-secondary border-dashed-l h-11 w-18 cursor-pointer content-center px-2 text-sm font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {state.errors?.feedbinPassword && (
              <p className="text-danger text-sm">
                {state.errors.feedbinPassword[0]}
              </p>
            )}
          </label>

          <CustomButton
            type="submit"
            className="flex items-center justify-center gap-1"
          >
            Connect {isPending && <SpinnerRotate />}
          </CustomButton>
        </form>
      )}
    </>
  );
};

const DisconnectFeedbin = ({ feedbinEmail }: { feedbinEmail: string }) => {
  const { mutate: globalMutate } = useSWRConfig();
  const [isPending, startTransition] = useTransition();

  const handleFeedbinDisconnect = async () => {
    startTransition(async () => {
      const { type, message, userDid } = await disconnectFeedbin();
      if (type === "success") {
        globalMutate(
          "/api/check-feedbin-connect",
          (prevData) => {
            return {
              ...prevData,
              hasFeedbinAccount: false,
            };
          },
          {
            revalidate: false,
          },
        );
        globalMutate(`/api/get-user-feeds?did=${userDid}`);
        toast.success("Feedbin disconnected.");
      } else {
        internalErrorToast(message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border-dashed p-3">
      <h3 className="flex items-center gap-1">
        <span>Connected to Feedbin</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 256 256"
        >
          <path
            fill="#3bb143"
            d="M240.49 15.51a12 12 0 0 0-17 0l-49.55 49.58l-2.54-2.55a36.05 36.05 0 0 0-50.91 0L100 83l-3.51-3.52a12 12 0 0 0-17 17L83 100l-20.46 20.49a36 36 0 0 0 0 50.91l2.55 2.54l-49.58 49.57a12 12 0 0 0 17 17l49.57-49.58l2.54 2.55a36.06 36.06 0 0 0 50.91 0L156 173l3.51 3.52a12 12 0 0 0 17-17L173 156l20.49-20.49a36 36 0 0 0 0-50.91l-2.55-2.54l49.58-49.57a12 12 0 0 0-.03-16.98m-121.95 161a12 12 0 0 1-17 0l-22.03-22.08a12 12 0 0 1 0-17L100 117l39 39Zm58-57.95L156 139l-39-39l20.49-20.49a12 12 0 0 1 17 0l22.06 22.06a12 12 0 0 1 0 17ZM85.27 33.37a12 12 0 0 1 21.46-10.74l8 16a12 12 0 1 1-21.46 10.74Zm-68 57.26a12 12 0 0 1 16.1-5.36l16 8a12 12 0 1 1-10.74 21.46l-16-8a12 12 0 0 1-5.36-16.1m221.46 74.74a12 12 0 0 1-16.1 5.36l-16-8a12 12 0 0 1 10.74-21.46l16 8a12 12 0 0 1 5.36 16.1m-68 57.26a12 12 0 1 1-21.46 10.74l-8-16a12 12 0 0 1 21.46-10.74Z"
          />
        </svg>
      </h3>
      {feedbinEmail && <p className="text-sm font-medium">{feedbinEmail}</p>}

      <CustomButton
        className="flex items-center justify-center gap-1"
        onClick={handleFeedbinDisconnect}
      >
        Disconnect {isPending && <SpinnerRotate />}
      </CustomButton>
    </div>
  );
};
