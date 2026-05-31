import { useState } from "react";
import { BusinessForm } from "./components/BusinessForm";
import { ClusterMap } from "./components/ClusterMap";
import { BlogPreview } from "./components/BlogPreview";
import { BusinessInput, ClusterPlan, GeneratedBlog } from "./types";
import { DownloadCloud, LayoutDashboard, DatabaseZap } from "lucide-react";

export default function App() {
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [plan, setPlan] = useState<ClusterPlan | null>(null);
  const [pillarBlog, setPillarBlog] = useState<GeneratedBlog | null>(null);
  const [supportingBlogs, setSupportingBlogs] = useState<GeneratedBlog[]>([]);
  const [activeInput, setActiveInput] = useState<BusinessInput | null>(null);

  const startGeneration = async (input: BusinessInput) => {
    try {
      setActiveInput(input);
      setLoadingStep("Structuring SEO Map & Cluster Concept...");
      
      const planRes = await fetch("/api/seo/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!planRes.ok) throw new Error(await planRes.text());
      const planData: ClusterPlan = await planRes.json();
      setPlan(planData);

      setLoadingStep("Generating Long-Form Pillar Content...");
      const pillarRes = await fetch("/api/seo/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          blogPlan: planData.cluster.pillar,
          isPillar: true,
          linkMap: planData.internal_link_map
        }),
      });
      if (!pillarRes.ok) throw new Error(await pillarRes.text());
      setPillarBlog(await pillarRes.json());

      // Generate 1 supporting blog for demo to avoid waiting too long
      // Expanding all would take sequential time, so we just do the first
      const generatedSupports = [];
      const firstSupporting = planData.cluster.supporting[0];
      if (firstSupporting) {
         setLoadingStep(`Generating Support Blog: ${firstSupporting.title.substring(0,25)}...`);
         const suppRes = await fetch("/api/seo/generate-blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              input,
              blogPlan: firstSupporting,
              isPillar: false,
              linkMap: planData.internal_link_map
            }),
         });
         if (suppRes.ok) generatedSupports.push(await suppRes.json());
      }
      setSupportingBlogs(generatedSupports);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoadingStep(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden text-slate-900 bg-slate-50">
      {/* Header */}
      <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10 w-full">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-mono text-sm">
              <DatabaseZap className="w-4 h-4" />
            </div>
            <div className="h-6 w-px bg-slate-200"></div>
            <h1 className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500">
              Enterprise <span className="text-slate-300 mx-2">/</span> <span className="text-slate-900 underline underline-offset-4 decoration-indigo-500">SEO Generator</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 hidden sm:flex">
             <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-100">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase">Gemini 1.5</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white overflow-y-auto relative py-12">
        <div className="max-w-4xl mx-auto px-6 w-full">
          {!plan && (
            <div className="mb-10 border-l-4 border-indigo-500 pl-6">
              <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase">System Initialization</span>
              <h2 className="text-4xl font-light text-slate-800 mt-2">Topical Authority Engine</h2>
              <p className="text-slate-400 mt-4 text-xs font-medium uppercase tracking-tight">
                Generate a fully mapped, internally-linked SEO content cluster.
              </p>
            </div>
          )}

          <BusinessForm onSubmit={startGeneration} isLoading={!!loadingStep} />

          {loadingStep && (
            <div className="mt-16 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
              <div className="w-8 h-8 bg-white rounded-full border border-slate-200 flex items-center justify-center mb-4 shadow-sm animate-pulse">
                <DatabaseZap className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">Analysis Active</p>
              <div className="text-xs font-bold text-indigo-600 bg-white border border-indigo-100 px-4 py-2 rounded shadow-sm">
                {loadingStep}
              </div>
            </div>
          )}

          {plan && !loadingStep && (
            <div className="mt-16">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
                 <div className="flex items-center gap-3">
                   <div className="bg-indigo-50 p-2 rounded text-indigo-600">
                     <LayoutDashboard className="w-5 h-5" />
                   </div>
                   <h2 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                     Generated Campaign
                   </h2>
                 </div>
                 <button className="flex text-[10px] bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded font-bold uppercase tracking-widest transition-colors shadow-sm items-center gap-2">
                    <DownloadCloud className="w-3.5 h-3.5" /> Export All (ZIP)
                 </button>
              </div>
              
              <ClusterMap plan={plan} />
              
              <div className="space-y-12 mt-12">
                {pillarBlog && (
                   <div id="pillar">
                     <BlogPreview blog={pillarBlog} label="01 Pillar Page Specification" />
                   </div>
                )}

                {supportingBlogs.map((blog, idx) => (
                   <div id={`support-${idx}`} key={idx}>
                     <BlogPreview blog={blog} label={`0${idx + 2} Supporting Internal Blog`} />
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
