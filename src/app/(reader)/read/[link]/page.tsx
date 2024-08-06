import { ExtractArticle } from "@/lib/extract-article";
import Article from "@/components/Article";

export default async function Read({ params }: { params: { link: string } }) {
  const article = await ExtractArticle(decodeURIComponent(params.link));
  console.log(article);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-28">
      <h1 className="text-xl font-semibold">{article?.title}</h1>
      <Article content={article?.content as string} />
    </main>
  );
}
