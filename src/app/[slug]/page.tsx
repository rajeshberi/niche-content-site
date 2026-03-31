import { notFound } from "next/navigation";
import { getArticleBySlug, getAllArticles } from "@/lib/content";
import type { Metadata } from "next";

const SITE_URL = process.env.SITE_URL ?? "https://example.com";

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
    keywords: article.keyword,
    authors: article.author ? [{ name: article.author }] : undefined,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.date,
      url: `${SITE_URL}/${slug}`,
      siteName: "Content Site",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${SITE_URL}/${slug}`,
    },
  };
}

function ArticleJsonLd({ article, slug }: { article: { title: string; description: string; date: string; author?: string; keyword?: string }; slug: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    url: `${SITE_URL}/${slug}`,
    author: {
      "@type": "Person",
      name: article.author ?? "Content Site Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Content Site",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/${slug}`,
    },
    ...(article.keyword && { keywords: article.keyword }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <>
      <ArticleJsonLd article={article} slug={slug} />
      <article className="prose prose-gray max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          <p className="text-gray-600">{article.description}</p>
          <div className="flex items-center gap-4 mt-2">
            <time className="text-sm text-gray-400" dateTime={article.date}>
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {article.author && (
              <span className="text-sm text-gray-400">by {article.author}</span>
            )}
            {article.category && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {article.category}
              </span>
            )}
          </div>
        </header>
        <div dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      </article>
    </>
  );
}
