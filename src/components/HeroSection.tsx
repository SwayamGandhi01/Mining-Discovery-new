import React, { useEffect, useState } from "react";
import { cachedFetch } from "../utils/cachedFetch";
import { Skeleton, SkeletonRegion } from "./ui/Skeleton";
import LazyImage from "./ui/LazyImage";

interface HeroNews {
  id: number;
  documentId: string;
  title: string;
  shortDescription?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
}

interface HeroSectionProps {
  onArticleClick?: (documentId: string) => void;
}

const mapHeroItem = (item: any): HeroNews => ({
  id: item.id,
  documentId: item.documentId,
  title: item.title,
  shortDescription: item.short_description,
  image: item.image?.formats?.large?.url || item.image?.url || "",
  author: item.author,
  publishedAt: item.publish_on || item.publishedAt,
});

// Order by the editorial news date (`publish_on`) — the date the cover story
// actually displays — and fall back to the CMS record timestamp to break ties
// between stories filed on the same day. Sorting by `publishedAt` alone put
// whichever story was entered last on the cover, even when its news date was
// older than other stories on the page.
//
// `publish_on` nulls sort first on a descending sort, which would hand the
// cover to an undated story, so they are filtered out (1 of 3245 at time of
// writing).
const HERO_URL =
  "https://admins.miningdiscovery.com/api/news-sections" +
  "?filters[news_categories][slug][$eq]=latest-news" +
  "&filters[publish_on][$notNull]=true" +
  "&sort[0]=publish_on:desc" +
  "&sort[1]=publishedAt:desc" +
  "&pagination[limit]=1" +
  "&populate=*";

const HeroSection: React.FC<HeroSectionProps> = ({ onArticleClick }) => {
  const [news, setNews] = useState<HeroNews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const data = await cachedFetch(HERO_URL, {
          onUpdate: (fresh: any) => {
            const item = fresh.data?.[0];
            if (item) setNews(mapHeroItem(item));
          },
        });

        const item = data.data?.[0];
        if (item) setNews(mapHeroItem(item));
      } catch (error) {
        console.error("Error fetching hero news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  if (loading) {
    return (
      <section className="lg:col-span-6 order-1 lg:order-2">
        <SkeletonRegion label="Loading cover story">
          <Skeleton className="aspect-[16/9] rounded-2xl mb-5" />
          <div className="flex flex-col items-center px-4">
            <Skeleton className="h-6 w-32 rounded-full mb-3" />
            <div className="flex w-full flex-col items-center gap-2 mb-3">
              <Skeleton className="h-7 sm:h-8 md:h-10 lg:h-12 w-full" />
              <Skeleton className="h-7 sm:h-8 md:h-10 lg:h-12 w-3/4" />
            </div>
            <div className="flex w-full max-w-2xl flex-col items-center gap-2.5">
              <Skeleton className="h-4 sm:h-5 w-full" />
              <Skeleton className="h-4 sm:h-5 w-2/3" />
            </div>
            <Skeleton className="mt-4 h-4 w-36" />
          </div>
        </SkeletonRegion>
      </section>
    );
  }

  if (!news) return null;

  return (
    <section className="lg:col-span-6 order-1 lg:order-2">
      <article
        className="relative cursor-pointer group"
        onClick={() => onArticleClick?.(news.documentId)}
      >
        <div className="aspect-[16/9] bg-slate-900 rounded-2xl overflow-hidden mb-5 shadow-lg group-hover:shadow-2xl transition-all duration-500 relative">
          <LazyImage
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        </div>

        <div className="text-center px-4">
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary dark:bg-primary/20 text-[11px] font-extrabold px-3.5 py-1 rounded-full mb-3 tracking-widest uppercase border border-primary/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            COVER STORY
          </span>

          <h2 className="serif-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300">
            {news.title}
          </h2>

          {news.shortDescription && (
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed line-clamp-2">
              {news.shortDescription}
            </p>
          )}

          <div className="mt-4 flex items-center justify-center space-x-2 text-xs font-bold text-slate-400 dark:text-slate-500">
            <span className="material-icons text-sm text-primary">calendar_today</span>
            <span>
              {news.publishedAt
                ? new Date(news.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
                : ""}
            </span>
          </div>
        </div>
      </article>
    </section>
  );
};

export default HeroSection;