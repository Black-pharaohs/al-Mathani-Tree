import React, { useEffect, useRef, useState, useCallback } from 'react';
import cytoscape, { Core, EventObject } from 'cytoscape';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  Filter, 
  Search, 
  Info, 
  ExternalLink, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen, 
  Compass
} from 'lucide-react';
import { Tree, GraphPayload, CytoscapeNodeData } from '../../core/types';

interface TreeViewerProps {
  onOpenPerson: (personId: string) => void;
}

export const TreeViewer: React.FC<TreeViewerProps> = ({ onOpenPerson }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string>('tree-sab-mathani');
  const [depth, setDepth] = useState<number>(2);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedNodeData, setSelectedNodeData] = useState<CytoscapeNodeData | null>(null);
  const [graphMeta, setGraphMeta] = useState<{ nodesCount: number; edgesCount: number }>({ nodesCount: 0, edgesCount: 0 });
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Fetch list of available trees
  useEffect(() => {
    fetch('/api/v1/trees')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setTrees(data.data);
          const mathaniTree = data.data.find((t: Tree) => t.tree_type === 'sab_mathani');
          if (mathaniTree) {
            setSelectedTreeId(mathaniTree.id);
          } else {
            setSelectedTreeId(data.data[0].id);
          }
        }
      })
      .catch(err => console.error('Failed to fetch trees:', err));
  }, []);

  // Fetch graph data for the selected tree and depth
  const loadGraph = useCallback(async () => {
    if (!selectedTreeId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/trees/${selectedTreeId}/graph?depth=${depth}&node_limit=80`);
      const payload: { success: boolean; data: GraphPayload } = await res.json();

      if (!payload.success || !containerRef.current) {
        setIsLoading(false);
        return;
      }

      const { tree, nodes, edges } = payload.data;
      const isMathani = tree?.tree_type === 'sab_mathani';
      setGraphMeta({ nodesCount: nodes.length, edgesCount: edges.length });

      // Clean up previous instance
      if (cyRef.current) {
        cyRef.current.destroy();
      }

      // Initialize Cytoscape
      const cy = cytoscape({
        container: containerRef.current,
        elements: [
          ...nodes.map(n => ({ group: 'nodes' as const, data: n.data, position: n.position })),
          ...edges.map(e => ({ group: 'edges' as const, data: e.data }))
        ],
        style: [
          {
            selector: 'node',
            style: {
              'label': 'data(label)',
              'font-family': 'Amiri, serif',
              'font-size': '12px',
              'font-weight': 'bold',
              'text-valign': 'bottom',
              'text-margin-y': 7,
              'color': '#292524',
              'background-color': '#d97706',
              'border-width': 3,
              'border-color': '#b45309',
              'width': 42,
              'height': 42,
              'text-outline-color': '#fafaf9',
              'text-outline-width': 2,
              'transition-property': 'background-color, border-color, border-width',
              'transition-duration': 0.2
            }
          },
          {
            selector: 'node:selected',
            style: {
              'background-color': '#047857',
              'border-color': '#065f46',
              'border-width': 5,
              'color': '#064e3b',
              'font-size': '15px'
            }
          },
          // Specific Tier Styling for Sab' Mathani
          {
            selector: 'node[tierNumber = 1]',
            style: {
              'background-color': '#7c3aed',
              'border-color': '#5b21b6'
            }
          },
          {
            selector: 'node[tierNumber = 2]',
            style: {
              'background-color': '#0284c7',
              'border-color': '#0369a1'
            }
          },
          {
            selector: 'node[tierNumber = 3]',
            style: {
              'background-color': '#d97706',
              'border-color': '#b45309'
            }
          },
          {
            selector: 'node[tierNumber = 4]',
            style: {
              'background-color': '#059669',
              'border-color': '#047857'
            }
          },
          {
            selector: 'node[tierNumber = 5]',
            style: {
              'background-color': '#0d9488',
              'border-color': '#0f766e'
            }
          },
          {
            selector: 'node[tierNumber = 6]',
            style: {
              'background-color': '#b45309',
              'border-color': '#92400e'
            }
          },
          {
            selector: 'node[tierNumber = 7]',
            style: {
              'background-color': '#4338ca',
              'border-color': '#3730a3'
            }
          },
          // Knot Completers (Hassan, Hussain, Mahdi)
          {
            selector: 'node[?isKnotCompleter]',
            style: {
              'background-color': '#e11d48',
              'border-color': '#be123c',
              'border-width': 5,
              'width': 52,
              'height': 52,
              'color': '#881337',
              'font-size': '14px'
            }
          },
          {
            selector: 'edge',
            style: {
              'width': 2,
              'line-color': '#a8a29e',
              'target-arrow-color': '#78716c',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
              'arrow-scale': 1.1,
              'label': 'data(label)',
              'font-family': 'IBM Plex Sans Arabic, sans-serif',
              'font-size': '9px',
              'color': '#78716c',
              'text-background-opacity': 0.85,
              'text-background-color': '#fafaf9',
              'text-background-padding': '2px',
              'text-rotation': 'autorotate'
            }
          },
          {
            selector: 'edge[typeCode = "teacher_of"], edge[typeCode = "student_of"]',
            style: {
              'line-color': '#3b82f6',
              'target-arrow-color': '#2563eb'
            }
          },
          {
            selector: 'edge[typeCode = "master_of"], edge[typeCode = "disciple_of"]',
            style: {
              'line-color': '#10b981',
              'target-arrow-color': '#059669'
            }
          },
          {
            selector: 'edge[typeCode = "parent_of"], edge[typeCode = "child_of"], edge[typeCode = "ancestor_of"]',
            style: {
              'line-color': '#d97706',
              'target-arrow-color': '#b45309'
            }
          },
          {
            selector: 'edge[?isKnotCompletion]',
            style: {
              'line-color': '#fda4af',
              'target-arrow-color': '#e11d48',
              'width': 2,
              'line-style': 'dashed',
              'opacity': 0.85
            }
          },
          {
            selector: 'edge[?tierRelation]',
            style: {
              'line-color': '#cbd5e1',
              'target-arrow-shape': 'none',
              'width': 1.5,
              'opacity': 0.75
            }
          },
          {
            selector: 'edge[typeCode = "realm_service_of"]',
            style: {
              'line-color': '#8b5cf6',
              'target-arrow-color': '#7c3aed',
              'width': 3,
              'line-style': 'solid'
            }
          }
        ],
        layout: isMathani
          ? {
              name: 'preset',
              padding: 50,
              animate: true,
              animationDuration: 500
            }
          : {
              name: 'breadthfirst',
              directed: true,
              padding: 40,
              spacingFactor: 1.4,
              animate: true,
              animationDuration: 400
            },
        wheelSensitivity: 0.25,
        minZoom: 0.2,
        maxZoom: 2.5
      });

      // Handle Node Click
      cy.on('tap', 'node', (evt: EventObject) => {
        const node = evt.target;
        const data = node.data() as CytoscapeNodeData;
        setSelectedNodeData(data);
      });

      // Handle Canvas Tap (deselect)
      cy.on('tap', (evt: EventObject) => {
        if (evt.target === cy) {
          setSelectedNodeData(null);
        }
      });

      cyRef.current = cy;
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to load graph:', err);
      setIsLoading(false);
    }
  }, [selectedTreeId, depth]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Controls Handlers
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 30);
  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.reset();
      cyRef.current.fit(undefined, 40);
    }
  };

  // Node highlight on search
  const handleSearchNode = (query: string) => {
    setSearchTerm(query);
    if (!cyRef.current) return;
    if (!query.trim()) {
      cyRef.current.elements().removeClass('highlighted faded');
      return;
    }

    const matches = cyRef.current.nodes().filter(node => {
      const label = node.data('label') || '';
      return label.toLowerCase().includes(query.toLowerCase());
    });

    if (matches.length > 0) {
      cyRef.current.center(matches[0]);
      cyRef.current.zoom(1.2);
      matches[0].select();
      setSelectedNodeData(matches[0].data() as CytoscapeNodeData);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-stone-100 overflow-hidden select-none">
      
      {/* Top Toolbar / Tree Controls */}
      <div className="absolute top-4 right-4 left-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Tree Selector & Depth */}
        <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md p-2 rounded-2xl border border-amber-900/30 shadow-xl pointer-events-auto">
          <Layers className="w-4 h-4 text-amber-400 mr-1" />
          <select
            value={selectedTreeId}
            onChange={(e) => setSelectedTreeId(e.target.value)}
            aria-label="اختر الشجرة المعرفية"
            className="bg-stone-800 text-stone-100 text-xs sm:text-sm rounded-xl px-3 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-500 font-heritage font-bold"
          >
            {trees.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Depth Level selector (Lazy Loading control) */}
          <div className="flex items-center gap-1 border-r border-stone-700 pr-2 mr-1">
            <span className="text-[11px] text-stone-400 font-sans">العمق:</span>
            {[1, 2, 3].map(d => (
              <button
                key={d}
                onClick={() => setDepth(d)}
                className={`w-6 h-6 rounded-lg text-xs font-mono font-bold transition-all ${
                  depth === d ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Search within Graph */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="relative bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/30 shadow-xl flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 mr-2 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchNode(e.target.value)}
              placeholder="تحديد شخصية في الشجرة..."
              className="bg-transparent text-xs text-stone-200 placeholder-stone-500 focus:outline-none w-36 sm:w-48"
            />
          </div>
        </div>

      </div>

      {/* Floating Canvas Controls (Zoom, Fit, Reset) */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/40 shadow-2xl">
        <button 
          onClick={handleZoomIn}
          title="تكبير"
          className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={handleZoomOut}
          title="تصغير"
          className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={handleFit}
          title="ملاءمة الشاشة"
          className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button 
          onClick={handleReset}
          title="إعادة التمركز"
          className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Graph Legend & Status Pill */}
      <div className="absolute bottom-6 left-6 z-20 hidden lg:flex flex-col gap-2 bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border border-amber-900/30 text-[11px] text-stone-300 shadow-xl max-w-md">
        <div className="flex items-center justify-between border-b border-stone-800 pb-1.5 font-bold text-amber-400">
          <span>دليل المراتب وشبكة الإسناد</span>
          <span className="font-mono text-[10px] text-stone-400">{graphMeta.nodesCount} شخصية • {graphMeta.edgesCount} رابط</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600"></span>
            <span>1. الكروبيون (الجبروت)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span>2. الفلكيون (الملكوت)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
            <span>3. أولو العزم (الرسل)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>4. رؤساء الصحابة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            <span>5. عبادلة القرآن</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-800"></span>
            <span>6. أئمة المذاهب</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span>7. أقطاب التصوف</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>عقد التمام (3 أئمة)</span>
          </div>
        </div>
      </div>

      {/* Main Cytoscape Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center z-30">
          <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-amber-500/30 flex items-center gap-3 shadow-2xl">
            <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-heritage font-bold">جارٍ بناء إسقاط الشجرة المعرفية...</span>
          </div>
        </div>
      )}

      {/* Interactive Node Slide-over Drawer (Section 82 of Spec) */}
      {selectedNodeData && (
        <div className="absolute top-20 left-4 bottom-6 w-80 sm:w-96 bg-stone-900/95 backdrop-blur-md rounded-2xl border border-amber-900/50 shadow-2xl z-30 flex flex-col overflow-hidden text-stone-200 transition-all duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 bg-gradient-to-l from-stone-900 to-amber-950/50 border-b border-stone-800 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>شخصية موثقة ومعتمدة</span>
              </div>
              <h3 className="font-heritage text-xl font-bold text-amber-100 leading-tight">
                {selectedNodeData.label}
              </h3>
              {selectedNodeData.titles && selectedNodeData.titles.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedNodeData.titles.map((t, idx) => (
                    <span key={idx} className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSelectedNodeData(null)}
              className="text-stone-400 hover:text-stone-100 p-1 rounded-lg hover:bg-stone-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-stone-300">
            
            {/* Sab' Mathani Special Tier Information */}
            {selectedNodeData.isKnotCompleter ? (
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-rose-950/50 to-stone-900 border border-rose-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span>عقد التمام والرباط الجامع لكل أربعة</span>
                </div>
                <p className="text-[11.5px] text-stone-300 leading-relaxed font-heritage">
                  {selectedNodeData.duty || 'إكمال عقد كل أربعة من السبع المثاني وحفظ الرباط الجامع، وهم على التوالي: سيدنا الإمام الحسن، وسيدنا الإمام الحسين، وسيدنا الإمام المهدي.'}
                </p>
                <div className="text-[10px] text-rose-300/80 bg-rose-950/40 p-2 rounded-lg border border-rose-900/30">
                  المقام: مقام الجمع والتمام المحمدي
                </div>
              </div>
            ) : selectedNodeData.tierName ? (
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-stone-900 border border-amber-600/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-xs font-heritage">
                    {selectedNodeData.tierName}
                  </span>
                  {selectedNodeData.roleBadge && (
                    <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/25">
                      {selectedNodeData.roleBadge}
                    </span>
                  )}
                </div>
                {selectedNodeData.realm && (
                  <div className="text-[11px] text-stone-400">
                    <span className="text-amber-500/80 font-semibold">عالم الخدمة: </span>
                    <span>{selectedNodeData.realm}</span>
                  </div>
                )}
                {selectedNodeData.duty && (
                  <div className="text-[11px] text-stone-300 leading-relaxed bg-stone-800/50 p-2 rounded-lg border border-stone-700/40">
                    <span className="text-amber-400 font-semibold block mb-0.5">الوظيفة والخدمة:</span>
                    <span>{selectedNodeData.duty}</span>
                  </div>
                )}
              </div>
            ) : null}

            {/* Dates & Lifespan */}
            <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/50">
              <div className="text-[11px] text-stone-400 mb-1">الميلاد والوفاة أو النشأة</div>
              <div className="font-semibold text-stone-200">{selectedNodeData.birthDeath}</div>
            </div>

            {/* Quick Relationship Meta */}
            <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/50 space-y-2">
              <div className="text-[11px] text-stone-400 font-medium">الارتباطات في المنظومة</div>
              <div className="text-sm font-semibold text-amber-300">
                {selectedNodeData.degree || 1} رابط موثق في هذه الشجرة
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                ترتبط هذه المرتبة بصلة وثيقة بمنظومة السبع المثاني وعقد التمام وسلاسل الإسناد العلمي والروحي.
              </p>
            </div>

            {/* Scientific Rule Reminder */}
            <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-700/30 text-[11px] text-amber-200/90 leading-relaxed">
              <span className="font-bold">المعيار المرجعي:</span> مستند إلى شروح السبع المثاني ومصادر التراجم المعتمدة لعلوم الشريعة والحقيقة.
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-stone-800 bg-stone-900/90 flex gap-2">
            <button
              onClick={() => onOpenPerson(selectedNodeData.id)}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>فتح الملف والتوثيق الكامل</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
