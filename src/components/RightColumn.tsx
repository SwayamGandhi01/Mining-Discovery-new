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
          "https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=7"
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
    <div className="lg:col-span-3 order-3 lg:border-l lg:border-slate-200 lg:dark:border-slate-800 lg:pl-6">
      <h4 className="font-bold text-xs uppercase tracking-widest border-b-2 border-primary w-fit pb-1 mb-6">
        Trending Now
      </h4>

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <div className="space-y-6">
          {news.map((item, index) => (
            <div
              key={item.id}
              className="flex gap-4 cursor-pointer"
              onClick={() => onArticleClick?.(item.documentId)}
            >
              <span className="serif-title text-3xl text-primary/30 font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>

              <p className="text-sm font-semibold hover:text-primary transition-colors">
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