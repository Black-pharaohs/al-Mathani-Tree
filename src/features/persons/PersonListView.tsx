import React, { useState, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Calendar, BookOpen, Network, ChevronLeft, Award } from 'lucide-react';
import { Person, Category, School, Tariqa } from '../../core/types';

interface PersonListViewProps {
  onOpenPerson: (personId: string) => void;
  onOpenTree: () => void;
}

export const PersonListView: React.FC<PersonListViewProps> = ({ onOpenPerson, onOpenTree }) => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [tariqas, setTariqas] = useState<Tariqa[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Load categories, schools, and tariqas
    Promise.all([
      fetch('/api/v1/categories').then(r => r.json()),
      fetch('/api/v1/schools').then(r => r.json()),
      fetch('/api/v1/tariqas').then(r => r.json())
    ]).then(([catRes, schRes, tarRes]) => {
      if (catRes.success) setCategories(catRes.data);
      if (schRes.success) setSchools(schRes.data);
      if (tarRes.success) setTariqas(tarRes.data);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedSchool) params.append('school', selectedSchool);
    if (searchTerm) params.append('search', searchTerm);

    fetch(`/api/v1/persons?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPersons(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch persons:', err);
        setLoading(false);
      });
  }, [selectedCategory, selectedSchool, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Heading */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heritage text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
              موسوعة الأعلام والشخصيات
            </h2>
            <p className="text-stone-600 text-sm max-w-2xl">
              قاعدة بيانات موثقة تضم أئمة آل البيت، والصحابة، والفقهاء الأربعة، وأعلام الحديث، وأقطاب التزكية، مع أسانيدهم وتراجمهم.
            </p>
          </div>

          <button
            onClick={onOpenTree}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-amber-200 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all self-start md:self-auto border border-amber-900/30"
          >
            <Network className="w-4 h-4 text-amber-400" />
            <span>استعراض في الشجرة التفاعلية</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم، اللقب، أو الكنية..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pr-10 pl-4 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label="تصفية حسب التصنيف"
            className="bg-stone-50 text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2 border border-stone-200 focus:outline-none focus:border-amber-600 font-sans"
          >
            <option value="">جميع التصنيفات</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* School Filter */}
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            aria-label="تصفية حسب المذهب"
            className="bg-stone-50 text-stone-800 text-xs sm:text-sm rounded-xl px-3 py-2 border border-stone-200 focus:outline-none focus:border-amber-600 font-sans"
          >
            <option value="">جميع المذاهب</option>
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {(selectedCategory || selectedSchool || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSelectedSchool('');
                setSearchTerm('');
              }}
              className="text-xs text-stone-500 hover:text-amber-800 px-2 py-1 font-semibold"
            >
              إعادة ضبط
            </button>
          )}

        </div>
      </div>

      {/* Persons Cards Grid (Sections 80-81 of Spec) */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-heritage text-lg text-stone-600">جارٍ تحميل التراجم المحققة...</p>
        </div>
      ) : persons.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-stone-300 p-8">
          <p className="text-stone-500 text-sm">لم يتم العثور على شخصيات مطابقة لمعايير البحث الحالية.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {persons.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all hover:border-amber-600/50 flex flex-col justify-between overflow-hidden group"
            >
              
              {/* Card Header & Content */}
              <div className="p-6">
                
                {/* Header row: Status & Era */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>سند معتمد</span>
                  </span>

                  <div className="flex items-center gap-1 text-xs text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{person.birth_date || '؟'} — {person.death_date || '؟'}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 
                  onClick={() => onOpenPerson(person.id)}
                  className="font-heritage text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors cursor-pointer mb-2 leading-snug"
                >
                  {person.primary_name}
                </h3>

                {/* Short Bio */}
                <p className="text-xs text-stone-600 font-sans line-clamp-3 leading-relaxed mb-4">
                  {person.short_bio || 'عالم ومحدث جليل من أعلام الأمة الإسلامية.'}
                </p>

              </div>

              {/* Card Footer Actions */}
              <div className="px-6 py-3.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-mono">
                  Slug: {person.slug}
                </span>

                <button
                  onClick={() => onOpenPerson(person.id)}
                  className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors"
                >
                  <span>عرض التفاصيل</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
