import { addFeedNeonAction } from "../actions/neon-add-test";

export default function NeonTest() {
  // const feeds = await db.selectFrom("feeds").selectAll().execute();
  // console.log("All feeds:", feeds);
  // const { getToken, userId } = await auth();
  // const authToken = await getToken();
  // console.log({ authToken });
  // // console.log({ userId });

  // const { payload } = await jwtVerify(
  //   authToken as string,
  //   createRemoteJWKSet(jwkURL),
  // );
  // const claims = JSON.stringify(payload);
  // console.log({ claims });

  return (
    // <form action={addFeedNeonAction}>
    //   <input type="text" name="feed_id" placeholder="feed id" />
    //   <input type="text" name="username" placeholder="username" />
    //   <input type="text" name="site_url" placeholder="site_url" />
    //   <input type="text" name="rss_url" placeholder="rss_url" />
    //   <input type="text" name="title" placeholder="title" />
    //   <input type="text" name="favicon" placeholder="favicon" />
    //   <input type="text" name="foldername" placeholder="foldername" />
    //   <button>Submit</button>
    // </form>
    <form action={addFeedNeonAction}>
      <button>Submit todo form</button>
    </form>
  );
}
