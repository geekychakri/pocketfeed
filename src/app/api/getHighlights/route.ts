// import { auth } from "@clerk/nextjs/server";

// import { getXataClient } from "@/xata";

// const xata = getXataClient();

// export async function GET(req: Request) {
//   const userId = (await auth()).userId as string;

//   const { searchParams } = new URL(req.url);
//   //   const articleId = searchParams.get("articleId") as string;

//   //   console.log({ articleId });
//   const articleId = "https://tonsky.me/blog/needy-programs/";

//   const data = await xata.db.highlights.filter({ userId, articleId }).getAll();

//   console.log({ data });

//   const highlights = data.map((item) => ({
//     text: item.highlightText,
//     startOffset: 0,
//     endOffset: item.highlightText?.length,
//   }));

//   console.log({ highlights });

//   return Response.json({ highlights }, { status: 200 });
// }
