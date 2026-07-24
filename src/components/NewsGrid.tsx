import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";

type SectionItem = any;

const CATEGORY_LIST = [
  { label: "Sponsored Posts", slug: "sponsored-post" },
  { label: "Copper News", slug: "copper-news" },
  { label: "Corporate News", slug: "corporate-news" },
  { label: "Precious Metals", slug: "precious-metals" },
  { label: "World News", slug: "world-news" },
];

interface NewsGridProps {
  onArticleClick?: (docId: string) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({ onArticleClick }) => {
  const [activeCategory, setActiveCategory] = useState("sponsored-post");
  const [posts, setPosts] = useState<SectionItem[]>([]);
  const [latestMag, setLatestMag] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async (slug: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://admins.miningdiscovery.com/api/news-sections?filters[news_categories][slug][$eq]=${slug}&sort=publishedAt:desc&pagination[limit]=2&populate=*`
      );

      const json = await res.json();
      setPosts(json?.data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    async function fetchMagazine() {
      try {
        const res = await fetch(
          "https://admins.miningdiscovery.com/api/magazines?populate=*"
        );
        const json = await res.json();
        const mags = json?.data || [];

        if (mags.length) {
          const sorted = mags.sort(
            (a: any, b: any) =>
              new Date(b.publishedAt).getTime() -
              new Date(a.publishedAt).getTime()
          );
          setLatestMag(sorted[0]);
        }
      } catch (e) {
        console.error("Magazine fetch error");
      }
    }

    fetchMagazine();
  }, []);

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 my-10 sm:my-14">
      {/* LEFT SIDE */}
      <div className="lg:col-span-3">
        {/* CATEGORY HEADING TABS */}
        <div className="flex gap-2 sm:gap-3 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8 overflow-x-auto no-scrollbar">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="aspect-video bg-slate-200 dark:bg-slate-800 rounded-xl mb-4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded mb-2 w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((item, idx) => {
              const readTime = calculateReadTime(
                item.description || item.short_description || ""
              );

              const imageUrl =
                item.image?.formats?.medium?.url ||
                item.image?.url ||
                "";

              const publishDate = new Date(
                item.publish_on || item.publishedAt
              ).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <article
                  key={idx}
                  onClick={() =>
                    item.documentId && onArticleClick
                      ? onArticleClick(item.documentId)
                      : null
                  }
                  className="group cursor-pointer bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden mb-4 rounded-xl relative shadow-inner">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-icons text-4xl">newspaper</span>
                        </div>
                      )}
                    </div>

                    <h4 className="serif-title text-xl font-bold mb-2.5 text-slate-900 dark:text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                      {item.short_description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 uppercase font-bold pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1">
                      <span className="material-icons text-xs text-primary">schedule</span>
                      {publishDate}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400">
                      {readTime} MIN READ
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDE - MAGAZINE */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border border-slate-800 p-6 rounded-2xl text-center shadow-xl">
          <span className="text-[10px] font-extrabold text-[#3B82F6] mb-4 uppercase tracking-[0.25em] inline-block border border-[#3B82F6]/30 px-3 py-1 rounded-full bg-[#3B82F6]/10">
            LATEST ISSUE
          </span>

          {latestMag && (
            <>
              <div className="my-4 relative group">
                <img
                  src={
                    latestMag?.coverImage?.formats?.medium?.url ||
                    latestMag?.coverImage?.url
                  }
                  alt={latestMag.Title}
                  className="w-auto h-52 mx-auto object-contain rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <p className="font-bold serif-title text-lg sm:text-xl text-white mb-2 line-clamp-2">
                {latestMag.Title}
              </p>

              {latestMag.pdf?.url && (
                <a
                  href={latestMag.pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 mt-4 w-full bg-[#1E3B6E] hover:bg-[#2563EB] text-white px-5 py-3 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  <Download className="w-4 h-4 flex-shrink-0" />
                  <span>Download PDF</span>
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;