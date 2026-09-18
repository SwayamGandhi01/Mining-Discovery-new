import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { cms, imageSources } from "../api/cms";
import { Skeleton, SkeletonRegion } from "./ui/Skeleton";
import LazyImage from "./ui/LazyImage";
import CardSkeleton from "./skeletons/CardSkeleton";
import { whenIdle } from '../utils/whenIdle'

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
  const [magLoading, setMagLoading] = useState(true);

  // Refetch on every tab change (tabs already visited come from the cache).
  // `active` drops responses for a tab the user has already left, so a slower
  // earlier request can't land on the new tab.
  useEffect(() => {
    let active = true;
    setLoading(true);

    // Below the fold: started once the first screen has painted.
    const cancel = whenIdle(() => {
      cms.tabPosts(activeCategory)
        .fetch((fresh: any) => {
          if (active) setPosts(fresh?.data || []);
        })
        .then((json) => {
          if (active) setPosts(json?.data || []);
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    });

    return () => {
      active = false;
      cancel();
    };
  }, [activeCategory]);

  useEffect(() => {
    async function fetchMagazine() {
      try {
        // Only the newest issue, which is all this card shows.
        const json = await cms.latestMagazine.fetch((fresh: any) => {
          const mag = fresh?.data?.[0];
          if (mag) setLatestMag(mag);
        });
        const mag = json?.data?.[0];
        if (mag) setLatestMag(mag);
      } catch (e) {
        console.error("Magazine fetch error");
      } finally {
        setMagLoading(false);
      }
    }

    // Below the fold: started once the first screen has painted.
    return whenIdle(fetchMagazine);
  }, []);

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // The cover shows 208px tall (~160px wide); the lightest variant that is sharp at that size.
  const magCover = imageSources(latestMag?.coverImage, 240);

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
              className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${activeCategory === cat.slug
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
          <SkeletonRegion label="Loading posts" className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[0, 1].map((i) => (
              <CardSkeleton
                key={i}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm"
                mediaClassName="aspect-video rounded-xl mb-4"
                textLines={3}
                textLineClassName="h-3 sm:h-3.5"
                footer
              />
            ))}
          </SkeletonRegion>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((item, idx) => {
              const readTime = calculateReadTime(
                item.description || item.short_description || ""
              );

              // Two cards across the three-quarter column (~430px), one on phones.
              const image = imageSources(item.image, 430);

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
                      {image ? (
                        <LazyImage
                          src={image.url}
                          srcSet={image.srcSet}
                          sizes="(min-width: 768px) 430px, 100vw"
                          width={image.width}
                          height={image.height}
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

          {latestMag ? (
            <>
              <div className="my-4 relative group">
                {/* width/height let the browser size the cover before it downloads. */}
                <LazyImage
                  src={magCover?.url}
                  srcSet={magCover?.srcSet}
                  sizes="160px"
                  width={magCover?.width}
                  height={magCover?.height}
                  alt={latestMag.Title}
                  className="w-auto h-52 mx-auto object-contain rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  skeletonTone="inverse"
                  skeletonClassName="left-1/2 right-auto w-40 -translate-x-1/2 rounded-lg"
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
          ) : magLoading ? (
            <SkeletonRegion label="Loading latest issue" className="flex flex-col items-center">
              <Skeleton tone="inverse" className="my-4 h-52 w-40 rounded-lg" />
              <Skeleton tone="inverse" className="mb-2 h-6 w-40" />
              <Skeleton tone="inverse" className="mt-4 h-10 w-full rounded-xl" />
            </SkeletonRegion>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default NewsGrid;
