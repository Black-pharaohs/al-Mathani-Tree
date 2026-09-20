import React, { useEffect, useState } from 'react';
import { BookOpen, ShieldCheck, FileCheck, ExternalLink, Library, Bookmark, Compass, Image as ImageIcon, Eye, X, HardDrive } from 'lucide-react';
import { Source, Book } from '../../core/types';

export const SourcesView: React.FC = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'sources' | 'books'>('sources');
  const [selectedManuscript, setSelectedManuscript] = useState<Source | null>(null);

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
              className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-xs flex flex-col justify-between hover:border-amber-400/60 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>مصدر معتمد</span>
                    </span>
                    {src.source_type === 'manuscript' && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        <ImageIcon className="w-3 h-3 text-amber-700" />
                        <span>مخطوط مصور</span>
                      </span>
                    )}
                  </div>
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

                {src.archive_reference && (
                  <div className="mb-4 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-600 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-serif">
                      <HardDrive className="w-3.5 h-3.5 text-stone-400" />
                      <span>حفظ الأرشيف: {src.archive_reference}</span>
                    </div>
                  </div>
                )}

                {src.manuscript_image_url && (
                  <div 
                    onClick={() => setSelectedManuscript(src)}
                    className="mb-4 group relative h-36 rounded-2xl overflow-hidden border border-amber-900/20 cursor-pointer bg-stone-950"
                  >
                    <img 
                      src={src.manuscript_image_url} 
                      alt={src.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                      <div className="text-stone-200 text-xs font-heritage font-bold flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>معاينة الرق والمخطوط عالي الدقة</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-300 bg-black/50 px-2 py-0.5 rounded-md border border-white/10">
                        Supabase Storage
                      </span>
                    </div>
                  </div>
                )}
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

      {/* High-Resolution Manuscript Viewer Modal (Supabase Storage Integrated) */}
      {selectedManuscript && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 px-6 border-b border-stone-800 bg-stone-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heritage text-lg font-bold text-stone-100">
                    {selectedManuscript.title}
                  </h4>
                  <div className="text-xs text-stone-400 flex items-center gap-2 mt-0.5">
                    <span>{selectedManuscript.archive_reference || 'خزانة المخطوطات والوثائق'}</span>
                    <span className="text-stone-600">•</span>
                    <span className="font-mono text-emerald-400">{selectedManuscript.storage_path}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedManuscript(null)}
                aria-label="إغلاق معاينة المخطوط"
                className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 bg-stone-950 flex items-center justify-center">
              <img
                src={selectedManuscript.manuscript_image_url}
                alt={selectedManuscript.title}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto rounded-xl object-contain border border-amber-900/30 shadow-lg"
              />
            </div>

            <div className="p-4 px-6 border-t border-stone-800 bg-stone-950/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p className="text-stone-400 font-serif leading-relaxed max-w-xl">
                {selectedManuscript.description}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-amber-300/90 font-mono bg-amber-950/60 border border-amber-800/40 px-3 py-1.5 rounded-xl">
                  تخزين سحابي موثق (Supabase Storage)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
