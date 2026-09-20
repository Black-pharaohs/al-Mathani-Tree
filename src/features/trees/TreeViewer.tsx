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
  ExternalLink, 
  ChevronLeft, 
  ShieldCheck, 
  BookOpen, 
  Compass,
  Download,
  Route,
  Sparkles,
  X,
  ArrowLeft,
  Check,
  Radio
} from 'lucide-react';
import { Tree, GraphPayload, CytoscapeNodeData } from '../../core/types';

interface TreeViewerProps {
  onOpenPerson: (personId: string) => void;
  initialFocusPersonId?: string | null;
}

type LayoutType = 'preset' | 'concentric' | 'cose' | 'circle';

export const TreeViewer: React.FC<TreeViewerProps> = ({ 
  onOpenPerson, 
  initialFocusPersonId 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  const [trees, setTrees] = useState<Tree[]>([]);
  const [selectedTreeId, setSelectedTreeId] = useState<string>('tree-sab-mathani');
  const [depth, setDepth] = useState<number>(2);
  const [layoutMode, setLayoutMode] = useState<LayoutType>('preset');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveSyncActive, setIsLiveSyncActive] = useState<boolean>(true);
  const [selectedNodeData, setSelectedNodeData] = useState<CytoscapeNodeData | null>(null);
  const [graphMeta, setGraphMeta] = useState<{ nodesCount: number; edgesCount: number }>({ nodesCount: 0, edgesCount: 0 });
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtering State
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [relationFilter, setRelationFilter] = useState<string>('all');

  // Pathfinding State
  const [isPathFinderOpen, setIsPathFinderOpen] = useState<boolean>(false);
  const [pathSourceId, setPathSourceId] = useState<string>('');
  const [pathTargetId, setPathTargetId] = useState<string>('');
  const [pathResult, setPathResult] = useState<{
    found: boolean;
    nodes: CytoscapeNodeData[];
    edgesCount: number;
  } | null>(null);
  const [pathError, setPathError] = useState<string | null>(null);

  // Available nodes for selection in pathfinder
  const [availableNodes, setAvailableNodes] = useState<CytoscapeNodeData[]>([]);

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
      setAvailableNodes(nodes.map(n => n.data));

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
              'transition-property': 'background-color, border-color, border-width, opacity, width, height',
              'transition-duration': 0.25
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
              'text-rotation': 'autorotate',
              'transition-property': 'line-color, target-arrow-color, width, opacity',
              'transition-duration': 0.25
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
          },
          // Highlight & Pathfinding Classes
          {
            selector: 'node.path-node',
            style: {
              'background-color': '#059669',
              'border-color': '#047857',
              'border-width': 6,
              'width': 58,
              'height': 58,
              'color': '#064e3b',
              'font-size': '15px',
              'z-index': 999
            }
          },
          {
            selector: 'edge.path-edge',
            style: {
              'line-color': '#059669',
              'target-arrow-color': '#047857',
              'width': 5,
              'opacity': 1,
              'z-index': 998
            }
          },
          {
            selector: '.faded-element',
            style: {
              'opacity': 0.12
            }
          }
        ],
        layout: isMathani && layoutMode === 'preset'
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

      // Check for initial focused person
      if (initialFocusPersonId) {
        const targetNode = cy.getElementById(initialFocusPersonId);
        if (targetNode.length) {
          cy.center(targetNode);
          cy.zoom(1.3);
          targetNode.select();
          setSelectedNodeData(targetNode.data() as CytoscapeNodeData);
        }
      }
    } catch (err) {
      console.error('Failed to load graph:', err);
      setIsLoading(false);
    }
  }, [selectedTreeId, depth, initialFocusPersonId, layoutMode]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  // Apply layout changes dynamically
  const handleApplyLayout = (mode: LayoutType) => {
    setLayoutMode(mode);
    if (!cyRef.current) return;
    const cy = cyRef.current;

    if (mode === 'preset') {
      cy.layout({
        name: 'preset',
        animate: true,
        animationDuration: 600,
        padding: 50
      }).run();
    } else if (mode === 'concentric') {
      cy.layout({
        name: 'concentric',
        concentric: (node: any) => {
          if (node.data('isKnotCompleter')) return 10;
          return 8 - (node.data('tierNumber') || 1);
        },
        levelWidth: () => 1,
        padding: 60,
        animate: true,
        animationDuration: 600
      }).run();
    } else if (mode === 'cose') {
      cy.layout({
        name: 'cose',
        animate: true,
        animationDuration: 700,
        nodeRepulsion: () => 7000,
        idealEdgeLength: () => 110,
        padding: 60
      }).run();
    } else if (mode === 'circle') {
      cy.layout({
        name: 'circle',
        animate: true,
        animationDuration: 600,
        padding: 60
      }).run();
    }
  };

  // Apply Filter across Cytoscape elements
  const applyFilters = (tier: string, rel: string) => {
    setTierFilter(tier);
    setRelationFilter(rel);
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.batch(() => {
      cy.elements().removeClass('faded-element');

      if (tier === 'all' && rel === 'all') {
        return;
      }

      // Filter Nodes
      cy.nodes().forEach(node => {
        let matchTier = true;
        if (tier !== 'all') {
          if (tier === 'knot') {
            matchTier = !!node.data('isKnotCompleter');
          } else {
            matchTier = node.data('tierNumber') === Number(tier);
          }
        }
        if (!matchTier) {
          node.addClass('faded-element');
        }
      });

      // Filter Edges
      cy.edges().forEach(edge => {
        let matchRel = true;
        if (rel !== 'all') {
          matchRel = edge.data('typeCode') === rel;
        }
        const srcFaded = edge.source().hasClass('faded-element');
        const tgtFaded = edge.target().hasClass('faded-element');
        if (!matchRel || srcFaded || tgtFaded) {
          edge.addClass('faded-element');
        }
      });
    });
  };

  const handleResetFilters = () => {
    applyFilters('all', 'all');
    setIsFilterPanelOpen(false);
  };

  // Pathfinding Handler
  const handleFindPath = () => {
    setPathError(null);
    if (!cyRef.current || !pathSourceId || !pathTargetId) {
      setPathError('يرجى تحديد شخصية البداية وشخصية الغاية أولاً.');
      return;
    }
    if (pathSourceId === pathTargetId) {
      setPathError('شخصية البداية مطابقة لشخصية الغاية.');
      return;
    }

    const cy = cyRef.current;
    const srcNode = cy.getElementById(pathSourceId);
    const tgtNode = cy.getElementById(pathTargetId);

    if (!srcNode.length || !tgtNode.length) {
      setPathError('إحدى الشخصيات غير محملة في الإسقاط الحالي.');
      return;
    }

    const aStar = cy.elements().aStar({
      root: srcNode,
      goal: tgtNode,
      directed: false
    });

    if (aStar.found) {
      cy.batch(() => {
        cy.elements().removeClass('path-node path-edge').addClass('faded-element');
        aStar.path.nodes().removeClass('faded-element').addClass('path-node');
        aStar.path.edges().removeClass('faded-element').addClass('path-edge');
      });

      cy.animate({
        fit: { eles: aStar.path, padding: 80 },
        duration: 600
      });

      const nodes = aStar.path.nodes().map(n => n.data() as CytoscapeNodeData);
      setPathResult({
        found: true,
        nodes,
        edgesCount: aStar.distance
      });
    } else {
      setPathError('لم يتم العثور على مسار اتصال مباشر في هذا العمق. يمكنك زيادة العمق من شريط التحكم.');
    }
  };

  const handleClearPath = () => {
    if (!cyRef.current) return;
    cyRef.current.elements().removeClass('path-node path-edge faded-element');
    setPathResult(null);
    setPathError(null);
    setPathSourceId('');
    setPathTargetId('');
    setIsPathFinderOpen(false);
    cyRef.current.fit(undefined, 40);
  };

  // Export High-Res PNG
  const handleExportPNG = () => {
    if (!cyRef.current) return;
    const pngUri = cyRef.current.png({
      full: true,
      scale: 2.5,
      bg: '#1c1917'
    });
    const link = document.createElement('a');
    link.href = pngUri;
    link.download = `shajarat-sab-mathani-${Date.now()}.png`;
    link.click();
  };

  // Export Graph JSON
  const handleExportJSON = () => {
    if (!cyRef.current) return;
    const graphJson = cyRef.current.json();
    const blob = new Blob([JSON.stringify(graphJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shajarat-sab-mathani-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Node highlight on search
  const handleSearchNode = (query: string) => {
    setSearchTerm(query);
    if (!cyRef.current) return;
    if (!query.trim()) {
      cyRef.current.elements().removeClass('faded-element');
      return;
    }

    const matches = cyRef.current.nodes().filter(node => {
      const label = node.data('label') || '';
      return label.toLowerCase().includes(query.toLowerCase());
    });

    if (matches.length > 0) {
      cyRef.current.center(matches[0]);
      cyRef.current.zoom(1.3);
      matches[0].select();
      setSelectedNodeData(matches[0].data() as CytoscapeNodeData);
    }
  };

  // Controls Handlers
  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 30);
  const handleReset = () => {
    if (cyRef.current) {
      cyRef.current.elements().removeClass('path-node path-edge faded-element');
      setPathResult(null);
      setPathError(null);
      setTierFilter('all');
      setRelationFilter('all');
      cyRef.current.reset();
      cyRef.current.fit(undefined, 40);
    }
  };

  const isFilteringActive = tierFilter !== 'all' || relationFilter !== 'all';

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] bg-stone-100 overflow-hidden select-none">
      
      {/* Top Main Toolbar */}
      <div className="absolute top-4 right-4 left-4 z-20 flex flex-wrap items-center justify-between gap-2 sm:gap-3 pointer-events-none">
        
        {/* Left Side: Tree Selector & Depth & Layout Mode */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {/* Tree Selector */}
          <div className="flex items-center gap-2 bg-stone-900/90 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl border border-amber-900/30 shadow-xl">
            <Layers className="w-4 h-4 text-amber-400 mr-1 hidden sm:block" />
            <select
              value={selectedTreeId}
              onChange={(e) => setSelectedTreeId(e.target.value)}
              aria-label="اختر الشجرة المعرفية"
              className="bg-stone-800 text-stone-100 text-xs sm:text-sm rounded-xl px-2 sm:px-3 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-500 font-heritage font-bold"
            >
              {trees.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            {/* Depth Level selector */}
            <div className="flex items-center gap-1 border-r border-stone-700 pr-2 mr-1">
              <span className="text-[11px] text-stone-400 font-sans hidden sm:inline">العمق:</span>
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

          {/* Layout Mode Selector */}
          <div className="hidden md:flex items-center gap-1 bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/30 shadow-xl text-xs">
            <span className="text-stone-400 px-1 font-semibold text-[11px]">الإسقاط:</span>
            <button
              onClick={() => handleApplyLayout('preset')}
              className={`px-2.5 py-1 rounded-xl transition-all font-heritage ${
                layoutMode === 'preset' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="الإسقاط الرتبي الهندسي للسبع المثاني"
            >
              الرتبي المنسق
            </button>
            <button
              onClick={() => handleApplyLayout('concentric')}
              className={`px-2.5 py-1 rounded-xl transition-all font-heritage ${
                layoutMode === 'concentric' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="الإسقاط الدائري المداري حول عقد التمام"
            >
              المداري الدائري
            </button>
            <button
              onClick={() => handleApplyLayout('cose')}
              className={`px-2.5 py-1 rounded-xl transition-all font-heritage ${
                layoutMode === 'cose' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
              title="الإسقاط العنقودي التفاعلي الحر"
            >
              العنقودي
            </button>
          </div>

          {/* Realtime Live Sync Badge */}
          <div 
            onClick={() => loadGraph()}
            title="اشتراك متصل لتحديث شبكة العلاقات لحظياً (Supabase Realtime) - انقر لإعادة المزامنة"
            className="hidden lg:flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-emerald-500/30 text-[11px] text-emerald-400 font-mono shadow-xl cursor-pointer hover:bg-stone-800 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-heritage text-xs font-semibold">بث العلاقات المباشر</span>
          </div>
        </div>

        {/* Right Side: Tools (Filter, Pathfinding, Export, Search) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Multi-Dimensional Filter Toggle */}
          <button
            onClick={() => {
              setIsFilterPanelOpen(!isFilterPanelOpen);
              setIsPathFinderOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md shadow-xl transition-all ${
              isFilteringActive || isFilterPanelOpen
                ? 'bg-amber-600 text-stone-950 border-amber-500 shadow-amber-900/40 font-bold'
                : 'bg-stone-900/90 text-stone-300 border-amber-900/30 hover:bg-stone-800'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">الفلاتر</span>
            {isFilteringActive && (
              <span className="w-2 h-2 rounded-full bg-stone-950"></span>
            )}
          </button>

          {/* Pathfinding Button */}
          <button
            onClick={() => {
              setIsPathFinderOpen(!isPathFinderOpen);
              setIsFilterPanelOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-semibold backdrop-blur-md shadow-xl transition-all ${
              isPathFinderOpen || pathResult
                ? 'bg-emerald-600 text-stone-950 border-emerald-500 shadow-emerald-900/40 font-bold'
                : 'bg-stone-900/90 text-stone-300 border-amber-900/30 hover:bg-stone-800'
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">مسار الإسناد والاتصال</span>
          </button>

          {/* Export High-Res PNG */}
          <button
            onClick={handleExportPNG}
            title="تصدير صورة عالية الدقة (PNG)"
            className="p-2 bg-stone-900/90 hover:bg-stone-800 text-stone-300 hover:text-amber-400 rounded-2xl border border-amber-900/30 shadow-xl transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Search within Graph */}
          <div className="relative bg-stone-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-amber-900/30 shadow-xl flex items-center">
            <Search className="w-3.5 h-3.5 text-stone-400 mr-2 ml-1" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchNode(e.target.value)}
              placeholder="تحديد شخصية في الشجرة..."
              className="bg-transparent text-xs text-stone-200 placeholder-stone-500 focus:outline-none w-32 sm:w-44"
            />
          </div>

        </div>

      </div>

      {/* Floating Filter Popover Panel */}
      {isFilterPanelOpen && (
        <div className="absolute top-20 right-4 sm:right-28 z-30 w-80 bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-amber-900/40 shadow-2xl space-y-4 text-xs text-stone-200 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 font-heritage text-sm">
              <Filter className="w-4 h-4" />
              <span>فلاتر الاستكشاف والتصنيف</span>
            </div>
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tier / Realm Filter */}
          <div className="space-y-1.5">
            <label className="text-stone-400 block font-semibold">حسب المرتبة أو العالم:</label>
            <select
              value={tierFilter}
              onChange={(e) => applyFilters(e.target.value, relationFilter)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500 font-heritage"
            >
              <option value="all">كافة المراتب والعوالم (الكل)</option>
              <option value="1">1. الكروبيون (عالم الجبروت)</option>
              <option value="2">2. الملائكة الفلكيون (عالم الملكوت)</option>
              <option value="3">3. أولو العزم من الرسل (عالم النبوة)</option>
              <option value="4">4. رؤساء الصحابة (الخلافة الراشدة)</option>
              <option value="5">5. عبادلة القرآن الكريم (الحفظ والتفسير)</option>
              <option value="6">6. أئمة المذاهب (أحكام الشريعة)</option>
              <option value="7">7. أقطاب التصوف (عالم الحقيقة والإحسان)</option>
              <option value="knot">عقد التمام (الأئمة الثلاثة)</option>
            </select>
          </div>

          {/* Relationship Type Filter */}
          <div className="space-y-1.5">
            <label className="text-stone-400 block font-semibold">حسب نوع الرابط:</label>
            <select
              value={relationFilter}
              onChange={(e) => applyFilters(tierFilter, e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-amber-500 font-heritage"
            >
              <option value="all">كافة أنواع الروابط</option>
              <option value="knot_completion_of">روابط عقد التمام والرباط الجامع</option>
              <option value="mathani_partner_of">شراكة المثنى (بين الأربعة)</option>
              <option value="realm_service_of">خدمة العوالم والترقي الإلهي</option>
              <option value="teacher_of">سلسلة المشيخة والأخذ</option>
              <option value="parent_of">النسب الشريف والعائلي</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-800">
            <button
              onClick={handleResetFilters}
              className="text-stone-400 hover:text-stone-200 text-[11px] underline"
            >
              إعادة ضبط الفلاتر
            </button>
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-colors"
            >
              تطبيق
            </button>
          </div>
        </div>
      )}

      {/* Floating Pathfinding Panel */}
      {isPathFinderOpen && (
        <div className="absolute top-20 right-4 sm:right-40 z-30 w-84 sm:w-96 bg-stone-900/95 backdrop-blur-md p-5 rounded-2xl border border-emerald-900/50 shadow-2xl space-y-4 text-xs text-stone-200 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <div className="flex items-center gap-2 font-bold text-emerald-400 font-heritage text-sm">
              <Route className="w-4 h-4" />
              <span>تحديد مسار الإسناد والاتصال (Pathfinding)</span>
            </div>
            <button
              onClick={() => setIsPathFinderOpen(false)}
              className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            محرك خوارزمي لاستخراج سلاسل الاتصال والروابط الروحية والعلمية بين أي شخصيتين في المنظومة وإبرازها مباشرة على الشجرة:
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] text-emerald-300 font-semibold mb-1">
                نقطة البداية (الشخصية الأولى):
              </label>
              <select
                value={pathSourceId}
                onChange={(e) => setPathSourceId(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500 font-heritage"
              >
                <option value="">-- اختر شخصية البداية --</option>
                {availableNodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-emerald-300 font-semibold mb-1">
                نقطة الغاية (الشخصية الثانية):
              </label>
              <select
                value={pathTargetId}
                onChange={(e) => setPathTargetId(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 focus:outline-none focus:border-emerald-500 font-heritage"
              >
                <option value="">-- اختر شخصية الغاية --</option>
                {availableNodes.map(n => (
                  <option key={n.id} value={n.id}>{n.label}</option>
                ))}
              </select>
            </div>

            {pathError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] leading-relaxed">
                {pathError}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleFindPath}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>استخراج المسار وإبرازه</span>
              </button>
              {pathResult && (
                <button
                  onClick={handleClearPath}
                  className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs transition-colors"
                >
                  إلغاء المسار
                </button>
              )}
            </div>
          </div>

          {/* Path Finding Result Breadcrumbs */}
          {pathResult && (
            <div className="pt-3 border-t border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-400">سلسلة الاتصال المكتشفة:</span>
                <span className="text-stone-400 font-mono">{pathResult.nodes.length} مراتب</span>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {pathResult.nodes.map((node, idx) => (
                  <div key={node.id} className="flex items-center gap-2 text-[11.5px] p-2 rounded-lg bg-stone-800/80 border border-stone-700/50">
                    <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 font-mono text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-heritage font-bold text-stone-100">{node.label}</span>
                    {idx < pathResult.nodes.length - 1 && (
                      <ArrowLeft className="w-3 h-3 text-emerald-500 mr-auto" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
          title="إعادة التمركز وضبط العرض"
          className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={handleExportJSON}
          title="تصدير بيانات المعرفة (JSON)"
          className="p-2 text-stone-300 hover:text-amber-400 hover:bg-stone-800 rounded-xl transition-colors"
        >
          <Download className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Graph Legend & Status Pill */}
      <div className="absolute bottom-6 left-6 z-20 hidden lg:flex flex-col gap-2 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-2xl border border-amber-900/30 text-[11px] text-stone-300 shadow-xl max-w-md">
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

      {/* Interactive Node Slide-over Drawer */}
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

            {/* Quick Actions inside Drawer: Pathfinding Helper */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setPathSourceId(selectedNodeData.id);
                  setIsPathFinderOpen(true);
                }}
                className="flex-1 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Route className="w-3.5 h-3.5 text-emerald-400" />
                <span>تعيين كبداية مسار</span>
              </button>
              <button
                onClick={() => {
                  setPathTargetId(selectedNodeData.id);
                  setIsPathFinderOpen(true);
                }}
                className="flex-1 p-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-[11px] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Route className="w-3.5 h-3.5 text-amber-400" />
                <span>تعيين كغاية مسار</span>
              </button>
            </div>

            {/* Dates & Lifespan */}
            <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700/50">
              <div className="text-[11px] text-stone-400 mb-1">الميلاد والوفاة أو النشأة</div>
              <div className="font-semibold text-stone-200">{selectedNodeData.birthDeath || 'ـ'}</div>
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
