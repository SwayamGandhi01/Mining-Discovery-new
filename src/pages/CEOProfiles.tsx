import React, { useEffect, useState } from "react";

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

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">CEO Profiles</h2>

      {loading && <div className="text-sm text-slate-500">Loading CEO profiles...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <article key={profile.id} className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col h-full">
              {/* Profile Image */}
              <div className="w-full h-56 overflow-hidden rounded bg-slate-100 flex items-center justify-center">
                {profile.ceo_image ? (
                  <img
                    src={profile.ceo_image.url}
                    alt={profile.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">No image</div>
                )}
              </div>

              {/* Profile Content */}
              <div className="mt-3 flex-1 flex flex-col">
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{profile.designation}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-4">
                  {profile.shortDescription}
                </p>

                {/* PDF Download Button */}
                <div className="mt-4">
                  {profile.ceo_pdf && profile.ceo_pdf.length > 0 && (
                    <>
                      <a
                        href={profile.ceo_pdf[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-slate-900 dark:bg-slate-700 text-white px-3 py-1 rounded text-sm hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
                      >
                        View Profile
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && profiles.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-sm text-slate-500">No CEO profiles available at the moment.</p>
        </div>
      )}
    </main>
  );
};

export default CEOProfiles;
