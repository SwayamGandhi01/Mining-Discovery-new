import React, { useEffect, useState } from "react";

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
    <section className="grid grid-cols-1 lg:grid-cols-4 gap-12">
      {/* LEFT SIDE */}
      <div className="lg:col-span-3">
        {/* CATEGORY HEADING TABS */}
        <div className="flex gap-6 border-b border-slate-200 mb-8 overflow-x-auto">
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`text-sm font-bold pb-4 whitespace-nowrap ${
                activeCategory === cat.slug
                  ? "border-b-2 border-primary text-primary"
                  : "text-slate-400 hover:text-slate-700 border-b-2 border-transparent"
              }`}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {loading ? (
          <div className="py-10">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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
                month: "long",
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
                  className="group cursor-pointer"
                >
                  <div className="aspect-video bg-slate-200 overflow-hidden mb-4 rounded-lg relative">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>

                  <h4 className="serif-title text-2xl mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                    {item.short_description}
                  </p>

                  <div className="flex justify-between text-xs text-slate-400 uppercase font-bold">
                    <span>{publishDate}</span>
                    <span>{readTime} MIN READ</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* RIGHT SIDE - MAGAZINE */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl text-center">
          <h5 className="text-xs font-extrabold text-primary mb-6 uppercase tracking-[0.2em]">
            Latest Magazine
          </h5>

          {latestMag && (
            <>
              <img
                src={
                  latestMag?.coverImage?.formats?.medium?.url ||
                  latestMag?.coverImage?.url
                }
                alt={latestMag.Title}
                className="w-auto h-48 mx-auto object-contain rounded shadow-lg mb-4"
              />

              <p className="font-bold serif-title text-xl mb-2">
                {latestMag.Title}
              </p>

              <a
                href={latestMag.pdf?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 bg-primary text-white px-6 py-3 text-xs font-bold uppercase rounded hover:opacity-90"
              >
                Download PDF
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;