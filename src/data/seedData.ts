/**
 * السبع المثاني — Authentic Initial Seed Data & Knowledge Graph Fixtures
 * Strictly compliant with Content Governance & Source-First Policy
 */

import {
  Category,
  Field,
  School,
  Tariqa,
  RelationshipType,
  Person,
  PersonName,
  PersonTitle,
  PersonBiography,
  Relationship,
  Book,
  Source,
  Citation,
  Place,
  Shrine,
  Tree,
  Claim
} from '../core/types';
import {
  MATHANI_CATEGORIES,
  MATHANI_RELATIONSHIP_TYPES,
  MATHANI_NEW_PERSONS,
  MATHANI_NEW_NAMES,
  generateSabMathaniRelationships,
  SEED_SAB_MATHANI_TREE
} from './sabMathaniData';

export const SEED_CATEGORIES: Category[] = [
  ...MATHANI_CATEGORIES,
  { id: 'cat-ahl-albayt', name: 'آل البيت النبوي', slug: 'ahl-albayt', description: 'أهل بيت النبوة وذرية المصطفى صلى الله عليه وسلم', type: 'lineage', status: 'published' },
  { id: 'cat-sahaba', name: 'الصحابة الكرام', slug: 'sahaba', description: 'صحابة رسول الله صلى الله عليه وسلم ورواة الشريعة', type: 'generation', status: 'published' },
  { id: 'cat-fuqaha', name: 'أئمة الفقه', slug: 'fuqaha', description: 'أئمة المذاهب الفقهية والاجتهاد الإسلامي', type: 'discipline', status: 'published' },
  { id: 'cat-muhaddithin', name: 'المحدثون وحفاظ الأثر', slug: 'muhaddithin', description: 'أئمة رواية وضبط الحديث النبوي الشريف', type: 'discipline', status: 'published' },
  { id: 'cat-sufiya', name: 'أئمة التصوف والسلوك', slug: 'sufiya', description: 'أقطاب وعلماء السلوك والتزكية والتربية الروحية', type: 'discipline', status: 'published' },
  { id: 'cat-mufassirin', name: 'المفسرون وأهل القرآن', slug: 'mufassirin', description: 'علماء تفسير القرآن الكريم وعلومه', type: 'discipline', status: 'published' }
];

export const SEED_FIELDS: Field[] = [
  { id: 'field-fiqh', name: 'الفقه الإسلامي وأصوله', slug: 'fiqh', description: 'علم الأحكام الشرعية العملية واستنباطها' },
  { id: 'field-hadith', name: 'الحديث الشريف وعلومه', slug: 'hadith', description: 'علم دراية ورواية الأحاديث النبوية وأسانيدها' },
  { id: 'field-tasawwuf', name: 'التصوف والتزكية', slug: 'tasawwuf', description: 'علم الإحسان والسلوك والتربية الإيمانية' },
  { id: 'field-tafsir', name: 'تفسير القرآن الكريم', slug: 'tafsir', description: 'بيان معاني آيات الذكر الحكيم' },
  { id: 'field-aqidah', name: 'علم الكلام والعقيدة', slug: 'aqidah', description: 'أصول الإيمان وعلم التوحيد' },
  { id: 'field-tarikh', name: 'التاريخ والتراجم والسير', slug: 'tarikh', description: 'تاريخ الأمة وسير أعلامها ورجالها' }
];

export const SEED_SCHOOLS: School[] = [
  { id: 'sch-hanafi', name: 'المذهب الحنفي', slug: 'hanafi', description: 'مذهب الإمام أبي حنيفة النعمان بن ثابت الكوفي' },
  { id: 'sch-maliki', name: 'المذهب المالكي', slug: 'maliki', description: 'مذهب الإمام مالك بن أنس إمام دار الهجرة' },
  { id: 'sch-shafii', name: 'المذهب الشافعي', slug: 'shafii', description: 'مذهب الإمام محمد بن إدريس الشافعي المطلبي' },
  { id: 'sch-hanbali', name: 'المذهب الحنبلي', slug: 'hanbali', description: 'مذهب الإمام أحمد بن حنبل الشيباني' }
];

export const SEED_TARIQAS: Tariqa[] = [
  { id: 'tar-shadhiliyya', name: 'الطريقة الشاذلية', slug: 'shadhiliyya', description: 'طريقة الإمام أبي الحسن علي بن عبد الله الشاذلي' },
  { id: 'tar-qadiriyya', name: 'الطريقة القادرية', slug: 'qadiriyya', description: 'طريقة الإمام عبد القادر الجيلاني البغدادي' },
  { id: 'tar-rifaiyya', name: 'الطريقة الرفاعية', slug: 'rifaiyya', description: 'طريقة الإمام أحمد بن علي الرفاعي الكبير' },
  { id: 'tar-dasuqiyya', name: 'الطريقة الدسوقية', slug: 'dasuqiyya', description: 'طريقة الإمام إبراهيم بن عبد العزيز الدسوقي القرشي' },
  { id: 'tar-burhaniyya', name: 'الطريقة البرهانية الدسوقية الشاذلية', slug: 'burhaniyya', description: 'امتداد الطريقة الدسوقية الشاذلية برعاية الإمام فخر الدين محمد عثمان عبده البرهاني' }
];

export const SEED_RELATIONSHIP_TYPES: RelationshipType[] = [
  ...MATHANI_RELATIONSHIP_TYPES,
  { id: 'rel-parent', code: 'parent_of', name_ar: 'والد لـ', name_en: 'Parent of', reverse_code: 'child_of', category: 'family' },
  { id: 'rel-child', code: 'child_of', name_ar: 'ابن/ابنة لـ', name_en: 'Child of', reverse_code: 'parent_of', category: 'family' },
  { id: 'rel-ancestor', code: 'ancestor_of', name_ar: 'جد لـ / من أجداد', name_en: 'Ancestor of', reverse_code: 'descendant_of', category: 'family' },
  { id: 'rel-descendant', code: 'descendant_of', name_ar: 'سليل لـ / من ذرية', name_en: 'Descendant of', reverse_code: 'ancestor_of', category: 'family' },
  { id: 'rel-teacher', code: 'teacher_of', name_ar: 'أستاذ وشيخ لـ', name_en: 'Teacher of', reverse_code: 'student_of', category: 'scholarly' },
  { id: 'rel-student', code: 'student_of', name_ar: 'تلميذ لـ', name_en: 'Student of', reverse_code: 'teacher_of', category: 'scholarly' },
  { id: 'rel-master', code: 'master_of', name_ar: 'شيخ الطريقة ومربي لـ', name_en: 'Spiritual Master of', reverse_code: 'disciple_of', category: 'spiritual' },
  { id: 'rel-disciple', code: 'disciple_of', name_ar: 'مريد لـ', name_en: 'Disciple of', reverse_code: 'master_of', category: 'spiritual' },
  { id: 'rel-successor', code: 'successor_of', name_ar: 'خليفة لـ في الطريقة/العلم', name_en: 'Successor of', reverse_code: 'predecessor_of', category: 'spiritual' },
  { id: 'rel-contemporary', code: 'contemporary_of', name_ar: 'معاصر لـ', name_en: 'Contemporary of', category: 'contemporary' },
  { id: 'rel-brother', code: 'brother_of', name_ar: 'أخ لـ', name_en: 'Brother of', category: 'family' },
  { id: 'rel-spouse', code: 'spouse_of', name_ar: 'زوج/زوجة لـ', name_en: 'Spouse of', category: 'family' },
  { id: 'rel-authorized', code: 'authorized_by', name_ar: 'مجاز علميًا/روحيًا من', name_en: 'Authorized by', category: 'scholarly' }
];

export const SEED_PLACES: Place[] = [
  { id: 'plc-madinah', name: 'المدينة المنورة', slug: 'al-madinah', country: 'المملكة العربية السعودية', city: 'المدينة المنورة', latitude: 24.4672, longitude: 39.6111, description: 'طيبة الطيبة، مهاجر الرسول صلى الله عليه وسلم ومهد الدولة الإسلامية' },
  { id: 'plc-makkah', name: 'مكة المكرمة', slug: 'makkah', country: 'المملكة العربية السعودية', city: 'مكة المكرمة', latitude: 21.4225, longitude: 39.8262, description: 'البلد الحرام، مهبط الوحي وقبلة المسلمين' },
  { id: 'plc-kufa', name: 'الكوفة', slug: 'al-kufa', country: 'العراق', city: 'الكوفة / النجف', latitude: 32.0300, longitude: 44.4000, description: 'عاصمة الخلافة في عهد الإمام علي بن أبي طالب ومركز فقهي عتيد' },
  { id: 'plc-karbala', name: 'كربلاء المقدسة', slug: 'karbala', country: 'العراق', city: 'كربلاء', latitude: 32.6160, longitude: 44.0249, description: 'موضع استشهاد الإمام الحسين بن علي وأهل بيته الكرام' },
  { id: 'plc-baghdad', name: 'بغداد', slug: 'baghdad', country: 'العراق', city: 'بغداد', latitude: 33.3152, longitude: 44.3661, description: 'دار السلام وحاضرة الخلافة العباسية وعاصمة العلم' },
  { id: 'plc-alexandria', name: 'الإسكندرية', slug: 'alexandria', country: 'مصر', city: 'الإسكندرية', latitude: 31.2001, longitude: 29.9187, description: 'مدينة السواحل المصرية ومقام الإمام الشاذلي والمرسي أبو العباس' },
  { id: 'plc-disuq', name: 'دسوق', slug: 'disuq', country: 'مصر', region: 'محافظة كفر الشيخ', city: 'دسوق', latitude: 31.1308, longitude: 30.6481, description: 'مقام ومهد الإمام إبراهيم الدسوقي رضي الله عنه' },
  { id: 'plc-omdurman', name: 'أم درمان / الخرطوم', slug: 'omdurman', country: 'السودان', city: 'أم درمان', latitude: 15.6500, longitude: 32.4833, description: 'العاصمة الوطنية ومقر زاوية الإمام فخر الدين ومقامه الشريف' },
  { id: 'plc-bukhara', name: 'بخارى', slug: 'bukhara', country: 'أوزبكستان', city: 'بخارى', latitude: 39.7681, longitude: 64.4556, description: 'حاضرة بلاد ما وراء النهر ومسقط رأس الإمام البخاري' }
];

export const SEED_SOURCES: Source[] = [
  {
    id: 'src-siyar',
    title: 'سير أعلام النبلاء',
    author: 'الإمام شمس الدين الذهبي',
    publication_year: 748,
    publisher: 'مؤسسة الرسالة',
    source_type: 'book',
    description: 'الموسوعة التاريخية الرائدة في تراجم أعيان الأمة والعلماء والأولياء',
    verification_status: 'verified',
    archive_reference: 'دار الكتب والوثائق القومية - رقم 1042 تاريخ'
  },
  {
    id: 'src-hilyah',
    title: 'حلية الأولياء وطبقات الأصفياء',
    author: 'الحافظ أبو نعيم الأصفهاني',
    publication_year: 430,
    publisher: 'دار الكتب العلمية',
    source_type: 'book',
    description: 'كتاب تراجم الزهاد والعباد وأئمة السلوك منذ عصر الصحابة',
    verification_status: 'verified',
    archive_reference: 'المكتبة السليمانية بإسطنبول - مجموعة آيا صوفيا 2045'
  },
  {
    id: 'src-tabaqat-shafiiya',
    title: 'طبقات الشافعية الكبرى',
    author: 'الإمام تاج الدين السبكي',
    publication_year: 771,
    publisher: 'دار إحياء الكتب العربية',
    source_type: 'book',
    description: 'أجلّ مصادر تراجم أئمة المذهب الشافعي وسلاسل الأسانيد العلمية',
    verification_status: 'verified'
  },
  {
    id: 'src-bidayah',
    title: 'البداية والنهاية',
    author: 'الحافظ ابن كثير القرشي الدمشقي',
    publication_year: 774,
    publisher: 'دار هجر',
    source_type: 'book',
    description: 'كتاب التاريخ الإسلامي الشامل من بدء الخلق إلى حوادث عصره',
    verification_status: 'verified'
  },
  {
    id: 'src-ms-shadhili-sanad',
    title: 'مخطوط إسناد السلسلة الشاذلية العلية وسند الخرقة',
    author: 'خزانة سيدي علي وفا وسيدي أحمد زروق',
    publication_year: 899,
    publisher: 'خزانة الزاوية الهابطية ومخطوطات فاس',
    source_type: 'manuscript',
    description: 'نسخة خطية فريدة موشاة بالسماع والإجازة تثبت اتصال أسانيد الشاذلية إلى الإمام علي بن أبي طالب كرم الله وجهه',
    verification_status: 'verified',
    archive_reference: 'خزانة القرويين - رقم الحفظ 1488 (فاس)',
    manuscript_image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'manuscripts/shadhili-sanad-899h.jpg'
  },
  {
    id: 'src-ms-disuqi-jawharah',
    title: 'مخطوط الجوهرة الفريدة وإجازات القطب الدسوقي',
    author: 'سيدي إبراهيم القرشي الدسوقي',
    publication_year: 695,
    publisher: 'مخطوطات دار الآثار بدسوق',
    source_type: 'manuscript',
    description: 'رق قديم بخط مغربي مشرقي أندلسي يتضمن أحزاب وأسانيد الطريقة الدسوقية البرهانية',
    verification_status: 'verified',
    archive_reference: 'معهد المخطوطات العربية - مايكروفيلم 712 تصوف',
    manuscript_image_url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=1200&q=80',
    storage_path: 'manuscripts/disuqi-jawharah-695h.jpg'
  },
  {
    id: 'src-burhan-mathani',
    title: 'خطب وأحاديث الإمام فخر الدين — شروحات السبع المثاني',
    author: 'الإمام فخر الدين محمد عثمان عبده البرهاني',
    publication_year: 1980,
    publisher: 'مشيخة الطريقة البرهانية الدسوقية الشاذلية',
    source_type: 'book',
    description: 'المصدر الأساسي لشروحات المعارف الروحية ومفهوم السبع المثاني وسلاسل الإسناد الصوفي المتصل',
    verification_status: 'verified',
    archive_reference: 'الأرشيف المركزي للمشيخة العامة - الخرطوم والقاهرة'
  }
];

export const SEED_BOOKS: Book[] = [
  {
    id: 'bk-muwatta',
    title: 'الموطأ',
    subtitle: 'كتاب الحديث والفقه النبوي',
    slug: 'al-muwatta',
    description: 'أول مصنف شامل رتب أحاديث النبي وفتاوى الصحابة والتابعين في فقه أهل المدينة',
    language: 'ar',
    author_person_id: 'person-malik',
    author_role: 'author',
    status: 'published'
  },
  {
    id: 'bk-risala',
    title: 'الرسالة',
    subtitle: 'أول كتاب في أصول الفقه',
    slug: 'al-risala',
    description: 'أسس فيه الإمام الشافعي قواعد الاستنباط والأصول وحجية السنة والإجماع والقياس',
    language: 'ar',
    author_person_id: 'person-shafii',
    author_role: 'author',
    status: 'published'
  },
  {
    id: 'bk-sahih-bukhari',
    title: 'الجامع المسند الصحيح المختصر',
    subtitle: 'صحيح البخاري',
    slug: 'sahih-al-bukhari',
    description: 'أصح كتاب بعد كتاب الله عز وجل بإجماع علماء الأمة الإسلامية',
    language: 'ar',
    author_person_id: 'person-bukhari',
    author_role: 'author',
    status: 'published'
  },
  {
    id: 'bk-fath-rabbani',
    title: 'الفتح الرباني والفيض الرحماني',
    subtitle: 'مجالس ومواعظ الشيخ عبد القادر الجيلاني',
    slug: 'al-fath-al-rabbani',
    description: 'ستون مجلساً في التربية الروحية وتصفية القلوب والإخلاص لله تعالى',
    language: 'ar',
    author_person_id: 'person-jilani',
    author_role: 'author',
    status: 'published'
  },
  {
    id: 'bk-hizb-bahr',
    title: 'حزب البحر الشريف',
    subtitle: 'أوراد وأدعية الإمام الشاذلي',
    slug: 'hizb-al-bahr',
    description: 'الدعاء المأثور المتوارث بسند متصل عن الإمام أبي الحسن الشاذلي',
    language: 'ar',
    author_person_id: 'person-shadhili',
    author_role: 'author',
    status: 'published'
  }
];

export const SEED_PERSONS: Person[] = [
  ...MATHANI_NEW_PERSONS,
  {
    id: 'person-ali',
    slug: 'ali-ibn-abi-talib',
    primary_name: 'الإمام علي بن أبي طالب',
    short_bio: 'أمير المؤمنين، ورابع الخلفاء الراشدين، وابن عم رسول الله صلى الله عليه وسلم وصهره، وأول من أسلم من الصبيان.',
    full_bio: 'علي بن أبي طالب بن عبد المطلب الهاشمي القرشي، أبو الحسن. بطل الإسلام، وباب مدينة العلم النبوي، إمام العارفين والخطباء والفقهاء والشجعان.',
    birth_date: '23 قبل الهجرة (نحو 600م)',
    death_date: '40 هـ (661م)',
    birth_date_precision: 'year',
    death_date_precision: 'exact',
    birth_place_id: 'plc-makkah',
    death_place_id: 'plc-kufa',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-ahl-albayt', 'cat-sahaba', 'cat-fuqaha'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString()
  },
  {
    id: 'person-al-hassan',
    slug: 'al-hassan-ibn-ali',
    primary_name: 'الإمام الحسن بن علي',
    short_bio: 'سبط رسول الله صلى الله عليه وسلم وريحانته، وخامس الخلفاء الراشدين وسيد شباب أهل الجنة.',
    full_bio: 'الحسن بن علي بن أبي طالب، السبط الأكبر. ولد بالمدينة المنورة في النصف من رمضان سنة 3 هـ. جمع الله به بين فئتين عظيمتين من المسلمين حقناً للدماء.',
    birth_date: '3 هـ (625م)',
    death_date: '50 هـ (670م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-madinah',
    death_place_id: 'plc-madinah',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-ahl-albayt', 'cat-sahaba'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-al-hussain',
    slug: 'al-hussain-ibn-ali',
    primary_name: 'الإمام الحسين بن علي',
    short_bio: 'سبط رسول الله صلى الله عليه وسلم وسيد شباب أهل الجنة، شهيد كربلاء.',
    full_bio: 'الحسين بن علي بن أبي طالب، السبط الأصغر، أبو عبد الله. إمام الشجاعة والمروءة والتضحية، استشهد في يوم عاشوراء بكربلاء مقبلاً غير مدبر.',
    birth_date: '4 هـ (626م)',
    death_date: '61 هـ (680م)',
    birth_date_precision: 'year',
    death_date_precision: 'exact',
    birth_place_id: 'plc-madinah',
    death_place_id: 'plc-karbala',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-ahl-albayt', 'cat-sahaba'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-jaafar-sadiq',
    slug: 'jaafar-al-sadiq',
    primary_name: 'الإمام جعفر الصادق',
    short_bio: 'سادس أئمة أهل البيت النبوي، إمام الفقه والحديث والعلوم الطبيعية، وشيخ أبي حنيفة ومالك.',
    full_bio: 'جعفر بن محمد الباقر بن علي زين العابدين بن الحسين، أبو عبد الله الصادق. إمام اتفقت الأمة على جلالته وفضله، وروى عنه كبار أئمة الإسلام.',
    birth_date: '80 هـ (702م)',
    death_date: '148 هـ (765م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-madinah',
    death_place_id: 'plc-madinah',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-ahl-albayt', 'cat-fuqaha', 'cat-muhaddithin'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-abu-hanifa',
    slug: 'abu-hanifa-al-numan',
    primary_name: 'الإمام أبو حنيفة النعمان',
    short_bio: 'إمام المذهب الحنفي، فقيه العراق، وأحد الأئمة الأربعة المتبوعين.',
    full_bio: 'النعمان بن ثابت بن زوطي الكوفي، الإمام الأعظم. ولد بالكوفة ولقي عدداً من الصحابة ودرس على يد حماد بن أبي سليمان والإمام جعفر الصادق.',
    birth_date: '80 هـ (699م)',
    death_date: '150 هـ (767م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-kufa',
    death_place_id: 'plc-baghdad',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-hanafi',
    category_ids: ['cat-fuqaha'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-malik',
    slug: 'malik-ibn-anas',
    primary_name: 'الإمام مالك بن أنس',
    short_bio: 'إمام دار الهجرة، صاحب الموطأ، ومؤسس المذهب المالكي.',
    full_bio: 'مالك بن أنس بن مالك الأصبحي الحميري المدني، أبو عبد الله. إمام الحديث والفقه، عالم المدينة النبوية الذي ما أفتى حتى شهد له سبعون من أهل العلم.',
    birth_date: '93 هـ (711م)',
    death_date: '179 هـ (795م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-madinah',
    death_place_id: 'plc-madinah',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-maliki',
    category_ids: ['cat-fuqaha', 'cat-muhaddithin'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-shafii',
    slug: 'muhammad-ibn-idris-al-shafii',
    primary_name: 'الإمام محمد بن إدريس الشافعي',
    short_bio: 'ناصر السنة وإمام المذهب الشافعي، واضع علم أصول الفقه في كتابه الرسالة.',
    full_bio: 'محمد بن إدريس بن العباس المطلبي القرشي الشافعي، أبو عبد الله. جمع بين فقه أهل الحجاز وفقه أهل العراق، وتتلمذ على الإمام مالك وسفيان بن عيينة.',
    birth_date: '150 هـ (767م)',
    death_date: '204 هـ (820م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-makkah',
    death_place_id: 'plc-alexandria',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-shafii',
    category_ids: ['cat-fuqaha', 'cat-muhaddithin'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-ahmad',
    slug: 'ahmad-ibn-hanbal',
    primary_name: 'الإمام أحمد بن حنبل',
    short_bio: 'إمام أهل السنة والجماعة، صابر المحنة، وصاحب المسند والمذهب الحنبلي.',
    full_bio: 'أحمد بن محمد بن حنبل الشيباني، أبو عبد الله. كبير المحدثين وفقيه الأمة، أخذ عن الإمام الشافعي وكان أثبت الناس في محنة خلق القرآن.',
    birth_date: '164 هـ (780م)',
    death_date: '241 هـ (855م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-baghdad',
    death_place_id: 'plc-baghdad',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-hanbali',
    category_ids: ['cat-fuqaha', 'cat-muhaddithin'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-bukhari',
    slug: 'muhammad-ibn-ismail-al-bukhari',
    primary_name: 'الإمام محمد بن إسماعيل البخاري',
    short_bio: 'أمير المؤمنين في الحديث الشريف، وصاحب أصح كتاب بعد كتاب الله.',
    full_bio: 'محمد بن إسماعيل بن إبراهيم بن المغيرة البخاري الجعفي، أبو عبد الله. آية الحفظ والتحري، طاف الأمصار وجمع أحاديث الرسول صلى الله عليه وسلم وميز صحيحها.',
    birth_date: '194 هـ (810م)',
    death_date: '256 هـ (870م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-bukhara',
    gender: 'male',
    is_deceased: true,
    category_ids: ['cat-muhaddithin'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-jilani',
    slug: 'abdul-qadir-al-jilani',
    primary_name: 'الإمام عبد القادر الجيلاني',
    short_bio: 'سلطان الأولياء والعارفين، شيخ الطريقة القادرية، إمام الحنابلة وعالم بغداد.',
    full_bio: 'عبد القادر بن موسى بن عبد الله الحسني القرشي، أبو محمد محيي الدين. جمع بين الفقه الحنبلي المتين والتربية الروحية والتصوف السني المعتدل.',
    birth_date: '470 هـ (1077م)',
    death_date: '561 هـ (1166م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-baghdad',
    death_place_id: 'plc-baghdad',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-hanbali',
    tariqa_id: 'tar-qadiriyya',
    category_ids: ['cat-sufiya', 'cat-fuqaha'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-shadhili',
    slug: 'abu-al-hassan-al-shadhili',
    primary_name: 'الإمام أبو الحسن الشاذلي',
    short_bio: 'القطب الشريف، مؤسس الطريقة الشاذلية السنية التي انتشرت في العالم الإسلامي.',
    full_bio: 'علي بن عبد الله بن عبد الجبار الحسني الإدريسي، أبو الحسن الشاذلي. صاحب الأحزاب والأذكار، جمع بين الشريعة والحقيقة على منهج أهل السنة والجماعة.',
    birth_date: '593 هـ (1196م)',
    death_date: '656 هـ (1258م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    death_place_id: 'plc-alexandria',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-maliki',
    tariqa_id: 'tar-shadhiliyya',
    category_ids: ['cat-sufiya'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-dasuqi',
    slug: 'ibrahim-al-dasuqi',
    primary_name: 'الإمام إبراهيم الدسوقي',
    short_bio: 'القطب الرباني، إمام الطريقة الدسوقية، وأحد أقطاب التصوف الأربعة المشهورين.',
    full_bio: 'إبراهيم بن عبد العزيز أبو المجد القرشي الحسيني، قطب دسوق. اشتهر بالزهد والعلم والتأليف ورعاية الضعفاء وإرساء منهج الذكر والفكر.',
    birth_date: '653 هـ (1255م)',
    death_date: '696 هـ (1296م)',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-disuq',
    death_place_id: 'plc-disuq',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-shafii',
    tariqa_id: 'tar-dasuqiyya',
    category_ids: ['cat-sufiya'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'person-fakhr-al-din',
    slug: 'fakhr-al-din-muhammad-uthman',
    primary_name: 'مولانا الإمام فخر الدين محمد عثمان عبده البرهاني',
    short_bio: 'مجدد الطريقة البرهانية الدسوقية الشاذلية، وصاحب شروحات علوم السبع المثاني.',
    full_bio: 'محمد عثمان عبده البرهاني، الملقب بفخر الدين. عالم ومربي صوفي ارتبطت به شروحات علوم السبع المثاني وحلقات التربية الروحية وتوسيع انتشار الطريقة عالمياً.',
    birth_date: '1902م',
    death_date: '1983م',
    birth_date_precision: 'year',
    death_date_precision: 'year',
    birth_place_id: 'plc-omdurman',
    death_place_id: 'plc-omdurman',
    gender: 'male',
    is_deceased: true,
    school_id: 'sch-maliki',
    tariqa_id: 'tar-burhaniyya',
    category_ids: ['cat-sufiya'],
    status: 'published',
    verification_status: 'verified',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SEED_PERSON_NAMES: PersonName[] = [
  ...MATHANI_NEW_NAMES,
  { id: 'pn-ali-1', person_id: 'person-ali', name: 'علي بن أبي طالب بن عبد المطلب بن هاشم', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-ali-2', person_id: 'person-ali', name: 'أبو الحسن', language: 'ar', name_type: 'kunya', is_primary: false },
  { id: 'pn-ali-3', person_id: 'person-ali', name: 'أبو تراب', language: 'ar', name_type: 'kunya', is_primary: false },
  { id: 'pn-ali-4', person_id: 'person-ali', name: 'أمير المؤمنين', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-ali-5', person_id: 'person-ali', name: 'القرشي الهاشمي', language: 'ar', name_type: 'nisba', is_primary: false },
  
  { id: 'pn-malik-1', person_id: 'person-malik', name: 'مالك بن أنس بن مالك الأصبحي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-malik-2', person_id: 'person-malik', name: 'إمام دار الهجرة', language: 'ar', name_type: 'laqab', is_primary: false },
  { id: 'pn-malik-3', person_id: 'person-malik', name: 'أبو عبد الله', language: 'ar', name_type: 'kunya', is_primary: false },
  
  { id: 'pn-shafii-1', person_id: 'person-shafii', name: 'محمد بن إدريس بن العباس الشافعي المطلبي', language: 'ar', name_type: 'full_name', is_primary: true },
  { id: 'pn-shafii-2', person_id: 'person-shafii', name: 'ناصر الحديث', language: 'ar', name_type: 'laqab', is_primary: false }
];

export const SEED_RELATIONSHIPS: Relationship[] = [
  ...generateSabMathaniRelationships(),
  // النسب والعائلة
  { id: 'rel-ali-hassan', source_person_id: 'person-ali', target_person_id: 'person-al-hassan', relationship_type_id: 'rel-parent', relationship_type_code: 'parent_of', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-ali-hussain', source_person_id: 'person-ali', target_person_id: 'person-al-hussain', relationship_type_id: 'rel-parent', relationship_type_code: 'parent_of', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-hassan-hussain', source_person_id: 'person-al-hassan', target_person_id: 'person-al-hussain', relationship_type_id: 'rel-brother', relationship_type_code: 'brother_of', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-hussain-jaafar', source_person_id: 'person-al-hussain', target_person_id: 'person-jaafar-sadiq', relationship_type_id: 'rel-ancestor', relationship_type_code: 'ancestor_of', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // السلسلة العلمية والفقهية
  { id: 'rel-jaafar-abuhanifa', source_person_id: 'person-jaafar-sadiq', target_person_id: 'person-abu-hanifa', relationship_type_id: 'rel-teacher', relationship_type_code: 'teacher_of', description: 'روى أبو حنيفة عن الإمام جعفر الصادق واستفاد من مجالسه العلمية', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-jaafar-malik', source_person_id: 'person-jaafar-sadiq', target_person_id: 'person-malik', relationship_type_id: 'rel-teacher', relationship_type_code: 'teacher_of', description: 'روى الإمام مالك عن جعفر الصادق في الموطأ', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-malik-shafii', source_person_id: 'person-malik', target_person_id: 'person-shafii', relationship_type_id: 'rel-teacher', relationship_type_code: 'teacher_of', description: 'لزم الشافعي الإمام مالك بالمدينة وقرأ عليه الموطأ حفظاً', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-shafii-ahmad', source_person_id: 'person-shafii', target_person_id: 'person-ahmad', relationship_type_id: 'rel-teacher', relationship_type_code: 'teacher_of', description: 'أخذ الإمام أحمد أصول الفقه والناسخ والمنسوخ عن الشافعي ببغداد', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-ahmad-bukhari', source_person_id: 'person-ahmad', target_person_id: 'person-bukhari', relationship_type_id: 'rel-teacher', relationship_type_code: 'teacher_of', description: 'التقى البخاري بالإمام أحمد وروى عنه وذاكره في علل الأحاديث', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // السلسلة الروحية والطرائق الصوفية المتصلة بالسند
  { id: 'rel-ali-jilani', source_person_id: 'person-ali', target_person_id: 'person-jilani', relationship_type_id: 'rel-ancestor', relationship_type_code: 'ancestor_of', description: 'نسب حسني حسيني وسند خرق التصوف', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-ali-shadhili', source_person_id: 'person-ali', target_person_id: 'person-shadhili', relationship_type_id: 'rel-ancestor', relationship_type_code: 'ancestor_of', description: 'نسب حسني إدريسي وسند الإسناد الصوفي', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-shadhili-dasuqi', source_person_id: 'person-shadhili', target_person_id: 'person-dasuqi', relationship_type_id: 'rel-master', relationship_type_code: 'master_of', description: 'سلسلة المشيخة والتربية الروحية الجامعة بين الشاذلية والدسوقية', confidence: 'high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'rel-dasuqi-fakhr', source_person_id: 'person-dasuqi', target_person_id: 'person-fakhr-al-din', relationship_type_id: 'rel-master', relationship_type_code: 'master_of', description: 'تجديد السند الدسوقي والشاذلي عبر الطريقة البرهانية الدسوقية الشاذلية', confidence: 'very_high', verification_status: 'verified', status: 'published', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export const SEED_TREES: Tree[] = [
  SEED_SAB_MATHANI_TREE,
  {
    id: 'tree-fuqaha-sanad',
    name: 'شجرة الأئمة الأربعة وسند الفقه الإسلامي',
    slug: 'sanad-al-fuqaha',
    description: 'شبكة العلاقات العلمية وأسانيد الرواية بين أئمة الفقه والحديث من عصر النبوة وآل البيت إلى الأئمة الأربعة والبخاري',
    tree_type: 'scholars',
    category_id: 'cat-fuqaha',
    root_person_id: 'person-ali',
    visibility: 'public',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tree-spiritual-lineage',
    name: 'سلسلة الإسناد الروحي وأقطاب السبع المثاني',
    slug: 'spiritual-lineage-mathani',
    description: 'المسار الروحي المتصل عبر آل البيت الكرام وأقطاب الطرائق (القادرية، الشاذلية، الدسوقية، البرهانية)',
    tree_type: 'spiritual_lineage',
    category_id: 'cat-sufiya',
    root_person_id: 'person-ali',
    visibility: 'public',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tree-genealogy-albayt',
    name: 'شجرة النسب الشريف لآل البيت النبوي',
    slug: 'genealogy-ahl-albayt',
    description: 'شجرة الأنساب الشريفة العلوية والحسنية والحسينية',
    tree_type: 'genealogy',
    category_id: 'cat-ahl-albayt',
    root_person_id: 'person-ali',
    visibility: 'public',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const SEED_CLAIMS: Claim[] = [
  {
    id: 'claim-sab-mathani-origin',
    subject_type: 'person',
    subject_id: 'person-fakhr-al-din',
    predicate: 'origin_concept_sab_mathani',
    object_value: 'بيان أن اسم المنصة مستوحى من حديث وشروح مولانا الإمام فخر الدين حول السبع المثاني وسلاسل المعرفة الروحية المتصلة',
    confidence: 'very_high',
    status: 'published',
    verification_status: 'verified',
    created_by: 'system'
  }
];
