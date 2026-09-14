import React, { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck, FileCheck, ExternalLink, Library, Bookmark, Compass } from 'lucide-react';
import { Source, Book } from '../../core/types';

export const SourcesView: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'sources' | 'books'>('sources');

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/sources').then(r => r.json()),
      fetch('/api/v1/books').then(r => r.json())
    ]).then(([srcRes, bkRes]) => {
      if (srcRes.success) setSources(srcRes.data);
      if (bkRes.success) setBooks(bkRes.data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load sources/books:', err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          المصادر والمراجع المحققة
        </h2>
        <p className="text-stone-600 text-sm max-w-2xl leading-relaxed">
          تطبيق المبدأ الأساسي «المصدر أولاً» (Source-First Principle)؛ حيث ترتبط كافة التراجم والأسانيد بمراجع موثوقة من أمهات كتب التاريخ، والطبقات، والحديث، والسلوك.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 mt-6 border-b border-stone-200">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'sources'
                ? 'border-amber-600 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>المصادر التوثيقية ({sources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'books'
                ? 'border-amber-600 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>الكتب والمصنفات ({books.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-heritage text-lg text-stone-600">جارٍ استرجاع بيانات الفهرسة المرجعية...</p>
        </div>
      ) : activeTab === 'sources' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((src) => (
            <div
              key={src.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مصدر معتمد</span>
                  </span>
                  {src.publication_year && (
                    <span className="text-xs text-stone-400 font-mono">
                      سنة الوفاة/النشر: {src.publication_year} هـ
                    </span>
                  )}
                </div>

                <h3 className="font-heritage text-2xl font-bold text-stone-900 mb-1">
                  {src.title}
                </h3>
                
                {src.author && (
                  <div className="text-xs font-semibold text-amber-800 mb-3">
                    المؤلف: {src.author}
                  </div>
                )}

                <p className="text-xs text-stone-600 leading-relaxed font-sans mb-4">
                  {src.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span>الناشر: {src.publisher || 'مخطوط محقق'}</span>
                <span className="font-mono text-[11px]">ID: {src.id}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold mb-2">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{b.subtitle || 'مصنف أصيل'}</span>
                </div>

                <h3 className="font-heritage text-xl font-bold text-stone-900 mb-2">
                  {b.title}
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-4">
                  {b.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-400">
                <span>اللغة: {b.language === 'ar' ? 'العربية' : b.language}</span>
                <span className="font-mono text-[11px]">Slug: {b.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
