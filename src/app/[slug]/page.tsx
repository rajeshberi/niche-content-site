import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="prose prose-gray max-w-none">
      <header className="mb-8 not-prose">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <p className="text-gray-600">{article.description}</p>
        <time className="text-sm text-gray-400" dateTime={article.date}>
          {new Date(article.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
    </article>
  );
}
