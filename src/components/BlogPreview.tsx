import Markdown from "react-markdown";
import { GeneratedBlog } from "../types";

export function BlogPreview({ blog, label, isDark }: { blog: GeneratedBlog; label: string; isDark?: boolean }) {
  if (!blog?.markdownContent) return null;

  return (
    <div className={`border rounded-xl overflow-hidden shadow-sm mb-12 relative transition-colors duration-200 ${isDark ? "bg-slate-950 border-slate-800 shadow-slate-950/20" : "bg-white border-slate-200"}`}>
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
      <div className={`border-b px-6 py-4 flex items-center justify-between ${isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
        <h4 className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-200" : "text-slate-900"}`}>{label}</h4>
        <div className={`flex items-center gap-2 px-2 py-1 rounded shadow-sm border ${isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-500"}`}>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-bold tracking-wider uppercase">Content Ready</span>
        </div>
      </div>
      
      {/* SERP Preview Simulation */}
      <div className={`px-8 py-6 border-b ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className={`text-[10px] uppercase tracking-widest font-bold mb-3 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-400"}`}>
            <svg className="w-3 h-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            SERP Specification
        </div>
        <div className={`text-lg font-medium truncate cursor-pointer hover:underline ${isDark ? "text-indigo-400" : "text-indigo-600"}`}>
          {blog.meta.title}
        </div>
        <div className={`text-xs mt-2 leading-relaxed max-w-3xl ${isDark ? "text-slate-300" : "text-slate-600"}`}>
          {blog.meta.meta_description}
        </div>
      </div>

      {/* Styled Markdown content body */}
      <div className="px-8 py-10">
        <div className={`max-w-none text-xs leading-relaxed transition-colors duration-200
          ${isDark ? "text-slate-300" : "text-slate-600"}
          ${isDark ? "[&_h1]:text-slate-100" : "[&_h1]:text-slate-800"} [&_h1]:text-3xl [&_h1]:font-light [&_h1]:mb-8 
          ${isDark ? "[&_h2]:text-slate-200" : "[&_h2]:text-slate-900"} [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:uppercase [&_h2]:tracking-widest
          ${isDark ? "[&_h3]:text-slate-350" : "[&_h3]:text-slate-700"} [&_h3]:text-xs [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:uppercase [&_h3]:tracking-wider
          ${isDark ? "[&_p]:text-slate-300" : "[&_p]:text-slate-600"} [&_p]:text-xs [&_p]:leading-relaxed [&_p]:mb-6
          ${isDark ? "[&_a]:text-indigo-400 [&_a]:decoration-indigo-850" : "[&_a]:text-indigo-600 [&_a]:decoration-indigo-200"} [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:decoration-indigo-500
          ${isDark ? "[&_li]:text-slate-350" : "[&_li]:text-slate-600"} [&_li]:text-xs [&_li]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-6
          ${isDark ? "[&_strong]:text-slate-100" : "[&_strong]:text-slate-800"} [&_strong]:font-bold
        `}>
          <Markdown>{blog.markdownContent.replace(/```markdown|```/g, "")}</Markdown>
        </div>
      </div>
    </div>
  );
}
