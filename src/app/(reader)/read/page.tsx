import { ExtractArticle } from "@/lib/extract-article";
import Article from "@/components/Article";

export default async function Read() {
  const article = await ExtractArticle(
    "https://www.asymco.com/2023/11/28/google-and-apple-the-beginning/"
  );
  console.log(article);
  return (
    <main className="flex flex-col gap-6 max-w-3xl w-full mx-auto py-28 px-4">
      <h1 className="font-semibold text-xl">{article?.title}</h1>
      <Article content={article?.content as string} />
    </main>
  );
}
