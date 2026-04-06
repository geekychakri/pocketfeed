"use server";

import qs from "qs";

export async function addOPMLFeeds(prevState: any, formData: FormData) {
  const results = qs.parse(Object.fromEntries(formData.entries()) as {}, {
    arrayLimit: 200,
  });

  // console.log({ results });

  console.log(results);

  // const feeds = results?.feeds
  //   .filter((item) => Boolean(item.isChecked))
  //   .map((item) => {
  //     return {
  //       feedUrl: item?.rssUrl,
  //       title: item?.title,
  //       folder: results.folder,
  //       favicon: results.favicon,
  //       siteUrl: results.siteUrl,
  //     };
  //   });

  // console.log({ feeds });

  return {
    message: "",
  };
}
