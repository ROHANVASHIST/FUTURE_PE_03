import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calculator, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

interface ROICalculatorProps {
  isDark: boolean;
}

export function ROICalculator({ isDark }: ROICalculatorProps) {
  // States for sliders
  const [volume, setVolume] = useState<number>(10000); // 1,000 to 100,000
  const [ctr, setCtr] = useState<number>(4.5); // 1% to 25%
  const [conversionRate, setConversionRate] = useState<number>(2.5); // 0.5% to 15%
  const [customerValue, setCustomerValue] = useState<number>(1200); // $50 to $10,000

  // Calculated values
  const [traffic, setTraffic] = useState<number>(0);
  const [leads, setLeads] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);

  useEffect(() => {
    const estTraffic = Math.round(volume * (ctr / 100));
    const estLeads = Math.round(estTraffic * (conversionRate / 100));
    const estRevenue = Math.round(estLeads * customerValue);

    setTraffic(estTraffic);
    setLeads(estLeads);
    setRevenue(estRevenue);
  }, [volume, ctr, conversionRate, customerValue]);

  // Calculations for conventional Single Article vs Cluster Strategy
  const conventionalRevenue = Math.round(revenue * 0.25); // Cluster performs ~4x better
  const addedBenefit = revenue - conventionalRevenue;

  return (
    <div className="pt-16 border-t border-slate-150 dark:border-slate-850">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">ROI Projections</span>
        <h3 className={`text-2xl font-light font-display mt-2 tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          Dynamic Local SEO ROI Estimator
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          See the direct monetary potential of building structural topical authority clusters. Compare cluster compound performance versus standard isolated pages.
        </p>
      </div>

      <div className={`grid lg:grid-cols-12 gap-8 rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${isDark ? "bg-slate-950/70 border-slate-800/80" : "bg-white border-slate-200/80 shadow-md animate-fade-in"}`}>
        {/* Sliders Area */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Avg. Monthly Vertical Keyword Search Volume
              </label>
              <span className="font-mono text-xs font-semibold text-indigo-500">
                {volume.toLocaleString()} searches
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>1k</span>
              <span>50k</span>
              <span>100k</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Assumed Organic CTR (Rank #1-3 Average)
              </label>
              <span className="font-mono text-xs font-semibold text-indigo-500">
                {ctr.toFixed(1)}% CTR
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={ctr}
              onChange={(e) => setCtr(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>1%</span>
              <span>12.5%</span>
              <span>25%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Lead / Purchase Conversion Rate on Landing Page
              </label>
              <span className="font-mono text-xs font-semibold text-indigo-500">
                {conversionRate.toFixed(1)}% CVR
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.5%</span>
              <span>7.5%</span>
              <span>15%</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={`text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Average Customer Value (Lead / Invoice Value)
              </label>
              <span className="font-mono text-xs font-semibold text-emerald-500">
                ${customerValue.toLocaleString()} USD
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="10000"
              step="50"
              value={customerValue}
              onChange={(e) => setCustomerValue(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>$50</span>
              <span>$5,000</span>
              <span>$10,000</span>
            </div>
          </div>

          <div className={`p-4 rounded-xl flex items-start gap-3 border ${isDark ? "bg-slate-900 border-slate-800/80 text-slate-400" : "bg-slate-50 border-slate-150 text-slate-600"}`}>
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong className={isDark ? "text-slate-300" : "text-slate-700"}>Topical Cluster Multiplier:</strong> In local markets, single blogs routinely struggle because they lack semantic evidence. Deploying 4 tightly inter-linked thematic articles signals depth to indexing engines, scaling visibility across secondary search queries.
            </div>
          </div>
        </div>

        {/* Calculations Results Area */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border text-center relative overflow-hidden ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50/50 border-slate-200"}`}>
              <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Projected Organic Traffic</span>
              <span className={`text-2xl font-light font-display tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                {traffic.toLocaleString()} <span className="text-xs text-slate-400">visitors/mo</span>
              </span>
            </div>

            <div className={`p-5 rounded-2xl border text-center relative overflow-hidden ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50/50 border-slate-200"}`}>
              <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500 block mb-1">Acquired Leads / Inbound Clients</span>
              <span className={`text-2xl font-light font-display tracking-tight ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
                {leads.toLocaleString()} <span className="text-xs text-slate-400">leads/mo</span>
              </span>
            </div>

            <div className={`p-6 rounded-2xl border text-center relative overflow-hidden bg-radial from-emerald-500/10 to-transparent ${isDark ? "bg-slate-900/80 border-emerald-900/40" : "bg-emerald-50/20 border-emerald-200"}`}>
              <div className="absolute top-3 right-3 text-emerald-500 bg-emerald-500/15 rounded-full p-1.5 border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-450 block mb-1">Monthly Economic Opportunity</span>
              <div className="text-4xl font-light font-display tracking-tight text-emerald-600 dark:text-emerald-400">
                ${revenue.toLocaleString()}
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                An added +${addedBenefit.toLocaleString()}/mo over standard isolated posts
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Conventional SEO Potential:</span>
            <span className="font-mono font-bold text-slate-400">${conventionalRevenue.toLocaleString()}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-indigo-500 font-bold">Topical Cluster Advantage:</span>
            <span className="font-mono font-bold text-emerald-500">4x Gain (${addedBenefit.toLocaleString()} added)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
