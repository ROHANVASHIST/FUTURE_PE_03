import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ClusterPlan } from "../types";
import { 
  Network, 
  HelpCircle, 
  FileText, 
  Share2, 
  Zap, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  Target, 
  ArrowRight,
  Info 
} from "lucide-react";

export function ClusterMap({ plan, isDark }: { plan: ClusterPlan | null; isDark?: boolean }) {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    title: string;
    keyword: string;
    type: string;
    intent: string;
    crawlPriority: string;
    lsiKeywords: string[];
    linkWeight: string;
  } | null>(null);

  if (!plan) return null;

  const pillarNode = {
    id: "pillar",
    title: plan.cluster.pillar.title,
    keyword: plan.cluster.pillar.target_keyword,
    type: "Primary Pillar Node",
    intent: "Informational & Commercial Core",
    crawlPriority: "CRITICAL (Daily)",
    linkWeight: "100% Core Hub Authority",
    lsiKeywords: [
      `${plan.cluster.pillar.target_keyword} guide`,
      `comprehensive ${plan.cluster.pillar.target_keyword}`,
      `best strategic ${plan.cluster.pillar.target_keyword}`,
      `expert ${plan.cluster.pillar.target_keyword} breakdown`
    ]
  };

  const handleNodeClick = (node: typeof pillarNode) => {
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all duration-300 ${
        isDark 
          ? "bg-slate-950/40 border-slate-800 shadow-indigo-950/5" 
          : "bg-white border-slate-200/80 shadow-indigo-100/10"
      }`}
    >
      {/* Absolute background accent decor */}
      <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      {/* Decorative vertical band indicator */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-850/80 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/25">
            <Network className="w-4 h-4 text-indigo-500 animate-pulse" />
          </span>
          <div>
            <h3 className={`text-xs font-bold uppercase tracking-widest pl-1.5 ${isDark ? "text-slate-200" : "text-slate-900"}`}>
              Cluster Topical Link Map
            </h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5 pl-1.5">Interactive Multi-Node Semantic Tree</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 font-mono text-[9px] uppercase tracking-wider text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Click Nodes to Inspect Link Weight</span>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-10 relative pb-4 w-full">
        {/* Core Pillar Node */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 15 }}
          whileHover={{ y: -3, scale: 1.01 }}
          onClick={() => handleNodeClick(pillarNode)}
          className={`p-6 rounded-2xl max-w-lg text-center w-full z-20 border shadow-lg relative cursor-pointer transition-all duration-300 ${
            selectedNode?.id === "pillar" 
              ? "ring-2 ring-indigo-500 border-indigo-500 scale-[1.02] shadow-indigo-500/10" 
              : ""
          } ${
            isDark 
              ? "bg-slate-900 border-slate-800 text-slate-100" 
              : "bg-slate-900 border-slate-950 text-white"
          }`}
        >
          {/* Subtle neon glow at top boundary of active node */}
          {selectedNode?.id === "pillar" && (
            <div className="absolute top-0 left-10 right-10 h-[2px] bg-indigo-500 blur-sm rounded-full animate-pulse"></div>
          )}
          
          <div className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-extrabold mb-3 flex items-center justify-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-550 animate-ping"></span>
            PILLAR STRATEGIC CORE (CENTER)
          </div>
          <div className="font-display font-medium text-base leading-relaxed px-2">
            {plan.cluster.pillar.title}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <div className={`text-[9px] rounded-lg px-2.5 py-1 font-mono tracking-tight uppercase border font-semibold ${
              isDark ? "bg-slate-950 text-slate-305 border-slate-800" : "bg-slate-800 text-slate-300 border-slate-700"
            }`}>
              Target Goal: {plan.cluster.pillar.target_keyword}
            </div>
            <div className="text-[9px] rounded-lg px-2.5 py-1 font-mono tracking-tight uppercase bg-indigo-500/10 border border-indigo-400/25 text-indigo-300 font-bold">
              Power Rank Hub
            </div>
          </div>
          
          <div className="mt-3 text-[9px] text-indigo-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
            <Info className="w-3 h-3" />
            <span>Click to expand strategy metrics</span>
          </div>
        </motion.div>

        {/* Decorative SVG Connector wires with high-fidelity anim details */}
        <div className="absolute left-0 right-0 top-24 bottom-16 pointer-events-none z-10 hidden sm:block">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Left wire path */}
            <path 
              d="M 380,10 C 380,60 160,50 160,110" 
              fill="none" 
              stroke={isDark ? "#334155" : "#cbd5e1"} 
              strokeWidth="2" 
            />
            <path 
              d="M 380,10 C 380,60 160,50 160,110" 
              fill="none" 
              stroke="url(#glowGrad)" 
              strokeWidth="2" 
              strokeDasharray="8 12" 
              className="animate-[dash_6s_linear_infinite]"
            />
            {/* Center wire path */}
            <path 
              d="M 380,10 C 380,60 380,50 380,110" 
              fill="none" 
              stroke={isDark ? "#334155" : "#cbd5e1"} 
              strokeWidth="2" 
            />
            <path 
              d="M 380,10 C 380,60 380,50 380,110" 
              fill="none" 
              stroke="url(#glowGrad)" 
              strokeWidth="2" 
              strokeDasharray="8 12" 
              className="animate-[dash_5s_linear_infinite]"
            />
            {/* Right wire path */}
            <path 
              d="M 380,10 C 380,60 600,50 600,110" 
              fill="none" 
              stroke={isDark ? "#334155" : "#cbd5e1"} 
              strokeWidth="2" 
            />
            <path 
              d="M 380,10 C 380,60 600,50 600,110" 
              fill="none" 
              stroke="url(#glowGrad)" 
              strokeWidth="2" 
              strokeDasharray="8 12" 
              className="animate-[dash_6s_linear_infinite]"
            />
          </svg>
        </div>

        {/* Fallback connection rails for mobile screens */}
        <div className={`w-full max-w-2xl border-t relative mt-1 sm:hidden ${
          isDark ? "border-slate-800" : "border-slate-200"
        }`}>
          <div className="absolute -top-1 left-1/2 -ml-1 w-2 h-2 rounded-full bg-indigo-500"></div>
        </div>

        {/* Child supporting node matrix cards */}
        <div className="flex flex-wrap justify-center gap-6 w-full mt-2 z-20">
          {plan.cluster.supporting.map((blog, idx) => {
            const nodeId = `support-${idx}`;
            const isSelected = selectedNode?.id === nodeId;
            const blogNode = {
              id: nodeId,
              title: blog.title,
              keyword: blog.target_keyword,
              type: `${blog.blog_type} Supporting Node`,
              intent: blog.blog_type === "Long-Tail" ? "Transactional Search Intent" : "Commercial Investigation Core",
              crawlPriority: "HIGH (Every 48 Hours)",
              linkWeight: "Bidirectional Link to Pillar Core",
              lsiKeywords: [
                `${blog.target_keyword} reviews`,
                `${blog.target_keyword} services cost`,
                `local ${blog.target_keyword} company`,
                `near me ${blog.target_keyword}`
              ]
            };

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.08, type: "spring", stiffness: 100 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedNode(selectedNode?.id === nodeId ? null : blogNode)}
                className={`p-5 rounded-2xl border w-full sm:w-68 flex flex-col relative group transition-all duration-300 shadow-sm cursor-pointer ${
                  isSelected 
                    ? "ring-2 ring-indigo-500 border-indigo-500 bg-white dark:bg-slate-900 shadow-indigo-500/10 scale-[1.02]" 
                    : isDark 
                      ? "bg-slate-900/40 border-slate-800/80 text-slate-200 hover:bg-slate-900 hover:border-slate-700" 
                      : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-200 hover:shadow-md"
                }`}
              >
                {/* Visual anchor neon banner on card */}
                {isSelected && (
                  <div className="absolute top-0 left-6 right-6 h-[2px] bg-indigo-500 blur-sm rounded-full"></div>
                )}
                
                <div className="text-[10px] uppercase tracking-widest text-indigo-500 font-extrabold mb-3 font-mono flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 opacity-80" />
                  {blog.blog_type} Branch Node
                </div>
                
                <div className={`text-xs font-semibold flex-1 leading-relaxed ${
                  isDark ? "text-slate-100" : "text-slate-800"
                }`}>
                  {blog.title}
                </div>
                
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                  <div className={`text-[9px] px-2.5 py-1 border rounded-lg font-mono uppercase tracking-tight shadow-sm transition-colors ${
                    isDark 
                      ? "bg-slate-950 text-slate-400 border-slate-800 group-hover:border-indigo-900/60" 
                      : "bg-white text-slate-500 border-slate-200 group-hover:border-indigo-200"
                  }`}>
                    {blog.target_keyword}
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-920 flex items-center justify-center group-hover:opacity-100 opacity-70 transition-opacity">
                    <Share2 className="w-3 h-3 text-indigo-505" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SVG css helper inside Tailwind */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        .animate-\\[dash_6s_linear_infinite\\] {
          animation: dash 6s linear infinite;
        }
        .animate-\\[dash_5s_linear_infinite\\] {
          animation: dash 4s linear infinite;
        }
      `}</style>

      {/* Dynamic Inspector drawer showing granular weight analysis */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`mt-8 p-6 rounded-2xl border text-xs leading-relaxed relative overflow-hidden ${
              isDark 
                ? "bg-slate-900/70 border-slate-800 text-slate-300" 
                : "bg-indigo-50/25 border-indigo-100 text-slate-705 shadow-inner"
            }`}
          >
            <div className="absolute right-4 top-4">
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1 px-2.5 rounded-lg text-slate-400 hover:text-slate-600 border border-slate-200 dark:border-slate-800 bg-transparent cursor-pointer font-mono text-[9px]"
              >
                Close Metrics Panel
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded bg-indigo-500/10 text-indigo-500 border border-indigo-505/20 font-mono text-[9px] font-extrabold uppercase">
                    {selectedNode.type} Status Indicator
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] text-emerald-500 font-mono font-bold tracking-wider uppercase">Active Integration</span>
                </div>
                
                <h4 className={`text-base font-display font-medium leading-normal tracking-tight max-w-xl ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}>
                  {selectedNode.title}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl font-mono text-[11px] leading-relaxed pt-2 border-t border-slate-200/50 dark:border-slate-800/40">
                  <div className="space-y-1">
                    <span className="text-slate-400 select-none block text-[10px]">Target SEO Intent Focus</span>
                    <strong className="text-slate-850 dark:text-slate-100 font-semibold">{selectedNode.intent}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 select-none block text-[10px]">Indexed Crawl Velocity</span>
                    <strong className="text-slate-850 dark:text-slate-100 font-extrabold text-indigo-500">{selectedNode.crawlPriority}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 select-none block text-[10px]">Authority Weight distribution</span>
                    <strong className="text-slate-850 dark:text-slate-100 font-semibold">{selectedNode.linkWeight}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 select-none block text-[10px]">Latent Semantic Keyword Cores</span>
                    <span className="text-emerald-550 dark:text-emerald-400 font-bold font-mono text-[10px]">Perfect density model (1.8% to 2.4%)</span>
                  </div>
                </div>
              </div>

              {/* Sidebar card containing semantic LSI suggestions */}
              <div className={`p-4 rounded-xl border sm:w-64 max-w-full shrink-0 ${
                isDark ? "bg-slate-950/60 border-slate-800" : "bg-white border-slate-200"
              }`}>
                <h5 className="text-[9.5px] font-bold font-mono uppercase tracking-wider text-indigo-500 mb-2.5 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-indigo-505 shrink-0" />
                  Target LSI Synonyms Co-Indexing
                </h5>
                <ul className="space-y-1 font-mono text-[10px] pl-1.5 list-none">
                  {selectedNode.lsiKeywords.map((k, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 py-0.5 border-b border-slate-100 dark:border-slate-900/50 last:border-0 hover:text-indigo-500 transition-colors">
                      <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0"></span>
                      <span className="truncate">"{k}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
