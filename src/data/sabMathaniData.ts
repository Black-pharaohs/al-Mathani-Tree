/**
 * السبع المثاني — المرجع المعرفي والبيانات التأسيسية لشجرة السبع المثاني وعقد الأئمة المكملين
 * التزاماً صارماً بمحددات الوثيقة المرجعية الهندسية V1 ونص التوجيه المعرفي
 */

import {
  Category,
  RelationshipType,
  Person,
  PersonName,
  Relationship,
  Tree
} from '../core/types';

export interface SabMathaniTierDefinition {
  tierNumber: number;
  title: string;
  shortTitle: string;
  realm: string;
  duty: string;
  memberIds: string[];
  color: string;
  iconName: string;
}

export const SAB_MATHANI_TIERS_CONFIG: SabMathaniTierDefinition[] = [
  {
    tierNumber: 1,
    title: 'المثنى الأول: أربعة من الملائكة الكروبيين (المقربين)',
    shortTitle: 'الملائكة الكروبيون',
    realm: 'عالم الجبروت (العرش والكرسي واللوح والقلم)',
    duty: 'خدمة الدين في عالم الجبروت (حيث العرش والكرسي واللوح والقلم) بين الملائكة العالين الذين لا يعلمون بخلق آدم.',
    memberIds: ['person-karubi-arsh', 'person-karubi-kursi', 'person-karubi-lawh', 'person-karubi-qalam'],
    color: '#7c3aed', // Purple / Royal Jabarut
    iconName: 'Crown'
  },
  {
    tierNumber: 2,
    title: 'المثنى الثاني: أربعة من الملائكة الفلكيين',
    shortTitle: 'الملائكة الفلكيون',
    realm: 'عالم الملكوت والأفلاك والجنات',
    duty: 'خدمة الدين في عالم الملكوت والأفلاك والجنات. بدأت خدمتهم مع بداية المكان ولا تنقضي إلا بانتهاء الدنيا.',
    memberIds: ['person-angel-jibril', 'person-angel-mikail', 'person-angel-israfil', 'person-angel-azrail'],
    color: '#0284c7', // Sky blue / Malakut
    iconName: 'Sparkles'
  },
  {
    tierNumber: 3,
    title: 'المثنى الثالث: أربعة من أولو العزم من الرسل',
    shortTitle: 'أولو العزم من الرسل',
    realm: 'عالم النبوة والرسالة والميثاق النبوي',
    duty: 'الموكلون بالميثاق الخاص بمعرفة النبي ﷺ وتبليغه للأنبياء والرسل؛ ويمثلون تطور وتدرج الرسالة الإلهية إلى الخلق.',
    memberIds: ['person-prophet-nuh', 'person-prophet-ibrahim', 'person-prophet-musa', 'person-prophet-isa'],
    color: '#d97706', // Amber gold / Prophecy
    iconName: 'Scroll'
  },
  {
    tierNumber: 4,
    title: 'المثنى الرابع: أربعة من رؤساء (رؤوس) الصحابة',
    shortTitle: 'رؤساء الصحابة الكرام',
    realm: 'عالم الخلافة الراشدة ودعائم الدين',
    duty: 'إقامة دعائم الدين الظاهرة، والخلافة الراشدة، وحفظ جسد الأمة الإسلامية في طورها الأول.',
    memberIds: ['person-abu-bakr', 'person-umar', 'person-uthman', 'person-ali'],
    color: '#059669', // Emerald green / Sahaba & Khilafah
    iconName: 'Shield'
  },
  {
    tierNumber: 5,
    title: 'المثنى الخامس: أربعة من العبادلة حفظة القرآن الكريم',
    shortTitle: 'العبادلة حفظة القرآن',
    realm: 'عالم التنزيل والتفسير والحفظ القرآني',
    duty: 'حفظ أسرار التنزيل، وتفسير معاني القرآن، ونقل العلم الدقيق للأجيال اللاحقة.',
    memberIds: ['person-abdullah-ibn-umar', 'person-abdullah-ibn-zubayr', 'person-abdullah-ibn-masud', 'person-abdullah-ibn-abbas'],
    color: '#0d9488', // Teal / Quranic scholarship
    iconName: 'BookOpen'
  },
  {
    tierNumber: 6,
    title: 'المثنى السادس: أربعة من أئمة الشريعة (أصحاب المذاهب)',
    shortTitle: 'أئمة المذاهب الفقهية',
    realm: 'عالم الملك والدنيا (الأحكام والظاهر)',
    duty: 'تقنين الأحكام، وحفظ ظاهر الشريعة، وتيسير الفقه لعامة المسلمين في عالم الملك (الدنيا).',
    memberIds: ['person-abu-hanifa', 'person-malik', 'person-shafii', 'person-ahmad'],
    color: '#b45309', // Warm ochre / Jurisprudence
    iconName: 'Scale'
  },
  {
    tierNumber: 7,
    title: 'المثنى السابع: أربعة من أئمة التصوف (الأقطاب الأربعة)',
    shortTitle: 'الأقطاب الأربعة أئمة التصوف',
    realm: 'عالم الحقيقة والتربية الروحية وباطن الشريعة',
    duty: 'حفظ باطن الشريعة (الحقيقة)، وتربية قلوب المريدين، وتولّي الإرشاد الروحي. (ومنهم السيد إبراهيم الدسوقي شقيق الطريقة البرهانية نسباً ومشرباً).',
    memberIds: ['person-jilani', 'person-rifai', 'person-badawi', 'person-dasuqi'],
    color: '#4338ca', // Indigo / Spiritual mastery
    iconName: 'HeartHandshake'
  }
];

export const KNOT_COMPLETERS_CONFIG = {
  title: 'عقد التمام والرباط الجامع لكل أربعة',
  description: 'يكمل عقد كل أربعة من السبع المثاني: سيدنا ومولانا الإمام الحسن، وسيدنا ومولانا الإمام الحسين، وسيدنا ومولانا الإمام المهدي.',
  memberIds: ['person-al-hassan', 'person-al-hussain', 'person-al-mahdi'],
  color: '#e11d48' // Crimson Rose / Divine Kinship & Seal
};

export const MATHANI_CATEGORIES: Category[] = [
  {
    id: 'cat-sab-mathani',
    name: 'السبع المثاني وعقد التمام',
    slug: 'al-sab-al-mathani',
    description: 'المراتب السبعة للسبع المثاني في الجبروت والملكوت والرسالة والخلافة والقرآن والشريعة والحقيقة مع عقد التمام',
    type: 'discipline',
    status: 'published'
  },
  {
    id: 'cat-karubiyyun',
    name: 'الملائكة الكروبيون (المقربون)',
    slug: 'al-karubiyyun',
    description: 'ملائكة عالم الجبروت المقربون عند العرش والكرسي واللوح والقلم',
    type: 'discipline',
    status: 'published'
  },
  {
    id: 'cat-falakiyyun',
    name: 'الملائكة الفلكيون',
    slug: 'al-falakiyyun',
    description: 'ملائكة عالم الملكوت والأفلاك والجنات (جبريل، ميكائيل، إسرافيل، عزرائيل)',
    type: 'discipline',
    status: 'published'
  },
  {
    id: 'cat-anbiya-azm',
    name: 'أولو العزم من الرسل',
    slug: 'ulu-al-azm',
    description: 'أئمة النبوة والرسالة والموكلون بالميثاق النبوي الخاص (نوح، إبراهيم، موسى، عيسى)',
    type: 'generation',
    status: 'published'
  },
  {
    id: 'cat-sahaba-ruasa',
    name: 'رؤساء الصحابة الكرام',
    slug: 'ruasa-al-sahaba',
    description: 'الخلفاء الراشدون الأربعة ومقيمو دعائم الدين الظاهرة',
    type: 'generation',
    status: 'published'
  },
  {
    id: 'cat-abadilah-quran',
    name: 'العبادلة حفظة القرآن',
    slug: 'al-abadilah-al-arbaa',
    description: 'العبادلة الأربعة حفظة أسرار التنزيل ومفسرو معاني القرآن',
    type: 'discipline',
    status: 'published'
  },
  {
    id: 'cat-aqtab-tasawwuf',
    name: 'أقطاب التصوف الأربعة',
    slug: 'al-aqtab-al-arbaa',
    description: 'الأقطاب الأربعة حفظة باطن الشريعة وتولّي الإرشاد الروحي',
    type: 'discipline',
    status: 'published'
  },
  {
    id: 'cat-knot-imams',
    name: 'عقد التمام (الأئمة المكملون)',
    slug: 'aqd-al-tamam',
    description: 'سيدنا الإمام الحسن، وسيدنا الإمام الحسين، وسيدنا الإمام المهدي مكملو عقد كل أربعة',
    type: 'lineage',
    status: 'published'
  }
];

export const MATHANI_RELATIONSHIP_TYPES: RelationshipType[] = [
  {
    id: 'rel-mathani-pair',
    code: 'mathani_partner_of',
    name_ar: 'شريك في رتبة المثنى',
    name_en: 'Mathani Partner',
    reverse_code: 'mathani_partner_of',
    category: 'spiritual'
  },
  {
    id: 'rel-knot-completion',
    code: 'knot_completion_of',
    name_ar: 'مكمل عقد ورباط لـ',
    name_en: 'Completer of Knot for',
    reverse_code: 'completed_by_knot',
    category: 'spiritual'
  },
  {
    id: 'rel-realm-service',
    code: 'realm_service_of',
    name_ar: 'خدمة الدين في عالم',
    name_en: 'Realm Service of',
    category: 'spiritual'
  },
  {
    id: 'rel-covenant-transmission',
    code: 'covenant_transmission_to',
    name_ar: 'حامل ميثاق وتبليغ لـ',
    name_en: 'Covenant Transmission to',
    category: 'spiritual'
  },
  {
    id: 'rel-quran-preservation',
    code: 'quran_preservation_with',
    name_ar: 'حفظ وتفسير التنزيل مع',
    name_en: 'Quran Preservation with',
    category: 'scholarly'
  }
];

// Persons to add for Sab' Mathani
export const MATHANI_NEW_PERSONS: Person[] = [
  // --- 1. الملائكة الكروبيون (عالم الجبروت) ---
  {
    id: 'person-karubi-arsh',
    slug: 'al-malak-al-karubi-arsh',
    primary_name: 'الملك الكروبي المقرب — حامل سر العرش',
    short_bio: 'من الملائكة الكروبيين العالين في عالم الجبروت، الموكل بخدمة الدين وسر الاستواء الإلهي وحمل العرش.',
    full_bio: 'أحد الملائكة الكروبيين الأربعة المقربين في عالم الجبروت، حيث العرش والكرسي واللوح والقلم. وظيفته خدمة الدين الإلهي في الملأ الأعلى بين الملائكة العالين المستغرقين في معرفة الله قبل خلق الأكوان.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-karubiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-karubi-kursi',
    slug: 'al-malak-al-karubi-kursi',
    primary_name: 'الملك الكروبي المقرب — حامل سر الكرسي',
    short_bio: 'من الملائكة الكروبيين العالين، الموكل بخدمة الدين في عالم الجبروت عند مظهر الكرسي الواسع للسماوات والأرض.',
    full_bio: 'أحد الملائكة الأربعة الكروبيين المقربين القائمين في حضرة الجبروت، وظيفته حفظ أسرار الأمر والتدبير وخدمة الدين الإلهي في الملأ الأعلى المحيط بعوالم التقدير.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-karubiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-karubi-lawh',
    slug: 'al-malak-al-karubi-lawh',
    primary_name: 'الملك الكروبي المقرب — حافظ اللوح المحفوظ',
    short_bio: 'من الملائكة الكروبيين العالين، الموكل بحفظ أسرار اللوح المحفوظ وما سطر فيه من مقادير الخلائق وأسرار التنزيل.',
    full_bio: 'أحد الملائكة الكروبيين الأربعة المقربين القائمين بخدمة الدين في عالم الجبروت، موكل باللوح المحفوظ الذي لا يمسه إلا المطهرون وتسطير الآجال والأرزاق والكليات الوجودية.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-karubiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-karubi-qalam',
    slug: 'al-malak-al-karubi-qalam',
    primary_name: 'الملك الكروبي المقرب — حامل سر القلم الإلهي',
    short_bio: 'من الملائكة الكروبيين العالين، الموكل بسريان أمر القلم الأول وجريان مشيئة الحق في كتابة العلوم الأزلية.',
    full_bio: 'أحد الملائكة الكروبيين الأربعة المقربين في عالم الجبروت، وظيفته خدمة الدين في أول ما خلق الله، حيث قال للقلم: اكتب، فجرى بما هو كائن إلى يوم القيامة، بحفظ الأسرار النورانية.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-karubiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // --- 2. الملائكة الفلكيون (عالم الملكوت والأفلاك والجنات) ---
  {
    id: 'person-angel-jibril',
    slug: 'sayyiduna-jibril-alayhis-salam',
    primary_name: 'سيدنا جبريل عليه السلام (الروح الأمين)',
    short_bio: 'رئيس الملائكة الفلكيين، الروح الأمين ورسول الوحي الإلهي إلى الأنبياء والمرسلين، خادم الدين في الملكوت.',
    full_bio: 'سيدنا جبريل عليه السلام، الروح القدس، أمين الوحي الإلهي، وسيد الملائكة الفلكيين. وظيفته خدمة الدين في عالم الملكوت والأفلاك والجنات، بدأت خدمته مع بداية المكان ولا تنقضي إلا بانتهاء الدنيا. صاحب النور الأكبر وصاحب النبي ﷺ في الإسراء والمعراج.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-falakiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-angel-mikail',
    slug: 'sayyiduna-mikail-alayhis-salam',
    primary_name: 'سيدنا ميكائيل عليه السلام',
    short_bio: 'من الملائكة الفلكيين العظام، الموكل بالأرزاق وقطر السماء والنبات وتدبير الأفلاك بإذن الله.',
    full_bio: 'سيدنا ميكائيل عليه السلام، أحد الملائكة الفلكيين الأربعة. وظيفته خدمة الدين في عالم الملكوت والأفلاك والجنات، موكل بحياة الأبدان بالأرزاق والأمطار والرياح وسريان الرحمة في الأكوان، خدمته مستمرة من بدء المكان حتى فناء الدنيا.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-falakiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-angel-israfil',
    slug: 'sayyiduna-israfil-alayhis-salam',
    primary_name: 'سيدنا إسرافيل عليه السلام',
    short_bio: 'من الملائكة الفلكيين العظام، صاحب الصور الموكل بالنفخة الأولى للصعق ونفخة البعث والنشور.',
    full_bio: 'سيدنا إسرافيل عليه السلام، أحد الملائكة الفلكيين الأربعة. وظيفته خدمة الدين في عالم الملكوت والأفلاك؛ واضع فمه على الصور منتظر أمر ربه، موكل بنفخة الصعق وإماتة الخلائق ونفخة البعث لحضور الخلائق بين يدي الله، وحفظ النواميس الفلكية.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-falakiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-angel-azrail',
    slug: 'sayyiduna-azrail-alayhis-salam',
    primary_name: 'سيدنا عزرائيل عليه السلام (ملك الموت)',
    short_bio: 'من الملائكة الفلكيين العظام، الموكل بقبض الأرواح وتسيير انتقال النفوس إلى دار البرزخ والخلود.',
    full_bio: 'سيدنا عزرائيل عليه السلام، أحد الملائكة الفلكيين الأربعة. وظيفته خدمة الدين في عالم الملكوت والأفلاك والجنات؛ الموكل بقبض الأرواح وحفظ أمانات النفوس وتسيير انتقالها من دار التكليف الفانية إلى عالم البرزخ، لا تنقضي خدمته إلا بانتهاء الدنيا وقبض الأكوان.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-falakiyyun'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // --- 3. أولو العزم من الرسل ---
  {
    id: 'person-prophet-nuh',
    slug: 'sayyiduna-nuh-alayhis-salam',
    primary_name: 'سيدنا نوح عليه السلام (شيخ المرسلين)',
    short_bio: 'شيخ الأنبياء وأول أولي العزم من الرسل، الموكل بالميثاق النبوي الخاص وصاحب السفينة والنجاة الأولى.',
    full_bio: 'نوح عليه السلام، الأب الثاني للبشرية. لبث في قومه ألف سنة إلا خمسين عاماً يدعو إلى التوحيد الخالص. وهو من أولي العزم الأربعة الموكلين بالميثاق الخاص بمعرفة النبي ﷺ وتبليغه للأنبياء والرسل، ممثلاً فجر تدرج الرسالة الإلهية إلى الخلق.',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-anbiya-azm'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-prophet-ibrahim',
    slug: 'sayyiduna-ibrahim-alayhis-salam',
    primary_name: 'سيدنا إبراهيم عليه السلام (خليل الرحمن)',
    short_bio: 'خليل الله وأبو الأنبياء، إمام الحنفاء وباني البيت العتيق، حامل الميثاق النبوي وإمام التوحيد.',
    full_bio: 'إبراهيم بن تارخ عليه السلام، خليل الرحمن وإمام الأمة التي كانت أمة قانتاً لله حنيفاً. موكل بالميثاق الخاص بمعرفة الحبيب المصطفى ﷺ، وهو الذي دعا: (ربنا وابعث فيهم رسولاً منهم)، وأرسى قواعد التوحيد الصافي والملة الإبراهيمية الخالدة.',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-anbiya-azm'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-prophet-musa',
    slug: 'sayyiduna-musa-alayhis-salam',
    primary_name: 'سيدنا موسى عليه السلام (كليم الله)',
    short_bio: 'كليم الله وصاحب التوراة، رسول بني إسرائيل والمجاهد ضد الطغيان، حامل ميثاق الشريعة والتبليغ.',
    full_bio: 'موسى بن عمران عليه السلام، كليم الله بالوادي المقدس طوى. أوحي إليه بالتوراة وأيده الله بالآيات التسع البينات. وهو أحد أولي العزم الأربعة الموكلين بالميثاق النبوي وتبليغ بشارة النبي الخاتم، وتدرج التشريع الإلهي الظاهر.',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-anbiya-azm'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-prophet-isa',
    slug: 'sayyiduna-isa-alayhis-salam',
    primary_name: 'سيدنا عيسى عليه السلام (روح الله وكلمته)',
    short_bio: 'روح الله وكلمته ألقاها إلى مريم، صاحب الإنجيل والمبشر الصادق بسيدنا محمد ﷺ (أحمد).',
    full_bio: 'عيسى بن مريم عليه السلام، عبد الله ورسوله، وكلمته وروحه. نزل بالإنجيل هدى ونوراً، وأحيا الموتى وأبرأ الأكمه والأبرص بإذن الله. موكل بالميثاق الخاص وتبليغ البشارة بالنبي الأكرم: (ومبشراً برسول يأتي من بعدي اسمه أحمد)، وممثل الروحانية العليا في تدرج الرسالة.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-anbiya-azm'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // --- 4. رؤساء الصحابة الكرام (أبو بكر، عمر، عثمان، علي موجود مسبقاً) ---
  {
    id: 'person-abu-bakr',
    slug: 'abu-bakr-al-siddiq',
    primary_name: 'سيدنا أبو بكر الصديق رضي الله عنه',
    short_bio: 'أول الخلفاء الراشدين، وصاحب الغار، ووزير رسول الله ﷺ والصدّيق الأكبر لهذه الأمة.',
    full_bio: 'عبد الله بن أبي قحافة عثمان بن عامر التيمي القرشي، أبو بكر الصديق. أول من أسلم من الرجال الأحرار، رفيق الهجرة الشريفة، وخليفة رسول الله ﷺ الذي ثبت الأمة وقاتل أهل الردة وأقام دعائم الدين الظاهرة وحفظ جسد الأمة الإسلامية في طورها الأول.',
    birth_date: '50 قبل الهجرة (573م)',
    death_date: '13 هـ (634م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-sahaba', 'cat-sahaba-ruasa'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-umar',
    slug: 'umar-ibn-al-khattab',
    primary_name: 'سيدنا عمر بن الخطاب رضي الله عنه',
    short_bio: 'أمير المؤمنين، الفاروق، ثاني الخلفاء الراشدين، مقيم العدل وفاتح الأمصار ومدون الدواوين.',
    full_bio: 'عمر بن الخطاب بن نفيل العدوي القرشي، أبو حفص الفاروق. أعز الله به الإسلام، وفرق به بين الحق والباطل. وظيفته في السبع المثاني إقامة دعائم الدين الظاهرة، والخلافة الراشدة، وتأسيس القضاء والدواوين والتقويم الهجري، وحفظ جسد الأمة الإسلامية.',
    birth_date: '40 قبل الهجرة (584م)',
    death_date: '23 هـ (644م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-sahaba', 'cat-sahaba-ruasa'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-uthman',
    slug: 'uthman-ibn-affan',
    primary_name: 'سيدنا عثمان بن عفان رضي الله عنه',
    short_bio: 'أمير المؤمنين، ذو النورين، ثالث الخلفاء الراشدين، جامع القرآن الكريم في المصحف الإمام.',
    full_bio: 'عثمان بن عفان بن أبي العاص الأموي القرشي، أبو عبد الله وأبو عمرو. جهز جيش العسرة وبئر رومة، وهاجر الهجرتين وتزوج ابنتي رسول الله ﷺ رقية وأم كلثوم. وظيفته إقامة دعائم الدين الظاهرة وحفظ الأمة من الاختلاف بجمع القرآن الكريم وتوحيد المصاحف.',
    birth_date: '47 قبل الهجرة (576م)',
    death_date: '35 هـ (656م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-sahaba', 'cat-sahaba-ruasa'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // --- 5. العبادلة حفظة القرآن الكريم ---
  {
    id: 'person-abdullah-ibn-umar',
    slug: 'abdullah-ibn-umar',
    primary_name: 'سيدنا عبد الله بن عمر رضي الله عنهما',
    short_bio: 'فقيه الصحابة، إمام الورع وحفظ الآثار النبوية والقرآنية الدقيقة، وأحد العبادلة الأربعة.',
    full_bio: 'عبد الله بن عمر بن الخطاب القرشي العدوي، أبو عبد الرحمن. كان من أشد الناس حرصاً على اتباع أفعال رسول الله ﷺ بدقة متناهية، وحفظ القرآن الكريم وعلمه، ونقل أسرار التنزيل وأحكام الشريعة للأجيال اللاحقة بنقاء تام.',
    birth_date: '10 قبل الهجرة (613م)',
    death_date: '73 هـ (693م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-sahaba', 'cat-abadilah-quran'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-abdullah-ibn-zubayr',
    slug: 'abdullah-ibn-al-zubayr',
    primary_name: 'سيدنا عبد الله بن الزبير رضي الله عنهما',
    short_bio: 'فارس قريش، أول مولود للمهاجرين بالمدينة، أحد العبادلة وحفظة القرآن وكتاب المصحف الإمام.',
    full_bio: 'عبد الله بن الزبير بن العوام الأسدي القرشي، أمه أسماء بنت أبي بكر ذات النطاقين. نشأ على القرآن والجهاد، وكان من الأربعة الذين اختارهم عثمان لكتابة وضبط المصحف الإمام، متولياً حفظ أسرار التنزيل واللغة ونقل العلم الدقيق للأمة.',
    birth_date: '1 هـ (622م)',
    death_date: '73 هـ (692م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-sahaba', 'cat-abadilah-quran'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-abdullah-ibn-masud',
    slug: 'abdullah-ibn-masud',
    primary_name: 'سيدنا عبد الله بن مسعود رضي الله عنه',
    short_bio: 'صاحب السواد والوساد، أول من جهر بالقرآن بمكة، إمام التفسير والقراءة المتلقاة غضة طرية.',
    full_bio: 'عبد الله بن مسعود بن غافل الهذلي، أبو عبد الرحمن. قال فيه النبي ﷺ: (من أحب أن يقرأ القرآن غضاً كما أنزل فليقرأه على قراءة ابن أم عبد). تولى حفظ أسرار التنزيل وتفسير معانيه وتأسيس المدرسة الكوفية في الفقه والتفسير للأجيال اللاحقة.',
    birth_date: '32 قبل الهجرة (591م)',
    death_date: '32 هـ (652م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-sahaba', 'cat-abadilah-quran'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-abdullah-ibn-abbas',
    slug: 'abdullah-ibn-abbas',
    primary_name: 'سيدنا عبد الله بن عباس رضي الله عنهما',
    short_bio: 'حبر الأمة وترجمان القرآن، دعا له النبي ﷺ بالفقه في الدين وعلم التأويل، إمام المفسرين.',
    full_bio: 'عبد الله بن عباس بن عبد المطلب الهاشمي القرشي، ابن عم رسول الله ﷺ. ضمه النبي إلى صدره وقال: (اللهم علمه الكتاب والحكمة وفي رواية: وفقهه في الدين وعلمه التأويل). قام بحفظ أسرار التنزيل وتفسير معاني القرآن وتبيان مدارج الوحي للأمة.',
    birth_date: '3 قبل الهجرة (619م)',
    death_date: '68 هـ (687م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-sab-mathani', 'cat-ahl-albayt', 'cat-sahaba', 'cat-abadilah-quran', 'cat-mufassirin'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // --- 7. أئمة التصوف (الرفاعي والبدوي، والجيلاني والدسوقي موجودان مسبقاً) ---
  {
    id: 'person-rifai',
    slug: 'ahmad-al-rifai',
    primary_name: 'السيد أحمد الرفاعي رضي الله عنه',
    short_bio: 'شيخ العارفين، القطب الغوث الكبير، إمام الطريقة الرفاعية، صاحب المحبة والانكسار.',
    full_bio: 'أحمد بن علي الرفاعي الحسيني القرشي، أبو العباس. ولد بالبطائح في العراق، واشتهر بالزهد الشديد والتواضع النبوي ومد اليد الشريفة لتقبيلها في الروضة النبوية. وظيفته في السبع المثاني حفظ باطن الشريعة وتربية القلوب وتولي الإرشاد الروحي.',
    birth_date: '512 هـ (1118م)',
    death_date: '578 هـ (1182م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-shafii',
    tariqa_id: 'tar-rifaiyya',
    category_ids: ['cat-sab-mathani', 'cat-sufiya', 'cat-aqtab-tasawwuf'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-badawi',
    slug: 'ahmad-al-badawi',
    primary_name: 'السيد أحمد البدوي رضي الله عنه',
    short_bio: 'القطب الشريف الطندتاوي، صاحب المقام الشهير بطنطا، إمام الطريقة الأحمدية ومربي السالكين.',
    full_bio: 'أحمد بن علي بن إبراهيم البدوي الفاسي الحسني، أبو الفتيان. ينتهي نسبه إلى الإمام الحسين بن علي. استقر بمدينة طنطا بمصر، وأسس منهجاً رفيعاً في المحبة وإيواء الفقراء وإرشاد القلوب وتطهير البواطن وحفظ أسرار الحقيقة المحمدية.',
    birth_date: '596 هـ (1199م)',
    death_date: '675 هـ (1276م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-shafii',
    category_ids: ['cat-sab-mathani', 'cat-sufiya', 'cat-aqtab-tasawwuf'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // --- عقد التمام: سيدنا الإمام المهدي (الحسن والحسين موجودان مسبقاً) ---
  {
    id: 'person-al-mahdi',
    slug: 'sayyiduna-al-imam-al-mahdi',
    primary_name: 'سيدنا ومولانا الإمام المهدي عليه السلام',
    short_bio: 'بقية الله وخاتم الأئمة، مكمل عقد التمام لكل أربعة، مظهر العدل والقسط في آخر الزمان.',
    full_bio: 'سيدنا ومولانا الإمام محمد بن الحسن المهدي (عليه السلام وعجل الله فرجه الشريف). من ذرية فاطمة الزهراء عليها السلام، يملأ الأرض قسطاً وعدلاً كما ملئت ظلماً وجوراً. وظيفته في السبع المثاني إكمال عقد كل أربعة من مراتب المثاني مع أخويه وجديه الإمامين الحسن والحسين، حاملاً سر الختام والجمع المحمدي الشامل.',
    gender: 'male',
    is_deceased: false,
    category_ids: ['cat-sab-mathani', 'cat-ahl-albayt', 'cat-knot-imams'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Names for newly created persons
export const MATHANI_NEW_NAMES: PersonName[] = [
  { id: 'pn-abu-bakr-1', person_id: 'person-abu-bakr', name: 'عبد الله بن أبي قحافة عثمان التيمي القرشي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-abu-bakr-2', person_id: 'person-abu-bakr', name: 'أبو بكر الصديق', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-umar-1', person_id: 'person-umar', name: 'عمر بن الخطاب بن نفيل العدوي القرشي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-umar-2', person_id: 'person-umar', name: 'الفاروق', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-uthman-1', person_id: 'person-uthman', name: 'عثمان بن عفان بن أبي العاص الأموي القرشي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-uthman-2', person_id: 'person-uthman', name: 'ذو النورين', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-ibn-abbas-1', person_id: 'person-abdullah-ibn-abbas', name: 'عبد الله بن عباس بن عبد المطلب الهاشمي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-ibn-abbas-2', person_id: 'person-abdullah-ibn-abbas', name: 'حبر الأمة وترجمان القرآن', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-ibn-masud-1', person_id: 'person-abdullah-ibn-masud', name: 'عبد الله بن مسعود بن غافل الهذلي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-ibn-masud-2', person_id: 'person-abdullah-ibn-masud', name: 'صاحب السواد والوساد', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-mahdi-1', person_id: 'person-al-mahdi', name: 'محمد بن الحسن العسكري الحسيني القرشي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-mahdi-2', person_id: 'person-al-mahdi', name: 'الإمام المهدي المنتظر صاحب الزمان', language: 'ar', name_type: 'laqab', is_primary: false }
];

// Generate comprehensive relationships for Sab' Mathani
export function generateSabMathaniRelationships(): Relationship[] {
  const rels: Relationship[] = [];
  let counter = 1;

  // 1. Intra-tier connections (All members of a 4-group connected as partners in the tier)
  for (const tier of SAB_MATHANI_TIERS_CONFIG) {
    const ids = tier.memberIds;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        rels.push({
          id: `rel-mathani-pair-${counter++}`,
          source_person_id: ids[i],
          target_person_id: ids[j],
          relationship_type_id: 'rel-mathani-pair',
          relationship_type_code: 'mathani_partner_of',
          description: `شريكان في ${tier.title}، الوظيفة المشتركة: ${tier.duty}`,
          confidence: 'very_high',
          verification_status: 'verified',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
  }

  // 2. Knot Completion connections:
  // "ثم يكمل عقد كل اربعة سيدنا ومولانا الامام الحسن وسيدنا ومولانا الامام الحسين وسيدنا ومولانا الامام المهدي"
  const knotCompleters = ['person-al-hassan', 'person-al-hussain', 'person-al-mahdi'];

  for (const tier of SAB_MATHANI_TIERS_CONFIG) {
    for (const completerId of knotCompleters) {
      // Connect completer to the primary head or all members of each 4-group
      for (const memberId of tier.memberIds) {
        if (memberId === completerId) continue; // avoid self-loop if any
        rels.push({
          id: `rel-knot-comp-${counter++}`,
          source_person_id: completerId,
          target_person_id: memberId,
          relationship_type_id: 'rel-knot-completion',
          relationship_type_code: 'knot_completion_of',
          description: `إكمال عقد ${tier.shortTitle} بواسطة الأئمة المكملين، لتحقيق التمام والرباط الجامع`,
          confidence: 'very_high',
          verification_status: 'verified',
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }
  }

  // 3. Sequential tier bridge connections (From Tier 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7)
  // Reflecting the cosmic and spiritual descent: Jabarut -> Malakut -> Risala -> Khilafah -> Quran -> Sharia -> Haqiqa
  for (let t = 0; t < SAB_MATHANI_TIERS_CONFIG.length - 1; t++) {
    const currentTier = SAB_MATHANI_TIERS_CONFIG[t];
    const nextTier = SAB_MATHANI_TIERS_CONFIG[t + 1];

    // Bridge the leading poles of each consecutive tier
    rels.push({
      id: `rel-mathani-bridge-${counter++}`,
      source_person_id: currentTier.memberIds[0],
      target_person_id: nextTier.memberIds[0],
      relationship_type_id: 'rel-realm-service',
      relationship_type_code: 'realm_service_of',
      description: `التدرج المعرفي والروحي من ${currentTier.shortTitle} إلى ${nextTier.shortTitle}`,
      confidence: 'very_high',
      verification_status: 'verified',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  // 4. Knot completers mutual connection
  rels.push({
    id: `rel-knot-hassan-hussain`,
    source_person_id: 'person-al-hassan',
    target_person_id: 'person-al-hussain',
    relationship_type_id: 'rel-mathani-pair',
    relationship_type_code: 'mathani_partner_of',
    description: 'سيدا شباب أهل الجنة وأركان عقد التمام',
    confidence: 'very_high',
    verification_status: 'verified',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  rels.push({
    id: `rel-knot-hussain-mahdi`,
    source_person_id: 'person-al-hussain',
    target_person_id: 'person-al-mahdi',
    relationship_type_id: 'rel-mathani-pair',
    relationship_type_code: 'mathani_partner_of',
    description: 'سلسلة الولاية وعقد التمام الإمامي الممتد إلى آخر الزمان',
    confidence: 'very_high',
    verification_status: 'verified',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  return rels;
}

export const SEED_SAB_MATHANI_TREE: Tree = {
  id: 'tree-sab-mathani',
  name: 'شجرة السبع المثاني وعقد الأئمة المكملين',
  slug: 'al-sab-al-mathani',
  description: 'شجرة التعريف بالسبع المثاني ومراتبها السبعة المتسلسلة من عالم الجبروت والملكوت والرسالة والخلافة والقرآن والشريعة والحقيقة، مع عقد التمام الجامع لكل أربعة (الإمام الحسن، والإمام الحسين، والإمام المهدي).',
  tree_type: 'sab_mathani',
  category_id: 'cat-sab-mathani',
  root_person_id: 'person-karubi-arsh',
  visibility: 'public',
  status: 'published',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
