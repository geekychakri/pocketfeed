"use client";

import {
  memo,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { InView } from "react-intersection-observer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";

import { followBskyTribe } from "@/app/actions/follow-bsky-tribe";
import { getInitials } from "@/lib/utils";

const initialState = {
  type: "",
  message: "",
};

export default function FollowBskyUsers({ followsList }: { followsList: any }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const [state, dispatch, isPending] = useActionState(
    followBskyTribe,
    initialState,
  );

  const selectAllCheckboxRef = useRef<HTMLInputElement | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    //getting an array of all roleIds
    const userDids = followsList.map((user) => user.did);
    //on check of the master checkbox, return all roleIds and on uncheck, an empty array
    setSelectedIds(e.target.checked ? userDids : []);
  };

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      if (
        selectedIds.length === 0 ||
        followsList.length === selectedIds.length
      ) {
        selectAllCheckboxRef.current.indeterminate = false;
        return;
      }

      if (selectedIds.length !== followsList.length) {
        selectAllCheckboxRef.current.indeterminate = true;
      }
    }
  }, [selectedIds]);

  const handleCheckboxChange = useCallback((event) => {
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
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (selectedIds.length > 150) {
    //   return toast.warning("Only 150 feeds are allowed to import.");
    // }

    // startTransition(async () => {
    //   formAction(new FormData(e.currentTarget));
    // });
    const selectedIdsSet = new Set(selectedIds);
    const selectedUsers = followsList.flatMap((user) =>
      selectedIdsSet.has(user.did)
        ? {
            did: user.did,
          }
        : [],
    );

    console.log({ selectedUsers });

    // const res = await followBskyTribe(selectedUsers);
    // console.log({ res });
  };
  console.log({ selectedIds });

  return (
    <div className="">
      <div
        className={`flex items-center px-4 justify-between mb-5 h-14 sticky top-14 max-md:top-28 bg-background-primary border-dashed-y`}
      >
        <label
          htmlFor="select-all"
          className="flex gap-1 items-center cursor-pointer select-none"
        >
          <input
            type="checkbox"
            id="select-all"
            onChange={handleSelectAll}
            ref={selectAllCheckboxRef}
            // checked={opmlFeeds.feeds.length === selectedIds.length}
          />
          Select all
        </label>

        {selectedIds.length >= 1 && (
          <button
            type="submit"
            form="bsky-users-form"
            className="bg-brand-primary opacity-100 starting:opacity-0 transition-opacity hover:bg-brand-primary/95 text-white px-4 py-2 font-medium flex items-center justify-center rounded-md cursor-pointer"
          >
            Follow
          </button>
        )}
      </div>
      <form
        id="bsky-users-form"
        // onSubmit={handleOPMLImport}
        // className="flex flex-wrap gap-5"
        name="bsky-users-form"
        // onSubmit={handleSubmit}
        ref={formRef}
        action={(formData) => dispatch(formData)}
        // onChange={updateCount}
        // className="flex flex-col"
        onDragStart={(e) => e.preventDefault()}
        className="px-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-5 select-none"
      >
        {followsList.map((user, i) => {
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
        })}
      </form>
    </div>
  );
}

const UserItem = memo(({ userData, isChecked, onChange, index }) => {
  console.log("feed item");
  return (
    <label
      htmlFor={userData.did}
      className="flex items-center gap-1 border-shadow rounded-md p-4 cursor-pointer select-none"
      // draggable={false}
    >
      <div className="flex flex-1  flex-col min-w-0 gap-2">
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
        <p className="text-text-secondary text-sm min-w-0 truncate">
          @{userData.handle}
        </p>
      </div>

      <div className="shrink-0">
        <input
          // key={i}
          type="checkbox"
          // name={name}
          // value={feed.id}
          id={userData.did}
          // value={`{did: ${userData.did}, handle: ${userData.handle}, displayName: ${userData.displayName}, avatar: ${userData.avatar}}`}
          name={`user-did`}
          defaultValue={userData.did}
          checked={isChecked}
          onChange={onChange}
        />
      </div>
    </label>
  );
});

UserItem.displayName = "UserItem";

const ActionBar = ({ children }: { children: React.ReactNode }) => {
  const [isSticky, setIsSticky] = useState(false);
  return (
    <InView
      as="div"
      threshold={1}
      onChange={(inView, entry) => {
        if (entry.intersectionRatio < 1) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }}
      className={`flex items-center px-4 justify-between mb-5 h-14 sticky top-14 max-md:top-28 bg-background-primary border-dashed-y`}
    >
      {children}
    </InView>
  );
};
