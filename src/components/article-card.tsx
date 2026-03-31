import Link from "next/link";
import type { ArticleMeta } from "@/lib/content";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/${article.slug}`}
      className="block border border-gray-200 rounded-lg p-6 hover:border-gray-400 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-1">{article.title}</h2>
      <p className="text-gray-600 text-sm mb-2">{article.description}</p>
      <time className="text-xs text-gray-400" dateTime={article.date}>
        {new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </time>
    </Link>
  );
}
