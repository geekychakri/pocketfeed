"use server";

import { $Typed, ComAtprotoRepoApplyWrites } from "@atproto/api";
import {
  Create,
  Delete,
  Update,
} from "@atproto/api/dist/client/types/com/atproto/repo/applyWrites";
import { TID } from "@atproto/common";

import { getSessionAgent } from "@/lib/auth/session";

export async function addRecord() {
  console.log("POSTING");
  const agent = await getSessionAgent();
  //   const record = {
  //     $type: "xyz.statusphere.status",
  //     status: "hello-from-pocket-feed",
  //     createdAt: new Date().toISOString(),
  //   };

  const updatedRecord = {
    $type: "xyz.statusphere.status",
    status: "update-from-pocket-feed",
    createdAt: new Date().toISOString(),
  };

  const bulkRecords = [
    {
      $type: "com.atproto.repo.applyWrites#create" as const,
      collection: "xyz.pocketfeed.status",
      value: {
        status: "hello-from-pocket-feed-1",
        createdAt: new Date().toISOString(),
      },
    },
    {
      $type: "com.atproto.repo.applyWrites#create" as const,
      collection: "xyz.pocketfeed.status",
      value: {
        status: "hello-from-pocket-feed-2",
        createdAt: new Date().toISOString(),
      },
    },
    {
      $type: "com.atproto.repo.applyWrites#create" as const,
      collection: "xyz.pocketfeed.status",
      value: {
        status: "hello-from-pocket-feed-3",
        createdAt: new Date().toISOString(),
      },
    },
  ];

  //list records
  //   const res = await agent?.com.atproto.repo.listRecords({
  //     repo: agent.assertDid,
  //     collection: "xyz.pocketfeed.status",
  //   });

  //get a single record

  const res = await agent?.com.atproto.repo.getRecord({
    repo: agent.assertDid,
    collection: "xyz.pocketfeed.status",
    rkey: "3mdmp3qch2b2n",
  });

  // Insert bulk records or transactions
  //   const response = await agent?.com.atproto.repo.applyWrites({
  //     repo: agent.assertDid,
  //     writes: [...bulkRecords],
  //   });

  // Insert a single record
  //   const res = await agent?.com.atproto.repo.putRecord({
  //     repo: agent.assertDid,
  //     collection: "xyz.pocketfeed.status",
  //     rkey: TID.nextStr(),
  //     record,
  //     validate: false,
  //   });

  // update record
  //   const res = await agent?.com.atproto.repo.putRecord({
  //     repo: agent.assertDid,
  //     collection: "xyz.pocketfeed.status",
  //     rkey: "3mdkq7b4jds2u",
  //     record: updatedRecord,
  //     validate: false,
  //   });

  // delete record
  //   const res = await agent?.com.atproto.repo.deleteRecord({
  //     repo: agent.assertDid,
  //     collection: "xyz.pocketfeed.status",
  //     rkey: "3mdkq7b4jds2u",
  //   });

  console.log("Posted", res?.data);
}
