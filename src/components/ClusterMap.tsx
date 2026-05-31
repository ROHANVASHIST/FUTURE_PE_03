import { ClusterPlan } from "../types";

export function ClusterMap({ plan }: { plan: ClusterPlan | null }) {
  if (!plan) return null;

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-8 pl-4">Architecture Map</h3>
      
      <div className="flex flex-col items-center gap-8 relative pb-2 w-full">
        <div className="bg-slate-900 text-white p-6 rounded-xl max-w-md text-center w-full z-10 border border-slate-800 shadow-sm relative">
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Pillar Master Node
          </div>
          <div className="font-medium text-sm leading-relaxed">{plan.cluster.pillar.title}</div>
          <div className="text-[10px] mt-4 bg-slate-800 text-slate-300 rounded px-3 py-1.5 inline-block font-mono tracking-tight uppercase border border-slate-700">
            {plan.cluster.pillar.target_keyword}
          </div>
          <div className="absolute -bottom-8 left-1/2 -ml-px w-px h-8 bg-slate-200"></div>
        </div>

        <div className="w-full max-w-3xl border-t border-slate-200 relative mt-4">
            <div className="absolute top-0 left-1/2 -ml-px w-px h-4 bg-slate-200"></div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full mt-4">
          {plan.cluster.supporting.map((blog, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200 w-full sm:w-64 flex flex-col relative group hover:border-indigo-200 transition-colors">
              <div className="absolute -top-12 left-1/2 -ml-px w-px h-12 bg-slate-200"></div>
              <div className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold mb-3">
                {blog.blog_type} Branch
              </div>
              <div className="text-xs text-slate-700 font-medium flex-1 leading-relaxed">{blog.title}</div>
              <div className="mt-4 text-[10px] text-slate-500 px-2.5 py-1.5 bg-white border border-slate-200 rounded font-mono self-start uppercase tracking-tight shadow-sm group-hover:border-indigo-100 transition-colors">
                {blog.target_keyword}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
