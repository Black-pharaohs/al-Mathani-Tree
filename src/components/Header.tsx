import React, { useState, useEffect, useRef } from 'react';
import { Search, Network, Users, BookOpen, GitPullRequest, Info, Sparkles, CheckCircle2, Shield, LogIn, LogOut, KeyRound, Compass, MapPin } from 'lucide-react';
import { normalizeArabicText } from '../core/utils/arabic';
import { Person, Book, Source, Place } from '../core/types';
import { useAuth } from '../core/auth/AuthContext';

interface HeaderProps {
  currentTab: 'trees' | 'persons' | 'atlas' | 'sources' | 'contributions' | 'about' | 'admin';
  onSelectTab: (tab: 'trees' | 'persons' | 'atlas' | 'sources' | 'contributions' | 'about' | 'admin') => void;
  onSelectPerson: (personIdOrSlug: string) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onSelectPerson, onOpenAuth }) => {
  const { user, logout, can } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    persons: Person[];
    books: Book[];
    sources: Source[];
    places: Place[];
  }>({ persons: [], books: [], sources: [], places: [] });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ persons: [], books: [], sources: [], places: [] });
      setIsDropdownOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.data);
          setIsDropdownOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-amber-900/40 text-stone-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Title */}
          <div 
            onClick={() => onSelectTab('trees')}
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 border border-amber-500/40 flex items-center justify-center shadow-inner group-hover:border-amber-400 transition-colors">
              <span className="font-heritage text-2xl font-bold text-amber-200">٧</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heritage text-2xl font-bold tracking-wide text-amber-100 group-hover:text-amber-300 transition-colors">
                  السبع المثاني
                </h1>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  V1.0
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans hidden sm:block">
                موسوعة شبكات المعرفة والشخصيات الإسلامية
              </p>
            </div>
          </div>

          {/* Quick Search with Instant Arabic Normalizer */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
                placeholder="ابحث عن شخصية، إمام، كتاب، أو مصدر..."
                className="w-full bg-stone-800/90 border border-stone-700/80 rounded-xl pr-10 pl-4 py-2 text-sm text-stone-200 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-3" />
            </div>

            {/* Live Autocomplete Results */}
            {isDropdownOpen && (
              <div className="absolute right-0 left-0 mt-2 bg-stone-900 border border-amber-900/50 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>بحث دلالي وتوافقي مدعوم بـ pg_trgm</span>
                  </span>
                  <span className="font-mono text-amber-500/80">
                    {searchResults.persons.length + searchResults.books.length + (searchResults.places?.length || 0)} نتيجة
                  </span>
                </div>

                {searchResults.persons.length === 0 && searchResults.books.length === 0 && (!searchResults.places || searchResults.places.length === 0) && (
                  <div className="p-4 text-xs text-stone-400 text-center">
                    لم يُعثر على نتائج مطابقة لـ «{searchQuery}»
                  </div>
                )}

                {searchResults.persons.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-semibold text-amber-400/80 px-2 py-1 mb-1">الشخصيات والأعلام</div>
                    {searchResults.persons.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectPerson(p.id);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-stone-800 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="text-sm font-heritage font-bold text-stone-200">{p.primary_name}</div>
                          <div className="text-xs text-stone-400 line-clamp-1">{p.short_bio}</div>
                        </div>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400/70 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.books.length > 0 && (
                  <div className="p-2 border-t border-stone-800">
                    <div className="text-[11px] font-semibold text-amber-400/80 px-2 py-1 mb-1">المؤلفات والكتب</div>
                    {searchResults.books.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onSelectTab('sources');
                          setIsDropdownOpen(false);
                        }}
                        className="p-2 rounded-lg hover:bg-stone-800 cursor-pointer text-xs text-stone-300"
                      >
                        <span className="font-semibold text-amber-200">{b.title}</span> — {b.subtitle || b.description}
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.places && searchResults.places.length > 0 && (
                  <div className="p-2 border-t border-stone-800">
                    <div className="text-[11px] font-semibold text-emerald-400/80 px-2 py-1 mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>الحواضر والمعالم الجغرافية</span>
                    </div>
                    {searchResults.places.map((pl) => (
                      <div
                        key={pl.id}
                        onClick={() => {
                          onSelectTab('atlas');
                          setIsDropdownOpen(false);
                        }}
                        className="p-2 rounded-lg hover:bg-stone-800 cursor-pointer text-xs text-stone-300 flex items-center justify-between"
                      >
                        <span className="font-semibold text-emerald-200">{pl.name}</span>
                        <span className="text-[11px] text-stone-400 font-sans">{pl.city ? `${pl.city}، ` : ''}{pl.country}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('trees')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'trees'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Network className="w-4 h-4" />
              <span>الأشجار المعرفية</span>
            </button>

            <button
              onClick={() => onSelectTab('persons')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'persons'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>الأعلام</span>
            </button>

            <button
              onClick={() => onSelectTab('atlas')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'atlas'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
              title="أطلس المعالم والمراقد والمسارات التاريخية (البند 48)"
            >
              <Compass className="w-4 h-4" />
              <span>أطلس المراقد</span>
            </button>

            <button
              onClick={() => onSelectTab('sources')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'sources'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">المصادر</span>
            </button>

            <button
              onClick={() => onSelectTab('contributions')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'contributions'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
            >
              <GitPullRequest className="w-4 h-4" />
              <span className="hidden md:inline">التحقيق والمساهمة</span>
            </button>

            {/* Admin / Moderation Workspace (Sprint 1) */}
            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'admin'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-amber-300/80 hover:bg-stone-800 hover:text-amber-200'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">لوحة الإشراف والتدقيق</span>
            </button>

            <button
              onClick={() => onSelectTab('about')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                currentTab === 'about'
                  ? 'bg-amber-600 text-amber-50 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800 hover:text-stone-100'
              }`}
              title="عن السبع المثاني والمبادئ الهندسية"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* User Session / Auth Controls */}
            <div className="flex items-center gap-2 pr-2 border-r border-stone-800">
              {user ? (
                <div className="flex items-center gap-2">
                  <div 
                    onClick={() => onSelectTab('admin')}
                    className="cursor-pointer text-right hidden sm:block"
                  >
                    <div className="text-xs font-bold text-amber-200 leading-tight">{user.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{user.role}</span>
                    </div>
                  </div>

                  <button
                    onClick={logout}
                    title="تسجيل الخروج"
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold text-xs shadow-md transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>دخول الباحثين</span>
                </button>
              )}
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
};
