import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BusinessForm } from "./components/BusinessForm";
import { ClusterMap } from "./components/ClusterMap";
import { BlogPreview } from "./components/BlogPreview";
import { ROICalculator } from "./components/ROICalculator";
import { PricingTiers } from "./components/PricingTiers";
import { Testimonials } from "./components/Testimonials";
import { FAQAccordion } from "./components/FAQAccordion";
import { PolishedFooter } from "./components/PolishedFooter";
import { NewsletterBriefing } from "./components/NewsletterBriefing";
import { PerformanceMetrics } from "./components/PerformanceMetrics";
import { ProfilePortfolio, SavedCampaign } from "./components/ProfilePortfolio";
import { BusinessInput, ClusterPlan, GeneratedBlog } from "./types";
import { 
  DownloadCloud, 
  LayoutDashboard, 
  DatabaseZap, 
  Sun, 
  Moon, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Network,
  TrendingUp,
  Target,
  Award,
  Inbox,
  ChevronRight,
  X,
  ShieldCheck,
  MailCheck,
  Mail,
  ArrowUpRight,
  Menu,
  User
} from "lucide-react";

export default function App() {
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<number>(0); // 0: Idle, 1: Plan, 2: Pillar, 3: Supporting
  const [plan, setPlan] = useState<ClusterPlan | null>(null);
  const [pillarBlog, setPillarBlog] = useState<GeneratedBlog | null>(null);
  const [supportingBlogs, setSupportingBlogs] = useState<GeneratedBlog[]>([]);
  const [activeInput, setActiveInput] = useState<BusinessInput | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"workspace" | "profile">("workspace");
  const [simulatedEmails, setSimulatedEmails] = useState<any[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState<boolean>(false);
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);

  // Advanced Visual Navigation, Mobile Menu, and Active Toast States
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null);
  const [activeNavId, setActiveNavId] = useState<string>("architect-section");
  const [newEmailToast, setNewEmailToast] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Initialize theme and local cache loading
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDarkMode(true);
    }
    const storedMails = localStorage.getItem("simulated_emails");
    if (storedMails) {
      try {
        const parsed = JSON.parse(storedMails);
        setSimulatedEmails(parsed);
        if (parsed.length > 0) {
          setSelectedMailId(parsed[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Handle custom listener for local email intercept logic
  useEffect(() => {
    const handleEmail = (e: Event) => {
      const newMail = (e as CustomEvent).detail;
      setSimulatedEmails(prev => {
        const updated = [newMail, ...prev];
        localStorage.setItem("simulated_emails", JSON.stringify(updated));
        return updated;
      });
      setSelectedMailId(newMail.id);
      setNewEmailToast(newMail);
    };
    window.addEventListener("SIMULATED_EMAIL_RECEIVED", handleEmail);
    return () => window.removeEventListener("SIMULATED_EMAIL_RECEIVED", handleEmail);
  }, []);

  // Monitor Scroll Position to Dynamically Highlight Menu Tabs
  useEffect(() => {
    const handleScroll = () => {
      const sections = plan 
        ? ["architect-section", "cluster-map-section", "pillar-section", "supporting-section", "performance-metrics-section", "roi-calculator-section", "pricing-tiers-section"]
        : ["architect-section", "performance-metrics-section", "roi-calculator-section", "testimonials-section", "pricing-tiers-section", "newsletter-section", "faq-accordion-section"];
        
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Element is active if it borders the top line including safe responsive offset
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveNavId(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, true);
    handleScroll(); // Trigger initial sync
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [plan]);


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
      setPlan(null);
      setPillarBlog(null);
      setSupportingBlogs([]);
      
      setLoadingStep("Structuring SEO Map & Cluster Concept...");
      setLoadingPhase(1);
      
      const planRes = await fetch("/api/seo/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!planRes.ok) throw new Error(await planRes.text());
      const planData: ClusterPlan = await planRes.json();
      setPlan(planData);

      setLoadingStep("Generating Long-Form Pillar Content...");
      setLoadingPhase(2);
      
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
      const pillarData = await pillarRes.json();
      setPillarBlog(pillarData);

      // Generate supporting blogs concurrently
      setLoadingStep("Drafting & Linking Supporting Sub-Blogs...");
      setLoadingPhase(3);
      
      const supportPromises = planData.cluster.supporting.map((supp: any) => {
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
            throw new Error(`Failed supporting blog "${supp.title}": ${await res.text()}`);
          }
          return res.json();
        });
      });
      const generatedSupports = await Promise.all(supportPromises);
      setSupportingBlogs(generatedSupports);
      setLoadingPhase(4);

      // Auto persist campaign execution inside profile's local storage library
      try {
        const stored = localStorage.getItem("seo_saved_campaigns");
        const existingList = stored ? JSON.parse(stored) : [];
        const newCampaign: SavedCampaign = {
          id: "camp_" + Date.now(),
          name: `${input.businessName} - Hub Strategy`,
          timestamp: new Date().toISOString(),
          input,
          plan: planData,
          pillarBlog: pillarData,
          supportingBlogs: generatedSupports
        };
        const updated = [newCampaign, ...existingList];
        localStorage.setItem("seo_saved_campaigns", JSON.stringify(updated));

        // Smoothly scroll down to the estimations simulator after generation
        setTimeout(() => {
          const simulatorEl = document.getElementById("performance-metrics-section");
          if (simulatorEl) {
            simulatorEl.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 900);
      } catch (err) {
        console.error("Auto persist failed", err);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoadingStep(null);
      setLoadingPhase(0);
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

  const navItems = plan 
    ? [
        { id: "architect-section", label: "Workspace" },
        { id: "cluster-map-section", label: "Semantic Network" },
        { id: "pillar-section", label: "Pillar Core" },
        { id: "supporting-section", label: "Branch Nodes" },
        { id: "performance-metrics-section", label: "Velocity Model" },
        { id: "roi-calculator-section", label: "ROI Calculator" },
        { id: "pricing-tiers-section", label: "SaaS Packages" }
      ]
    : [
        { id: "architect-section", label: "Architect Core" },
        { id: "performance-metrics-section", label: "Velocity Model" },
        { id: "roi-calculator-section", label: "ROI Estimator" },
        { id: "testimonials-section", label: "Client Success" },
        { id: "pricing-tiers-section", label: "SaaS Packages" },
        { id: "newsletter-section", label: "Intel Feed" },
        { id: "faq-accordion-section", label: "Strategic FAQ" }
      ];

  const scrollToSection = (id: string) => {
    if (id === "architect-section") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      const mainEl = document.querySelector("main");
      if (mainEl) mainEl.scrollTo({ top: 0, behavior: "smooth" });
      setIsMobileMenuOpen(false);
      setActiveNavId("architect-section");
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
    setActiveNavId(id);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "dark bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Header */}
      <header className={`h-16 border-b flex items-center justify-between px-6 shrink-0 shadow-sm z-40 sticky top-0 w-full transition-all duration-300 ${isDarkMode ? "bg-slate-950/90 border-slate-800/80 backdrop-blur-md" : "bg-white/90 border-slate-200/80 backdrop-blur-md"}`}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 15 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-sm shadow-md cursor-pointer relative overflow-hidden group ${isDarkMode ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-white/10 to-white/0 group-hover:via-white/20 transition-all duration-500"></div>
              <DatabaseZap className="w-5 h-5 text-white" />
            </motion.div>
            <div className={`h-6 w-px ${isDarkMode ? "bg-slate-800" : "bg-slate-200"}`}></div>
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={`text-xs font-bold font-display tracking-[0.25em] uppercase cursor-pointer hidden md:block ${isDarkMode ? "text-slate-350" : "text-slate-600"}`}
            >
              Enterprise <span className="text-indigo-500 mx-1.5">/</span> <span className="underline underline-offset-4 decoration-indigo-500">SEO Cluster Suite</span>
            </motion.h1>
          </div>

          {/* Navigation link items with dynamic sliding background pills */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/30">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              const isHovered = hoveredNavId === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  onMouseEnter={() => setHoveredNavId(item.id)}
                  onMouseLeave={() => setHoveredNavId(null)}
                  className={`relative px-3.5 py-1.5 text-[10.5px] font-mono tracking-wider uppercase font-bold transition-colors duration-200 bg-transparent border-0 cursor-pointer rounded-lg ${
                    isActive 
                      ? "text-indigo-600 dark:text-indigo-400 font-extrabold" 
                      : isDarkMode ? "text-slate-400 hover:text-slate-200" : "text-slate-550 hover:text-slate-900"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  
                  {/* Sliding hover pill indicator */}
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverPill"
                      className="absolute inset-0 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/15 dark:border-indigo-500/25"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  
                  {/* Active navigation scroll highlight pin */}
                  {isActive && (
                    <motion.div
                      layoutId="activeScrollPin"
                      className="absolute bottom-[-1px] left-3 right-3 h-[2px] bg-indigo-500 dark:bg-indigo-450 rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-3">
             {/* Dynamic Workspace / Profile Selector Tabs */}
             <div className={`p-1 rounded-xl border flex items-center ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-100/80 border-slate-200"}`}>
               <button
                 onClick={() => {
                   setActiveTab("workspace");
                   setIsMobileMenuOpen(false);
                 }}
                 className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase transition flex items-center gap-1.5 border-0 cursor-pointer ${
                   activeTab === "workspace"
                     ? "bg-indigo-600 text-white shadow-sm"
                     : isDarkMode ? "text-slate-400 hover:text-slate-200 bg-transparent" : "text-slate-600 hover:text-slate-950 bg-transparent"
                 }`}
               >
                 <LayoutDashboard className="w-3.5 h-3.5 animate-pulse" />
                 <span className="hidden sm:inline">Workspace</span>
               </button>
               <button
                 onClick={() => {
                   setActiveTab("profile");
                   setIsMobileMenuOpen(false);
                 }}
                 className={`px-3 py-1.5 rounded-lg font-mono text-[9.5px] font-bold uppercase transition flex items-center gap-1.5 border-0 cursor-pointer ${
                   activeTab === "profile"
                     ? "bg-indigo-600 text-white shadow-sm"
                     : isDarkMode ? "text-slate-400 hover:text-slate-200 bg-transparent" : "text-slate-600 hover:text-slate-950 bg-transparent"
                 }`}
               >
                 <User className="w-3.5 h-3.5" />
                 <span>Profile</span>
               </button>
             </div>

             {/* SMTP Real Server Sandbox Log Button */}
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onClick={() => setIsInboxOpen(true)}
               className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer ${
                 simulatedEmails.length > 0
                   ? "bg-indigo-500/10 border-indigo-500/35 text-indigo-505 dark:bg-indigo-505/10 dark:border-indigo-500/40 dark:text-indigo-400"
                   : "bg-slate-50 dark:bg-slate-850 dark:border-slate-800 border-slate-200 text-slate-500"
               }`}
               title="Open secure SMTP outbound email sandbox interceptor terminal"
             >
               <Inbox className="w-3.5 h-3.5" />
               <span>SMTP View</span>
               {simulatedEmails.length > 0 ? (
                 <span className="min-w-4 h-4 px-1 rounded bg-indigo-600 text-[9px] font-bold text-white flex items-center justify-center font-mono animate-pulse">
                   {simulatedEmails.length}
                 </span>
               ) : (
                 <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
               )}
             </motion.button>

             {/* Dark mode switch */}
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={toggleTheme}
               className={`p-2 rounded-lg border transition shadow-sm cursor-pointer ${isDarkMode ? "bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
               title="Toggle Contrast Mode"
             >
               {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
             </motion.button>

             <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/25 px-2.5 py-1.5 rounded-lg border border-emerald-150 dark:border-emerald-800/30 font-mono shrink-0">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-450 tracking-wider uppercase">Active Gemini</span>
             </div>

             {/* Mobile Hamburger toggle */}
             <div className="flex lg:hidden items-center">
               <motion.button
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 className={`p-2 rounded-lg border transition shadow-sm cursor-pointer ${
                   isDarkMode 
                     ? "bg-slate-900 border-slate-800 text-slate-400" 
                     : "bg-slate-50 border-slate-200 text-slate-600"
                 }`}
               >
                 {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
               </motion.button>
             </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`lg:hidden border-b overflow-hidden px-6 pb-6 shadow-md transition-colors duration-300 z-30 relative ${isDarkMode ? "bg-slate-950/98 border-slate-850" : "bg-white border-slate-200"}`}
          >
            <div className="flex flex-col gap-2 pt-3">
              {navItems.map((item) => {
                const isActive = activeNavId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left py-2.5 px-4 rounded-xl font-mono text-[10px] font-bold tracking-wider uppercase border-0 transition-all ${
                      isActive 
                        ? "bg-indigo-650/15 text-indigo-500 border-l-[3px] border-indigo-550 pl-3.5" 
                        : isDarkMode ? "bg-slate-900/50 text-slate-400 hover:text-white" : "bg-slate-50 text-slate-650 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <main className="flex-1 bg-transparent relative py-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <AnimatePresence mode="wait">
            {activeTab === "profile" ? (
              <motion.div
                key="profile-viewport"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-12"
              >
                <ProfilePortfolio 
                  isDark={isDarkMode} 
                  onLoadCampaign={(camp) => {
                    setActiveInput(camp.input);
                    setPlan(camp.plan);
                    setPillarBlog(camp.pillarBlog);
                    setSupportingBlogs(camp.supportingBlogs);
                    setActiveTab("workspace");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  currentCampaign={{
                    input: activeInput,
                    plan: plan,
                    pillarBlog: pillarBlog,
                    supportingBlogs: supportingBlogs
                  }}
                />
              </motion.div>
            ) : (
              <motion.div key="workspace-viewport" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnimatePresence mode="wait">
                  {!plan && !loadingStep && (
               <motion.div 
                 id="architect-section"
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -15 }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
                 className="scroll-mt-20 space-y-16 max-w-6xl mx-auto"
               >
                 {/* Hero & Configuration Form */}
                 <div className="grid lg:grid-cols-2 gap-12 items-center">
                   <div className="order-2 lg:order-1">
                     <motion.div 
                       initial={{ opacity: 0, x: -20 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: 0.1, duration: 0.5 }}
                       className="mb-8 border-l-4 border-indigo-600 pl-6"
                     >
                       <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">Topical Authority Constructor</span>
                       <h2 className="text-4xl sm:text-5xl font-display font-light mt-2 tracking-tight mb-4 leading-tight">
                         Orchestrate<br className="hidden sm:block" /> Topic Hierarchies
                       </h2>
                       <p className={`mt-4 text-xs sm:text-sm max-w-md leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                         Instantly deploy a fully cross-linked semantic SEO map. Define your industrial focal hub below, or tap a profile preset to see high-ranking semantic clusters draft contextually.
                       </p>
                     </motion.div>
                     
                     <motion.div
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 0.2 }}
                     >
                       <BusinessForm onSubmit={startGeneration} isLoading={!!loadingStep} isDark={isDarkMode} />
                     </motion.div>
                   </div>
                   
                   <div className="order-1 lg:order-2 hidden lg:block">
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: 0.15, duration: 0.6 }}
                       className={`rounded-2xl overflow-hidden border shadow-2xl relative aspect-square group ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}
                     >
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10"></div>
                       <img 
                         src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
                         alt="Cyber network node background" 
                         className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-102"
                         referrerPolicy="no-referrer"
                       />
                       
                       {/* Floating ambient badge 1 */}
                       <div className="absolute top-6 left-6 z-20">
                         <div className="backdrop-blur-md bg-white/10 dark:bg-black/30 text-white rounded-full px-4 py-1.5 border border-white/25 text-[10px] font-mono tracking-widest uppercase shadow-lg">
                            ✦ SEMANTIC MAPPING ENGINE
                         </div>
                       </div>

                       <div className="absolute bottom-8 left-8 right-8 z-20">
                         <motion.div 
                           initial={{ y: 20 }}
                           animate={{ y: 0 }}
                           transition={{ delay: 0.3, type: "spring" }}
                           className={`backdrop-blur-md p-6 rounded-xl border shadow-xl flex items-center gap-4 transition-all duration-500 group-hover:-translate-y-1.5 ${isDarkMode ? "bg-slate-950/90 border-slate-700/50 text-slate-100" : "bg-white/95 border-slate-200/60 text-slate-800"}`}
                         >
                           <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isDarkMode ? "dark bg-indigo-950 text-indigo-300" : "bg-indigo-50 text-indigo-650"}`}>
                              <Network className="w-5 h-5" />
                           </div>
                           <div>
                              <p className="text-xs font-bold uppercase tracking-widest font-display">Semantically Coupled Nodes</p>
                              <p className={`text-[10px] mt-1 uppercase tracking-wider font-mono ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Bidirectional Context Backlinking</p>
                           </div>
                         </motion.div>
                       </div>
                     </motion.div>
                   </div>
                 </div>

                 {/* Advanced Strategic Features Grid */}
                 <div className="pt-12 border-t border-slate-150 dark:border-slate-850">
                    <div className="text-center max-w-xl mx-auto mb-12">
                       <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">Campaign Architecture</span>
                       <h3 className={`text-2xl font-light font-display mt-2 tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}>
                          Topical Authority Pillars
                       </h3>
                       <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          Our platform programmatically splits standard search concepts into high-ranking content nodes complete with contextual internal backlinking.
                       </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                       {/* Column 1 */}
                       <motion.div 
                         whileHover={{ y: -6 }}
                         className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col group transition-all duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                       >
                          <div className="h-44 overflow-hidden relative">
                             <img 
                               src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800" 
                               alt="Campaign Blueprint Strategy" 
                               className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                               referrerPolicy="no-referrer"
                             />
                             <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-slate-900/60 rounded-full p-2 border border-white/10 text-white">
                                <Network className="w-4 h-4 text-white" />
                             </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                             <div>
                                <h4 className={`text-xs ml-0.5 uppercase tracking-wider font-bold mb-2 font-display ${isDarkMode ? "text-slate-205" : "text-slate-800"}`}>
                                   Topical Cluster Blueprints
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                   Generates a high-authority "Pillar Blog" serving as the strategic core, surrounded by exactly three modular "Supporting Blogs" addressing related long-tail user search queries.
                                </p>
                             </div>
                             <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-indigo-500 font-bold">
                                <span>Learn Pillar Method</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                             </div>
                          </div>
                       </motion.div>

                       {/* Column 2 */}
                       <motion.div 
                         whileHover={{ y: -6 }}
                         className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col group transition-all duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                       >
                          <div className="h-44 overflow-hidden relative">
                             <img 
                               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" 
                               alt="Data Semantic Analysis" 
                               className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                               referrerPolicy="no-referrer"
                             />
                             <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-slate-900/60 rounded-full p-2 border border-white/10 text-white">
                                <Target className="w-4 h-4 text-white" />
                             </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                             <div>
                                <h4 className={`text-xs ml-0.5 uppercase tracking-wider font-bold mb-2 font-display ${isDarkMode ? "text-slate-205" : "text-slate-800"}`}>
                                   Search Intent Precision
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                   Funnels target keywords into distinct search states (Informational, commercial investigation, or transactional) tailored for the exact audience demographics configured.
                                </p>
                             </div>
                             <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-indigo-500 font-bold">
                                <span>Demographics Setup</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                             </div>
                          </div>
                       </motion.div>

                       {/* Column 3 */}
                       <motion.div 
                         whileHover={{ y: -6 }}
                         className={`rounded-2xl overflow-hidden border shadow-sm flex flex-col group transition-all duration-300 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                       >
                          <div className="h-44 overflow-hidden relative">
                             <img 
                               src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800" 
                               alt="E-E-A-T Quality Auditor" 
                               className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105"
                               referrerPolicy="no-referrer"
                             />
                             <div className="absolute top-4 left-4 z-10 backdrop-blur-md bg-slate-900/60 rounded-full p-2 border border-white/10 text-white">
                                <Award className="w-4 h-4 text-white" />
                             </div>
                          </div>
                          <div className="p-6 flex-1 flex flex-col justify-between">
                             <div>
                                <h4 className={`text-xs ml-0.5 uppercase tracking-wider font-bold mb-2 font-display ${isDarkMode ? "text-slate-205" : "text-slate-800"}`}>
                                   E-E-A-T Structural Audit
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                                   Scans finished layout drafts programmatically to ensure correct H1/H2 head distribution ratios, ideal keyword density metrics, and active internal context anchor references.
                                </p>
                             </div>
                             <div className="pt-3 border-t border-slate-100 dark:border-slate-900 flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-indigo-500 font-bold">
                                <span>Explore Audit Metrics</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                             </div>
                          </div>
                       </motion.div>
                    </div>
                 </div>
               </motion.div>
            )}

            {loadingStep && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`max-w-xl mx-auto mt-16 border rounded-2xl p-10 shadow-xl relative overflow-hidden transition-colors duration-200 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
              >
                {/* Visual glow background inside loading frame */}
                <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl"></div>

                {/* Top loader pipeline visual line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 dark:bg-slate-900">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="h-1 bg-indigo-500 w-1/2"
                  ></motion.div>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-md relative ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-indigo-50/50 border-indigo-100"}`}>
                    <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
                  </div>

                  <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold mb-2">Analyzing Topic Graph</span>
                  <h3 className="text-lg font-display font-medium tracking-tight mb-6">Orchestrating High-Ranking Content</h3>

                  {/* Active Step Progress Pill */}
                  <div className={`text-xs font-bold font-mono px-5 py-3 rounded-xl shadow-inner border w-full max-w-sm mb-8 ${isDarkMode ? "bg-slate-900 text-indigo-300 border-slate-850" : "bg-slate-50 text-indigo-700 border-slate-200"}`}>
                    {loadingStep}
                  </div>

                  {/* High Quality Stepper Visualization */}
                  <div className="w-full max-w-sm space-y-4 text-left border-t pt-6 border-slate-150 dark:border-slate-800">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[9px] font-bold ${loadingPhase >= 1 ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 border-slate-250 text-slate-400"}`}>
                        {loadingPhase > 1 ? <CheckCircle2 className="w-3.5 h-3.5 text-white bg-indigo-650 rounded-full" /> : "1"}
                      </div>
                      <span className={`text-[11px] font-medium ${loadingPhase >= 1 ? "text-slate-800 dark:text-slate-100 font-bold" : "text-slate-400"}`}>
                        Semantic Deconstruct & Keyword Intent Mapping
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[9px] font-bold ${loadingPhase >= 2 ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 border-slate-250 text-slate-400"}`}>
                        {loadingPhase > 2 ? <CheckCircle2 className="w-3.5 h-3.5 text-white bg-indigo-650 rounded-full" /> : "2"}
                      </div>
                      <span className={`text-[11px] font-medium ${loadingPhase >= 2 ? "text-slate-800 dark:text-slate-100 font-bold" : "text-slate-400"}`}>
                        Pillar Strategic Article Generation
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border font-mono text-[9px] font-bold ${loadingPhase >= 3 ? "bg-indigo-600 text-white border-indigo-600" : "bg-slate-100 border-slate-250 text-slate-400"}`}>
                        "3"
                      </div>
                      <span className={`text-[11px] font-medium ${loadingPhase >= 3 ? "text-slate-800 dark:text-slate-100 font-bold" : "text-slate-400"}`}>
                        Concurrently Drafting Supporting Anchored Nodes
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {plan && !loadingStep && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-4xl mx-auto mt-6 mb-24"
              >
                {/* Result header workspace metadata block */}
                <div id="architect-section" className="scroll-mt-20">
                  <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b gap-4 ${isDarkMode ? "border-slate-800" : "border-slate-200"}`}>
                     <div className="flex items-center gap-3">
                       <div className={`p-2.5 rounded-xl border ${isDarkMode ? "bg-slate-900 border-slate-800 text-indigo-400" : "bg-indigo-50/50 border-indigo-100 text-indigo-600"}`}>
                         <LayoutDashboard className="w-5 h-5" />
                       </div>
                       <div>
                         <h2 className="text-xs font-bold uppercase tracking-widest font-display">
                           Campaign Workspace
                         </h2>
                         <p className={`text-[10px] uppercase font-mono tracking-wider mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                           {activeInput?.businessName}
                         </p>
                       </div>
                     </div>
                     <div className="flex flex-wrap gap-2.5">
                       <motion.button 
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={exportMarkdownPack}
                         className={`flex text-[10px] px-4 py-2.5 rounded-lg border font-bold uppercase tracking-widest transition-all shadow-sm items-center gap-2 cursor-pointer ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850 hover:border-slate-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-350"}`}
                       >
                         <DownloadCloud className="w-4 h-4" /> Export MD Content Pack
                       </motion.button>
                       <motion.button 
                         whileHover={{ scale: 1.02, y: -1 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={exportPDFPack}
                         className="flex text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg border border-indigo-550 font-bold uppercase tracking-widest transition-all shadow-md items-center gap-2 cursor-pointer"
                       >
                         <FileText className="w-4 h-4" /> Export PDF (Print)
                       </motion.button>
                       
                       <motion.button 
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={() => {
                           setPlan(null);
                           setPillarBlog(null);
                           setSupportingBlogs([]);
                         }}
                         className={`flex text-[10px] px-3.5 py-2.5 rounded-lg border transition-all cursor-pointer ${isDarkMode ? "bg-slate-950 border-slate-850 text-slate-400 hover:bg-slate-900" : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-150"}`}
                       >
                         Reset
                       </motion.button>
                     </div>
                  </div>
                </div>
                
                {/* Cluster visual tree wrapped with map ID */}
                <div id="cluster-map-section" className="scroll-mt-20">
                  <ClusterMap plan={plan} isDark={isDarkMode} />
                </div>
                
                {/* Anchor Index Indicator table preview */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`border rounded-xl p-6 mt-12 transition-colors duration-250 ${isDarkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}
                >
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-4 font-mono">Context Internal Linking Spec</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className={`border-b ${isDarkMode ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                          <th className="pb-3 uppercase tracking-wider font-bold text-[9px]">From (Origin Source)</th>
                          <th className="pb-3 uppercase tracking-wider font-bold text-[9px] pl-4">To (Destination Node)</th>
                          <th className="pb-3 uppercase tracking-wider font-bold text-[9px] text-right">Context Anchor Link Text</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {plan.internal_link_map.map((item, index) => (
                          <tr key={index} className={`hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                            <td className="py-3.5 font-medium pr-4 max-w-xs truncate">{item.from_blog_title}</td>
                            <td className="py-3.5 font-medium pl-4 max-w-xs truncate text-indigo-400 dark:text-indigo-350">{item.to_blog_title}</td>
                            <td className="py-3.5 text-right font-mono text-[10px]"><span className={`px-2 py-1 rounded border uppercase text-[9px] font-bold ${isDarkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-emerald-50 border-emerald-100 text-emerald-800"}`}>"{item.anchor_text}"</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Article List Previews with Pillar Section ID */}
                <div id="pillar-section" className="scroll-mt-20 mt-12">
                  {pillarBlog && (
                     <motion.div 
                       id="pillar"
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                     >
                       <BlogPreview blog={pillarBlog} label="01 Pillar Master Specification" isDark={isDarkMode} />
                     </motion.div>
                  )}
                </div>

                {/* Supporting section list previews */}
                <div id="supporting-section" className="scroll-mt-20 mt-12 space-y-12">
                  {supportingBlogs.map((blog, idx) => (
                     <motion.div 
                       id={`support-${idx}`} 
                       key={idx}
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true, margin: "-100px" }}
                     >
                       <BlogPreview blog={blog} label={`0${idx + 2} Supporting Branch Node`} isDark={isDarkMode} />
                     </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!loadingStep && (
            <div className="space-y-16 mt-16 pt-16 border-t border-slate-200 dark:border-slate-800">
              {/* Gorgeous Interactive Performance and Keyword Ranking Trends */}
              <PerformanceMetrics isDark={isDarkMode} plan={plan} activeInput={activeInput} />

              {/* Dynamic interactive SEO ROI Calculator */}
              <div id="roi-calculator-section" className="scroll-mt-20">
                <ROICalculator isDark={isDarkMode} />
              </div>

              {/* Customer success stories and metrics */}
              <div id="testimonials-section" className="scroll-mt-20">
                <Testimonials isDark={isDarkMode} />
              </div>

              {/* Subscription and authority packages models */}
              <div id="pricing-tiers-section" className="scroll-mt-20">
                <PricingTiers isDark={isDarkMode} />
              </div>

              {/* Gorgeous Interactive Strategic Newsletter subscription feed */}
              <NewsletterBriefing 
                isDark={isDarkMode} 
                activeInput={activeInput} 
                onSubscribeSuccess={() => {
                  setIsInboxOpen(true);
                }}
              />

              {/* Strategic Frequently Asked questions */}
              <div id="faq-accordion-section" className="scroll-mt-20">
                <FAQAccordion isDark={isDarkMode} />
              </div>
            </div>
          )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* High Authority Polished Footer */}
      <PolishedFooter isDark={isDarkMode} activeInput={activeInput} />

      {/* Interactive SMTP Sandbox Sidebar Drawer */}
      <AnimatePresence>
        {isInboxOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-end">
            {/* Sidebar background click to close */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsInboxOpen(false)}></div>
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-full max-w-2xl h-full shadow-2xl relative flex flex-col z-10 border-l ${
                isDarkMode 
                  ? "bg-slate-950 border-slate-850 text-slate-100" 
                  : "bg-white border-slate-200 text-slate-800"
              }`}
            >
              {/* Header toolbar */}
              <div className={`p-5 border-b flex items-center justify-between shrink-0 ${
                isDarkMode ? "border-slate-850" : "border-slate-150"
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-mono">
                    <Inbox className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold font-display uppercase tracking-wider">Outbound SMTP Container</h4>
                      <span className="text-[9px] font-mono font-bold uppercase py-0.5 px-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded">
                        ONLINE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">Container Network Relay: loops to lo0/3000</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsInboxOpen(false)}
                  className={`p-1.5 rounded-lg border hover:scale-105 transition cursor-pointer ${
                    isDarkMode 
                      ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" 
                      : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-850"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Info panel */}
              <div className={`p-4 mx-5 mt-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                isDarkMode 
                  ? "bg-slate-900/40 border-slate-800 text-slate-400" 
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}>
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className={isDarkMode ? "text-slate-200" : "text-slate-800"}>Live Dynamic SMTP Router active:</strong> Briefing requests and client onboarding logs triggers live Gemini runs and emails them here instantly. This replicates public-facing SMTP grids securely within our sandboxed architecture.
                </div>
              </div>

              {/* Main section */}
              <div className="flex-1 overflow-hidden flex min-h-0 divide-x divide-slate-150 dark:divide-slate-850 mt-4">
                {/* Email Catalog List (38% scale on desktop) */}
                <div className="w-[38%] overflow-y-auto shrink-0 divide-y divide-slate-100 dark:divide-slate-900 border-r border-slate-150 dark:border-slate-850">
                  {simulatedEmails.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 font-mono mt-10">
                      No outbound mail dispatched. Trigger a newsletter subscription or launch a pricing workspace to intercept logs!
                    </div>
                  ) : (
                    simulatedEmails.map(mail => (
                      <div
                        key={mail.id}
                        onClick={() => setSelectedMailId(mail.id)}
                        className={`p-4 text-left text-xs cursor-pointer transition relative ${
                          selectedMailId === mail.id 
                            ? (isDarkMode ? "bg-indigo-950/20 text-indigo-400" : "bg-indigo-50/50 text-indigo-800")
                            : (isDarkMode ? "hover:bg-slate-900/50" : "hover:bg-slate-50")
                        }`}
                      >
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
                          <span className="truncate max-w-[80px] font-bold text-indigo-500">{mail.sender.split("@")[0]}</span>
                          <span>{new Date(mail.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h5 className="font-semibold truncate leading-snug mb-1">{mail.subject}</h5>
                        <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-snug">{mail.textContent}</p>
                        {selectedMailId === mail.id && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Email Content Panel (62% scale) */}
                <div className="flex-1 overflow-y-auto p-5 flex flex-col min-h-0 bg-slate-950/10 dark:bg-slate-950/30">
                  {simulatedEmails.find(m => m.id === selectedMailId) || simulatedEmails[0] ? (() => {
                    const activeMail = simulatedEmails.find(m => m.id === selectedMailId) || simulatedEmails[0];
                    return (
                      <div className="space-y-4 flex flex-col h-full bg-slate">
                        {/* Headers bar */}
                        <div className={`p-4 rounded-xl border text-xs divide-y divide-slate-100 dark:divide-slate-900 ${
                          isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200"
                        }`}>
                          <div className="pb-2.5 flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold tracking-tight font-display text-indigo-500 uppercase">{activeMail.subject}</h4>
                              <p className="text-[10px] text-slate-400 mt-2 font-mono">
                                SMTP-From: <span className="text-emerald-500 font-bold">&lt;{activeMail.sender}&gt;</span>
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                SMTP-To: <span className="text-sky-450 font-bold">&lt;{activeMail.recipient}&gt;</span>
                              </p>
                            </div>
                          </div>
                          <div className="pt-2.5 grid grid-cols-2 gap-y-1.5 gap-x-3 text-[9px] font-mono text-slate-500">
                            <div>MTA-IP: <span className="text-slate-400 font-bold">127.0.0.1</span></div>
                            <div>TLS: <span className="text-indigo-400 font-bold">v1.3 (ChaCha20)</span></div>
                            <div>SPF: <span className="text-emerald-500 font-bold">PASS</span></div>
                            <div>DKIM: <span className="text-emerald-500 font-bold">PASS (2048)</span></div>
                          </div>
                        </div>

                        {/* HTML content inside styled div container block safely styled */}
                        <div 
                          className={`flex-1 p-5 rounded-xl border overflow-y-auto text-xs ${
                            isDarkMode ? "bg-slate-900 border-slate-850 text-slate-100" : "bg-white border-slate-200 text-slate-800"
                          }`}
                        >
                          <div 
                            className="email-body-renderer prose max-w-full text-left dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: activeMail.htmlContent }}
                          />
                        </div>
                      </div>
                    );
                  })() : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-70">
                      <Mail className="w-10 h-10 text-slate-400 stroke-1 mb-3" />
                      <h5 className="font-semibold text-xs text-slate-450 uppercase tracking-widest font-mono">SMTP Intercept Center</h5>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                        Submit any email briefings down in the newsletter form or test transaction plans on the pricing packages to intercept outbound emails instantly!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dynamic Toast Notification for Outbound Intercepts */}
      <AnimatePresence>
        {newEmailToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: 50 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border shadow-xl flex items-start gap-4 max-w-sm ${
              isDarkMode 
                ? "bg-slate-950/95 border-indigo-500/40 text-slate-100 backdrop-blur-md" 
                : "bg-white/95 border-indigo-200 text-slate-900 backdrop-blur-md shadow-indigo-100/40 shadow-2xl"
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-550/20 shrink-0 mt-0.5">
              <MailCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-indigo-500 font-mono uppercase tracking-wider">SMTP Intercepted</span>
                <button 
                  onClick={() => setNewEmailToast(null)} 
                  className="p-1 rounded text-slate-400 hover:text-slate-205 cursor-pointer border-0 bg-transparent"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h5 className="font-semibold text-xs truncate mt-0.5">{newEmailToast.subject}</h5>
              <p className={`text-[10.5px] mt-1 leading-snug ${isDarkMode ? "text-slate-450" : "text-slate-500"}`}>
                Dossier successfully customized and dispatched to <span className="font-mono text-[9.5px] font-bold text-indigo-500">{newEmailToast.recipient}</span>.
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMailId(newEmailToast.id);
                    setIsInboxOpen(true);
                    setNewEmailToast(null);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-2 rounded-lg transition-all shadow-sm cursor-pointer border-0"
                >
                  Inspect Transmission
                </button>
                <button
                  onClick={() => setNewEmailToast(null)}
                  className={`font-bold text-[9px] uppercase tracking-widest px-2.5 py-2 rounded-lg border cursor-pointer transition-all ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100"
                  }`}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
