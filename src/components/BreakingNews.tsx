import React, { useEffect, useState } from "react";

export default function BreakingNews(): JSX.Element {
  const [headline, setHeadline] = useState<string>("Loading latest news...");

  useEffect(() => {
    const fetchBreakingNews = async () => {
      try {
        const res = await fetch(
          "https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=5"
        );

        const data = await res.json();

        if (!data.data || data.data.length === 0) return;

        const titles = data.data.map((item: any) => item.title);

        const joinedHeadlines = titles.join(" · ");

        setHeadline(joinedHeadlines);
      } catch (error) {
        console.error("Error fetching breaking news:", error);
      }
    };

    fetchBreakingNews();
  }, []);

  return (
    <div className="bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-2">
        <span className="bg-yellow-400 text-black font-bold text-xs px-2 py-1">
          BREAKING NEWS
        </span>

        <div className="flex-1 overflow-hidden">
          <div className="breaking-ticker-wrapper">
            <div className="breaking-ticker-content text-sm md:text-base">
              <span className="mr-8">{headline}</span>
              <span className="mr-8">{headline}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}