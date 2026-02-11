import React, { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  documentId: string;
  title: string;
  shortDescription?: string;
  slug?: string;
}

interface LeftColumnProps {
  onArticleClick?: (documentId: string) => void;
}

const BASE_URL = "https://admins.miningdiscovery.com";

const LeftColumn: React.FC<LeftColumnProps> = ({ onArticleClick }) => {
  const [gold, setGold] = useState<NewsItem | null>(null);
  const [silver, setSilver] = useState<NewsItem | null>(null);
  const [copper, setCopper] = useState<NewsItem | null>(null);

  useEffect(() => {
    const fetchCategoryNews = async (slug: string, setter: any) => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/news-sections?filters[news_categories][slug][$eq]=${slug}&sort=publishedAt:desc&pagination[limit]=1&populate=*`
        );

        const data = await res.json();
        const item = data.data[0];

        if (!item) return;

        setter({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          shortDescription: item.short_description,
          slug: item.slug,
        });
      } catch (error) {
        console.error(`Error fetching ${slug} news:`, error);
      }
    };

    fetchCategoryNews("gold-news", setGold);
    fetchCategoryNews("silver-news", setSilver);
    fetchCategoryNews("copper-news", setCopper);
  }, []);

  const renderArticle = (
    tag: string,
    colorClass: string,
    newsItem: NewsItem | null
  ) => {
    if (!newsItem) return null;

    return (
      <>
        <article
          className="group cursor-pointer"
          onClick={() => onArticleClick?.(newsItem.documentId)}
        >
          <p className={`text-[10px] font-bold ${colorClass} mb-1 uppercase tracking-wider`}>
            {tag}
          </p>

          <h3 className="serif-title text-xl leading-tight group-hover:text-primary transition-colors">
            {newsItem.title}
          </h3>

          {newsItem.shortDescription && (
            <p className="text-sm text-slate-500 mt-2 line-clamp-3 leading-relaxed">
              {newsItem.shortDescription}
            </p>
          )}
        </article>

        <hr className="border-slate-100 dark:border-slate-800" />
      </>
    );
  };

  return (
    <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1 lg:border-r lg:border-slate-200 lg:dark:border-slate-800 lg:pr-6">
      {renderArticle("GOLD", "text-yellow-500", gold)}
      {renderArticle("SILVER", "text-gray-400", silver)}
      {renderArticle("COPPER", "text-orange-500", copper)}
    </div>
  );
};

export default LeftColumn;