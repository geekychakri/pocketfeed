import { Suspense } from "react";
import Link from "next/link";

import { currentUser } from "@clerk/nextjs/server";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { decode } from "html-entities";

import LoadingUI from "@/components/loading-ui";
import Button from "@/components/ui/custom-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/user-avatar";

import { getAllRecords } from "@/lib/atproto/queries";
import { getInitials } from "@/lib/utils";

// import { getXataClient } from "@/xata";

import SubscriptionList from "./subscription-list";

// const xata = getXataClient();

export default async function SubscriptionPage(props: {
  params: Promise<any>;
}) {
  // return "Subscriptions";
  // const params = await props.params;
  // const username = params.username;
  // // const user = await currentUser();
  // // console.log({ user });
  // const feeds = await xata.db.feeds.filter({ username }).getAll();
  // console.log(feeds);

  const records = await getAllRecords();

  return <SubscriptionList records={records} />;
}
