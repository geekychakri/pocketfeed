import { getXataClient } from "@/xata";
import { currentUser } from "@clerk/nextjs/server";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/UserAvatar";

import { getInitials } from "@/lib/utils";
import Link from "next/link";

import { decode } from "html-entities";

import * as Checkbox from "@radix-ui/react-checkbox";

import { CheckIcon, TrashIcon } from "@radix-ui/react-icons";

import Button from "@/components/ui/Button";
import SubscriptionList from "./subscription-list";

import { Suspense } from "react";
import LoadingUI from "@/components/loading-ui";

const xata = getXataClient();

export default async function SubscriptionPage(props: {
  params: Promise<any>;
}) {
  const params = await props.params;
  const username = params.username;
  // const user = await currentUser();
  // console.log({ user });
  const feeds = await xata.db.feeds.filter({ username }).getAll();
  console.log(feeds);

  return <SubscriptionList feeds={JSON.parse(JSON.stringify(feeds))} />;
}
