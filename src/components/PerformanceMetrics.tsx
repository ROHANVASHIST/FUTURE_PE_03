import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar
} from "recharts";
import { 
  TrendingUp, 
  Search, 
  MousePointerClick, 
  LineChart as ChartIcon, 
  ArrowUpRight, 
  Calendar,
  Sparkles,
  Award,
  Zap,
  History,
  Layers
} from "lucide-react";
import { BusinessInput, ClusterPlan } from "../types";

interface PerformanceMetricsProps {
  isDark: boolean;
  plan: ClusterPlan | null;
  activeInput: BusinessInput | null;
}

export function PerformanceMetrics({ isDark, plan, activeInput }: PerformanceMetricsProps) {
  const [timeframe, setTimeframe] = useState<"3m" | "6m" | "12m">("12m");
  const [activeMetricTab, setActiveMetricTab] = useState<"traffic" | "positions" | "ctr">("traffic");
  
  // Local storage simulations list tracker
  const [savedSims, setSavedSims] = useState<any[]>([]);
  const [selectedSimId, setSelectedSimId] = useState<string>("active");

  // Read saved portfolios/simulations on loading and updates
  useEffect(() => {
    const stored = localStorage.getItem("seo_saved_campaigns");
    if (stored) {
      try {
        setSavedSims(JSON.parse(stored));
      } catch (err) {
        console.error("Error reading saved campaigns in simulator", err);
      }
    }
  }, [plan, activeInput]);

  // Determine active simulation profile
  const activeSim = useMemo(() => {
    if (selectedSimId === "active") {
      return { plan, activeInput };
    }
    const found = savedSims.find(s => s.id === selectedSimId);
    if (found) {
      return { plan: found.plan, activeInput: found.input };
    }
    return { plan, activeInput };
  }, [selectedSimId, savedSims, plan, activeInput]);

  // Dynamically tailor simulating parameters to the active simulation context
  const currentPlan = activeSim.plan;
  const currentInput = activeSim.activeInput;

  const businessLabel = currentInput?.businessName || "Demoweb Enterprise";
  const nicheLabel = currentInput?.services || currentInput?.primaryKeyword || "Topical Focus Cluster";
  const primaryTerm = currentInput?.primaryKeyword || "Topical Authority Cluster";

  // Create highly tailored, simulated dataset based on selected inputs & generated plan
  const simulatedData = useMemo(() => {
    const hasActivePlan = !!currentPlan;
    const supportNodes = currentPlan?.cluster?.supporting || [];
    const nodeCount = supportNodes.length || 5;
    
    // Calculate primary keyword difficulty/word length
    const primaryWordCount = primaryTerm.split(/\s+/).filter(Boolean).length;
    // Easier ranking if it's a long-tail keyword (higher word count)
    const difficultyScore = Math.max(12, Math.min(94, 90 - (primaryWordCount * 11))); // score from 12 to 94
    
    // Depth multiplier based on selected depth options
    const isComp = currentInput?.contentDepth === "Comprehensive Focus" || currentInput?.contentDepth?.toLowerCase().includes("comp");
    const velocityScale = isComp ? 1.45 : 1.05;
    
    // Customize volume potential by category/niche context
    let nicheTrafficCeiling = 8200;
    const textToAnalyze = `${currentInput?.businessType || ""} ${nicheLabel} ${primaryTerm}`.toLowerCase();
    if (textToAnalyze.includes("tech") || textToAnalyze.includes("saas") || textToAnalyze.includes("software") || textToAnalyze.includes("app")) {
      nicheTrafficCeiling = 14800;
    } else if (textToAnalyze.includes("law") || textToAnalyze.includes("legal") || textToAnalyze.includes("medical") || textToAnalyze.includes("dental") || textToAnalyze.includes("clinic")) {
      nicheTrafficCeiling = 4600; // lower volume but higher conversion/intent quality
    } else if (textToAnalyze.includes("shop") || textToAnalyze.includes("retail") || textToAnalyze.includes("ecom") || textToAnalyze.includes("store")) {
      nicheTrafficCeiling = 24000;
    }

    const rawData = [];
    for (let i = 1; i <= 12; i++) {
      const monthLabel = `Month ${i}`;
      
      // S-curve logistic formula for SEO Traffic: L / (1 + e^(-k * (x - x0)))
      const x = i;
      const x0 = 5.2; // midpoint month
      const k = 0.48 * velocityScale; // growth rate
      const L = nicheTrafficCeiling * (nodeCount / 5) * (hasActivePlan ? 1.3 : 0.85);
      
      const trafficVal = Math.round(150 + (L / (1 + Math.exp(-k * (x - x0)))));
      
      // Calculate search engine positions: Starts at e.g. Rank startRank and drops (improves) to finalTargetRank
      const startRank = Math.min(98, Math.round(55 + (difficultyScore / 2.2)));
      const finalTargetRank = Math.max(1.3, parseFloat((12 - (nodeCount * 1.4) - (primaryWordCount * 0.7)).toFixed(1)));
      
      // Exponential curve for ranking improvement
      const rankDrop = (startRank - finalTargetRank) * (1 - Math.exp(-0.24 * x));
      const currentRank = Math.max(1.2, parseFloat((startRank - rankDrop).toFixed(1)));
      
      // Click-Through Rate is inversely proportional to search position
      const targetCtr = parseFloat((0.4 + (8.5 / currentRank) * (hasActivePlan ? 1.45 : 0.9)).toFixed(2));
      
      // Interactive backlink simulation matches node size growth over time
      const indexPercent = Math.min(100, Math.round((i * 14.5) * velocityScale));
      const crawlCounts = Math.round((i * 42) * velocityScale * (hasActivePlan ? 1.2 : 0.8));

      rawData.push({
        month: monthLabel,
        traffic: trafficVal,
        pos: currentRank,
        ctr: targetCtr,
        backlinks: Math.round(i * (nodeCount * 0.8)),
        pillarCrawl: crawlCounts,
        clusterIndexed: indexPercent
      });
    }

    // Filter based on timeframe state
    if (timeframe === "3m") {
      return rawData.slice(0, 3);
    } else if (timeframe === "6m") {
      return rawData.slice(0, 6);
    }
    return rawData;
  }, [timeframe, plan, activeInput, nicheLabel, primaryTerm]);

  // Overall calculations based on data
  const statsSummary = useMemo(() => {
    const lastElement = simulatedData[simulatedData.length - 1];
    const prevElement = simulatedData[0];
    
    const trafficDiff = lastElement.traffic - prevElement.traffic;
    const trafficChangePct = ((trafficDiff / prevElement.traffic) * 100).toFixed(0);
    
    return {
      currentTraffic: lastElement.traffic.toLocaleString(),
      trafficGrowthPct: `+${trafficChangePct}%`,
      averageRank: lastElement.pos.toFixed(1),
      rankJump: (prevElement.pos - lastElement.pos).toFixed(0),
      currentCtr: `${lastElement.ctr.toFixed(1)}%`,
      ctrMultiplier: (lastElement.ctr / prevElement.ctr).toFixed(1)
    };
  }, [simulatedData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      id="performance-metrics-section"
      className="scroll-mt-20 my-16"
    >
      <div className={`relative rounded-3xl p-6 sm:p-10 overflow-hidden border shadow-xl ${
        isDark 
          ? "bg-slate-950/40 border-slate-800 shadow-indigo-950/5" 
          : "bg-white border-slate-200/80 shadow-indigo-100/10"
      }`}>
        
        {/* Abstract futuristic accents */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-505/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute left-1/4 bottom-0 w-80 h-80 bg-emerald-500/3 rounded-full blur-2xl pointer-events-none -z-10"></div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100 dark:border-slate-850/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800/40 text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              Algorithmic ROI Projection
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-light tracking-tight leading-none text-slate-900 dark:text-slate-100">
              Topical Velocity <span className="font-semibold text-indigo-600 dark:text-indigo-400">Simulator</span>
            </h3>
            <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Projected keyword growth model resulting from deploying {currentPlan?.cluster?.supporting?.length || 5} interconnected authoritative nodes for <strong className="text-slate-800 dark:text-slate-200 font-semibold">{businessLabel}</strong>.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Dynamic saved campaign simulations selector */}
            {savedSims.length > 0 && (
              <div className={`flex items-center p-1 rounded-xl border ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}>
                <Layers className="w-3.5 h-3.5 mx-2 text-indigo-505" />
                <select
                  value={selectedSimId}
                  onChange={(e) => setSelectedSimId(e.target.value)}
                  className={`border-0 bg-transparent py-1 px-2.5 text-[10px] font-mono font-bold uppercase cursor-pointer focus:outline-none ${
                    isDark ? "text-slate-300 bg-slate-950" : "text-slate-750 bg-white"
                  }`}
                >
                  <option value="active" className={isDark ? "bg-slate-950 text-slate-300" : "bg-white text-slate-700"}>
                    {plan ? `Current Active Plan` : "🚀 Active Strategy"}
                  </option>
                  {savedSims.map((sim: any) => (
                    <option key={sim.id} value={sim.id} className={isDark ? "bg-slate-950 text-slate-300" : "bg-white text-slate-700"}>
                      📊 Sim: {sim.name?.substring(0, 18)}...
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <Calendar className="w-4 h-4 mx-2 text-slate-400" />
              {(["3m", "6m", "12m"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-lg font-mono text-[10px] font-bold uppercase cursor-pointer border-none transition-all ${
                    timeframe === t
                      ? "bg-indigo-600 text-white shadow-sm"
                      : isDark ? "text-slate-400 hover:text-white bg-transparent" : "text-slate-650 hover:text-slate-900 bg-transparent"
                  }`}
                >
                  {t === "3m" ? "3 M" : t === "6m" ? "6 M" : "1 Year"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Multi-State Bento Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          
          {/* Card 1: Organic Traffic */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => setActiveMetricTab("traffic")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeMetricTab === "traffic"
                ? isDark 
                  ? "bg-indigo-950/25 border-indigo-500 shadow-indigo-950/40" 
                  : "bg-indigo-50/50 border-indigo-300 shadow-indigo-100/40"
                : isDark ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700" : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={`p-2 rounded-xl text-indigo-600 border ${
                isDark ? "bg-indigo-500/10 border-indigo-500/25" : "bg-indigo-100/40 border-indigo-200/55"
              }`}>
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {statsSummary.trafficGrowthPct}
              </span>
            </div>
            <div className="mt-4">
              <h4 className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Estimated Monthly Traffic
              </h4>
              <p className="text-2xl font-semibold tracking-tight font-display mt-1 text-slate-900 dark:text-slate-100">
                {statsSummary.currentTraffic} <span className="text-[11px] font-normal text-slate-500 font-mono">visits/mo</span>
              </p>
              <p className={`text-[10px] mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                Simulating rapid indexing of the {nicheLabel} domain.
              </p>
            </div>
          </motion.div>

          {/* Card 2: Keyword Rankings */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => setActiveMetricTab("positions")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeMetricTab === "positions"
                ? isDark 
                  ? "bg-indigo-950/25 border-indigo-500 shadow-indigo-950/40" 
                  : "bg-indigo-50/50 border-indigo-300 shadow-indigo-100/40"
                : isDark ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700" : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={`p-2 rounded-xl text-indigo-600 border ${
                isDark ? "bg-indigo-500/10 border-indigo-500/25" : "bg-indigo-100/40 border-indigo-200/55"
              }`}>
                <Search className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-550/10 px-2 py-0.5 rounded-full">
                Jumped {statsSummary.rankJump} spots
              </span>
            </div>
            <div className="mt-4">
              <h4 className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Core Average Position
              </h4>
              <p className="text-2xl font-semibold tracking-tight font-display mt-1 text-slate-900 dark:text-slate-100">
                #{statsSummary.averageRank} <span className="text-[11px] font-normal text-slate-500 font-mono">avg rank</span>
              </p>
              <p className={`text-[10px] mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                Focused ranking lift on <span className="underline italic text-indigo-505 font-mono text-[9px]">{primaryTerm.substring(0, 22)}...</span>
              </p>
            </div>
          </motion.div>

          {/* Card 3: Click-Through Rate */}
          <motion.div
            whileHover={{ y: -3 }}
            onClick={() => setActiveMetricTab("ctr")}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              activeMetricTab === "ctr"
                ? isDark 
                  ? "bg-indigo-950/25 border-indigo-500 shadow-indigo-950/40" 
                  : "bg-indigo-50/50 border-indigo-300 shadow-indigo-100/40"
                : isDark ? "bg-slate-900/30 border-slate-800/80 hover:border-slate-700" : "bg-slate-50/50 border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className={`p-2 rounded-xl text-indigo-600 border ${
                isDark ? "bg-indigo-500/10 border-indigo-500/25" : "bg-indigo-100/40 border-indigo-200/55"
              }`}>
                <MousePointerClick className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                {statsSummary.ctrMultiplier}x higher CTR
              </span>
            </div>
            <div className="mt-4">
              <h4 className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                Organic Click-Through Rate
              </h4>
              <p className="text-2xl font-semibold tracking-tight font-display mt-1 text-slate-900 dark:text-slate-100">
                {statsSummary.currentCtr} <span className="text-[11px] font-normal text-slate-500 font-mono">avg ctr</span>
              </p>
              <p className={`text-[10px] mt-2 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                Enriched snip optimization captures direct response.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Central Visualization Section */}
        <div className={`p-5 sm:p-6 rounded-2xl border ${
          isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <ChartIcon className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-slate-350">
                {activeMetricTab === "traffic" && "Simulated Organic SEO Traffic Ascent Curve"}
                {activeMetricTab === "positions" && "Topical Clustering Position Velocity Map (#)"}
                {activeMetricTab === "ctr" && "Calculated Organic Click-Through Growth Trend"}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span>
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>Core Authority Target</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>Branch Clusters</span>
              </div>
            </div>
          </div>

          {/* High performance charting stage */}
          <div className="h-64 sm:h-80 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetricTab === "traffic" ? (
                <AreaChart data={simulatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorCrawl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDark ? "#64748b" : "#475569"} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={isDark ? "#64748b" : "#475569"} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? "#020617" : "#ffffff", 
                      borderColor: isDark ? "#1e293b" : "#cbd5e1",
                      borderRadius: "12px",
                      color: isDark ? "#f8fafc" : "#0f172a"
                    }} 
                  />
                  <Area 
                    name="Organic Visits/Month"
                    type="monotone" 
                    dataKey="traffic" 
                    stroke="#6366f1" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorTraffic)" 
                  />
                  <Area 
                    name="Pillar Crawler Index Rate"
                    type="monotone" 
                    dataKey="pillarCrawl" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    fillOpacity={1} 
                    fill="url(#colorCrawl)" 
                  />
                </AreaChart>
              ) : activeMetricTab === "positions" ? (
                <LineChart data={simulatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDark ? "#64748b" : "#475569"} 
                    tickLine={false}
                  />
                  <YAxis 
                    reversed 
                    stroke={isDark ? "#64748b" : "#475569"} 
                    tickLine={false} 
                    axisLine={false}
                    label={{ value: 'Search Engine Rank position', angle: -90, position: 'insideLeft', fill: isDark ? "#64748b" : "#475569" }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? "#020617" : "#ffffff", 
                      borderColor: isDark ? "#1e293b" : "#cbd5e1",
                      borderRadius: "12px",
                      color: isDark ? "#f8fafc" : "#0f172a"
                    }} 
                  />
                  <Line 
                    name="Average Search Rank Position"
                    type="monotone" 
                    dataKey="pos" 
                    stroke="#6366f1" 
                    strokeWidth={3} 
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={simulatedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
                  <XAxis 
                    dataKey="month" 
                    stroke={isDark ? "#64748b" : "#475569"} 
                    tickLine={false}
                  />
                  <YAxis 
                    stroke={isDark ? "#64748b" : "#475569"} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? "#020617" : "#ffffff", 
                      borderColor: isDark ? "#1e293b" : "#cbd5e1",
                      borderRadius: "12px",
                      color: isDark ? "#f8fafc" : "#0f172a"
                    }} 
                  />
                  <Bar 
                    name="Calculated Click-Through Rate (%)"
                    dataKey="ctr" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    name="Target Cluster Coverage (%)"
                    dataKey="clusterIndexed" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]}
                    opacity={0.65}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Forecasting Insight Bottom Alert */}
        <div className={`mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isDark ? "bg-slate-900/50 border-slate-800" : "bg-indigo-50/20 border-indigo-100"
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-505/10 flex items-center justify-center text-indigo-550 border border-indigo-550/25">
              <Zap className="w-4 h-4 animate-pulse" />
            </span>
            <p className="text-[11px] leading-relaxed">
              <strong className="font-semibold text-slate-800 dark:text-slate-100">Topical Velocity Insight:</strong> Interconnecting your pillar and supportive nodes will pass critical contextual weight, triggering up to <span className="font-bold font-display text-indigo-550 text-xs">{statsSummary.ctrMultiplier}x</span> click-through amplification on Google Search Engine Results Pages (SERPs) compared to publishing unlinked blog pages.
            </p>
          </div>
          
          <button
            onClick={() => {
              const el = document.getElementById("newsletter-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-1 border-0 bg-transparent text-[10.5px] font-mono tracking-wider font-extrabold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline uppercase shrink-0"
          >
            Get PDF Strategy
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
