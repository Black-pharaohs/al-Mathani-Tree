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
  Sparkles,
  Compass,
  Printer,
  Scale,
  Quote,
  CheckCircle2,
  HelpCircle,
  Landmark
} from 'lucide-react';
import { Person, PersonName, Book, Place, School, Tariqa, Category, Claim, MathaniMeta, Shrine } from '../../core/types';
import { ClaimVerificationItem, getPersonClaimsAndEvidence } from '../../data/evidenceClaimsData';
import { DossierPrintModal } from './DossierPrintModal';

interface PersonDetailResponse {
  person: Person;
  names: PersonName[];
  books: Book[];
  birthPlace?: Place;
  deathPlace?: Place;
  shrine?: Shrine;
  school?: School;
  tariqa?: Tariqa;
  categories: Category[];
  claims: Claim[];
  scholarlyClaims?: ClaimVerificationItem[];
  mathaniMeta?: MathaniMeta | null;
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
  onOpenInTree?: (personId: string) => void;
  onOpenPlace?: (placeId: string) => void;
}

export const PersonProfileModal: React.FC<PersonProfileModalProps> = ({
  personIdOrSlug,
  onClose,
  onSelectPerson,
  onOpenInTree,
  onOpenPlace
}) => {
  const [data, setData] = useState<PersonDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'bio' | 'mathani' | 'relations' | 'books' | 'sources'>('bio');
  const [showPrintDossier, setShowPrintDossier] = useState<boolean>(false);

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
                  <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-300">
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{data.person.birth_date || '؟'} — {data.person.death_date || '؟'}</span>
                      </div>

                      {data.birthPlace && (
                        <button
                          onClick={() => onOpenPlace?.(data.birthPlace!.id)}
                          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors group cursor-pointer"
                          title="عرض الموطن في أطلس المعالم"
                        >
                          <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span>الميلاد: {data.birthPlace.name}</span>
                        </button>
                      )}

                      {data.deathPlace && (
                        <button
                          onClick={() => onOpenPlace?.(data.deathPlace!.id)}
                          className="flex items-center gap-1.5 hover:text-amber-300 transition-colors group cursor-pointer"
                          title="عرض الموطن في أطلس المعالم"
                        >
                          <MapPin className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                          <span>الوفاة: {data.deathPlace.name}</span>
                        </button>
                      )}

                      {data.shrine && (
                        <button
                          onClick={() => onOpenPlace?.(data.shrine!.place_id)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-heritage transition-all shadow-sm"
                          title="عرض المرقد والمقام الشريف على أطلس المعالم"
                        >
                          <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                          <span>المرقد الشريف: {data.shrine.name}</span>
                        </button>
                      )}
                    </div>

                    {/* Dossier PDF / Print Action Button */}
                    <button
                      onClick={() => setShowPrintDossier(true)}
                      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>الملف التوثيقي المعتمد (Dossier PDF)</span>
                    </button>
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

              {data.mathaniMeta && (
                <button
                  onClick={() => setActiveTab('mathani')}
                  className={`flex items-center gap-2 py-3.5 px-3 border-b-2 font-medium transition-all ${
                    activeTab === 'mathani'
                      ? 'border-amber-400 text-amber-300 font-bold bg-amber-950/20'
                      : 'border-transparent text-amber-400/80 hover:text-amber-300'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {data.mathaniMeta.isKnotCompleter ? 'عقد التمام والرباط الجامع' : `مقام السبع المثاني (المرتبة ${data.mathaniMeta.tierNumber})`}
                  </span>
                </button>
              )}

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
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>سجل الأدلة والمقارنة المنهجية للروايات</span>
              </button>
            </div>

            {/* Profile Tab Contents */}
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6 text-stone-200 text-sm leading-relaxed">
              
              {/* Tab: Sab' Mathani Placement */}
              {activeTab === 'mathani' && data.mathaniMeta && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-900 border border-amber-500/40 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
                        <span className="font-heritage text-xl sm:text-2xl font-bold text-amber-200">
                          {data.mathaniMeta.isKnotCompleter ? data.mathaniMeta.knotTitle : data.mathaniMeta.tierTitle}
                        </span>
                      </div>
                      {data.mathaniMeta.isKnotCompleter ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-700/50">
                          عقد التمام الإلهي
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                          {data.mathaniMeta.tierShortTitle}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
                        <span className="text-amber-400 font-bold block">عالم الخدمة الإلهية:</span>
                        <span className="text-stone-300 font-medium">
                          {data.mathaniMeta.tierRealm || 'مقام الجمع والتمام المحمدي'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
                        <span className="text-amber-400 font-bold block">الرتبة في المنظومة:</span>
                        <span className="text-stone-300 font-medium">
                          {data.mathaniMeta.isKnotCompleter
                            ? 'أحد الأئمة الثلاثة المكملين لعقد كل أربعة'
                            : `المرتبة ${data.mathaniMeta.tierNumber} من السبع المثاني`}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 space-y-2">
                      <span className="text-amber-300 font-bold text-xs block">الوظيفة والخدمة الإلهية المنوطة:</span>
                      <p className="text-xs text-stone-300 font-heritage text-base leading-relaxed">
                        {data.mathaniMeta.isKnotCompleter ? data.mathaniMeta.knotDuty : data.mathaniMeta.tierDuty}
                      </p>
                    </div>

                    {onOpenInTree && (
                      <button
                        onClick={() => {
                          onOpenInTree(data.person.id);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs transition-all shadow-md"
                      >
                        <Compass className="w-4 h-4" />
                        <span>استعراض في الشجرة التفاعلية مع رفقاء المرتبة</span>
                      </button>
                    )}
                  </div>

                  {/* Partner figures in the tier */}
                  {data.mathaniMeta.partners && data.mathaniMeta.partners.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>
                          {data.mathaniMeta.isKnotCompleter ? 'الأئمة المشاركون في عقد التمام' : 'رفقاء المرتبة في هذا المثنى (الأربعة)'}
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {data.mathaniMeta.partners.map((partner) => (
                          <div
                            key={partner.id}
                            className="p-4 rounded-2xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 flex flex-col justify-between gap-3 transition-colors"
                          >
                            <div>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-2 inline-block">
                                {data.mathaniMeta?.isKnotCompleter ? 'إمام مكمل' : 'شريك في المثنى'}
                              </span>
                              <div className="font-heritage text-base font-bold text-stone-100">
                                {partner.name}
                              </div>
                            </div>
                            <button
                              onClick={() => onSelectPerson(partner.id)}
                              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 self-start"
                            >
                              <span>عرض الترجمة</span>
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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

              {/* Tab 4: Evidence & Conflict Verification Ledger (Sections 25-28 of Engineering Spec) */}
              {activeTab === 'sources' && (
                <div className="space-y-6">
                  {/* Top Header Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 border border-emerald-800/40 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-heritage text-lg font-bold text-emerald-200">
                          سجل الأدلة والمقارنة المنهجية للروايات (Evidence & Conflict Verification Ledger)
                        </h4>
                      </div>
                      
                      <button
                        onClick={() => setShowPrintDossier(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>تصدير الوثيقة للطباعة (PDF)</span>
                      </button>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed font-heritage">
                      التزاماً بمبادئ التحقيق العلمي الرصين، تعتمد المنصة نموذج الادعاءات المصدرية المقارنة؛ بحيث تُسند كل معلومة أو نسبة إلى مصدرها المعتمد، وتُعرض الروايات المتعددة والأقوال المقابلة جنباً إلى جنب دون شطب أو إقصاء.
                    </p>
                  </div>

                  {/* Scholarly Comparative Claims Ledger List */}
                  {(() => {
                    const claimsList = data.scholarlyClaims && data.scholarlyClaims.length > 0
                      ? data.scholarlyClaims
                      : getPersonClaimsAndEvidence(data.person.id, data.person.primary_name, data.person.short_bio);

                    return (
                      <div className="space-y-5">
                        {claimsList.map((item, idx) => (
                          <div 
                            key={item.claim.id || idx}
                            className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-emerald-700/50 transition-all space-y-4 shadow-sm"
                          >
                            {/* Topic Header & Consensus Badge */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800 pb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 flex items-center justify-center font-mono text-xs font-bold">
                                  {idx + 1}
                                </span>
                                <h5 className="font-heritage text-base font-bold text-stone-100">
                                  {item.topicTitle}
                                </h5>
                              </div>

                              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                                item.consensusLevel === 'consensus'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50'
                                  : 'bg-amber-950/80 text-amber-300 border-amber-700/50'
                              }`}>
                                {item.consensusLevel === 'consensus' ? 'إجماع معتمد ومستفيض' : 'رواية محققة ذات وجوه وخلاف'}
                              </span>
                            </div>

                            {/* Primary Assertion & Evidence */}
                            <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-850 space-y-2">
                              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>الرأي والادعاء المعتمد في السجل:</span>
                              </div>
                              <div className="text-xs text-stone-200 font-heritage leading-relaxed pl-2">
                                {item.claim.object_value}
                              </div>
                              
                              <div className="pt-2 border-t border-stone-900 text-xs text-stone-400 font-heritage flex items-start gap-1.5">
                                <Quote className="w-3.5 h-3.5 text-stone-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <strong className="text-stone-300">مستند التوثيق المعتمد: </strong>
                                  {item.primaryEvidence}
                                </div>
                              </div>
                            </div>

                            {/* Counter or Alternative Scholarly Narrations */}
                            {item.counterOrAlternativeOpinions && item.counterOrAlternativeOpinions.length > 0 && (
                              <div className="space-y-2.5 pt-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                                  <Scale className="w-4 h-4 text-amber-400" />
                                  <span>مقارنة الروايات وأقوال جهابذة المؤرخين (دون شطب):</span>
                                </div>

                                <div className="grid grid-cols-1 gap-2.5">
                                  {item.counterOrAlternativeOpinions.map(op => (
                                    <div 
                                      key={op.id}
                                      className="p-3.5 rounded-xl bg-stone-950/40 border border-stone-800/80 hover:border-stone-700 space-y-2 text-xs"
                                    >
                                      <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="font-bold text-amber-200">
                                          {op.schoolOrHistorian}
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                                          {op.stance}
                                        </span>
                                      </div>

                                      <p className="text-stone-300 font-heritage leading-relaxed">
                                        {op.detail}
                                      </p>

                                      {op.sources && op.sources.length > 0 && (
                                        <div className="pt-1.5 border-t border-stone-850 flex flex-wrap items-center gap-2 text-[11px] text-stone-400">
                                          <span className="text-stone-500 font-bold">المراجع والصفحات:</span>
                                          {op.sources.map((src, sIdx) => (
                                            <span 
                                              key={sIdx}
                                              className="inline-flex items-center gap-1 bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-stone-300 font-mono text-[10px]"
                                            >
                                              <BookOpen className="w-3 h-3 text-amber-500" />
                                              <span>{src.sourceTitle} ({src.author}{src.volumeAndPage ? `، ${src.volumeAndPage}` : ''})</span>
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Verification Note */}
                            {item.verificationNote && (
                              <div className="text-[11px] text-emerald-400/90 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                                <span>ملاحظة التحقيق: {item.verificationNote}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}

                  {/* Standard Base Claims & Primary Historical Sources */}
                  <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                    <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      أمهات المصادر المرجعية المعتمدة للشخصية
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300">
                        <strong className="text-stone-100">سير أعلام النبلاء</strong> — الإمام شمس الدين الذهبي (تحقيق محققي السير).
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300">
                        <strong className="text-stone-100">حلية الأولياء وطبقات الأصفياء</strong> — الحافظ أبو نعيم الأصفهاني.
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300">
                        <strong className="text-stone-100">لواقح الأنوار القدسية (الطبقات الكبرى)</strong> — الإمام عبد الوهاب الشعراني.
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-300">
                        <strong className="text-stone-100">شروح ومقامات السبع المثاني</strong> — الإمام فخر الدين محمد عثمان عبده البرهاني.
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Profile Footer */}
            <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span className="font-mono">ID: {data.person.id} • Slug: {data.person.slug}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrintDossier(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors font-semibold"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>طباعة الملف (Dossier)</span>
                </button>
                <button
                  onClick={onClose}
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 px-4 py-1.5 rounded-xl transition-colors font-bold"
                >
                  إغلاق
                </button>
              </div>
            </div>

            {/* Printable Research Dossier Modal */}
            {showPrintDossier && (
              <DossierPrintModal
                data={{
                  person: data.person,
                  names: data.names,
                  books: data.books,
                  birthPlace: data.birthPlace,
                  deathPlace: data.deathPlace,
                  school: data.school,
                  tariqa: data.tariqa,
                  categories: data.categories,
                  mathaniMeta: data.mathaniMeta,
                  scholarlyClaims: data.scholarlyClaims || getPersonClaimsAndEvidence(data.person.id, data.person.primary_name, data.person.short_bio),
                  relationships: data.relationships
                }}
                onClose={() => setShowPrintDossier(false)}
              />
            )}
          </>
        )}

      </div>
    </div>
  );
};
