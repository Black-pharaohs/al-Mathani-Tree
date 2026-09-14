import React from 'react';
import { ShieldCheck, Network, Layers, BookOpen, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

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

    </div>
  );
};
