import React, { useEffect, useState } from "react";
import { cachedFetch } from "../utils/cachedFetch";
import { Skeleton, SkeletonRegion } from "./ui/Skeleton";

export default function BreakingNews(): JSX.Element {
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const data = await cachedFetch(
          "https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=8",
          {
            onUpdate: (fresh: any) => {
              const titles = (fresh.data || []).map((item: any) => item.title).filter(Boolean);
              if (titles.length > 0) setHeadlines(titles);
            }
          }
        );

        if (!data.data || data.data.length === 0) return;

        const titles = data.data.map((item: any) => item.title).filter(Boolean);
        setHeadlines(titles);
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakingNews();
  }, []);


  return (
    <div className="w-full bg-[#DCE4F6] border-y border-slate-300/80 text-slate-800 flex items-center overflow-hidden h-9">
      {/* Left Badge: LATEST NEWS */}
      <div className="bg-[#0B132B] text-white px-5 h-full text-xs font-black uppercase tracking-wider flex items-center justify-center flex-shrink-0 z-10 shadow-sm whitespace-nowrap">
        LATEST NEWS
      </div>

      {/* Scrolling Ticker */}
      <div className="flex-1 overflow-hidden h-full flex items-center px-2">
        <div className="breaking-ticker-wrapper w-full">
          {headlines.length > 0 ? (
            <div className="breaking-ticker-content text-xs sm:text-sm font-semibold text-slate-800">
              {headlines.map((title, idx) => (
                <span key={idx} className="inline-flex items-center gap-2">
                  <span className="hover:underline cursor-pointer">{title}</span>
                  <span className="text-slate-400 font-normal mx-3 select-none">|</span>
                  <span className="text-[#3B82F6] text-[10px] select-none mr-1">▶</span>
                </span>
              ))}
              {headlines.map((title, idx) => (
                <span key={`dup-${idx}`} className="inline-flex items-center gap-2">
                  <span className="hover:underline cursor-pointer">{title}</span>
                  <span className="text-slate-400 font-normal mx-3 select-none">|</span>
                  <span className="text-[#3B82F6] text-[10px] select-none mr-1">▶</span>
                </span>
              ))}
            </div>
          ) : loading ? (
            // Kept outside the scrolling track so the placeholder stays still.
            <SkeletonRegion label="Loading latest news" className="flex items-center gap-8">
              <Skeleton tone="muted" className="h-3 w-64 shrink-0" />
              <Skeleton tone="muted" className="h-3 w-48 shrink-0 hidden sm:block" />
              <Skeleton tone="muted" className="h-3 w-56 shrink-0 hidden lg:block" />
            </SkeletonRegion>
          ) : null}
        </div>
      </div>
    </div>
  );
}
