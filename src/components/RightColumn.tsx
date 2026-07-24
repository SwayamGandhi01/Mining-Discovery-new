import React, { useEffect, useState } from "react";

interface NewsItem {
  id: number;
  documentId: string;
  title: string;
  slug?: string;
}

interface RightColumnProps {
  onArticleClick?: (documentId: string) => void;
}

const RightColumn: React.FC<RightColumnProps> = ({ onArticleClick }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await fetch(
          "https://admins.miningdiscovery.com/api/news-sections?filters[news_categories][slug][$eq]=latest-news&sort=publishedAt:desc&pagination[limit]=8"
        );

        const data = await res.json();

        const formattedNews = data.data.map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          slug: item.slug,
        }));

        setNews(formattedNews);
      } catch (error) {
        console.error("Error fetching latest news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestNews();
  }, []);

  return (
    <div className="lg:col-span-3 order-3 lg:border-l lg:border-slate-200/80 lg:dark:border-slate-800 lg:pl-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-5">
        <span className="material-icons text-primary text-base">trending_up</span>
        <h4 className="font-extrabold text-xs uppercase tracking-widest text-slate-900 dark:text-white">
          Trending Now
        </h4>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div key={i} className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {news.map((item, index) => (
            <div
              key={item.id}
              className="flex items-start gap-3.5 px-2.5 py-3 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group border-b border-slate-100 dark:border-slate-800/60 last:border-b-0"
              onClick={() => onArticleClick?.(item.documentId)}
            >
              <span className="serif-title text-2xl font-black text-primary/40 group-hover:text-primary transition-colors leading-none min-w-[30px] mt-0.5">
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RightColumn;