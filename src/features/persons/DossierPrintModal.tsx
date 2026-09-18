import React from 'react';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  Compass, 
  FileText, 
  Calendar, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';
import { ClaimVerificationItem } from '../../data/evidenceClaimsData';
import { Person, PersonName, Book, Place, School, Tariqa, Category, MathaniMeta } from '../../core/types';

interface DossierData {
  person: Person;
  names: PersonName[];
  books: Book[];
  birthPlace?: Place;
  deathPlace?: Place;
  school?: School;
  tariqa?: Tariqa;
  categories: Category[];
  mathaniMeta?: MathaniMeta | null;
  scholarlyClaims?: ClaimVerificationItem[];
  relationships: Array<{
    id: string;
    relation_label: string;
    confidence: string;
    related_person?: {
      name: string;
    };
  }>;
}

interface DossierPrintModalProps {
  data: DossierData;
  onClose: () => void;
}

export const DossierPrintModal: React.FC<DossierPrintModalProps> = ({ data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDateFormatted = new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'full'
  }).format(new Date());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-amber-800/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Action Header bar (Hidden when printing) */}
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span className="font-heritage text-lg font-bold text-amber-100">
              معاينة الوثيقة التوثيقية المعتمدة (Scholarly Dossier)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الوثيقة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-amber-50 text-stone-900 print:p-0 print:bg-white print:text-black">
          <div id="scholarly-dossier-document" className="max-w-3xl mx-auto space-y-6">
            
            {/* Header / Crest */}
            <div className="border-b-2 border-stone-800 pb-5 text-center space-y-2">
              <div className="text-[12px] tracking-widest text-stone-600 font-serif uppercase">
                الموسوعة الرقمية المعرفية للسبع المثاني • دار التحقيق العلمي
              </div>
              <h1 className="font-heritage text-3xl sm:text-4xl font-extrabold text-stone-900">
                وثيقة التوثيق والتحقيق المصدري المعتمدة
              </h1>
              <p className="text-xs text-stone-600 font-heritage">
                صحيفة بيوغرافية متكاملة لبيانات الشخصية، وموقعها في مراتب السبع المثاني وعقد التمام، وسجل الأدلة المقارنة
              </p>
              <div className="text-[11px] text-stone-500 font-mono pt-1">
                تاريخ الاستخراج: {currentDateFormatted} • معرف السجل: {data.person.id}
              </div>
            </div>

            {/* Person Banner Box */}
            <div className="p-5 rounded-2xl bg-white border border-stone-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 inline-block mb-1.5">
                  سجل شخصية معتمدة ومحققة
                </span>
                <h2 className="font-heritage text-2xl sm:text-3xl font-bold text-stone-950">
                  {data.person.primary_name}
                </h2>
                {data.names.length > 0 && (
                  <div className="text-xs text-stone-700 mt-1 font-heritage">
                    الألقاب والكنى: {data.names.map(n => n.name).join(' • ')}
                  </div>
                )}
              </div>

              <div className="text-left text-xs text-stone-600 space-y-1 font-mono border-t sm:border-t-0 sm:border-r sm:pr-4 border-stone-200 pt-2 sm:pt-0">
                <div>الميلاد: {data.person.birth_date || 'غير محدد'}</div>
                <div>الانتقال: {data.person.death_date || 'ـ'}</div>
                {data.school && <div>المذهب: {data.school.name}</div>}
                {data.tariqa && <div>المشرب: {data.tariqa.name}</div>}
              </div>
            </div>

            {/* Mathani Position Section (If applicable) */}
            {data.mathaniMeta && (
              <div className="p-5 rounded-2xl bg-amber-100/60 border border-amber-300/80 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold font-heritage text-base">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>
                    {data.mathaniMeta.isKnotCompleter
                      ? 'المقام في منظومة السبع المثاني: عقد التمام والرباط الجامع'
                      : `المقام في السبع المثاني: ${data.mathaniMeta.tierTitle}`}
                  </span>
                </div>
                <div className="text-xs text-stone-800 leading-relaxed font-heritage">
                  <strong>عالم الخدمة والوظيفة: </strong>
                  {data.mathaniMeta.tierRealm || 'عالم الجمع والتمام المحمدي'}
                </div>
                <div className="text-xs text-stone-800 leading-relaxed font-heritage">
                  <strong>بيان الوظيفة التكوينية والتشريعية: </strong>
                  {data.mathaniMeta.tierDuty || data.mathaniMeta.knotDuty}
                </div>
                {data.mathaniMeta.partners && data.mathaniMeta.partners.length > 0 && (
                  <div className="text-xs text-stone-700 pt-1 border-t border-amber-200">
                    <strong>
                      {data.mathaniMeta.isKnotCompleter ? 'الأئمة الثلاثة في عقد التمام: ' : 'رفقاء المرتبة الأربعة (شراكة المثنى): '}
                    </strong>
                    {data.mathaniMeta.partners.map(p => p.name).join('، ')}
                  </div>
                )}
              </div>
            )}

            {/* Biography & Scientific Context */}
            <div className="space-y-3">
              <h3 className="font-heritage text-lg font-bold text-stone-900 border-b border-stone-300 pb-1 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>الخلاصة البيوغرافية والسياق العلمي</span>
              </h3>
              {data.person.short_bio && (
                <p className="text-sm font-heritage leading-relaxed text-stone-800 bg-white p-4 rounded-xl border border-stone-200">
                  {data.person.short_bio}
                </p>
              )}
              {data.person.full_bio && (
                <div className="text-xs font-heritage leading-loose text-stone-700 bg-white p-4 rounded-xl border border-stone-200">
                  {data.person.full_bio}
                </div>
              )}
            </div>

            {/* Scholarly Claims & Evidence Ledger (Section 1 & 3 of prompt) */}
            <div className="space-y-3">
              <h3 className="font-heritage text-lg font-bold text-stone-900 border-b border-stone-300 pb-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>سجل الأدلة والمقارنة المنهجية للروايات (Evidence & Claims Ledger)</span>
              </h3>

              {data.scholarlyClaims && data.scholarlyClaims.length > 0 ? (
                <div className="space-y-4">
                  {data.scholarlyClaims.map((item, idx) => (
                    <div key={item.claim.id || idx} className="p-4 rounded-xl bg-white border border-stone-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heritage font-bold text-sm text-stone-950">
                          {idx + 1}. {item.topicTitle}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {item.consensusLevel === 'consensus' ? 'إجماع معتمد' : 'مروي بخلاف محقق'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-800 leading-relaxed font-heritage bg-stone-50 p-2.5 rounded border border-stone-200">
                        <strong>الدليل والنص المعتمد: </strong>
                        {item.primaryEvidence}
                      </div>

                      {/* Opposing/Alternative Narrations */}
                      {item.counterOrAlternativeOpinions && item.counterOrAlternativeOpinions.length > 0 && (
                        <div className="space-y-1.5 pt-1.5 border-t border-stone-200">
                          <div className="text-[11px] font-bold text-stone-700">مقارنة الروايات وأقوال المحققين دون شطب:</div>
                          {item.counterOrAlternativeOpinions.map(op => (
                            <div key={op.id} className="text-[11px] text-stone-600 bg-amber-50/50 p-2 rounded border border-amber-200 space-y-1">
                              <div className="flex items-center justify-between font-semibold text-stone-900">
                                <span>{op.schoolOrHistorian} — ({op.stance})</span>
                              </div>
                              <p className="font-heritage text-stone-700">{op.detail}</p>
                              {op.sources.length > 0 && (
                                <div className="text-[10px] text-stone-500 font-mono pt-0.5">
                                  المراجع: {op.sources.map(s => `${s.sourceTitle} (${s.author}${s.volumeAndPage ? `، ${s.volumeAndPage}` : ''})`).join(' • ')}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-stone-500 p-4 bg-white rounded-xl border border-stone-200">
                  تم توثيق الشخصية ومطابقتها وفق الأصول المتواترة لكتب التراجم والسير.
                </div>
              )}
            </div>

            {/* Connected Relationships Sample */}
            {data.relationships.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="font-heritage text-base font-bold text-stone-900 border-b border-stone-300 pb-1 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-stone-700" />
                  <span>شبكة الأسانيد والعلاقات الموثقة ({data.relationships.length} رابط)</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {data.relationships.slice(0, 6).map(r => (
                    <div key={r.id} className="p-2 bg-white rounded border border-stone-200 flex items-center justify-between">
                      <span className="font-heritage font-bold text-stone-900">
                        {r.related_person ? r.related_person.name : 'شخصية موثقة'}
                      </span>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                        {r.relation_label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Seal / Signature Footer */}
            <div className="pt-6 border-t-2 border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-2 border-amber-700 flex items-center justify-center font-heritage font-bold text-amber-800 text-sm">
                  محقّق
                </div>
                <div>
                  <div className="font-bold text-stone-900">لجنة التوثيق والتحقيق العلمي</div>
                  <div>منصة وموسوعة السبع المثاني الرقمية</div>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-stone-500">
                وثيقة رقمية استرشادية صادرة طبقاً لقواعد التحقيق المنهجي المعياري
              </div>
            </div>

          </div>
        </div>

        {/* Footer print bar */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors"
          >
            إغلاق المعاينة
          </button>
        </div>

      </div>
    </div>
  );
};
