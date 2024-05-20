import { extract } from "@extractus/article-extractor";

export async function ExtractArticle(url: string) {
  const article = await extract(url);
  return article;
}
