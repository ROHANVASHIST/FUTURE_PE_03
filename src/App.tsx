import { useState, useEffect } from "react";
import { BusinessForm } from "./components/BusinessForm";
import { ClusterMap } from "./components/ClusterMap";
import { BlogPreview } from "./components/BlogPreview";
import { BusinessInput, ClusterPlan, GeneratedBlog } from "./types";
import { DownloadCloud, LayoutDashboard, DatabaseZap, Sun, Moon, FileText } from "lucide-react";

export default function App() {
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [plan, setPlan] = useState<ClusterPlan | null>(null);
  const [pillarBlog, setPillarBlog] = useState<GeneratedBlog | null>(null);
  const [supportingBlogs, setSupportingBlogs] = useState<GeneratedBlog[]>([]);
  const [activeInput, setActiveInput] = useState<BusinessInput | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from system preference if possible
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

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

      // Generate all planned supporting blogs concurrently for a complete portfolio!
      setLoadingStep("Generating All Supporting Sub-Blogs concurrently...");
      const supportPromises = planData.cluster.supporting.map((supp: any, idx: number) => {
        return fetch("/api/seo/generate-blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input,
            blogPlan: supp,
            isPillar: false,
            linkMap: planData.internal_link_map
          }),
        }).then(async (res) => {
          if (!res.ok) {
            throw new Error(`Failed to generate supporting blog "${supp.title}": ${await res.text()}`);
          }
          return res.json();
        });
      });
      const generatedSupports = await Promise.all(supportPromises);
      setSupportingBlogs(generatedSupports);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoadingStep(null);
    }
  };

  const exportMarkdownPack = () => {
    if (!plan) return;
    let md = `# SEO Content Cluster Portfolio\n`;
    md += `Business: ${activeInput?.businessName || ""}\n`;
    md += `Vertical: ${activeInput?.businessType || ""}\n`;
    md += `Primary Keyword Goal: ${activeInput?.primaryKeyword || ""}\n\n`;
    md += `## 1. SEMANTIC KEYWORD MAP\n`;
    md += `| Keyword | Intent | Page Link |\n|---|---|---|\n`;
    if (plan.keywordMap?.primary) {
      const pk = plan.keywordMap.primary;
      md += `| ${pk.keyword} | ${pk.intent} | Pillar Page |\n`;
    }
    if (plan.keywordMap?.secondary) {
      plan.keywordMap.secondary.forEach((sk: any) => {
        md += `| ${sk.keyword} | ${sk.intent} | Supporting |\n`;
      });
    }
    if (plan.keywordMap?.long_tail) {
      plan.keywordMap.long_tail.forEach((lk: any) => {
        md += `| ${lk.keyword} | ${lk.intent} | Supporting |\n`;
      });
    }
    md += `\n## 2. PARTNERSHIP INTERNAL LINKING MATRIX\n`;
    md += `| From | To | Anchor Text |\n|---|---|---|\n`;
    plan.internal_link_map.forEach((l: any) => {
      md += `| ${l.from_blog_title} | ${l.to_blog_title} | ${l.anchor_text} |\n`;
    });

    if (pillarBlog) {
      md += `\n\n# PILLAR ARTICLE: ${pillarBlog.meta.title}\n`;
      md += `**Meta Description**: ${pillarBlog.meta.meta_description}\n`;
      md += `**Target Keyword**: ${pillarBlog.meta.target_keyword}\n\n`;
      md += `${pillarBlog.markdownContent}\n`;
    }

    supportingBlogs.forEach((blog, idx) => {
      md += `\n\n# SUPPORTING ARTICLE ${idx + 1}: ${blog.meta.title}\n`;
      md += `**Meta Description**: ${blog.meta.meta_description}\n`;
      md += `**Target Keyword**: ${blog.meta.target_keyword}\n\n`;
      md += `${blog.markdownContent}\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${activeInput?.businessName.replace(/\s+/g, "_")}_SEO_Content_Pack.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDFPack = () => {
    if (!plan) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to export the PDF.");
      return;
    }

    let htmlContent = `
      <html>
        <head>
          <title>${activeInput?.businessName || "Business"} - SEO Cluster Portfolio</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              line-height: 1.6;
              margin: 40px;
            }
            h1, h2, h3 {
              color: #0f172a;
            }
            h1 {
              font-size: 26px;
              font-weight: 300;
              border-bottom: 2px solid #6366f1;
              padding-bottom: 12px;
              margin-top: 40px;
              page-break-before: always;
            }
            h1:first-of-type {
              page-break-before: avoid;
            }
            h2 {
              font-size: 18px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 30px;
            }
            h3 {
              font-size: 14px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #475569;
            }
            p {
              font-size: 13px;
            }
            .meta-box {
              background-color: #f8fafc;
              border-left: 4px solid #6366f1;
              padding: 16px;
              margin-bottom: 24px;
              font-size: 12px;
            }
            .meta-title {
              font-weight: bold;
              color: #4f46e5;
            }
            @media print {
              body { margin: 20mm; }
              h1 { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 60px;">
            <h1 style="border: none; page-break-before: avoid; font-size: 32px; margin-bottom: 10px;">SEO Content Cluster Portfolio</h1>
            <p style="font-size: 14px; color: #64748b;">Orchestrated by Gemini AI Engine</p>
            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #475569; text-align: left; max-width: 400px; margin-left: auto; margin-right: auto;">
              <strong>Client Business:</strong> ${activeInput?.businessName}<br/>
              <strong>Vertical Category:</strong> ${activeInput?.businessType}<br/>
              <strong>Location Hub:</strong> ${activeInput?.area}, ${activeInput?.city}<br/>
              <strong>Target Theme Keyword:</strong> ${activeInput?.primaryKeyword}
            </div>
          </div>
    `;

    if (pillarBlog) {
      htmlContent += `
        <h1>01. PILLAR MASTER ARTICLE</h1>
        <div class="meta-box">
          <div><span class="meta-title">SERP Meta Title:</span> ${pillarBlog.meta.title}</div>
          <div style="margin-top: 8px;"><span class="meta-title">Meta Description:</span> ${pillarBlog.meta.meta_description}</div>
        </div>
        <div>${pillarBlog.markdownContent
          .replace(/# (.*)/g, '<h1 style="page-break-before: avoid;">$1</h1>')
          .replace(/## (.*)/g, '<h2>$1</h2>')
          .replace(/### (.*)/g, '<h3>$1</h3>')
          .replace(/\n\n/g, '<p></p>')
          .replace(/\n- (.*)/g, '<li>$1</li>')
        }</div>
      `;
    }

    supportingBlogs.forEach((blog, idx) => {
      htmlContent += `
        <h1>0${idx + 2}. SUPPORTING SUB-ARTICLE</h1>
        <div class="meta-box">
          <div><span class="meta-title">SERP Meta Title:</span> ${blog.meta.title}</div>
          <div style="margin-top: 8px;"><span class="meta-title">Meta Description:</span> ${blog.meta.meta_description}</div>
        </div>
        <div>${blog.markdownContent
          .replace(/# (.*)/g, '<h1 style="page-break-before: avoid;">$1</h1>')
          .replace(/## (.*)/g, '<h2>$1</h2>')
          .replace(/### (.*)/g, '<h3>$1</h3>')
          .replace(/\n\n/g, '<p></p>')
          .replace(/\n- (.*)/g, '<li>$1</li>')
        }</div>
      `;
    });

    htmlContent += `
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${isDarkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Header */}
      <header className={`h-14 border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-10 w-full transition-colors duration-250 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm shadow-sm ${isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"}`}>
              <DatabaseZap className="w-4 h-4 text-white" />
            </div>
            <div className={`h-6 w-px ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}></div>
            <h1 className={`text-xs font-bold tracking-[0.2em] uppercase ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              Enterprise <span className="text-slate-400 mx-2">/</span> <span className="underline underline-offset-4 decoration-indigo-500">SEO Generator</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
             {/* Dark mode switch */}
             <button
               onClick={toggleTheme}
               className={`p-2 rounded-lg border transition shadow-sm ${isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
               title="Toggle Contrast Mode"
             >
               {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>

             <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-1.5 rounded border border-emerald-100 dark:border-emerald-800/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">Active Gemini</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-transparent overflow-y-auto relative py-12">
        <div className="mx-auto w-full max-w-7xl">
          {!plan && !loadingStep && (
             <div className="grid lg:grid-cols-2 gap-12 items-center mb-12 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="order-2 lg:order-1">
                  <div className="mb-10 border-l-4 border-indigo-500 pl-6">
                    <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase">System Initialization</span>
                    <h2 className="text-4xl sm:text-5xl font-light mt-2 tracking-tight mb-4">Topical<br className="hidden sm:block" /> Authority Engine</h2>
                    <p className={`mt-4 text-xs sm:text-sm max-w-md leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                      Deploy a fully mapped, internally-linked SEO content cluster. Enter your business details below to orchestrate your AI content strategy.
                    </p>
                  </div>
                  <BusinessForm onSubmit={startGeneration} isLoading={!!loadingStep} isDark={isDarkMode} />
                </div>
                <div className="order-1 lg:order-2 hidden md:block">
                  <div className={`rounded-2xl overflow-hidden border shadow-2xl relative aspect-[4/5] lg:aspect-square group ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10"></div>
                    <img 
                      src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200" 
                      alt="Modern office architecture" 
                      className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-8 left-8 right-8 z-20">
                      <div className={`backdrop-blur-sm p-6 rounded-xl border shadow-xl flex items-center gap-4 transition-transform duration-500 group-hover:-translate-y-2 ${isDarkMode ? "bg-slate-950/90 border-slate-700/55" : "bg-white/95 border-white/20"}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-indigo-50"}`}>
                           <LayoutDashboard className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div>
                           <p className="text-xs font-bold uppercase tracking-widest">Semantic Clusters</p>
                           <p className={`text-[10px] mt-1 uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Automated Internal Linking Matrix</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          )}

          {loadingStep && (
            <div className={`max-w-2xl mx-auto mt-16 flex flex-col items-center justify-center border border-dashed rounded-xl p-8 text-center shadow-sm relative overflow-hidden ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100"><div className="h-1 bg-indigo-500 animate-pulse"></div></div>
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center mb-6 shadow-sm animate-pulse ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
                <DatabaseZap className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-3">Analysis Active</p>
              <div className={`text-xs font-bold px-6 py-3 rounded shadow-sm ${isDarkMode ? "bg-slate-900 text-indigo-400 border border-indigo-950" : "bg-white text-indigo-600 border border-indigo-100"}`}>
                {loadingStep}
              </div>
              <p className="text-[10px] text-slate-400 mt-6 max-w-sm uppercase tracking-wider leading-relaxed">
                Assembling topical map and generating structural hierarchy...
              </p>
            </div>
          )}

          {plan && !loadingStep && (
            <div className="max-w-4xl mx-auto mt-12 mb-24 px-4 sm:px-6">
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b pb-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded ${isDarkMode ? "bg-slate-800 text-indigo-400" : "bg-indigo-50 text-indigo-600"}`}>
                     <LayoutDashboard className="w-5 h-5" />
                   </div>
                   <h2 className="text-xs font-bold uppercase tracking-widest">
                     Generated Campaign
                   </h2>
                 </div>
                 <div className="flex flex-wrap gap-2">
                   <button 
                     onClick={exportMarkdownPack}
                     className={`flex text-[10px] px-4 py-2 rounded font-bold uppercase tracking-widest transition-colors shadow-sm items-center gap-2 border cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                   >
                     <DownloadCloud className="w-3.5 h-3.5" /> Export Content Pack (.md)
                   </button>
                   <button 
                     onClick={exportPDFPack}
                     className="flex text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-bold uppercase tracking-widest transition-colors shadow-sm items-center gap-2 cursor-pointer"
                   >
                     <FileText className="w-3.5 h-3.5" /> Export PDF (Print)
                   </button>
                 </div>
              </div>
              
              <ClusterMap plan={plan} isDark={isDarkMode} />
              
              <div className="space-y-12 mt-12">
                {pillarBlog && (
                   <div id="pillar">
                     <BlogPreview blog={pillarBlog} label="01 Pillar Page Specification" isDark={isDarkMode} />
                   </div>
                )}

                {supportingBlogs.map((blog, idx) => (
                   <div id={`support-${idx}`} key={idx}>
                     <BlogPreview blog={blog} label={`0${idx + 2} Supporting Internal Blog`} isDark={isDarkMode} />
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
