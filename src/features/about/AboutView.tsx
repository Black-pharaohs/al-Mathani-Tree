import React from 'react';
import { ShieldCheck, Network, Layers, BookOpen, Compass, Sparkles, CheckCircle2, Database, GitBranch, Terminal } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-500/40 text-amber-200 text-3xl font-heritage font-bold shadow-xl mb-4">
          ٧
        </div>
        <h2 className="font-heritage text-3xl sm:text-5xl font-bold text-stone-900 mb-3 tracking-wide">
          عن منصة «السبع المثاني»
        </h2>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          البنية المعرفية الرقمية والرؤية الهندسية لبناء موسوعة الأعلام والعلاقات والشخصيات الإسلامية
        </p>
      </div>

      {/* Philosophy Card: The Tree is a View */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">المبدأ المعماري الحاكم</span>
            <h3 className="font-heritage text-2xl font-bold text-stone-900">
              «الشجرة واجهة عرض، وليست هي المعرفة نفسها»
            </h3>
          </div>
        </div>

        <p className="text-stone-700 text-sm sm:text-base leading-loose mb-4">
          في المعمارية الهندسية لمنصة <strong>«السبع المثاني»</strong>، لا يتم تخزين البيانات في صيغة أشجار هرمية مسبقة الصنع أو محدودة الروابط؛ بل تُبنى المنصة على أساس شبكة معرفة متكاملة (Knowledge Graph):
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs font-bold text-stone-800 text-center">
          <div className="p-2 bg-white rounded-xl shadow-2xs">الأعيان (Entities)</div>
          <div className="p-2 bg-white rounded-xl shadow-2xs">العلاقات (Relationships)</div>
          <div className="p-2 bg-white rounded-xl shadow-2xs">المصادر (Sources)</div>
          <div className="p-2 bg-white rounded-xl shadow-2xs">الأدلة (Claims & Evidence)</div>
        </div>

        <p className="text-stone-600 text-xs sm:text-sm mt-4 leading-relaxed">
          ومن هذا النموذج المتشابك، يقوم محرك الإسقاط (Projection Engine) بتوليد الأشجار المعرفية، والتراجم المفصلة، والخطوط الزمنية (Timelines)، والخرائط الجغرافية دون أي تقييد لقابلية التوسع.
        </p>
      </div>

      {/* Origin of "Al-Sab' Al-Mathani" as a Content Claim */}
      <div className="bg-gradient-to-br from-amber-950/10 via-stone-50 to-white rounded-3xl border border-amber-900/30 p-8 shadow-xs mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-900 text-amber-200 rounded-2xl shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">سياسة التوثيق والمصادر</span>
            <h3 className="font-heritage text-2xl font-bold text-stone-900">
              أصل التسمية: «السبع المثاني»
            </h3>
          </div>
        </div>

        <p className="text-stone-700 text-sm leading-loose mb-3">
          اسم المنصة مستوحى من حديث وشروحات <strong>مولانا الإمام فخر الدين محمد عثمان عبده البرهاني</strong> (مؤسس ومجدد الطريقة البرهانية الدسوقية الشاذلية) حول مفهوم «السبع المثاني» وسلاسل الاتصال الروحي والعلمي.
        </p>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-600/30 text-xs text-amber-950 leading-relaxed space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>الالتزام بالمعيار العلمي للمحتوى (Content Governance):</span>
          </div>
          <p>
            تتعامل المنصة مع هذه النسبة باعتبارها <strong>ادعاء محتوى موثقًا بمصدر (Content Claim with Source Documentation)</strong>، وليس كحقيقة تاريخية مفروضة برمجيًا. وتلتزم المنصة بتوفير اسم المصدر، والاقتباس، وتصنيف درجة التحقق، والتفريق التام بين الروايات التاريخية المتوارثة وبين الإجماع العلمي العام.
          </p>
        </div>
      </div>

      {/* Sprint 0 Milestones Delivered */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs">
        <h3 className="font-heritage text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          <span>إنجازات المرحلة التأسيسية (Sprint 0 Deliverables)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-stone-700">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
            <div>
              <span className="font-bold text-stone-900">Domain Model & Contracts:</span> تعريف شامل لكافة الكيانات وأنواع العلاقات في TypeScript.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
            <div>
              <span className="font-bold text-stone-900">Interactive Cytoscape Engine:</span> عارض تفاعلي يدعم التكبير، والفلترة، وLazy Loading، ولوحة التفاصيل الجانبية.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
            <div>
              <span className="font-bold text-stone-900">Modular REST API v1:</span> مسارات موثقة للبحث الموحد، والشخصيات، والأشجار، والمصادر.
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-50 border border-stone-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
            <div>
              <span className="font-bold text-stone-900">Arabic Normalizer & Search:</span> معالج لغوي دقيق للبحث في الهمزات والحركات والكنى والألقاب.
            </div>
          </div>
        </div>
      </div>

      {/* ADR-002: Backend Architecture & Implementation Phase 2 */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-950 rounded-3xl border border-stone-800 p-8 shadow-xl mt-8 text-stone-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60 text-[10px] font-mono font-bold">
                  قرار معماري معتمد: ADR-002
                </span>
                <span className="text-xs text-stone-400">البنود 17، 18، 48</span>
              </div>
              <h3 className="font-heritage text-xl sm:text-2xl font-bold text-stone-100 mt-1">
                اعتماد منصة Supabase (PostgreSQL) للبنية التحتية الخلفية
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold self-start sm:self-auto font-heritage">
            المرحلة الثانية (Phase 2)
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-300 leading-loose mb-6 font-serif">
          تم اعتماد منصة <strong>Supabase</strong> مفتوحة المصدر كبنية تحتية موحدة للخدمات الخلفية وقاعدة البيانات، وذلك لتطابقها الكامل مع مخطط البيانات العلائقي (<code className="text-amber-300 font-mono">001_initial_schema.sql</code>)، وقدرتها الأصيلة على تنفيذ الاستعلامات الشجرية العودية (<code className="text-amber-300 font-mono">WITH RECURSIVE</code>) لتتبع سلاسل الأسانيد، بالإضافة إلى حوكمة الأمان المتقدمة على مستوى الصفوف (<code className="text-amber-300 font-mono">Row-Level Security - RLS</code>) ودعم امتدادات اللغة العربية والجغرافيا.
        </p>

        {/* Phase 2 Sub-steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 font-heritage">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>الخطوة 2.1 — المخطط والامتدادات</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              تطبيق 24 جدولاً علائقياً مع تفعيل امتدادات pg_trgm للبحث العربي وامتداد PostGIS لأطلس المعالم.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 font-heritage">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>الخطوة 2.2 — حوكمة الصلاحيات (RLS)</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              تفعيل أمان الصفوف لعزل المسودات وحصر الاعتماد النهائي للأدلة والمشجرات على المدققين المعتمدين.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-stone-950/70 border border-stone-800/80 space-y-1">
            <div className="text-amber-400 font-bold flex items-center gap-1.5 font-heritage">
              <GitBranch className="w-3.5 h-3.5 text-amber-400" />
              <span>الخطوة 2.3 — محول المستودع (Adapter)</span>
            </div>
            <p className="text-stone-400 leading-relaxed text-[11px]">
              ربط SupabaseRepository في خادم Express مع الإبقاء التام على عقود REST API v1 الحالية.
            </p>
          </div>
        </div>
      </div>


    </div>
  );
};
