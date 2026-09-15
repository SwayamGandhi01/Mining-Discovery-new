import React, { useEffect, useState } from "react";
import { cachedFetch } from "../utils/cachedFetch";
import { Skeleton, SkeletonRegion } from "./ui/Skeleton";

interface NewsItem {
  id: number;
  documentId: string;
  title: string;
  shortDescription?: string;
  slug?: string;
}

// undefined while loading; null once there is nothing to show for that metal.
type NewsSlot = NewsItem | null | undefined;

interface LeftColumnProps {
  onArticleClick?: (documentId: string) => void;
}

const BASE_URL = "https://admins.miningdiscovery.com";

/** Same card shell as a loaded teaser: tag pill, two-line title, three-line summary. */
const ArticleTeaserSkeleton: React.FC = () => (
  <SkeletonRegion
    label="Loading market news"
    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm"
  >
    <div className="flex items-center justify-between mb-2">
      <Skeleton className="h-5 w-14 rounded-full" />
      <Skeleton className="h-3.5 w-3.5 rounded-full" />
    </div>
    <div className="space-y-1.5">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
    </div>
    <div className="mt-2 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  </SkeletonRegion>
);

const LeftColumn: React.FC<LeftColumnProps> = ({ onArticleClick }) => {
  const [gold, setGold] = useState<NewsSlot>(undefined);
  const [silver, setSilver] = useState<NewsSlot>(undefined);
  const [copper, setCopper] = useState<NewsSlot>(undefined);

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
        if (!item) {
          setter(null);
          return;
        }

        setter({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          shortDescription: item.short_description,
          slug: item.slug,
        });
      } catch (error) {
        console.error(`Error fetching ${slug} news:`, error);
        setter(null);
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
    newsItem: NewsSlot
  ) => {
    if (newsItem === undefined) return <ArticleTeaserSkeleton />;
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

      {renderArticle("GOLD", "text-[#1E3B6E] dark:text-[#3B82F6]", "bg-[#3B82F6]/10", gold)}
      {renderArticle("SILVER", "text-slate-600 dark:text-slate-300", "bg-slate-500/10", silver)}
      {renderArticle("COPPER", "text-[#1E3B6E] dark:text-[#3B82F6]", "bg-[#3B82F6]/10", copper)}
    </div>
  );
};

export default LeftColumn;
