import React, { useEffect, useState } from "react";
import { cachedFetch } from "../utils/cachedFetch";

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

const HERO_URL = "https://admins.miningdiscovery.com/api/news-sections?filters[news_categories][slug][$eq]=latest-news&sort=publishedAt:desc&pagination[limit]=1&populate=*";

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
        <div className="animate-pulse">
          <div className="aspect-[16/9] bg-slate-200 dark:bg-slate-800 rounded-2xl mb-4" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-3" />
          <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-2" />
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mx-auto" />
        </div>
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
          <img
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