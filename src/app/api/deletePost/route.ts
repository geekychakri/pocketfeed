// import { auth } from "@clerk/nextjs/server";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();
// export async function POST(req: Request) {
//   try {
//     const userId = (await auth()).userId;
//     if (!userId) {
//       return Response.json(
//         {
//           type: "user-error",
//           message: "You must be signed in to delete your post.",
//         },
//         { status: 401 },
//       );
//     }
//     const body = await req.json();
//     console.log(body);
//     const deletedPost = await xata.db.posts.delete(body.postId);
//     return Response.json("", { status: 200 });
//   } catch (err) {
//     return Response.json("", { status: 500 });
//   }
// }
