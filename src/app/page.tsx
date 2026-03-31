import { getAllArticles } from "@/lib/content";
import { ArticleCard } from "@/components/article-card";
import { HeaderAd, FooterAd, InContentAd } from "@/components/ad-unit";

const AD_SLOTS = {
  header: process.env.NEXT_PUBLIC_AD_SLOT_HEADER ?? "",
  inContent: process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT ?? "",
  footer: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER ?? "",
};

export default function Home() {
  const articles = getAllArticles();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Latest Articles</h1>
      <p className="text-gray-600 mb-8">
        Expert guides and in-depth articles on topics that matter.
      </p>
      {AD_SLOTS.header && <HeaderAd slot={AD_SLOTS.header} />}
      {articles.length === 0 ? (
        <p className="text-gray-500">No articles yet. Check back soon!</p>
      ) : (
        <div className="grid gap-6">
          {articles.map((article, index) => (
            <div key={article.slug}>
              <ArticleCard article={article} />
              {AD_SLOTS.inContent && index === 2 && (
                <InContentAd slot={AD_SLOTS.inContent} />
              )}
            </div>
          ))}
        </div>
      )}
      {AD_SLOTS.footer && <FooterAd slot={AD_SLOTS.footer} />}
    </div>
  );
}
