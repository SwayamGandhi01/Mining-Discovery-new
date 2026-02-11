import React, { useEffect, useState } from "react";

interface Article {
  id: number;
  documentId?: string;
  title: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  author?: string;
  publishedAt?: string;
  slug?: string;
}

interface ArticleDetailProps {
  documentId: string;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ documentId, onBack }) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(
          `https://admins.miningdiscovery.com/api/news-sections/${documentId}?populate=*`
        );

        if (!res.ok) {
          console.error(`Error: ${res.status} - Article not found`);
          setArticle(null);
          return;
        }

        const data = await res.json();
        const item = data.data;

        if (!item) {
          setArticle(null);
          return;
        }

        setArticle({
          id: item.id,
          documentId: item.documentId,
          title: item.title,
          shortDescription: item.short_description,
          description: item.description,
          image:
            item.image?.formats?.large?.url || item.image?.url || "",
          author: item.author,
          publishedAt: item.publish_on || item.publishedAt,
          slug: item.slug,
        });

        fetchRelatedArticles();
      } catch (error) {
        console.error("Error fetching article:", error);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedArticles = async () => {
      try {
        const res = await fetch(
          "https://admins.miningdiscovery.com/api/news-sections?sort=publishedAt:desc&pagination[limit]=15&populate=image"
        );
        const data = await res.json();
        const articles = (data.data || [])
          .filter((item: any) => item.documentId !== documentId)
          .slice(0, 15)
          .map((item: any) => ({
            id: item.id,
            documentId: item.documentId,
            title: item.title,
            image: item.image?.formats?.medium?.url || item.image?.url || "",
            slug: item.slug,
          }));
        setRelatedArticles(articles);
      } catch (error) {
        console.error("Error fetching related articles:", error);
      }
    };

    fetchArticle();
  }, [documentId]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-20">Loading article...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <p className="text-slate-700 dark:text-slate-300 mb-4">Article not found</p>
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            ← Back to News
          </button>
        </div>
      </div>
    );
  }

  const readTime = Math.ceil(
    (article.description?.split(" ").length || 0) / 200
  );

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Breadcrumb Navigation */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          <button
            onClick={onBack}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Home
          </button>
          <span className="mx-2 text-slate-400">/</span>
          <span>News</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="line-clamp-1">{article.title.substring(0, 40)}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8 px-4 py-12">
        {/* Main Content */}
        <div className="col-span-12 lg:col-span-8">
          {/* Article Header */}
          <div className="mb-8">
            <h1 className="serif-title text-4xl lg:text-5xl leading-tight mb-4 text-slate-900 dark:text-slate-100">
              {article.title}
            </h1>

            {article.shortDescription && (
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {article.shortDescription}
              </p>
            )}

            {/* Author Info */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">
                  {(article.author || "M").charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {article.author || "Mining Discovery"}
                </p>
                <p className="text-sm text-slate-500">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.image && (
            <div className="mb-8">
              <div className="aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-lg">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          {article.description && (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
              <div
                className="text-slate-700 dark:text-slate-300 leading-relaxed text-base"
                dangerouslySetInnerHTML={{ __html: article.description }}
              />
            </div>
          )}

          {/* Social Share */}
          <div className="py-8 border-t border-b border-slate-200 dark:border-slate-800 mb-12">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-4 uppercase tracking-wider">
              Share
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const url = window.location.href;
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    'facebook-share-dialog',
                    'width=800,height=600'
                  );
                }}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = `${article.title}`;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                    'twitter-share-dialog',
                    'width=800,height=600'
                  );
                }}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-600 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.837.856 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button
                onClick={() => {
                  const url = window.location.href;
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.shortDescription || article.title,
                      url: url,
                    });
                  } else {
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                      'linkedin-share-dialog',
                      'width=800,height=600'
                    );
                  }
                }}
                className="w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="w-full mb-8 px-4 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </button>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div>
              <h3 className="font-bold text-xs uppercase tracking-widest border-b-2 border-primary w-fit pb-2 mb-6 text-slate-900 dark:text-slate-100">
                Continue Reading
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {relatedArticles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      window.location.hash = `#/article/${item.documentId || item.id}`;
                    }}
                    className="group cursor-pointer"
                  >
                    {item.image && (
                      <div className="aspect-video bg-slate-200 dark:bg-slate-800 overflow-hidden rounded-lg mb-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-3 leading-tight">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
