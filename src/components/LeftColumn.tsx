import React, { useEffect, useState } from "react";
import { cachedFetch } from "../utils/cachedFetch";

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
        const url = `${BASE_URL}/api/news-sections?filters[news_categories][slug][$eq]=${slug}&sort=publishedAt:desc&pagination[limit]=1&populate=*`;
        const data = await cachedFetch(url, {
          onUpdate: (fresh: any) => {
            const item = fresh.data?.[0];
            if (item) setter({
              id: item.id, documentId: item.documentId, title: item.title,
              shortDescription: item.short_description, slug: item.slug,
            });
          },
        });

        const item = data.data?.[0];
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
    bgClass: string,
    newsItem: NewsItem | null
  ) => {
    if (!newsItem) return null;

    return (
      <article
        className="group cursor-pointer p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
        onClick={() => onArticleClick?.(newsItem.documentId)}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-[10px] font-black ${colorClass} ${bgClass} px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-current/20`}
          >
            {tag}
          </span>
          <span className="material-icons text-slate-300 dark:text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all text-sm">
            arrow_forward
          </span>
        </div>

        <h3 className="serif-title text-lg font-bold leading-snug text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
          {newsItem.title}
        </h3>

        {newsItem.shortDescription && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
            {newsItem.shortDescription}
          </p>
        )}
      </article>
    );
  };

  return (
    <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1 lg:border-r lg:border-slate-200/80 lg:dark:border-slate-800 lg:pr-6">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-900 dark:text-white">
          Market Intelligence
        </h4>
      </div>

      {renderArticle("GOLD", "text-amber-600 dark:text-amber-400", "bg-amber-500/10", gold)}
      {renderArticle("SILVER", "text-slate-600 dark:text-slate-300", "bg-slate-500/10", silver)}
      {renderArticle("COPPER", "text-orange-600 dark:text-orange-400", "bg-orange-500/10", copper)}
    </div>
  );
};

export default LeftColumn;