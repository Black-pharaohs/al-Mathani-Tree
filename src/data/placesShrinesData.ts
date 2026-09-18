/**
 * السبع المثاني — أطلس المعالم والمراقد والأماكن التاريخية والرحلات العلمية
 * Strictly compliant with Section 48 & Sections 17, 18 of Engineering Specification V1
 * Content Governance & Source-First Policy
 */

import { Place, Shrine, VerificationStatus } from '../core/types';

export interface PlaceWithDetails extends Place {
  historicalImportance: string;
  associatedMathaniTiers?: number[];
  shrinesCount?: number;
  bornPersonsCount?: number;
  diedPersonsCount?: number;
}

export interface ShrineWithPerson extends Shrine {
  personName: string;
  personSlug: string;
  placeName: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  mathaniTier?: number;
  mathaniRole?: string;
  visitationTradition?: string;
  sourceReference: string;
}

export interface ScholarlyJourney {
  id: string;
  personId: string;
  personName: string;
  title: string;
  summary: string;
  stops: Array<{
    placeId: string;
    placeName: string;
    stageTitle: string;
    description: string;
    yearApprox?: string;
  }>;
}

export interface HistoricalEra {
  id: string;
  name: string;
  spanYears: string;
  description: string;
  color: string;
  keyFigures: string[];
}

export const SEED_HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'era-prophetic',
    name: 'عصر النبوة والرسالة',
    spanYears: 'قبل الهجرة — 11 هـ',
    description: 'مهبط الوحي، وتأسيس الشريعة، وظهور أصول السبع المثاني وآل البيت والصحابة الأطهار.',
    color: '#059669', // emerald
    keyFigures: ['person-ali', 'person-hassan', 'person-hussain']
  },
  {
    id: 'era-rashidun',
    name: 'عصر الخلفاء الراشدين',
    spanYears: '11 هـ — 40 هـ',
    description: 'عهد الخلافة الراشدة، جمع القرآن الكريم، وتوسيع ديوان الإسلام والفتوحات.',
    color: '#0d9488', // teal
    keyFigures: ['person-ali']
  },
  {
    id: 'era-tabiin',
    name: 'عصر التابعين ورواة الأثر',
    spanYears: '40 هـ — 150 هـ',
    description: 'تثبيت رواية الحديث النبوي، تأسيس مدرسة المدينة المنورة ومدرسة الكوفة والبصرة.',
    color: '#d97706', // amber
    keyFigures: ['person-malik', 'person-abu-hanifa']
  },
  {
    id: 'era-madhahib',
    name: 'عصر أئمة المذاهب والتدوين',
    spanYears: '150 هـ — 300 هـ',
    description: 'تدوين الفقه الشامل، أصول الفقه، ضبط كتب الصحاح والمسانيد والسنن الأربعة.',
    color: '#2563eb', // blue
    keyFigures: ['person-shafii', 'person-ahmad', 'person-bukhari']
  },
  {
    id: 'era-tasawwuf-golden',
    name: 'عصر كبار الأقطاب وسلوك السبع المثاني',
    spanYears: '500 هـ — 700 هـ',
    description: 'ظهور أقطاب السبع المثاني الكبار (الجيلاني، الرفاعي، البدوي، الشاذلي، الدسوقي) وانتشار التربية السلوكية.',
    color: '#7c3aed', // violet
    keyFigures: ['person-jilani', 'person-shadhili', 'person-dasuqi']
  },
  {
    id: 'era-modern-revival',
    name: 'عصر التجديد والانتشار المعاصر',
    spanYears: '1300 هـ — العصر الحاضر',
    description: 'شروح علوم السبع المثاني والتربية الروحية الجامعة عبر مولانا الإمام فخر الدين والنهضة التوثيقية.',
    color: '#b45309', // warm amber
    keyFigures: ['person-fakhr-al-din']
  }
];

export const DETAILED_PLACES: PlaceWithDetails[] = [
  {
    id: 'plc-madinah',
    name: 'المدينة المنورة (طيبة الطيبة)',
    slug: 'al-madinah-al-munawwarah',
    country: 'المملكة العربية السعودية',
    region: 'الحجاز',
    city: 'المدينة المنورة',
    latitude: 24.4672,
    longitude: 39.6111,
    description: 'طيبة الطيبة ودار الهجرة النبوية الشريفة وعاصمة الإسلام الأولى، تضم الحجرة النبوية وبقيع الغرقد ومسجد رسول الله صلى الله عليه وسلم.',
    historicalImportance: 'مهد الشريعة النبوية، وموطن إمام دار الهجرة مالك بن أنس، ومرقد أئمة أهل البيت والصحابة الكرام.',
    associatedMathaniTiers: [1, 2, 3, 5]
  },
  {
    id: 'plc-makkah',
    name: 'مكة المكرمة (البلد الحرام)',
    slug: 'makkah-al-mukarramah',
    country: 'المملكة العربية السعودية',
    region: 'الحجاز',
    city: 'مكة المكرمة',
    latitude: 21.4225,
    longitude: 39.8262,
    description: 'أم القرى وقبلة المسلمين، مهبط الوحي ومولد رسول الله صلى الله عليه وسلم ومولد أمير المؤمنين علي بن أبي طالب في جوف الكعبة المشرفة.',
    historicalImportance: 'المركز الروحي للأمة، ومنشأ الإمام الشافعي المبكر، ومحج الأئمة والعلماء والأولياء عبر العصور.',
    associatedMathaniTiers: [1, 2, 4, 7]
  },
  {
    id: 'plc-kufa',
    name: 'الكوفة والنجف الأشرف',
    slug: 'al-kufa-and-najaf',
    country: 'العراق',
    region: 'العراق الأوسط',
    city: 'النجف الأشرف / الكوفة',
    latitude: 32.0300,
    longitude: 44.4000,
    description: 'حاضرة الخلافة العلوية، ومقر المشهد العلوي الشريف للإمام علي بن أبي طالب، ومركز الفقه الكوفي الأصيل ومحراب مسجد الكوفة المعظم.',
    historicalImportance: 'عاصمة أمير المؤمنين، وموطن مدرسة الرأي والإمام أبي حنيفة وتخريج كبار المحدثين والفقهاء.',
    associatedMathaniTiers: [1, 3, 5]
  },
  {
    id: 'plc-karbala',
    name: 'كربلاء المقدسة',
    slug: 'karbala',
    country: 'العراق',
    region: 'العراق الأوسط',
    city: 'كربلاء المقدسة',
    latitude: 32.6160,
    longitude: 44.0249,
    description: 'أرض الطف وموضع استشهاد سبط رسول الله وسيد شباب أهل الجنة الإمام الحسين بن علي وأهل بيته وصحبه الكرام في عاشوراء.',
    historicalImportance: 'رمز التضحية وإرساء الشهادة، تضم الروضة الحسينية المقدسة وروضة العباس بن علي ومزارات شهداء كربلاء.',
    associatedMathaniTiers: [1, 2]
  },
  {
    id: 'plc-baghdad',
    name: 'بغداد (دار السلام)',
    slug: 'baghdad-dar-al-salam',
    country: 'العراق',
    region: 'العراق',
    city: 'بغداد',
    latitude: 33.3152,
    longitude: 44.3661,
    description: 'عاصمة الدولة العباسية وعاصمة العلم والحديث والتصوف في العالم الإسلامي، تضم مقابر الأئمة الأربعة والأولياء الكبار.',
    historicalImportance: 'تضم الحضرة القادرية للإمام عبد القادر الجيلاني، وجامع الإمام الأعظم أبي حنيفة، ومقام الإمام أحمد بن حنبل، والكاظمية والجُنيد ومعروف الكرخي.',
    associatedMathaniTiers: [3, 4, 5]
  },
  {
    id: 'plc-cairo',
    name: 'القاهرة والفسطاط',
    slug: 'cairo-and-fustat',
    country: 'مصر',
    region: 'مصر الكبرى',
    city: 'القاهرة / الفسطاط',
    latitude: 30.0444,
    longitude: 31.2357,
    description: 'حاضرة مصر التاريخية ومستقر الإمام الشافعي ومؤلف مذهبه الجديد، وموئل مشاهد آل البيت النبوي (السيدة زينب، السيدة نفيسة، الحسين بالقاهرة).',
    historicalImportance: 'مركز النهضة العلمية والتدوين، ومقر القبة الشافعية وقرافة مصر الجامعة لأئمة العلم والسلوك.',
    associatedMathaniTiers: [2, 3, 4, 6]
  },
  {
    id: 'plc-alexandria',
    name: 'الإسكندرية (ثغر المرابطين)',
    slug: 'alexandria',
    country: 'مصر',
    region: 'الساحل الشمالي المصري',
    city: 'الإسكندرية',
    latitude: 31.2001,
    longitude: 29.9187,
    description: 'ثغر مصر وحاضرة البحر، مأوى الإمام أبي الحسن الشاذلي وخليفته سيدي أبي العباس المرسي والإمام البوصيري صاحب البردة.',
    historicalImportance: 'مركز الإشعاع الشاذلي الأصيل ومدرسة الحقيقة الممتزجة بنصوص الشريعة.',
    associatedMathaniTiers: [4, 6]
  },
  {
    id: 'plc-disuq',
    name: 'دسوق (حرم القطب الدسوقي)',
    slug: 'disuq',
    country: 'مصر',
    region: 'محافظة كفر الشيخ - الدلتا',
    city: 'دسوق',
    latitude: 31.1308,
    longitude: 30.6481,
    description: 'المدينة المباركة على ضفاف نهر النيل فرع رشيد، مهد ومقام القطب الرابع الإمام إبراهيم الدسوقي ومسجده التاريخي العريق.',
    historicalImportance: 'مركز الطريقة الدسوقية والبرهانية ومنشأ علوم السبع المثاني وأسرار الحقائق الدسوقية.',
    associatedMathaniTiers: [4, 7]
  },
  {
    id: 'plc-tanta',
    name: 'طنطا (حرم السيد البدوي)',
    slug: 'tanta',
    country: 'مصر',
    region: 'محافظة الغربية - الدلتا',
    city: 'طنطا',
    latitude: 30.7865,
    longitude: 31.0004,
    description: 'قلب الدلتا ومقام القطب النبوي الشريف سيدي أحمد البدوي ومسجده الأحمدي الشهير الذي جمع الملايين من المحبين والعلماء.',
    historicalImportance: 'أحد أركان الأقطاب الأربعة في مصر، وتاريخ ممتد من التربية والتزكية وإيواء الوافدين وطلاب العلم.',
    associatedMathaniTiers: [4]
  },
  {
    id: 'plc-humaythara',
    name: 'وادي حميثراء (صحراء عيذاب)',
    slug: 'humaythara',
    country: 'مصر',
    region: 'البحر الأحمر / صعيد مصر',
    city: 'مرسى علم / حميثراء',
    latitude: 24.7167,
    longitude: 34.8500,
    description: 'الوادي المبارك بصحراء عيذاب في طريق الحج التاريخي، حيث وافت المنية القطب سيدي أبا الحسن الشاذلي وهو في طريقه إلى بيت الله الحرام سنة 656 هـ.',
    historicalImportance: 'مقام القطب الشاذلي وبئره المباركة التي تفجرت عذباً زلالاً، ومزار ومحطة روحية تاريخية لأهل السلوك والوفود.',
    associatedMathaniTiers: [4]
  },
  {
    id: 'plc-omdurman',
    name: 'الخرطوم وأم درمان (مقر الزاوية البرهانية)',
    slug: 'omdurman-and-khartoum',
    country: 'السودان',
    region: 'ولاية الخرطوم',
    city: 'أم درمان / الخرطوم',
    latitude: 15.6500,
    longitude: 32.4833,
    description: 'حاضرة السودان ومستقر الزاوية والمقام الشريف لمولانا الإمام فخر الدين الشيخ محمد عثمان عبده البرهاني ومجدد الطريقة البرهانية الدسوقية الشاذلية.',
    historicalImportance: 'منطلق تجديد علوم السبع المثاني وشروحها ونشر الطريقة في قارات العالم وإحياء حلقات الذكر والإنشاد التراثي.',
    associatedMathaniTiers: [7]
  },
  {
    id: 'plc-damascus',
    name: 'دمشق الفيحاء',
    slug: 'damascus',
    country: 'سوريا',
    region: 'بلاد الشام',
    city: 'دمشق',
    latitude: 33.5138,
    longitude: 36.2765,
    description: 'حاضرة الشام وعاصمة الدولة الأموية، تضم الجامع الأموي الكبير، ومقبرة الباب الصغير، ومقام الشيخ الأكبر محيي الدين بن عربي بالصالحية.',
    historicalImportance: 'محور علمي وتاريخي عتيد ضم كبار المحدثين والفقهاء والصلحاء من أهل البيت والصحابة والتابعين.',
    associatedMathaniTiers: [2, 3, 5]
  },
  {
    id: 'plc-bukhara',
    name: 'بخارى وسمرقند',
    slug: 'bukhara-and-samarkand',
    country: 'أوزبكستان',
    region: 'بلاد ما وراء النهر',
    city: 'بخارى / سمرقند',
    latitude: 39.7681,
    longitude: 64.4556,
    description: 'حاضرة بلاد ما وراء النهر ومسقط رأس إمام أهل الحديث محمد بن إسماعيل البخاري، وموطن الطريقة النقشبندية العلية.',
    historicalImportance: 'منجم رواية الحديث الصحيح وتصنيف المصنفات الحديثية التي قامت عليها سائر الشريعة المطهرة.',
    associatedMathaniTiers: [3, 5]
  },
  {
    id: 'plc-fes',
    name: 'فاس العلمية',
    slug: 'fes-al-bali',
    country: 'المملكة المغربية',
    region: 'المغرب الأقصى',
    city: 'فاس',
    latitude: 34.0333,
    longitude: -5.0000,
    description: 'حاضرة الإدريسيين ومنارة جامع القرويين، تضم ضريح المولى إدريس الأزهر حفيد الإمام الحسن وضريح القطب أحمد التيجاني.',
    historicalImportance: 'أقدم جامعة في العالم وعاصمة العلم والنسب الإدريسي الشريف في المغرب والأندلس.',
    associatedMathaniTiers: [1, 4]
  }
];

export const SEED_SHRINES: ShrineWithPerson[] = [
  {
    id: 'shrine-ali',
    person_id: 'person-ali',
    place_id: 'plc-kufa',
    personName: 'أمير المؤمنين الإمام علي بن أبي طالب',
    personSlug: 'ali-ibn-abi-talib',
    name: 'المشهد والروضة الحيدرية الشريفة بالنجف الأشرف',
    placeName: 'النجف الأشرف / الكوفة',
    country: 'العراق',
    city: 'النجف الأشرف',
    latitude: 31.9961,
    longitude: 44.3142,
    mathaniTier: 1,
    mathaniRole: 'أصل السبع المثاني وباب مدينة العلم النبوي',
    description: 'المرقد الطاهر لأمير المؤمنين ورابع الخلفاء الراشدين ووالد السبطين وزوج سيدة نساء العالمين، أجمع المؤرخون وأهل البيت على دفنه بموضع الغري بالنجف الأشرف.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'مزار عالمي محقق يقصده الملايين سنوياً، مشهور بالمهابة والسكينة.',
    sourceReference: 'تاريخ بغداد للخطيب (ج1 ص136)، الكامل في التاريخ لابن الأثير (ج3 ص260).'
  },
  {
    id: 'shrine-hussain',
    person_id: 'person-hussain',
    place_id: 'plc-karbala',
    personName: 'سيد الشهداء الإمام الحسين بن علي',
    personSlug: 'al-hussain-ibn-ali',
    name: 'الروضة الحسينية المقدسة بكربلاء',
    placeName: 'كربلاء المقدسة',
    country: 'العراق',
    city: 'كربلاء',
    latitude: 32.6164,
    longitude: 44.0324,
    mathaniTier: 1,
    mathaniRole: 'سيد شباب أهل الجنة وريحانة رسول الله',
    description: 'المرقد الشريف للإمام الحسين بن علي بموضع استشهاده يوم عاشوراء بكربلاء، ويجاوره مرقد ولده علي الأكبر والشهداء وروضة أبي الفضل العباس.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'من أعظم المشاهد إجماعاً ومقصداً للزائرين من أرجاء المعمورة.',
    sourceReference: 'البداية والنهاية لابن كثير (ج8 ص204)، سير أعلام النبلاء للذهبي (ج3 ص312).'
  },
  {
    id: 'shrine-hassan',
    person_id: 'person-hassan',
    place_id: 'plc-madinah',
    personName: 'الإمام الحسن بن علي المجتبى',
    personSlug: 'al-hassan-ibn-ali',
    name: 'مقام الإمام الحسن بالبقيع الغرقد',
    placeName: 'المدينة المنورة',
    country: 'المملكة العربية السعودية',
    city: 'المدينة المنورة',
    latitude: 24.4678,
    longitude: 39.6150,
    mathaniTier: 1,
    mathaniRole: 'سيد شباب أهل الجنة وسيد الصلح',
    description: 'مرقد الإمام الحسن بن علي رضي الله عنهما بجوار أمه فاطمة الزهراء وأئمة أهل البيت في مقبرة بقيع الغرقد بالمدينة المنورة.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'يقصده الحجاج والزوار في كل موسم للسلام على سبط المصطفى.',
    sourceReference: 'طبقات ابن سعد (ج3 ص36)، الاستيعاب لابن عبد البر (ج1 ص389).'
  },
  {
    id: 'shrine-malik',
    person_id: 'person-malik',
    place_id: 'plc-madinah',
    personName: 'الإمام مالك بن أنس',
    personSlug: 'malik-ibn-anas',
    name: 'روضة إمام دار الهجرة بالبقيع',
    placeName: 'المدينة المنورة',
    country: 'المملكة العربية السعودية',
    city: 'المدينة المنورة',
    latitude: 24.4682,
    longitude: 39.6158,
    mathaniTier: 3,
    mathaniRole: 'إمام دار الهجرة وناشر الموطأ',
    description: 'مرقد الإمام مالك بن أنس الأصبحي بالبقيع الغرقد المبارك بالقرب من مشهد أهل البيت والصحابة رضي الله عنهم.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'موضع إجماع لدى علماء الأمة وأهل الحديث وتراجم الحفاظ.',
    sourceReference: 'ترتيب المدارك للقاضي عياض (ج1 ص112)، وفيات الأعيان لابن خلكان (ج4 ص135).'
  },
  {
    id: 'shrine-shafii',
    person_id: 'person-shafii',
    place_id: 'plc-cairo',
    personName: 'الإمام محمد بن إدريس الشافعي',
    personSlug: 'muhammad-ibn-idris-al-shafii',
    name: 'القبة والمسجد الشافعي بالقرافة الصغرى',
    placeName: 'القاهرة والفسطاط',
    country: 'مصر',
    city: 'القاهرة',
    latitude: 30.0125,
    longitude: 31.2589,
    mathaniTier: 3,
    mathaniRole: 'مؤسس علم الأصول وناصر الحديث',
    description: 'المرقد الشريف للإمام الشافعي المطلبي القرشي، تعلوه القبة الخشبية الأيوبية التاريخية الكبرى بالقرافة بالقاهرة، وبجواره مسجده الشهير.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'مزار تاريخي عريق يؤمه أئمة الفقه والشافعية والأزهر الشريف.',
    sourceReference: 'طبقات الشافعية الكبرى للسبكي (ج2 ص67)، النجوم الزاهرة لابن تغري بردي.'
  },
  {
    id: 'shrine-abu-hanifa',
    person_id: 'person-abu-hanifa',
    place_id: 'plc-baghdad',
    personName: 'الإمام أبو حنيفة النعمان',
    personSlug: 'abu-hanifa-al-numan',
    name: 'جامع ومقام الإمام الأعظم بالأعظمية',
    placeName: 'بغداد (دار السلام)',
    country: 'العراق',
    city: 'بغداد',
    latitude: 33.3725,
    longitude: 44.3592,
    mathaniTier: 3,
    mathaniRole: 'إمام المذهب الحنفي وفقيه العراق',
    description: 'مرقد الإمام الأعظم أبي حنيفة بمقبرة الخيزران بالأعظمية في بغداد، وشيد عليه مسجده الجامع وكلية أصول الدين الحنفية.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'أحد أشهر معالم بغداد التاريخية والدينية المتصلة بالإسناد الفقهي.',
    sourceReference: 'تاريخ بغداد للخطيب البغدادي (ج13 ص323)، الجواهر المضيئة في طبقات الحنفية.'
  },
  {
    id: 'shrine-ahmad',
    person_id: 'person-ahmad',
    place_id: 'plc-baghdad',
    personName: 'الإمام أحمد بن حنبل الشيباني',
    personSlug: 'ahmad-ibn-hanbal',
    name: 'مرقد ومقام إمام أهل السنة أحمد بن حنبل',
    placeName: 'بغداد (دار السلام)',
    country: 'العراق',
    city: 'بغداد',
    latitude: 33.3444,
    longitude: 44.3789,
    mathaniTier: 3,
    mathaniRole: 'إمام أهل السنة وصاحب المسند',
    description: 'مرقد الإمام أحمد بن حنبل بمقبرة باب حرب بالكرخ ببغداد، حيث شيع جنازته مئات الآلاف من المسلمين في يوم مشهود في التاريخ.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'مزار تواترت عليه طبقات الحنابلة والمحدثين عبر القرون.',
    sourceReference: 'سير أعلام النبلاء للذهبي (ج11 ص341)، البداية والنهاية لابن كثير.'
  },
  {
    id: 'shrine-jilani',
    person_id: 'person-jilani',
    place_id: 'plc-baghdad',
    personName: 'الإمام محيي الدين عبد القادر الجيلاني',
    personSlug: 'abdul-qadir-al-jilani',
    name: 'الحضرة القادرية الشريفة بباب الشيخ',
    placeName: 'بغداد (دار السلام)',
    country: 'العراق',
    city: 'بغداد',
    latitude: 33.3361,
    longitude: 44.4089,
    mathaniTier: 4,
    mathaniRole: 'القطب الأول من أقطاب السبع المثاني الأربعة',
    description: 'مرقد الشيخ عبد القادر الجيلاني الحسني بالرصافة في بغداد، وهو مجمع روحي عظيم يضم مدرسته الفقهية الحنبلية وزاويته ومكتبته القادرية النفيسة.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'من أشهر معالم العالم الإسلامي التي يقصدها مريدو القادرية والعلماء.',
    sourceReference: 'قلائد الجواهر للتادفي، ذيل طبقات الحنابلة لابن رجب (ج1 ص290).'
  },
  {
    id: 'shrine-shadhili',
    person_id: 'person-shadhili',
    place_id: 'plc-humaythara',
    personName: 'الإمام أبو الحسن الشاذلي',
    personSlug: 'abu-al-hassan-al-shadhili',
    name: 'مقام وضريح سيدي أبي الحسن الشاذلي بحميثراء',
    placeName: 'وادي حميثراء (صحراء عيذاب)',
    country: 'مصر',
    city: 'مرسى علم / حميثراء',
    latitude: 24.7167,
    longitude: 34.8500,
    mathaniTier: 4,
    mathaniRole: 'قطب الشاذلية وركن السبع المثاني',
    description: 'المرقد المبارك للإمام الشاذلي في وادي حميثراء بالصحراء الشرقية بمصر، توفي فيه وهو متوجه إلى حج بيت الله الحرام سنة 656 هـ بعد أن أوصى أصحابه بالبقاء على نهج الشريعة.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'محطة سنوية كبرى يقصدها أهل الذكر والمحبون من مصر والعالم الإسلامي.',
    sourceReference: 'لطائف المنن لابن عطاء الله السكندري، درة الأسرار لابن الصباغ.'
  },
  {
    id: 'shrine-dasuqi',
    person_id: 'person-dasuqi',
    place_id: 'plc-disuq',
    personName: 'الإمام إبراهيم الدسوقي',
    personSlug: 'ibrahim-al-dasuqi',
    name: 'المسجد الإبراهيمي والمقام الشريف بدسوق',
    placeName: 'دسوق (حرم القطب الدسوقي)',
    country: 'مصر',
    city: 'دسوق',
    latitude: 31.1308,
    longitude: 30.6481,
    mathaniTier: 4,
    mathaniRole: 'القطب الرابع من أقطاب السبع المثاني وأصل الطريقة البرهانية',
    description: 'المرقد الشريف للإمام إبراهيم بن عبد العزيز أبي المجد القرشي الحسيني بدسوق، وهو مجمع إسلامي عريق يضم مسجده الفسيح وضريحه وضريح شقيقه سيدي شرف الدين موسى.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'مزار عتيد ومحط احتفالات المولد الدسوقي ورعاية طلاب العلم والمساكين.',
    sourceReference: 'الطبقات الكبرى للشعراني (ج1 ص154)، كواكب الدرية للمناوي.'
  },
  {
    id: 'shrine-fakhr-al-din',
    person_id: 'person-fakhr-al-din',
    place_id: 'plc-omdurman',
    personName: 'مولانا الإمام فخر الدين محمد عثمان عبده البرهاني',
    personSlug: 'fakhr-al-din-muhammad-uthman',
    name: 'المقام الشريف والزاوية البرهانية بالخرطوم',
    placeName: 'الخرطوم وأم درمان',
    country: 'السودان',
    city: 'الخرطوم / أم درمان',
    latitude: 15.6500,
    longitude: 32.4833,
    mathaniTier: 7,
    mathaniRole: 'مجدد الطريقة البرهانية وناشر شروح السبع المثاني',
    description: 'المرقد والمقام الشريف لمولانا الإمام فخر الدين الشيخ محمد عثمان عبده البرهاني، وبجواره نجله وخليفته الشيخ إبراهيم، في المقر العام للطريقة البرهانية الدسوقية الشاذلية بالخرطوم.',
    historical_status: 'confirmed',
    verification_status: 'verified',
    visitationTradition: 'مركز التربية الروحية وتلاوة الأحزاب والقصائد وشروح أسرار المعرفة الصوفية.',
    sourceReference: 'سجلات الطريقة البرهانية الدسوقية الشاذلية، وتوثيق مؤلفات وتراث الإمام فخر الدين.'
  }
];

export const SCHOLARLY_JOURNEYS: ScholarlyJourney[] = [
  {
    id: 'journey-shafii',
    personId: 'person-shafii',
    personName: 'الإمام محمد بن إدريس الشافعي',
    title: 'رحلة تأسيس الفقه والأصول: من بطحاء مكة إلى الفسطاط',
    summary: 'مسار علمي تاريخي امتد بين الحجاز والعراق واليمن ومصر، أثمر المذهب القديم فالمذهب الجديد وكتاب الرسالة والأم.',
    stops: [
      {
        placeId: 'plc-makkah',
        placeName: 'مكة المكرمة',
        stageTitle: 'النشأة وحفظ الموطأ واللغة',
        description: 'نشأ يتيماً في شعب أبي طالب، حفظ القرآن وهو ابن سبع، وحفظ موطأ مالك وهو ابن عشر، وتفقه على مسلم بن خالد الزنجي.',
        yearApprox: '150 — 170 هـ'
      },
      {
        placeId: 'plc-madinah',
        placeName: 'المدينة المنورة',
        stageTitle: 'ملازمة إمام دار الهجرة مالك بن أنس',
        description: 'قدم على الإمام مالك وقرأ عليه الموطأ حفظاً عن ظهر قلب، فلازمه حتى توفي الإمام مالك سنة 179 هـ.',
        yearApprox: '170 — 179 هـ'
      },
      {
        placeId: 'plc-baghdad',
        placeName: 'بغداد (دار السلام)',
        stageTitle: 'مناظرة أهل العراق وتدوين المذهب القديم',
        description: 'ورد بغداد سنة 184 هـ واجتمع بمحمد بن الحسن الشيباني وأخذ كتب أهل الرأي، ثم عاد إليها سنة 195 هـ وصنف كتاب الحجة (المذهب القديم).',
        yearApprox: '184 — 198 هـ'
      },
      {
        placeId: 'plc-cairo',
        placeName: 'الفسطاط والقاهرة',
        stageTitle: 'الاستقرار في مصر وتدوين المذهب الجديد',
        description: 'دخل مصر سنة 199 هـ ومعه كتابه الرسالة في أصول الفقه، وأعاد صياغة مذهبه على فقه أصحابه هناك حتى وافاه الأجل سنة 204 هـ ودفن بالقرافة.',
        yearApprox: '199 — 204 هـ'
      }
    ]
  },
  {
    id: 'journey-shadhili',
    personId: 'person-shadhili',
    personName: 'الإمام أبو الحسن الشاذلي',
    title: 'مسار التجريد والشريعة: من المغرب إلى ثغر الإسكندرية فوادي حميثراء',
    summary: 'السير الروحي لقطب الشاذلية من جبال غمارة والمغرب وتونس، حتى الاستقرار بثغر الإسكندرية والارتحال إلى حميثراء.',
    stops: [
      {
        placeId: 'plc-fes',
        placeName: 'شمال المغرب (غمارة وتطوان)',
        stageTitle: 'اللقاء بالقطب عبد السلام بن مشيش',
        description: 'أخذ عن سيدي عبد السلام بن مشيش في جبل العلم، وأمره شيخه بالرحيل إلى إفريقية (تونس) لتبليغ منهج الذكر والافتقار.',
        yearApprox: 'حوالي 615 هـ'
      },
      {
        placeId: 'plc-alexandria',
        placeName: 'ثغر الإسكندرية',
        stageTitle: 'تأسيس حلقات الطريق وتخريج المرسي أبي العباس',
        description: 'قدم الإسكندرية واجتمع عليه العلماء والأولياء، وأرسى دعائم الطريقة الشاذلية السنية القائمة على الشكر والاستغناء بالله ومجاهدة النفس دون رهبانية.',
        yearApprox: '642 — 656 هـ'
      },
      {
        placeId: 'plc-humaythara',
        placeName: 'وادي حميثراء',
        stageTitle: 'الوفاة في طريق الحج والشهود الأخير',
        description: 'خرج متوجهاً إلى الحج بصحبة أصحابه، ونزل بوادي حميثراء بوعثاء صحراء عيذاب، ففاضت روحه الطاهرة هناك ودُفن بها.',
        yearApprox: '656 هـ'
      }
    ]
  },
  {
    id: 'journey-bukhari',
    personId: 'person-bukhari',
    personName: 'إمام المحدثين الإمام البخاري',
    title: 'الرحلة الكبرى في طلب الحديث: جمع الصحيح عبر أمصار الإسلام',
    summary: 'طاف الإمام البخاري كبريات حواضر العالم الإسلامي لسماع وسند الحديث النبوي الشريف وتنقيح أحاديث الجامع الصحيح.',
    stops: [
      {
        placeId: 'plc-bukhara',
        placeName: 'بخارى وسمرقند',
        stageTitle: 'البدايات ونبوغ الحفظ الخارق',
        description: 'بدأ طلب الحديث وهو دون العاشرة، وحفظ مصنفات ابن المبارك ووكيع، ثم حج مع والدته وأخيه وجاور بمكة المكرمة.',
        yearApprox: '205 — 210 هـ'
      },
      {
        placeId: 'plc-makkah',
        placeName: 'مكة والمدينة المنورة',
        stageTitle: 'التدوين تحت نور الحجرة النبوية',
        description: 'كتب كتابه التاريخ الكبير في الروضة الشريفة بالمدينة المنورة في ليال مقمرة، ولقي شيوخ الحجاز الكبار كالحميدي وابن أبي فديك.',
        yearApprox: '210 — 216 هـ'
      },
      {
        placeId: 'plc-baghdad',
        placeName: 'بغداد والكوفة والبصرة',
        stageTitle: 'امتحان الحفاظ والمذاكرة مع الإمام أحمد',
        description: 'دخل بغداد ثماني مرات، وذاكر الإمام أحمد بن حنبل، وامتحنه حفاظ العراق في مئة حديث قلبت أسانيدها ومتونها فردها جميعاً من حفظه دون خطأ.',
        yearApprox: '216 — 250 هـ'
      }
    ]
  }
];
