import React, { useEffect, useState } from "react";

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

const HeroSection: React.FC<HeroSectionProps> = ({ onArticleClick }) => {
  const [news, setNews] = useState<HeroNews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await fetch(
          "https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=1&populate=*"
        );

        const data = await res.json();
        const item = data.data[0];

        if (!item) return;

        setNews({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          shortDescription: item.short_description,
          image:
            item.image?.formats?.large?.url ||
            item.image?.url ||
            "",
          author: item.author,
          publishedAt: item.publish_on || item.publishedAt,
        });
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
        <div className="text-center py-20">Loading...</div>
      </section>
    );
  }

  if (!news) return null;

  return (
    <section className="lg:col-span-6 order-1 lg:order-2">
      <article
        className="relative cursor-pointer"
        onClick={() => onArticleClick?.(news.documentId)}
      >
        <div className="aspect-[16/9] bg-slate-200 overflow-hidden mb-4">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="text-center px-4">
          <span className="inline-block bg-primary/10 text-primary text-[10px] font-extrabold px-3 py-1 mb-3">
            COVER STORY
          </span>

          <h2 className="serif-title text-3xl md:text-5xl leading-tight mb-4 hover:underline decoration-primary decoration-2 underline-offset-8">
            {news.title}
          </h2>

          {news.shortDescription && (
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed line-clamp-1">
              {news.shortDescription}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center space-x-4 text-xs font-bold text-slate-400">
            <span>{news.author}</span>
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span>
              {news.publishedAt
                ? new Date(news.publishedAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>
      </article>
    </section>
  );
};

export default HeroSection;