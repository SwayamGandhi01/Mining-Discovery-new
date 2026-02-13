import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink } from "lucide-react";

interface CEOImage {
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

interface CEOPdf {
  id: number;
  name: string;
  url: string;
}

interface CoverImage {
  id: number;
  name: string;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
  };
}

interface CEOProfile {
  id: number;
  documentId: string;
  name: string;
  designation: string;
  shortDescription: string;
  ceo_image?: CEOImage;
  ceo_pdf?: CEOPdf[];
  cover_image?: CoverImage[];
}

const CEOProfiles: React.FC = () => {
  const [profiles, setProfiles] = useState<CEOProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;

  useEffect(() => {
    const fetchCEOProfiles = async () => {
      try {
        const res = await fetch(
          "https://admins.miningdiscovery.com/api/ceo-profiles?populate=*&pagination[limit]=100&sort=publishedAt:desc"
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch CEO profiles: ${res.status}`);
        }

        const data = await res.json();
        const formattedProfiles = (data.data || []).map((item: any) => ({
          id: item.id,
          documentId: item.documentId,
          name: item.name || "Unknown",
          designation: item.designation || "Executive",
          shortDescription: item.shortDescription || "",
          ceo_image: item.ceo_image || null,
          ceo_pdf: item.ceo_pdf || [],
          cover_image: item.cover_image || [],
        }));
        setProfiles(formattedProfiles);
      } catch (err) {
        console.error("Error fetching CEO profiles:", err);
        setError("Failed to load CEO profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchCEOProfiles();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(Math.max(0, profiles.length - itemsPerView), prev + 1)
    );
  };

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + itemsPerView);
  const maxIndex = Math.max(0, profiles.length - itemsPerView);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-yellow-500">CEO-PROFILES</h2>
        
        {/* Navigation Arrows */}
        <div className="flex gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous profiles"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next profiles"
          >
            <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">Loading CEO profiles...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-12">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {visibleProfiles.map((profile) => (
              <article
                key={profile.id}
                className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-100 dark:border-slate-800"
              >
                {/* Profile Image Container */}
                <div className="relative w-full h-64 bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                  {profile.ceo_image ? (
                    <img
                      src={profile.ceo_image.url}
                      alt={profile.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
                      No image available
                    </div>
                  )}
                </div>

                {/* Profile Content */}
                <div className="p-5 flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                      {profile.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">
                      {profile.designation}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {profile.shortDescription}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                    {profile.ceo_pdf && profile.ceo_pdf.length > 0 ? (
                      <>
                        <a
                          href={profile.ceo_pdf[0].url}
                          download
                          className="flex items-center gap-2 flex-1 justify-center bg-slate-900 dark:bg-slate-700 text-white px-4 py-2 rounded font-medium text-sm hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <a
                          href={profile.ceo_pdf[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 flex-1 justify-center border-2 border-slate-900 dark:border-slate-300 text-slate-900 dark:text-slate-300 px-4 py-2 rounded font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open
                        </a>
                      </>
                    ) : (
                      <div className="w-full text-center py-2 text-xs text-slate-500">
                        No profile available
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Progress Bar Indicator */}
          {profiles.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-slate-400 to-slate-600 dark:from-slate-500 dark:to-slate-400 transition-all duration-300"
                  style={{
                    width: `${maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 100}%`,
                  }}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {currentIndex + 1} - {Math.min(currentIndex + itemsPerView, profiles.length)} of {profiles.length}
              </span>
            </div>
          )}

          {/* No Profiles Message */}
          {profiles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500">
                No CEO profiles available at the moment.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default CEOProfiles;
