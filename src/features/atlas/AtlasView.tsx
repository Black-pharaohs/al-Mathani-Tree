import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Compass, 
  Search, 
  Filter, 
  Building2, 
  Landmark, 
  ChevronLeft, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Route, 
  Calendar, 
  Globe, 
  ShieldCheck, 
  Layers, 
  Info,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';
import { PlaceWithDetails, ShrineWithPerson, ScholarlyJourney, HistoricalEra } from '../../data/placesShrinesData';

interface AtlasViewProps {
  onOpenPerson: (personId: string) => void;
  onOpenTree?: (personId?: string) => void;
  initialSelectedPlaceId?: string | null;
}

type AtlasTab = 'map' | 'shrines' | 'journeys' | 'timeline';

export const AtlasView: React.FC<AtlasViewProps> = ({
  onOpenPerson,
  onOpenTree,
  initialSelectedPlaceId
}) => {
  const [activeTab, setActiveTab] = useState<AtlasTab>('map');
  const [places, setPlaces] = useState<PlaceWithDetails[]>([]);
  const [shrines, setShrines] = useState<ShrineWithPerson[]>([]);
  const [journeys, setJourneys] = useState<ScholarlyJourney[]>([]);
  const [eras, setEras] = useState<HistoricalEra[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & State
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>('journey-shafii');
  const [shrineFilterTier, setShrineFilterTier] = useState<string>('all');

  // Load Data from API
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetch('/api/v1/places').then(r => r.json()),
      fetch('/api/v1/shrines').then(r => r.json()),
      fetch('/api/v1/journeys').then(r => r.json()),
      fetch('/api/v1/eras').then(r => r.json())
    ])
      .then(([placesRes, shrinesRes, journeysRes, erasRes]) => {
        if (placesRes.success) setPlaces(placesRes.data || []);
        if (shrinesRes.success) setShrines(shrinesRes.data || []);
        if (journeysRes.success) setJourneys(journeysRes.data || []);
        if (erasRes.success) setEras(erasRes.data || []);

        // Handle initial selected place if provided
        if (initialSelectedPlaceId && placesRes.success) {
          const match = (placesRes.data as PlaceWithDetails[]).find(
            p => p.id === initialSelectedPlaceId || p.slug === initialSelectedPlaceId
          );
          if (match) setSelectedPlace(match);
        }
      })
      .catch(err => {
        console.error('Failed to load atlas data', err);
      })
      .finally(() => setIsLoading(false));
  }, [initialSelectedPlaceId]);

  // Regions list
  const regions = useMemo(() => {
    const set = new Set<string>();
    places.forEach(p => {
      if (p.region) set.add(p.region);
    });
    return Array.from(set);
  }, [places]);

  // Filtered Places
  const filteredPlaces = useMemo(() => {
    return places.filter(p => {
      const matchRegion = selectedRegion === 'all' || p.region === selectedRegion;
      const matchSearch = !searchQuery.trim() || 
        p.name.includes(searchQuery) || 
        p.city?.includes(searchQuery) || 
        p.country?.includes(searchQuery) ||
        p.description?.includes(searchQuery);
      return matchRegion && matchSearch;
    });
  }, [places, selectedRegion, searchQuery]);

  // Filtered Shrines
  const filteredShrines = useMemo(() => {
    return shrines.filter(s => {
      const matchTier = shrineFilterTier === 'all' || s.mathaniTier?.toString() === shrineFilterTier;
      const matchSearch = !searchQuery.trim() || 
        s.name.includes(searchQuery) || 
        s.personName.includes(searchQuery) || 
        s.placeName.includes(searchQuery) || 
        s.city.includes(searchQuery) ||
        s.description?.includes(searchQuery);
      return matchTier && matchSearch;
    });
  }, [shrines, shrineFilterTier, searchQuery]);

  // Current selected journey
  const currentJourney = useMemo(() => {
    return journeys.find(j => j.id === selectedJourneyId) || journeys[0];
  }, [journeys, selectedJourneyId]);

  // Map projection coordinates converter
  // Bounding box for historical Islamic world:
  // Longitude: -10 (Morocco) to 70 (Central Asia) -> width = 80
  // Latitude: 10 (Sudan) to 42 (Bukhara/North) -> height = 32
  const projectCoordinates = (lat?: number, lng?: number) => {
    if (lat === undefined || lng === undefined) return { x: 50, y: 50 };
    const minLng = -8;
    const maxLng = 68;
    const minLat = 13;
    const maxLat = 42;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(8, Math.min(92, y))
    };
  };

  return (
    <div className="flex-1 flex flex-col bg-stone-950 text-stone-100 min-h-[calc(100vh-4rem)]">
      
      {/* Sub-Header & Navigation Controls */}
      <div className="bg-stone-900/90 backdrop-blur-md border-b border-amber-900/40 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-mono">
                البند 48 من الوثيقة المرجعية V1
              </span>
              <span className="text-stone-500">•</span>
              <span className="text-xs text-stone-400">الجغرافيا المعرفية والمراقد الشريفة</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-heritage font-bold text-amber-100 flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-amber-400" />
              <span>أطلس المعالم والمراقد والمسارات التاريخية</span>
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 text-xs self-start md:self-auto shadow-inner">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'map'
                  ? 'bg-amber-600 text-amber-50 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>الخريطة التفاعلية</span>
            </button>

            <button
              onClick={() => setActiveTab('shrines')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'shrines'
                  ? 'bg-amber-600 text-amber-50 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>سجل المراقد ({shrines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('journeys')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'journeys'
                  ? 'bg-amber-600 text-amber-50 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Route className="w-3.5 h-3.5" />
              <span>الرحلات العلمية</span>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-amber-600 text-amber-50 shadow-md'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>الخط الزمني للأعصار</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
              <div className="text-sm font-heritage text-stone-400">جاري تحميل بيانات الأطلس الجغرافي والمراقد الشريفة...</div>
            </div>
          </div>
        ) : (
          <>
            {/* ==================== TAB 1: INTERACTIVE CARTOGRAPHIC MAP ==================== */}
            {activeTab === 'map' && (
              <div className="flex-1 flex flex-col lg:flex-row gap-6">
                
                {/* Left/Main Map Canvas */}
                <div className="flex-1 flex flex-col bg-stone-900/60 rounded-3xl border border-stone-800/80 p-5 shadow-2xl relative overflow-hidden">
                  
                  {/* Filter bar over map */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10">
                    {/* Region Selector Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setSelectedRegion('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedRegion === 'all'
                            ? 'bg-amber-500 text-stone-950 font-bold shadow'
                            : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        كل الأقاليم ({places.length})
                      </button>
                      {regions.map(r => (
                        <button
                          key={r}
                          onClick={() => setSelectedRegion(r)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            selectedRegion === r
                              ? 'bg-amber-500 text-stone-950 font-bold shadow'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>

                    {/* Quick Search inside Map */}
                    <div className="relative min-w-[200px]">
                      <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="ابحث عن مدينة أو موطن..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-stone-950/80 border border-stone-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Cartographic Visual Stage */}
                  <div className="flex-1 min-h-[440px] relative bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 rounded-2xl border border-stone-800/60 p-4 overflow-hidden select-none">
                    
                    {/* Historical Cartographic Grid Backdrop */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
                    
                    {/* Ancient Compass Rose Watermark */}
                    <div className="absolute left-8 bottom-8 opacity-15 pointer-events-none">
                      <Compass className="w-48 h-48 text-amber-500" />
                    </div>

                    {/* Map Labels for Historical Regions */}
                    <div className="absolute top-8 left-12 text-stone-700 font-heritage text-sm tracking-widest pointer-events-none">
                      المغرب الأقصى والأندلس
                    </div>
                    <div className="absolute top-12 left-1/3 text-stone-700 font-heritage text-sm tracking-widest pointer-events-none">
                      مصر وكنانة الله
                    </div>
                    <div className="absolute top-10 right-1/3 text-stone-700 font-heritage text-sm tracking-widest pointer-events-none">
                      العراق ودار السلام
                    </div>
                    <div className="absolute bottom-16 right-1/4 text-stone-700 font-heritage text-sm tracking-widest pointer-events-none">
                      الحجاز ومهبط الوحي
                    </div>
                    <div className="absolute bottom-6 left-1/3 text-stone-700 font-heritage text-sm tracking-widest pointer-events-none">
                      أرض النوبة والسودان
                    </div>
                    <div className="absolute top-8 right-12 text-stone-700 font-heritage text-sm tracking-widest pointer-events-none">
                      خراسان وما وراء النهر
                    </div>

                    {/* Interactive Place Markers */}
                    {filteredPlaces.map((place) => {
                      const coords = projectCoordinates(place.latitude, place.longitude);
                      const isSelected = selectedPlace?.id === place.id;
                      const hasShrines = (place.shrinesCount || 0) > 0;

                      return (
                        <div
                          key={place.id}
                          style={{
                            left: `${coords.x}%`,
                            top: `${coords.y}%`
                          }}
                          onClick={() => setSelectedPlace(place)}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20 transition-transform duration-200 hover:scale-125"
                        >
                          {/* Pulse Ring for Selected Place */}
                          {isSelected && (
                            <div className="absolute -inset-2 rounded-full bg-amber-500/40 animate-ping" />
                          )}

                          {/* Marker Pin */}
                          <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-xl transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-500/40 scale-110'
                              : hasShrines
                                ? 'bg-emerald-600 text-stone-100 hover:bg-emerald-500 border border-emerald-400/50'
                                : 'bg-stone-800 text-stone-300 hover:bg-stone-700 border border-stone-600'
                          }`}>
                            {hasShrines ? (
                              <Landmark className="w-4 h-4" />
                            ) : (
                              <MapPin className="w-4 h-4" />
                            )}

                            {/* Badge count of shrines */}
                            {hasShrines && (
                              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-stone-950 font-bold text-[9px] rounded-full flex items-center justify-center shadow">
                                {place.shrinesCount}
                              </span>
                            )}
                          </div>

                          {/* Pin Tooltip / City Label */}
                          <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-heritage font-bold shadow-lg transition-all ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 shadow-amber-900/30'
                              : 'bg-stone-900/90 text-stone-200 border border-stone-700 group-hover:bg-stone-800'
                          }`}>
                            {place.name.split(' ')[0]}
                          </div>
                        </div>
                      );
                    })}

                    {/* Bottom Map Legend */}
                    <div className="absolute bottom-3 left-3 bg-stone-950/80 backdrop-blur-md p-2.5 rounded-xl border border-stone-800 text-[11px] flex items-center gap-4 text-stone-400 z-10">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-400" />
                        <span>مواطن ومراقد شريفة</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-stone-700 border border-stone-500" />
                        <span>حواضر علمية وتاريخية</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300" />
                        <span>الموقع المحدد حالياً</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick summary strip */}
                  <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-stone-400 px-2">
                    <div>
                      مجموع الحواضر الموثقة: <span className="font-bold text-amber-300">{places.length} مدينة وقطر</span>
                    </div>
                    <div>
                      إجمالي المراقد المقيدة في السجل: <span className="font-bold text-emerald-400">{shrines.length} مرقد ومقام مؤكد</span>
                    </div>
                  </div>
                </div>

                {/* Right/Side Place Detail Drawer */}
                <div className="w-full lg:w-96 flex flex-col bg-stone-900/90 rounded-3xl border border-amber-900/30 p-5 shadow-2xl">
                  {selectedPlace ? (
                    <div className="flex-1 flex flex-col">
                      {/* Drawer Header */}
                      <div className="flex items-start justify-between pb-3 border-b border-stone-800 mb-4">
                        <div>
                          <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-400 text-[10px] font-mono">
                            {selectedPlace.region || 'إقليم إسلامي'}
                          </span>
                          <h3 className="text-xl font-heritage font-bold text-amber-200 mt-1">
                            {selectedPlace.name}
                          </h3>
                          <div className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                            <Globe className="w-3 h-3 text-amber-400" />
                            <span>{selectedPlace.country}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedPlace(null)}
                          className="p-1 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Coordinates Pill */}
                      {selectedPlace.latitude && selectedPlace.longitude && (
                        <div className="mb-4 p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-between text-[11px] font-mono text-stone-300">
                          <span className="text-stone-400">الإحداثيات الجغرافية:</span>
                          <span className="text-amber-400">
                            {selectedPlace.latitude.toFixed(4)}°N, {selectedPlace.longitude.toFixed(4)}°E
                          </span>
                        </div>
                      )}

                      {/* Historical Importance */}
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-stone-300 mb-1.5 flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          <span>الأهمية التاريخية والروحية:</span>
                        </h4>
                        <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/40 p-3 rounded-xl border border-stone-800/60 font-serif">
                          {selectedPlace.historicalImportance || selectedPlace.description}
                        </p>
                      </div>

                      {/* Shrines in this city */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 sticky top-0 bg-stone-900 py-1 z-10">
                          <Landmark className="w-3.5 h-3.5" />
                          <span>المراقد والمقامات الموثقة في {selectedPlace.city || selectedPlace.name}:</span>
                        </div>

                        {shrines.filter(s => s.place_id === selectedPlace.id).length === 0 ? (
                          <div className="p-4 rounded-xl bg-stone-950/50 border border-stone-800/50 text-center text-xs text-stone-400">
                            حاضرة علمية وتاريخية عريقة احتضنت الرحلات والمدارس الفقهية.
                          </div>
                        ) : (
                          shrines
                            .filter(s => s.place_id === selectedPlace.id)
                            .map(shrine => (
                              <div 
                                key={shrine.id}
                                className="p-3.5 rounded-2xl bg-stone-950/80 border border-emerald-900/40 hover:border-emerald-600/60 transition-all space-y-2 group"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="text-xs font-heritage font-bold text-emerald-300">
                                    {shrine.name}
                                  </div>
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] whitespace-nowrap">
                                    مرقد محقق
                                  </span>
                                </div>

                                <div className="text-[11px] text-stone-400 flex items-center gap-1 font-heritage">
                                  <span>المنسوب إليه:</span>
                                  <span className="text-amber-200 font-bold">{shrine.personName}</span>
                                </div>

                                <p className="text-[11px] text-stone-300 leading-relaxed line-clamp-3">
                                  {shrine.description}
                                </p>

                                <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px]">
                                  <button
                                    onClick={() => onOpenPerson(shrine.person_id)}
                                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold transition-colors"
                                  >
                                    <span>عرض ترجمة الشخصية</span>
                                    <ChevronLeft className="w-3 h-3" />
                                  </button>

                                  {onOpenTree && (
                                    <button
                                      onClick={() => onOpenTree(shrine.person_id)}
                                      className="text-stone-400 hover:text-stone-200 transition-colors"
                                      title="إظهار الموقع في الشجرة"
                                    >
                                      <Layers className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-stone-400">
                      <Compass className="w-12 h-12 text-stone-600 mb-3 animate-pulse" />
                      <div className="text-sm font-heritage font-bold text-stone-300 mb-1">
                        اختر حاضرة أو موطناً من الخريطة
                      </div>
                      <div className="text-xs text-stone-400 max-w-xs leading-relaxed">
                        انقر على أي نقطة جغرافية لاستعراض المراقد الشريفة، وتاريخ الحاضرة، وأعلام السبع المثاني المرتبطين بها.
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ==================== TAB 2: VERIFIED SHRINES & MAQAMS REGISTER ==================== */}
            {activeTab === 'shrines' && (
              <div className="flex-1 flex flex-col space-y-5">
                
                {/* Search & Filter Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-stone-900/60 p-4 rounded-2xl border border-stone-800">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      placeholder="ابحث بالمرقد، أو اسم الإمام، أو المدينة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl pr-10 pl-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Mathani Tier Selector */}
                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <span className="text-xs text-stone-400 whitespace-nowrap">المرتبة في السبع المثاني:</span>
                    <select
                      value={shrineFilterTier}
                      onChange={(e) => setShrineFilterTier(e.target.value)}
                      className="bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-amber-500 font-heritage"
                    >
                      <option value="all">كل المراتب والأعلام</option>
                      <option value="1">المرتبة الأولى (الرسل والصحابة)</option>
                      <option value="3">المرتبة الثالثة (أئمة المذاهب)</option>
                      <option value="4">المرتبة الرابعة (أقطاب التصوف الأربعة)</option>
                      <option value="7">عقد التمام والمجددون</option>
                    </select>
                  </div>
                </div>

                {/* Shrines Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredShrines.map((shrine) => (
                    <div
                      key={shrine.id}
                      className="bg-stone-900/80 rounded-3xl border border-stone-800/80 hover:border-amber-600/50 p-5 shadow-xl flex flex-col justify-between transition-all group"
                    >
                      <div>
                        {/* Status & Tier Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-[10px] font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>مرقد تاريخي محقق</span>
                          </span>

                          {shrine.mathaniTier && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800/50 text-[10px] font-bold font-heritage">
                              المرتبة {shrine.mathaniTier}
                            </span>
                          )}
                        </div>

                        {/* Shrine Name & Person */}
                        <h3 className="text-base font-heritage font-bold text-amber-200 group-hover:text-amber-300 transition-colors mb-1.5 leading-snug">
                          {shrine.name}
                        </h3>
                        <div className="text-xs font-heritage font-bold text-stone-200 mb-2 flex items-center gap-1.5">
                          <span className="text-stone-400 font-normal">صاحب المرقد:</span>
                          <span>{shrine.personName}</span>
                        </div>

                        {/* Location Details */}
                        <div className="flex items-center gap-2 text-xs text-stone-400 mb-3 bg-stone-950/60 p-2.5 rounded-xl border border-stone-800/60">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{shrine.city} — {shrine.country}</span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-300 leading-relaxed line-clamp-4 font-serif mb-4">
                          {shrine.description}
                        </p>

                        {/* Source Reference strictly compliant with Source-First principle */}
                        <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800/80 text-[11px] text-stone-400 mb-4">
                          <div className="font-semibold text-amber-400/90 mb-0.5 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>المصدر والتوثيق المعتمد:</span>
                          </div>
                          <div className="font-serif leading-relaxed text-stone-300">
                            {shrine.sourceReference}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => onOpenPerson(shrine.person_id)}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>الملف التوثيقي الكامل</span>
                        </button>

                        <button
                          onClick={() => {
                            const p = places.find(item => item.id === shrine.place_id);
                            if (p) {
                              setSelectedPlace(p);
                              setActiveTab('map');
                            }
                          }}
                          className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-all flex items-center gap-1"
                          title="عرض الموضع على الخريطة"
                        >
                          <Globe className="w-3.5 h-3.5 text-amber-400" />
                          <span>الخريطة</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB 3: SCHOLARLY JOURNEYS ==================== */}
            {activeTab === 'journeys' && (
              <div className="flex-1 flex flex-col space-y-6">
                
                {/* Journey Selector Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {journeys.map((journey) => {
                    const isCurrent = journey.id === selectedJourneyId;
                    return (
                      <div
                        key={journey.id}
                        onClick={() => setSelectedJourneyId(journey.id)}
                        className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                          isCurrent
                            ? 'bg-amber-600/20 border-amber-500 shadow-lg shadow-amber-950/40'
                            : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs text-amber-400 font-bold mb-1">
                          <Route className="w-4 h-4" />
                          <span>مسار رحلة: {journey.personName}</span>
                        </div>
                        <h4 className="text-sm font-heritage font-bold text-stone-100 mb-1.5">
                          {journey.title}
                        </h4>
                        <div className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                          {journey.summary}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Journey Timeline & Map Stops */}
                {currentJourney && (
                  <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800 mb-8">
                      <div>
                        <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          <span>سير الرحلة والطلب العلمي للإمام</span>
                        </div>
                        <h2 className="text-2xl font-heritage font-bold text-amber-100">
                          {currentJourney.title}
                        </h2>
                        <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                          {currentJourney.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenPerson(currentJourney.personId)}
                        className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors self-start sm:self-auto flex items-center gap-2 shadow"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>فتح ترجمة {currentJourney.personName}</span>
                      </button>
                    </div>

                    {/* Sequential Journey Stages */}
                    <div className="relative pl-6 sm:pl-0 sm:pr-8 space-y-8 before:absolute before:top-4 before:bottom-4 before:right-3.5 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-emerald-500 before:to-amber-500">
                      {currentJourney.stops.map((stop, idx) => (
                        <div key={idx} className="relative flex items-start gap-4">
                          {/* Station Number Node */}
                          <div className="w-8 h-8 rounded-full bg-stone-950 border-2 border-amber-400 text-amber-300 font-mono text-xs font-bold flex items-center justify-center shadow-md z-10 flex-shrink-0">
                            {idx + 1}
                          </div>

                          {/* Stage Content Card */}
                          <div className="flex-1 bg-stone-950/70 p-5 rounded-2xl border border-stone-800 hover:border-amber-600/40 transition-all space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-base font-heritage font-bold text-amber-200">
                                  {stop.stageTitle}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-xs font-heritage font-semibold">
                                  {stop.placeName}
                                </span>
                              </div>
                              {stop.yearApprox && (
                                <span className="text-xs text-amber-400/90 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                                  {stop.yearApprox}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-stone-300 leading-relaxed font-serif pt-1">
                              {stop.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 4: CHRONOLOGICAL TIMELINE & ERAS ==================== */}
            {activeTab === 'timeline' && (
              <div className="flex-1 flex flex-col space-y-6">
                
                {/* Introduction banner */}
                <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base font-heritage font-bold text-amber-200 mb-1">
                      الخط الزمني التاريخي وتتابع طبقات السبع المثاني عبر القرون
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">
                      استعراض متصل للحقب التاريخية التي تتابعت فيها سلاسل الإسناد العلمي والتربوي من عصر النبوة والرسالة حتى عهد التجديد المعاصر.
                    </p>
                  </div>
                </div>

                {/* Eras Grid */}
                <div className="space-y-4">
                  {eras.map((era, index) => (
                    <div
                      key={era.id}
                      className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 hover:border-amber-600/40 shadow-xl transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
                        <div className="flex items-center gap-3">
                          <span 
                            style={{ backgroundColor: era.color }}
                            className="w-4 h-4 rounded-full shadow"
                          />
                          <h4 className="text-lg font-heritage font-bold text-stone-100">
                            {era.name}
                          </h4>
                        </div>
                        <span className="text-xs font-mono text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 self-start sm:self-auto">
                          {era.spanYears}
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed font-serif">
                        {era.description}
                      </p>

                      {/* Associated figures in this era */}
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-stone-400 mb-2">
                          أبرز أعلام هذه الحقبة في المنظومة:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {era.keyFigures.map(figId => {
                            const shrine = shrines.find(s => s.person_id === figId);
                            const name = shrine?.personName || figId;
                            return (
                              <button
                                key={figId}
                                onClick={() => onOpenPerson(figId)}
                                className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-amber-200 border border-stone-700/80 text-xs font-heritage font-bold transition-all flex items-center gap-1.5"
                              >
                                <span>{name}</span>
                                <ChevronLeft className="w-3 h-3 text-stone-500" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};
