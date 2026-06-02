import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Markdown from "react-markdown";
import { GeneratedBlog } from "../types";
import { 
  Copy, 
  Check, 
  BarChart3, 
  Settings, 
  FileCheck2, 
  Compass, 
  Heading1, 
  Link2, 
  ShieldAlert, 
  ThumbsUp,
  Info
} from "lucide-react";

interface AuditStats {
  wordCount: number;
  keywordCount: number;
  keywordDensity: number;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  hasCta: boolean;
  linksFound: { text: string; url: string }[];
}

export function BlogPreview({ blog, label, isDark }: { blog: GeneratedBlog; label: string; isDark?: boolean }) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"content" | "audit">("content");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(blog.markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  // Perform programmatic SEO Audit on the generated markdown
  const audit: AuditStats = useMemo(() => {
    const raw = blog?.markdownContent || "";
    // Clean string for word counting
    const cleanText = raw.replace(/[#*\[\]\(\)_`\n]/g, " ").trim();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Search keywords
    const keyword = (blog?.meta?.target_keyword || "").toLowerCase().trim();
    let keywordCount = 0;
    if (keyword.length > 0) {
      const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
      const matches = raw.match(regex);
      keywordCount = matches ? matches.length : 0;
    }

    const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;

    // Heading structures
    const lines = raw.split("\n");
    let h1Count = 0;
    let h2Count = 0;
    let h3Count = 0;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith("# ")) h1Count++;
      else if (trimmed.startsWith("## ")) h2Count++;
      else if (trimmed.startsWith("### ")) h3Count++;
    });

    // Check for Call to Action
    const hasCta = raw.toLowerCase().includes("cta") || 
                   raw.toLowerCase().includes("contact") || 
                   raw.toLowerCase().includes("schedule") || 
                   raw.toLowerCase().includes("book");

    // Extract links [anchor](url)
    const linksFound: { text: string; url: string }[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(raw)) !== null) {
      linksFound.push({
        text: match[1],
        url: match[2]
      });
    }

    return {
      wordCount,
      keywordCount,
      keywordDensity,
      h1Count,
      h2Count,
      h3Count,
      hasCta,
      linksFound
    };
  }, [blog]);

  if (!blog?.markdownContent) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`border rounded-2xl overflow-hidden shadow-sm mb-12 relative transition-all duration-300 ${isDark ? "bg-slate-950 border-slate-800 shadow-slate-950/25" : "bg-white border-slate-200 hover:shadow-md"}`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

      {/* Interactive header block */}
      <div className={`border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDark ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
        <div>
          <h4 className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? "text-slate-305" : "text-slate-900"}`}>
            {label}
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[280px] sm:max-w-md">
            Keyword Target: <span className="font-bold text-indigo-500">"{blog.meta.target_keyword}"</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Tab Buttons */}
          <div className={`p-1 rounded-xl flex items-center border shrink-0 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-250"}`}>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${activeTab === "content" 
                ? "bg-indigo-600 text-white shadow-sm" 
                : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900")
              }`}
            >
              Article Copy
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${activeTab === "audit" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : (isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900")
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              SEO Quality Audit
            </button>
          </div>

          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-[10px] font-bold font-mono uppercase tracking-wider cursor-pointer transition-colors shrink-0 ${isCopyStyle(isDark, copied)}`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold font-mono">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Copy</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
      
      {/* SERP Preview Simulation Container */}
      <div className={`px-8 py-6 border-b transition-colors ${isDark ? "bg-slate-950/80 border-slate-800" : "bg-white border-slate-150"}`}>
        <div className="flex items-center gap-2 mb-3">
          {/* Search Icon */}
          <div className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-slate-400">
            Google SERP Specification Previews
          </span>
        </div>
        <div className={`text-lg font-medium tracking-tight truncate cursor-pointer hover:underline font-display ${isDark ? "text-indigo-455" : "text-indigo-650"}`}>
          {blog.meta.title}
        </div>
        <div className={`text-xs mt-2 leading-relaxed max-w-3xl ${isDark ? "text-slate-350" : "text-slate-600"}`}>
          {blog.meta.meta_description}
        </div>
      </div>

      {/* Tabs View container */}
      <AnimatePresence mode="wait">
        {activeTab === "content" ? (
          <motion.div 
            key="contentView"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="px-8 py-10"
          >
            <div className={`max-w-none text-xs leading-relaxed transition-colors duration-200
              ${isDark ? "text-slate-300" : "text-slate-650"}
              ${isDark ? "[&_h1]:text-slate-100" : "[&_h1]:text-slate-800"} [&_h1]:text-3xl [&_h1]:font-light [&_h1]:mb-8 
              ${isDark ? "[&_h2]:text-slate-250" : "[&_h2]:text-slate-900"} [&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:uppercase [&_h2]:tracking-widest
              ${isDark ? "[&_h3]:text-slate-350" : "[&_h3]:text-slate-705"} [&_h3]:text-xs [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:uppercase [&_h3]:tracking-wider
              ${isDark ? "[&_p]:text-slate-300" : "[&_p]:text-slate-650"} [&_p]:text-[13px] [&_p]:leading-relaxed [&_p]:mb-6
              ${isDark ? "[&_a]:text-indigo-400 [&_a]:decoration-indigo-850" : "[&_a]:text-indigo-600 [&_a]:decoration-indigo-200"} [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-indigo-500 hover:[&_a]:decoration-indigo-500
              ${isDark ? "[&_li]:text-slate-350" : "[&_li]:text-slate-655"} [&_li]:text-[13px] [&_li]:leading-relaxed
              [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-6 [&_ul]:space-y-1.5
              ${isDark ? "[&_strong]:text-slate-100" : "[&_strong]:text-slate-900"} [&_strong]:font-bold
            `}>
              <Markdown>{blog.markdownContent.replace(/```markdown|```/g, "")}</Markdown>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="auditView"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="p-8 space-y-8"
          >
            {/* Auditing Top Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-wider mb-2">
                  <span>Draft Length</span>
                  <Compass className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div>
                  <div className={`text-2xl font-display font-light ${isDark ? "text-slate-100" : "text-slate-900"}`}>{audit.wordCount}</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase font-mono">Index Words Count</div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-wider mb-2">
                  <span>Target Density</span>
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div>
                  <div className={`text-2xl font-display font-light ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    {audit.keywordDensity.toFixed(2)}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono uppercase flex items-center gap-1">
                    {audit.keywordCount} Mentions 
                    {audit.keywordDensity >= 1.0 && audit.keywordDensity <= 3.0 ? (
                      <span className="text-emerald-500 font-bold">● PERFECT</span>
                    ) : (
                      <span className="text-amber-500 font-bold">● OVER/UNDER</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-wider mb-2">
                  <span>Cluster Links</span>
                  <Link2 className="w-3.5 h-3.5 text-violet-500" />
                </div>
                <div>
                  <div className={`text-2xl font-display font-light ${isDark ? "text-slate-100" : "text-slate-900"}`}>{audit.linksFound.length}</div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase font-mono">Outbound Anchors</div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between ${isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono uppercase tracking-wider mb-2">
                  <span>Outline Headings</span>
                  <Heading1 className="w-3.5 h-3.5 text-rose-500" />
                </div>
                <div>
                  <div className={`text-2xl font-display font-light ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                    {audit.h2Count + audit.h3Count}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase font-mono flex items-center gap-1.5">
                    <span>H1: {audit.h1Count}</span>
                    <span className="text-slate-300">|</span>
                    <span>H2: {audit.h2Count}</span>
                    <span className="text-slate-300">|</span>
                    <span>H3: {audit.h3Count}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Checklist */}
            <div className={`p-6 rounded-2xl border ${isDark ? "bg-slate-900/20 border-slate-800" : "bg-slate-50/50 border-slate-200"}`}>
              <h5 className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${isDark ? "text-slate-300" : "text-slate-800"}`}>
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                Target Structural Audit Scorecard
              </h5>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {audit.h1Count === 1 ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[9px]">!</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Single H1 Header Match</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Exactly 1 H1 containing the core target keyword triggers E-E-A-T trust. (Current: {audit.h1Count})</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {audit.h2Count >= 3 ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[9px]">!</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Heading Frequency depth</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">At least 3 H2 chapters mapping relevant secondary user questions. (Current: {audit.h2Count})</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {audit.h3Count >= 3 ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[9px]">-</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Logical Drilling Headings (H3)</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">H3 tags decompose headings to ensure clean readability structure. (Current: {audit.h3Count})</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {audit.keywordDensity >= 0.8 && audit.keywordDensity <= 2.8 ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[9px]">!</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>Optimal Density Audit</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Targets 1.0% to 2.5% density to prevent negative search stuffing flags. (Current: {audit.keywordDensity.toFixed(1)}%)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {audit.hasCta ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-[9px]">!</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-300" : "text-slate-700"}`}>EEAT Business CTA Block</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">High-EEAT copy requires a strong, contextual business-facing Call to Action.</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {audit.linksFound.length > 0 ? (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center text-white font-mono text-[9px]">-</div>
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${isDark ? "text-slate-305" : "text-slate-700"}`}>Direct Outgoing Link Check</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Checks if structured internal anchors were integrated properly inside paragraph fields.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Hyperlinks list */}
            {audit.linksFound.length > 0 && (
              <div className={`p-5 rounded-xl border ${isDark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}>
                <h6 className="text-[10px] font-bold uppercase tracking-widest text-[#6366f1] mb-3.5 flex items-center gap-1.5 font-mono">
                  <Link2 className="w-3.5 h-3.5 text-[#6366f1]" />
                  Internal Links Detected Inside Prose
                </h6>
                <div className="grid sm:grid-cols-2 gap-3">
                  {audit.linksFound.map((l, lIdx) => (
                    <div 
                      key={lIdx} 
                      className={`p-3 rounded-lg border text-xs flex items-center justify-between ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"}`}
                    >
                      <div>
                        <div className={`font-bold ${isDark ? "text-slate-200" : "text-slate-855"}`}>"{l.text}"</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{l.url}</div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse"></span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function isCopyStyle(isDark?: boolean, copied?: boolean) {
  if (copied) {
    return isDark ? "bg-emerald-950/20 border-emerald-900 text-emerald-450" : "bg-emerald-50 border-emerald-100 text-emerald-700";
  }
  return isDark ? "bg-slate-950 border-slate-850 text-slate-300 hover:bg-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50";
}
