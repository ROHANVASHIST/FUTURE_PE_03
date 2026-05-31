import { ClusterPlan } from "../types";

export function ClusterMap({ plan, isDark }: { plan: ClusterPlan | null; isDark?: boolean }) {
  if (!plan) return null;

  return (
    <div className={`p-8 rounded-xl border shadow-sm relative overflow-hidden transition-colors duration-200 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
      <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 pl-4 ${isDark ? "text-slate-200" : "text-slate-900"}`}>Architecture Map</h3>
      
      <div className="flex flex-col items-center gap-8 relative pb-2 w-full">
        {/* Core Node */}
        <div className={`p-6 rounded-xl max-w-md text-center w-full z-10 border shadow-sm relative ${isDark ? "bg-slate-900 border-slate-700 text-slate-100" : "bg-slate-900 border-slate-800 text-white"}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> Pillar Master Node
          </div>
          <div className="font-medium text-sm leading-relaxed">{plan.cluster.pillar.title}</div>
          <div className={`text-[10px] mt-4 rounded px-3 py-1.5 inline-block font-mono tracking-tight uppercase border ${isDark ? "bg-slate-950 text-slate-300 border-slate-800" : "bg-slate-800 text-slate-300 border-slate-700"}`}>
            {plan.cluster.pillar.target_keyword}
          </div>
          <div className={`absolute -bottom-8 left-1/2 -ml-px w-px h-8 ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
        </div>

        {/* Connective lines */}
        <div className={`w-full max-w-3xl border-t relative mt-4 ${isDark ? "border-slate-800" : "border-slate-200"}`}>
            <div className={`absolute top-0 left-1/2 -ml-px w-px h-4 ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
        </div>

        {/* Child/Supporting nodes */}
        <div className="flex flex-wrap justify-center gap-6 w-full mt-4">
          {plan.cluster.supporting.map((blog, idx) => (
            <div key={idx} className={`p-5 rounded-xl border w-full sm:w-64 flex flex-col relative group transition-all duration-200 ${isDark ? "bg-slate-900/50 border-slate-800 text-slate-200 hover:border-indigo-500/50" : "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-200"}`}>
              <div className={`absolute -top-12 left-1/2 -ml-px w-px h-12 ${isDark ? "bg-slate-800" : "bg-slate-200"}`}></div>
              <div className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold mb-3">
                {blog.blog_type} Branch
              </div>
              <div className={`text-xs font-medium flex-1 leading-relaxed ${isDark ? "text-slate-200" : "text-slate-700"}`}>{blog.title}</div>
              <div className={`mt-4 text-[10px] px-2.5 py-1.5 border rounded font-mono self-start uppercase tracking-tight shadow-sm transition-colors ${isDark ? "bg-slate-950 text-slate-400 border-slate-850 group-hover:border-indigo-900" : "bg-white text-slate-500 border-slate-200 group-hover:border-indigo-100"}`}>
                {blog.target_keyword}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
