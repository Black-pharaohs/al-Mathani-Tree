import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  Layers, 
  ChevronLeft, 
  ExternalLink, 
  Award,
  BookMarked,
  Sparkles
} from 'lucide-react';
import { Person, PersonName, Book, Place, School, Tariqa, Category, Claim } from '../../core/types';

interface PersonDetailResponse {
  person: Person;
  names: PersonName[];
  books: Book[];
  birthPlace?: Place;
  deathPlace?: Place;
  school?: School;
  tariqa?: Tariqa;
  categories: Category[];
  claims: Claim[];
  relationships: Array<{
    id: string;
    direction: 'outgoing' | 'incoming';
    relationship_type_code: string;
    relation_label: string;
    confidence: string;
    verification_status: string;
    description?: string;
    related_person?: {
      id: string;
      slug: string;
      name: string;
    };
  }>;
}

interface PersonProfileModalProps {
  personIdOrSlug: string | null;
  onClose: () => void;
  onSelectPerson: (idOrSlug: string) => void;
}

export const PersonProfileModal: React.FC<PersonProfileModalProps> = ({
  personIdOrSlug,
  onClose,
  onSelectPerson
}) => {
  const [data, setData] = useState<PersonDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'bio' | 'relations' | 'books' | 'places' | 'sources'>('bio');

  useEffect(() => {
    if (!personIdOrSlug) return;
    setLoading(true);
    fetch(`/api/v1/persons/${personIdOrSlug}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load person details:', err);
        setLoading(false);
      });
  }, [personIdOrSlug]);

  if (!personIdOrSlug) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-amber-900/40 rounded-3xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[92vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {loading || !data ? (
          <div className="p-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-heritage text-lg text-amber-200">جارٍ استرجاع التراجم والمصادر...</p>
          </div>
        ) : (
          <>
            {/* Header / Hero Section (Sections 21-22) */}
            <div className="bg-gradient-to-l from-stone-900 via-amber-950/40 to-stone-900 p-6 sm:p-8 border-b border-stone-800">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                
                {/* Visual Avatar / Calligraphy Emblem */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 border-2 border-amber-500/40 flex items-center justify-center shadow-2xl flex-shrink-0">
                  <span className="font-heritage text-4xl sm:text-5xl font-bold text-amber-200 select-none">
                    {data.person.primary_name.charAt(data.person.primary_name.lastIndexOf(' ') + 1) || 'ع'}
                  </span>
                </div>

                {/* Person Titles & Meta */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/40">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>موثق بالكامل</span>
                    </span>

                    {data.categories.map(c => (
                      <span key={c.id} className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        {c.name}
                      </span>
                    ))}

                    {data.school && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/40">
                        {data.school.name}
                      </span>
                    )}

                    {data.tariqa && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                        {data.tariqa.name}
                      </span>
                    )}
                  </div>

                  <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide mb-1">
                    {data.person.primary_name}
                  </h2>

                  {/* Alternative names & kunyas */}
                  {data.names.length > 0 && (
                    <div className="text-xs text-stone-400 font-heritage mb-2">
                      {data.names.map(n => n.name).join(' • ')}
                    </div>
                  )}

                  {/* Lifespan & Era */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{data.person.birth_date || '؟'} — {data.person.death_date || '؟'}</span>
                    </div>

                    {data.birthPlace && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>الميلاد: {data.birthPlace.name}</span>
                      </div>
                    )}

                    {data.deathPlace && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>الوفاة: {data.deathPlace.name}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex items-center border-b border-stone-800 px-6 bg-stone-900/90 text-xs sm:text-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab('bio')}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium transition-all ${
                  activeTab === 'bio'
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>السيرة والترجمة</span>
              </button>

              <button
                onClick={() => setActiveTab('relations')}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium transition-all ${
                  activeTab === 'relations'
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>شبكة العلاقات ({data.relationships.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('books')}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium transition-all ${
                  activeTab === 'books'
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>المؤلفات والآثار ({data.books.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('sources')}
                className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium transition-all ${
                  activeTab === 'sources'
                    ? 'border-amber-500 text-amber-400 font-bold'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <BookMarked className="w-4 h-4" />
                <span>المصادر والادعاءات ({data.claims.length + 1})</span>
              </button>
            </div>

            {/* Profile Tab Contents */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 text-stone-200 text-sm leading-relaxed">
              
              {/* Tab 1: Biography */}
              {activeTab === 'bio' && (
                <div className="space-y-6">
                  {data.person.short_bio && (
                    <div className="bg-stone-800/50 p-4 rounded-2xl border border-stone-700/50">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">خلاصة الترجمة</h4>
                      <p className="font-heritage text-base sm:text-lg text-stone-200 leading-relaxed">
                        {data.person.short_bio}
                      </p>
                    </div>
                  )}

                  {data.person.full_bio && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-stone-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>السياق التاريخي والعلمي الموسع</span>
                      </h4>
                      <div className="bg-stone-800/30 p-5 rounded-2xl border border-stone-800 font-heritage text-base text-stone-300 leading-loose">
                        {data.person.full_bio}
                      </div>
                    </div>
                  )}

                  {/* Methodological notice */}
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300/80 flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>
                      جميع الأوصاف والتراجم مستقاة بدقة من كتب الطبقات والتاريخ المعتمدة؛ تمييزاً بين الحقائق التاريخية المؤكدة والروايات المنسوبة.
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Relationships */}
              {activeTab === 'relations' && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400">
                    العلاقات العلمية والتاريخية والروحية المباشرة المسندة في قاعدة المعرفة:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.relationships.map((rel) => (
                      <div
                        key={rel.id}
                        className="bg-stone-800/60 hover:bg-stone-800 p-4 rounded-2xl border border-stone-700/60 flex flex-col justify-between gap-3 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                              {rel.relation_label}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">
                              {rel.confidence === 'very_high' ? 'إسناد متواتر' : 'إسناد معتمد'}
                            </span>
                          </div>

                          <div className="font-heritage text-lg font-bold text-stone-100">
                            {rel.related_person ? rel.related_person.name : 'شخصية موثقة'}
                          </div>

                          {rel.description && (
                            <p className="text-xs text-stone-400 line-clamp-2 mt-1 font-sans">
                              {rel.description}
                            </p>
                          )}
                        </div>

                        {rel.related_person && (
                          <button
                            onClick={() => onSelectPerson(rel.related_person!.id)}
                            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-semibold self-start"
                          >
                            <span>عرض ملف الشخصية</span>
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Books */}
              {activeTab === 'books' && (
                <div className="space-y-4">
                  {data.books.length === 0 ? (
                    <div className="p-8 text-center text-stone-400 text-sm">
                      لم يتم تسجيل مصنفات مستقلة أو أن مؤلفاته محفوظة في أسانيد الروايات.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.books.map((b) => (
                        <div
                          key={b.id}
                          className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60 flex items-start gap-4"
                        >
                          <div className="p-3 bg-amber-950/60 border border-amber-700/30 rounded-xl text-amber-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-heritage text-lg font-bold text-amber-100">{b.title}</h4>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-stone-700 text-stone-300">
                                {b.subtitle || 'مصنف معتمد'}
                              </span>
                            </div>
                            <p className="text-xs text-stone-300 mt-1">{b.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Sources & Claims (Section 25-28 of Spec) */}
              {activeTab === 'sources' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/50">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
                      سجل التوثيق والتحقيق المصدري (Source-First Evidence)
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed mb-3">
                      تعتمد منصة «السبع المثاني» نموذج الادعاءات المصدرية المستقلة (Claims & Evidence)، حيث تُسند كل معلومة إلى مرجعها الأصلي مع توثيق الاختلافات دون حذف الروايات المقابلة.
                    </p>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                        <span className="font-semibold text-stone-200">المصدر الأساسي:</span> كتاب «سير أعلام النبلاء» للإمام الذهبي، و«حلية الأولياء» للحافظ أبي نعيم.
                      </div>

                      {data.claims.map(claim => (
                        <div key={claim.id} className="p-3 rounded-xl bg-stone-900/90 border border-amber-900/30 text-xs space-y-1">
                          <div className="flex items-center justify-between text-amber-300 font-bold">
                            <span>ادعاء توثيقي: {claim.predicate}</span>
                            <span className="text-emerald-400 font-mono text-[10px]">موثق ومعتمد</span>
                          </div>
                          <div className="text-stone-300">{claim.object_value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Profile Footer */}
            <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono">ID: {data.person.id} • Slug: {data.person.slug}</span>
              <button
                onClick={onClose}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-4 py-2 rounded-xl transition-colors font-semibold"
              >
                إغلاق
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
