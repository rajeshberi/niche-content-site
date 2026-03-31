import { getAllArticles } from "@/lib/content";
import { ArticleCard } from "@/components/article-card";

export default function Home() {
  const articles = getAllArticles();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Latest Articles</h1>
      <p className="text-gray-600 mb-8">
        Expert guides and in-depth articles on topics that matter.
      </p>
      {articles.length === 0 ? (
        <p className="text-gray-500">No articles yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
