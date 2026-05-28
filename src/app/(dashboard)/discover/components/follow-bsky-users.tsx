"use client";

import {
  memo,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { toast } from "sonner";
import useSound from "use-sound";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { SpinnerRotate } from "@/components/spinner-rotate";
import Button from "@/components/ui/custom-button";

import { followBskyTribe } from "@/app/actions/follow-bsky-tribe";
import { getInitials, internalErrorToast } from "@/lib/utils";

const initialState = {
  type: "",
  message: "",
};

export default function FollowBskyUsers({ followsList }: { followsList: any }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [state, dispatch, isPending] = useActionState(
    followBskyTribe,
    initialState,
  );

  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const [playCaution] = useSound("sounds/caution.wav", {
    volume: 0.25,
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    //getting an array of all roleIds
    const userDids = followsList.map((user: { did: string }) => user.did);
    //on check of the master checkbox, return all roleIds and on uncheck, an empty array
    setSelectedIds(e.target.checked ? userDids : []);
  };

  // useEffect(() => {
  //   if (selectAllCheckboxRef.current) {
  //     if (
  //       selectedIds.length === 0 ||
  //       followsList.length === selectedIds.length
  //     ) {
  //       selectAllCheckboxRef.current.indeterminate = false;
  //       return;
  //     }

  //     if (selectedIds.length !== followsList.length) {
  //       selectAllCheckboxRef.current.indeterminate = true;
  //     }
  //   }
  // }, [selectedIds, followsList.length]);

  useEffect(() => {
    const checkbox = selectAllCheckboxRef.current;

    if (!checkbox) return;

    const allSelected = selectedIds.length === followsList.length;

    const noneSelected = selectedIds.length === 0;

    checkbox.checked = allSelected;

    checkbox.indeterminate = !allSelected && !noneSelected;
  }, [selectedIds, followsList.length]);
  const handleCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      // if (selectAllCheckboxRef.current) {
      //   selectAllCheckboxRef.current.indeterminate = true;
      // }
      const checkedId = event.target.id;
      setSelectedIds((prev) => {
        if (event.target.checked) {
          return [...prev, checkedId];
        } else {
          return prev.filter((id) => id !== checkedId);
        }
      });
    },
    [],
  );

  useEffect(() => {
    console.log({ message: state.message });
    if (state.type === "success") {
      if (selectAllCheckboxRef.current) {
        selectAllCheckboxRef.current.checked = false;
        setSelectedIds([]);
      }
      toast.success("Followed successfully!");
    } else if (state.type === "internal-error") {
      internalErrorToast(state.message);
      playCaution();
    }
  }, [state]);

  console.log({ selectedIds });

  return (
    <div className="">
      <div
        className={`bg-background-primary border-dashed-b sticky top-14 mb-5 flex h-14 items-center justify-between px-4 max-md:top-28`}
      >
        <label
          htmlFor="select-all"
          className="flex cursor-pointer items-center gap-1 select-none"
        >
          <input
            type="checkbox"
            id="select-all"
            onChange={handleSelectAll}
            ref={selectAllCheckboxRef}
            // checked={
            //   selectedIds.length === followsList.length &&
            //   followsList.length > 0
            // }
          />
          Select all
        </label>

        {selectedIds.length >= 1 && (
          <Button
            type="submit"
            form="bsky-users-form"
            className="bg-brand-primary hover:bg-brand-primary/95 flex items-center justify-center gap-1 rounded-md font-medium text-white opacity-100 transition-opacity starting:opacity-0"
          >
            Follow
            {isPending && <SpinnerRotate />}
          </Button>
        )}
      </div>
      <form
        id="bsky-users-form"
        name="bsky-users-form"
        ref={formRef}
        action={(formData) => dispatch(formData)}
        onDragStart={(e) => e.preventDefault()}
        className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 px-4 select-none"
      >
        {followsList.map(
          (
            user: {
              did: string;
              handle: string;
              displayName: string;
              avatar: string;
            },
            i: number,
          ) => {
            const isChecked = selectedIds.includes(user.did);
            return (
              <UserItem
                key={i}
                userData={user}
                isChecked={isChecked}
                index={i}
                onChange={handleCheckboxChange}
              />
            );
          },
        )}
      </form>
    </div>
  );
}

const UserItem = memo(
  ({
    userData,
    isChecked,
    onChange,
    index,
  }: {
    userData: any;
    isChecked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    index: number;
  }) => {
    console.log("feed item");
    return (
      <label
        htmlFor={userData.did}
        className="border-shadow flex cursor-pointer items-center gap-1 rounded-md p-4 select-none"
        // draggable={false}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Avatar className="hover:ring-ui-normal bg-ui-normal ring-ui-normal inline-flex size-11 flex-none cursor-pointer items-center justify-center overflow-hidden rounded-full align-middle ring-1 transition-shadow select-none hover:ring-4">
            <AvatarImage
              className="h-full w-full rounded-[inherit] object-cover"
              src={userData.avatar}
              alt={userData.displayName || userData.handle}
              draggable={false}
            />
            <AvatarFallback
              // className="bg-ui-normal flex h-full w-full items-center justify-center text-[15px] leading-1 font-medium"
              delayMs={600}
            >
              {getInitials(userData.displayName || userData.handle)}
            </AvatarFallback>
          </Avatar>

          <p>{userData.displayName}</p>
          <p className="text-text-secondary min-w-0 truncate text-sm">
            @{userData.handle}
          </p>
        </div>

        <div className="shrink-0">
          <input
            // key={i}
            type="checkbox"
            id={userData.did}
            name={`user-did`}
            defaultValue={userData.did}
            checked={isChecked}
            onChange={onChange}
          />
        </div>
      </label>
    );
  },
);

UserItem.displayName = "UserItem";
