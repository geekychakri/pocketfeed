// import { auth } from "@clerk/nextjs/server";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ action: string }> },
// ) {
//   try {
//     const followerId = (await auth()).userId as string;
//     const action = (await params).action;

//     const { followeeName } = await request.json();

//     const followeeUser = await xata.db.users
//       .filter({ username: followeeName })
//       .getFirst();

//     console.log({ action });
//     console.log({ followeeName });

//     //   return Response.json({ message: "Followed successfully" });

//     if (action === "follow") {
//       // Add a new follower relationship
//       await xata.db.follows.create({
//         followerId,
//         followeeId: followeeUser?.userId as string,
//       });
//       return Response.json({ message: "Followed successfully" });
//     } else if (action === "unfollow") {
//       // Remove the follower relationship
//       const record = await xata.db.follows
//         .filter({ followerId, followeeId: followeeUser?.userId as string })
//         .getFirst();

//       await xata.db.follows.delete(record?.id as string);

//       return Response.json({ message: "Unfollowed successfully" });
//     }
//   } catch (err) {
//     return Response.json("", { status: 500 });
//   }
// }
