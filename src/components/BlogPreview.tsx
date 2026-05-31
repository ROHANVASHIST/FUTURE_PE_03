import Markdown from "react-markdown";
import { GeneratedBlog } from "../types";

export function BlogPreview({ blog, label }: { blog: GeneratedBlog; label: string }) {
  if (!blog?.markdownContent) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-12 relative">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
      <div className="bg-slate-50 border-b px-6 py-4 border-slate-200 flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{label}</h4>
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded shadow-sm border border-slate-200">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          <span className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">Content Ready</span>
        </div>
      </div>
      
      {/* SERP Preview Simulation */}
      <div className="px-8 py-6 border-b border-slate-200 bg-white">
        <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            SERP Specification
        </div>
        <div className="text-lg text-indigo-600 font-medium truncate cursor-pointer hover:underline">
          {blog.meta.title}
        </div>
        <div className="text-xs text-slate-600 mt-2 leading-relaxed max-w-3xl">
          {blog.meta.meta_description}
        </div>
      </div>

      <div className="px-8 py-10">
        <div className="prose prose-slate max-w-none text-xs text-slate-600 leading-relaxed
          prose-h1:text-3xl prose-h1:font-light prose-h1:mb-8 prose-h1:text-slate-800 
          prose-h2:text-sm prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h2:text-slate-900 prose-h2:uppercase prose-h2:tracking-widest
          prose-h3:text-xs prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-slate-700 prose-h3:uppercase prose-h3:tracking-wider
          prose-p:text-xs prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-indigo-600 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-indigo-200 hover:prose-a:decoration-indigo-500
          prose-li:text-xs prose-li:text-slate-600 prose-li:leading-relaxed
          prose-ul:list-disc prose-ul:pl-4 prose-ul:mb-6
          prose-strong:text-slate-800 prose-strong:font-bold
        ">
          <Markdown>{blog.markdownContent.replace(/```markdown|```/g, "")}</Markdown>
        </div>
      </div>
    </div>
  );
}
