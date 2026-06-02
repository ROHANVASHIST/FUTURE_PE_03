import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Database, 
  Trash2, 
  Download, 
  ExternalLink,
  PlusCircle, 
  CheckCircle, 
  Calendar, 
  Sparkles, 
  Clock, 
  FolderOpen,
  Award,
  Shield, 
  FileBox, 
  Layers, 
  TrendingUp,
  MapPin,
  ChevronRight,
  Info
} from "lucide-react";
import { BusinessInput, ClusterPlan, GeneratedBlog } from "../types";

export interface SavedCampaign {
  id: string;
  name: string;
  timestamp: string;
  input: BusinessInput;
  plan: ClusterPlan;
  pillarBlog: GeneratedBlog;
  supportingBlogs: GeneratedBlog[];
}

interface ProfilePortfolioProps {
  isDark: boolean;
  onLoadCampaign: (campaign: SavedCampaign) => void;
  currentCampaign: {
    input: BusinessInput | null;
    plan: ClusterPlan | null;
    pillarBlog: GeneratedBlog | null;
    supportingBlogs: GeneratedBlog[];
  };
  currentUserEmail?: string;
}

export function ProfilePortfolio({ isDark, onLoadCampaign, currentCampaign, currentUserEmail = "rohanvashist01@gmail.com" }: ProfilePortfolioProps) {
  const [campaigns, setCampaigns] = useState<SavedCampaign[]>([]);
  const [customName, setCustomName] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedLocalCampaign, setSelectedLocalCampaign] = useState<SavedCampaign | null>(null);

  // Load campaigns from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("seo_saved_campaigns");
    if (stored) {
      try {
        setCampaigns(JSON.parse(stored));
      } catch (err) {
        console.error("Error reading saved campaigns", err);
      }
    }
  }, []);

  const saveCampaign = () => {
    if (!currentCampaign.plan || !currentCampaign.input || !currentCampaign.pillarBlog) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }

    const campaignName = customName.trim() || `${currentCampaign.input.businessName} - ${currentCampaign.input.primaryKeyword}`;
    const newCampaign: SavedCampaign = {
      id: "camp_" + Date.now(),
      name: campaignName,
      timestamp: new Date().toISOString(),
      input: currentCampaign.input,
      plan: currentCampaign.plan,
      pillarBlog: currentCampaign.pillarBlog,
      supportingBlogs: currentCampaign.supportingBlogs
    };

    const updated = [newCampaign, ...campaigns];
    setCampaigns(updated);
    localStorage.setItem("seo_saved_campaigns", JSON.stringify(updated));
    setCustomName("");
    setSaveStatus("success");
    setSelectedLocalCampaign(newCampaign);
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const deleteCampaign = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = campaigns.filter(c => c.id !== id);
    setCampaigns(updated);
    localStorage.setItem("seo_saved_campaigns", JSON.stringify(updated));
    if (selectedLocalCampaign?.id === id) {
      setSelectedLocalCampaign(null);
    }
  };

  const loadCampaign = (camp: SavedCampaign) => {
    onLoadCampaign(camp);
  };

  // Compute neat statistics for user dashboards
  const stats = {
    totalCampaigns: campaigns.length,
    totalIndexedBlogs: campaigns.reduce((acc, c) => acc + 1 + c.supportingBlogs.length, 0),
    avgSupportingNodes: campaigns.length > 0
      ? (campaigns.reduce((acc, c) => acc + c.supportingBlogs.length, 0) / campaigns.length).toFixed(1)
      : "0",
    estimatedTotalTrafficPotential: campaigns.reduce((acc, c) => {
      // Simulate traffic prediction based on business input
      const depthFactor = c.input.contentDepth === "Comprehensive Focus" ? 1.5 : 1.0;
      return acc + Math.round(11200 * depthFactor);
    }, 0).toLocaleString()
  };

  return (
    <div id="profile-portfolio-container" className="space-y-8">
      {/* Dynamic Profile Header Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
        isDark 
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/20 border-slate-850" 
          : "bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 border-slate-200"
      }`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-505/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold tracking-wider relative overflow-hidden shadow-lg border ${
              isDark ? "bg-slate-900 border-indigo-500/25 text-indigo-400" : "bg-white border-indigo-200 text-indigo-600"
            }`}>
              <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
              <User className="w-8 h-8 relative z-10" />
            </div>
            
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-display font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {currentUserEmail.split("@")[0].toUpperCase()}
                </h3>
                <span className="text-[9px] font-mono font-bold bg-indigo-500/15 border border-indigo-500/25 text-indigo-500 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  Pro Analyst
                </span>
                <span className="text-[9px] font-mono font-bold bg-emerald-500/15 border border-emerald-500/25 text-emerald-500 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  Verified Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1 font-mono">
                <span>Account:</span>
                <strong className="text-indigo-600 dark:text-indigo-400">{currentUserEmail}</strong>
              </p>
              <p className="text-[10px] text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Edge Server Region Client Terminal</span>
              </p>
            </div>
          </div>

          {/* Core Analytics Badges */}
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 w-full md:w-auto">
            <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Campaigns</span>
              <strong className="text-lg font-semibold tracking-tight">{stats.totalCampaigns}</strong>
            </div>
            <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Total Pages</span>
              <strong className="text-lg font-semibold tracking-tight text-indigo-500">{stats.totalIndexedBlogs}</strong>
            </div>
            <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Avg Nodes/Map</span>
              <strong className="text-lg font-semibold tracking-tight text-emerald-500">{stats.avgSupportingNodes}</strong>
            </div>
            <div className={`p-3 rounded-2xl border text-center ${isDark ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-150 shadow-sm"}`}>
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Proj Traffic</span>
              <strong className="text-sm font-semibold tracking-tight block mt-1 truncate max-w-[80px]" title={stats.estimatedTotalTrafficPotential}>
                {stats.estimatedTotalTrafficPotential}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Campaign Management Hub splitting Local Saving Options and Cluster Library */}
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Quick Save Active Hub */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-3xl border shadow-md relative overflow-hidden h-full flex flex-col justify-between ${
            isDark ? "bg-slate-950/80 border-slate-850" : "bg-white border-slate-200"
          }`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500">
                  <Database className="w-3.5 h-3.5" />
                </span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Archive Session Cache
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Commit compiled semantic nodes to local profiles</p>
                </div>
              </div>

              {currentCampaign.plan ? (
                <div className={`p-4 rounded-xl border space-y-3 ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded font-extrabold border border-emerald-500/20">
                      Completed Strategy Detected
                    </span>
                    <strong className="text-[10px] font-mono text-slate-400">
                      {1 + currentCampaign.supportingBlogs.length} Active Nodes
                    </strong>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block select-none">Active Target Company</span>
                    <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                      {currentCampaign.input?.businessName}
                    </h5>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block select-none">Topical Focal Target Keyword</span>
                    <p className="text-[10px] font-mono text-indigo-505 dark:text-indigo-300 truncate">
                      "{currentCampaign.input?.primaryKeyword}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`p-6 rounded-xl border border-dashed text-center space-y-2 ${isDark ? "border-slate-800 bg-slate-900/10" : "border-slate-250 bg-slate-50/50"}`}>
                  <FileBox className="w-8 h-8 text-slate-350 dark:text-slate-700 mx-auto" />
                  <h5 className="text-xs font-medium text-slate-400 dark:text-slate-650">No Active Generated Strategy</h5>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                    Fill the Theme Target Matrix above and tap "Generate" to construct a new SEO node cluster map first.
                  </p>
                </div>
              )}

              {currentCampaign.plan && (
                <div className="space-y-3.5 pt-2">
                  <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 select-none">
                    Campaign Portfolio Title (Custom Name)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`e.g. ${currentCampaign.input?.businessName} Launch Bundle`}
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-505/20 transition text-xs font-medium ${
                      isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"
                    }`}
                  />
                </div>
              )}
            </div>

            {currentCampaign.plan && (
              <div className="pt-6 border-t border-slate-100 dark:border-slate-850 mt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={saveCampaign}
                  className="w-full text-[11px] bg-indigo-650 hover:bg-indigo-700 text-white px-4 py-3.5 rounded-xl font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Save Strategy to Local Library
                </motion.button>

                <AnimatePresence>
                  {saveStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-[10px] font-mono text-center font-bold flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Campaign Saved Successfully to Profile!
                    </motion.div>
                  )}
                  {saveStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-500 text-[10px] font-mono text-center font-bold"
                    >
                      Error: Generate cluster campaigns map before saving
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Saved SEO Clusters Explorer */}
        <div className="lg:col-span-7">
          <div className={`p-6 rounded-3xl border shadow-md relative overflow-hidden h-full flex flex-col ${
            isDark ? "bg-slate-950/80 border-slate-850" : "bg-white border-slate-200"
          }`}>
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-505"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-5 gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/25">
                  <FolderOpen className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Saved Campaign Library
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">Select a campaign portfolio cluster from local storage</p>
                </div>
              </div>
              
              <div className="text-[9px] font-mono uppercase bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-slate-400">
                {campaigns.length} Portfolios Cached
              </div>
            </div>

            {campaigns.length > 0 ? (
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1.5 custom-scrollbar">
                {campaigns.map((camp) => {
                  const isSelectedForInspect = selectedLocalCampaign?.id === camp.id;
                  return (
                    <motion.div
                      key={camp.id}
                      onClick={() => setSelectedLocalCampaign(isSelectedForInspect ? null : camp)}
                      whileHover={{ y: -2 }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-4 ${
                        isSelectedForInspect
                          ? isDark 
                            ? "bg-indigo-950/20 border-indigo-500 shadow-indigo-900/20" 
                            : "bg-indigo-50/40 border-indigo-300 shadow-indigo-100/30"
                          : isDark ? "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900" : "bg-slate-50/50 border-slate-200 hover:border-indigo-200 hover:bg-white"
                      }`}
                    >
                      <div className={`p-2.5 rounded-xl shrink-0 border ${
                        isSelectedForInspect
                          ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-550"
                          : isDark ? "bg-slate-950 border-slate-850 text-slate-400" : "bg-white border-slate-250 text-slate-500"
                      }`}>
                        <Layers className="w-4 h-4" />
                      </div>

                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h5 className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100 truncate pr-4">
                            {camp.name}
                          </h5>
                          <span className="text-[9px] text-slate-400 font-mono whitespace-nowrap shrink-0 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {new Date(camp.timestamp).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                          <span className={`px-2 py-0.5 rounded-md border ${
                            isDark ? "bg-slate-950 border-slate-850 text-slate-400" : "bg-white border-slate-200 text-slate-500"
                          }`}>
                            Company: {camp.input.businessName}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-bold uppercase">
                            Primary Theme: "{camp.input.primaryKeyword}"
                          </span>
                        </div>

                        {/* Expanded details & Restore buttons inside campaign item */}
                        <AnimatePresence>
                          {isSelectedForInspect && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-850 space-y-3.5 overflow-hidden"
                              onClick={(e) => e.stopPropagation()} // Stop click bubbling up to item list toggle
                            >
                              <div className="grid grid-cols-2 gap-3 font-mono text-[9.5px]">
                                <div className="space-y-1.5">
                                  <span className="text-slate-400 block select-none">Services Focused</span>
                                  <span className="text-slate-800 dark:text-slate-200 block truncate font-medium">
                                    {camp.input.services}
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  <span className="text-slate-400 block select-none">Tone Parameters</span>
                                  <span className="text-slate-800 dark:text-slate-200 block truncate font-medium">
                                    {camp.input.toneOfVoice || "Standard / Expert"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between gap-3 pt-2">
                                <button
                                  onClick={() => loadCampaign(camp)}
                                  className="px-3.5 py-2 rounded-lg bg-indigo-650 hover:bg-indigo-700 text-white font-mono text-[10px] font-bold uppercase transition flex items-center gap-1.5 border-0 cursor-pointer shadow-sm"
                                >
                                  <FolderOpen className="w-3.5 h-3.5" />
                                  Restore Workspace
                                </button>

                                <button
                                  onClick={(e) => deleteCampaign(camp.id, e)}
                                  className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-550 font-mono text-[10px] transition flex items-center justify-center cursor-pointer border-none"
                                  title="Delete strategy cache"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="shrink-0 flex items-center justify-center p-1">
                        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isSelectedForInspect ? "rotate-90 text-indigo-500" : ""}`} />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3.5">
                <FileBox className="w-12 h-12 text-slate-350 dark:text-slate-700 animate-pulse" />
                <div>
                  <h5 className="text-xs font-semibold text-slate-400 dark:text-slate-500">No Saved Projects in Local Profile</h5>
                  <p className="text-[10px] text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                    Once you source a semantic node SEO map with the Google Gemini algorithm, you can save and persist your configurations & full-length generated blog pages directly here.
                  </p>
                </div>
              </div>
            )}
            
            {/* Quick Informational Guide at bottom */}
            <div className={`mt-6 p-3.5 rounded-xl border flex items-start gap-2.5 ${
              isDark ? "bg-slate-900/30 border-slate-850" : "bg-indigo-50/10 border-indigo-100"
            }`}>
              <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-450">
                You can save unlimited concurrent keyword strategy architectures securely. Your campaign map, pillar articles, supportive nodes, LSI clusters, and outbound newsletter drafts are bundled tightly inside your browser’s isolated client-side storage box for immediate offline recall.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
