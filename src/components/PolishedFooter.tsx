import { useState, SyntheticEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, 
  Check, 
  DatabaseZap, 
  ShieldCheck, 
  Heart, 
  Loader, 
  BookOpen, 
  Terminal, 
  X, 
  Copy, 
  ChevronRight, 
  FileCode,
  Sparkles,
  Link2,
  Lock
} from "lucide-react";
import { BusinessInput } from "../types";

interface PolishedFooterProps {
  isDark: boolean;
  activeInput?: BusinessInput | null;
}

export function PolishedFooter({ isDark, activeInput }: PolishedFooterProps) {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Interactive Modal & Toast States
  const [activeModal, setActiveModal] = useState<"book" | "api" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeBookChapter, setActiveBookChapter] = useState<number>(0);
  const [activeApiRoute, setActiveApiRoute] = useState<string>("blueprint");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSubscribe = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          businessInput: activeInput || null
        })
      });

      if (!response.ok) throw new Error("Failed to subscribe");
      const data = await response.json();

      // Trigger standard simulated email client event
      const event = new CustomEvent("SIMULATED_EMAIL_RECEIVED", {
        detail: {
          id: Math.random().toString(36).substring(2, 11),
          sender: data.headers["x-smtp-sender"] || "briefings@seoclustersuite.com",
          recipient: email.trim(),
          subject: data.subject,
          htmlContent: data.htmlContent,
          textContent: data.textContent,
          timestamp: data.timestamp,
          headers: data.headers
        }
      });
      window.dispatchEvent(event);

      setIsSubscribed(true);
      setEmail("");
    } catch (err: any) {
      console.error(err);
      showToast("Subscription error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollOrAlert = (elementId: string, sectionName: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      // Find offset for sticky layout header offset margin
      const offsetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    } else {
      showToast(`Campaign plan required: Generate an AI SEO plan first to unlock the ${sectionName} workspace!`);
    }
  };

  const triggerCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const bookChapters = [
    {
      title: "01. Introduction to Topical Authority",
      subtitle: "Moving beyond individual keyword stuffing",
      content: `Modern search engines parse query meanings rather than exact strings. A site scores highly when it represents an exhaustive informational resource on a topical niche. By grouping tightly related nodes together, we project comprehensive coverage. 

Topical authority is mathematically represented as a dense sub-graph of related expert claims, backed by robust local context signals and logical semantic branches.`
    },
    {
      title: "02. The Hub & Spoke Interlinking Schema",
      subtitle: "Bidirectional structures designed for high crawler trust",
      content: `To pass contextual authority efficiently, each satellite "spoke" article must target one long-tail specific long-tail theme and link directly to a master "Pillar" specification page. 

Simultaneously, the Pillar must list out and redirect rank weights back downwards to each branching node. This dual interlinking model signals to crawlers that the portfolio forms one unified expert body of knowledge rather than fragmented essays.`
    },
    {
      title: "03. Engineering Local EEAT Landmarks",
      subtitle: "Grounding online articles into verifiable tangible parameters",
      content: `YMYL (Your Money Your Life) and local businesses must prove tangible local activity. Placing verified municipal structures, coordinates, transit hubs, and geographical landmarks inside article content grounds the text in raw geo-verifiability. 

Our generator dynamically fuses geographical databases with high-ranking intent parameters, satisfying critical trust thresholds automatically.`
    }
  ];

  const apiEndpoints = {
    blueprint: {
      method: "POST",
      path: "/api/generate-cluster-blueprint",
      desc: "Compile an entire visual topic cluster, incorporating geographic landmarks and anchor counts parsed by Gemini.",
      payload: JSON.stringify({
        businessName: "Metropolitan Dental",
        niche: "Emergency Dentistry",
        city: "San Francisco"
      }, null, 2),
      response: JSON.stringify({
        primaryKeyword: "Emergency Dentist San Francisco",
        secondaryKeywords: [
          "Emergency root canal SF",
          "Urgent tooth extraction cost"
        ],
        landmarks: ["Golden Gate Park", "Salesforce Tower"],
        anchorTarget: "sf-emergency-dentist",
        topicalPurityIndex: 98.4
      }, null, 2)
    },
    pillar: {
      method: "POST",
      path: "/api/generate-pillar-blog",
      desc: "Triggers the generative model to draft an exhaustive pillar master specification article complete with citation tags.",
      payload: JSON.stringify({
        keyword: "Emergency Dentist San Francisco",
        businessName: "Metropolitan Dental",
        city: "San Francisco",
        landmarks: ["Golden Gate Park"]
      }, null, 2),
      response: JSON.stringify({
        title: "The Ultimate Guide to Emergency Dentistry in San Francisco",
        metaDescription: "Urgent dental care guide in SF.",
        introduction: "When a severe toothache strikes near Golden Gate Park...",
        outline: ["1. Critical SF Urgent Services", "2. Cost Estimates"],
        localIntegrations: "Includes 3 regional citations and map signals.",
        wordCount: 2200
      }, null, 2)
    },
    subscribe: {
      method: "POST",
      path: "/api/subscribe",
      desc: "Binds an enterprise email to standard SMTP testing relays and dispatches an authentic authority dossier.",
      payload: JSON.stringify({
        email: "rohanvashist01@gmail.com",
        businessInput: {
          businessName: "Alpha Capital",
          niche: "Bespoke Wealth Management",
          city: "New York"
        }
      }, null, 2),
      response: JSON.stringify({
        success: true,
        recipient: "rohanvashist01@gmail.com",
        subject: "Strategic Cluster Dossier: Alpha Capital",
        timestamp: "2026-06-02T11:57:00Z",
        headers: {
          "x-smtp-sender": "briefings@seoclustersuite.com",
          "x-route-carrier": "SMTP-SANDBOX-INTERCEPT"
        }
      }, null, 2)
    }
  };

  return (
    <footer className={`border-t py-16 transition-colors duration-300 relative z-20 ${isDark ? "bg-slate-950 border-slate-850 text-slate-400" : "bg-white border-slate-200 text-slate-600"}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12 border-b border-slate-100 dark:border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono shadow-md ${isDark ? "bg-indigo-600 text-white" : "bg-slate-850 text-white"}`}>
                <DatabaseZap className="w-4 h-4 text-white" />
              </div>
              <span className={`text-[11px] font-bold tracking-[0.25em] uppercase ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                SEO CLUSTER ENGINE
              </span>
            </div>
            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              The industry-standard semantic authority planner that constructs tightly cross-linked content portfolios complete with local geographic landmarks. Ideal for dentists, lawyers, and agencies seeking rank dominance.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SOC2 Compliance Certified Agency</span>
            </div>
          </div>

          {/* Core Modules links */}
          <div className="md:col-span-2 space-y-3.5">
            <h5 className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? "text-slate-350" : "text-slate-700"}`}>
              Platform Suite
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => scrollOrAlert("cluster-map-section", "Semantic Mapping")}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Link2 className="w-3 h-3 opacity-60" /> Semantic Mapping
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollOrAlert("pillar-section", "Pillar Master")}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Link2 className="w-3 h-3 opacity-60" /> Pillar Core Planner
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollOrAlert("supporting-section", "Branch Nodes")}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Link2 className="w-3 h-3 opacity-60" /> Context Links Audit
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById("faq-accordion-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Link2 className="w-3 h-3 opacity-60" /> EEAT Scorecards
                </button>
              </li>
            </ul>
          </div>

          {/* Resources links */}
          <div className="md:col-span-2 space-y-3.5">
            <h5 className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? "text-slate-350" : "text-slate-700"}`}>
              Strategic Guide
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => setActiveModal("book")}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-505 shrink-0" /> Focus-Pillar eBook
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById("roi-calculator-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Link2 className="w-3 h-3 opacity-60" /> SEO ROI Calculator
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveModal("api")}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-505 shrink-0" /> API Developer Docs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById("testimonials-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`border-none bg-transparent p-0 text-left hover:text-indigo-500 cursor-pointer transition flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Link2 className="w-3 h-3 opacity-60" /> Success Stories
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="md:col-span-4 space-y-4">
            <h5 className={`text-[10px] font-bold tracking-widest uppercase ${isDark ? "text-slate-350" : "text-slate-700"}`}>
              Strategic Intel newsletter
            </h5>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Receive high-level algorithmic updates, semantic link strategies, and Google update analyses every Tuesday. No fluff.
            </p>

            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form
                  key="subscribe-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubscribe}
                  className="flex gap-2 max-w-sm"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="business@example.com"
                      value={email}
                      disabled={loading}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl text-xs border outline-none font-mono focus:border-indigo-500 transition ${isDark ? "bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-550" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-widest px-4 py-2.5 rounded-xl border border-indigo-550 transition shadow-sm cursor-pointer disabled:opacity-70 flex items-center justify-center gap-1 shrink-0"
                  >
                    {loading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : "Brief Me"}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="subscribe-success"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-3.5 rounded-xl border flex flex-col gap-2.5 max-w-sm text-xs ${isDark ? "bg-emerald-950/25 border-emerald-900 text-emerald-300" : "bg-emerald-50 border-emerald-150 text-emerald-800"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                    </div>
                    <span className="font-semibold text-[11px]">Bespoke Strategy Dossier Sent!</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed opacity-90 font-sans">
                    Our servers have dispatched a customized high-authority SEO analysis report to your virtual inbox container! Use the <span className="underline font-bold">SMTP View</span> to open it.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-[10px] text-slate-500 font-mono">
          <span>
            © {new Date().getFullYear()} SEO Cluster Mapping Suite. All programmatic rights reserved.
          </span>
          <div className="flex items-center gap-1.5 justify-center">
            <span>Built for Enterprise SEO Acquisition with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>& AI Authority Core</span>
          </div>
        </div>
      </div>

      {/* MODALS GATE & TOAST TRANSITIONS */}
      <AnimatePresence>
        {/* eBook Modal */}
        {activeModal === "book" && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-3xl rounded-3xl overflow-hidden border shadow-2xl flex flex-col md:flex-row max-h-[90vh] ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}
            >
              {/* Sidebar content chapters */}
              <div className={`md:w-1/3 p-6 border-r flex flex-col justify-between ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Focus Handbook</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display tracking-tight">Topical Clusters Specification</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Authority algorithms distilled by our content engineering staff.</p>
                  </div>
                  <nav className="space-y-1.5">
                    {bookChapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveBookChapter(idx)}
                        className={`w-full text-left p-3 rounded-xl border-0 text-[11px] font-mono font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          activeBookChapter === idx 
                            ? isDark ? "bg-indigo-650/20 text-indigo-400 font-bold" : "bg-indigo-50 text-indigo-650 font-bold"
                            : isDark ? "bg-transparent text-slate-400 hover:bg-slate-900 text-slate-450" : "bg-transparent text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{ch.title.split(". ")[1]}</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="text-[9.5px] font-mono text-slate-450 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Version 1.04 · Published 2026</span>
                </div>
              </div>

              {/* Text Chapter reader */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-500 font-mono tracking-widest uppercase">Chapter {activeBookChapter + 1}</span>
                      <h3 className="text-lg font-bold font-display tracking-tight mt-1">
                        {bookChapters[activeBookChapter].title.split(". ")[1]}
                      </h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium italic mt-0.5">
                        {bookChapters[activeBookChapter].subtitle}
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveModal(null)} 
                      className={`p-1.5 rounded-lg border cursor-pointer border-0 ${isDark ? "bg-slate-800 hover:bg-slate-750 text-slate-300" : "bg-slate-100 hover:bg-slate-150 text-slate-600"}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <hr className={isDark ? "border-slate-800" : "border-slate-200"} />

                  <p className={`text-xs leading-relaxed whitespace-pre-line font-sans ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                    {bookChapters[activeBookChapter].content}
                  </p>
                </div>

                <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-mono ${isDark ? "border-slate-800 text-slate-500" : "border-slate-150 text-slate-500"}`}>
                  <span>Read Time: 2 mins</span>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase py-2 px-4 rounded-xl cursor-pointer border-none"
                  >
                    Close Chapter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* API Docs Modal */}
        {activeModal === "api" && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-4xl rounded-3xl overflow-hidden border shadow-2xl flex flex-col md:flex-row max-h-[90vh] ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"}`}
            >
              {/* Developer Tab panel */}
              <div className={`md:w-1/3 p-6 border-r flex flex-col justify-between ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-150"}`}>
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-500" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">Developers API Schema</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display tracking-tight">Semantic Engine Integrations</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">Access visual blueprints and generated content programmatically.</p>
                  </div>
                  <nav className="space-y-1.5">
                    {Object.entries(apiEndpoints).map(([key, item]) => (
                      <button
                        key={key}
                        onClick={() => setActiveApiRoute(key)}
                        className={`w-full text-left p-3 rounded-xl border-0 font-mono text-[11px] transition-all cursor-pointer ${
                          activeApiRoute === key 
                            ? isDark ? "bg-indigo-650/20 text-indigo-400 font-semibold" : "bg-indigo-50 text-indigo-650 font-semibold"
                            : isDark ? "bg-transparent text-slate-400 hover:bg-slate-900" : "bg-transparent text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                            item.method === "POST" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-450" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {item.method}
                          </span>
                          <span className="truncate text-[10px]">{item.path}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
                <div className="text-[9.5px] font-mono text-slate-450 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Bearer token required</span>
                </div>
              </div>

              {/* Endpoint Request / Response panel */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-550 text-white">
                          {apiEndpoints[activeApiRoute as keyof typeof apiEndpoints].method}
                        </span>
                        <code className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {apiEndpoints[activeApiRoute as keyof typeof apiEndpoints].path}
                        </code>
                      </div>
                      <p className={`text-xs mt-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                        {apiEndpoints[activeApiRoute as keyof typeof apiEndpoints].desc}
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setActiveModal(null)} 
                      className={`p-1.5 rounded-lg border cursor-pointer border-0 ${isDark ? "bg-slate-800 hover:bg-slate-750 text-slate-300" : "bg-slate-100 hover:bg-slate-150 text-slate-600"}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <hr className={isDark ? "border-slate-800" : "border-slate-200"} />

                  {/* Code Samples */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 mb-1 px-1">
                        <span>JSON Request Template</span>
                        <button 
                          onClick={() => triggerCopy(apiEndpoints[activeApiRoute as keyof typeof apiEndpoints].payload)}
                          className="flex items-center gap-1 font-semibold hover:text-indigo-500 border-none bg-transparent cursor-pointer py-1"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {isCopied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <pre className={`p-3.5 rounded-xl font-mono text-[10px] overflow-x-auto border ${
                        isDark ? "bg-slate-950 border-slate-800 text-indigo-450" : "bg-slate-50 border-slate-200 text-indigo-800"
                      }`}>
                        <code>{apiEndpoints[activeApiRoute as keyof typeof apiEndpoints].payload}</code>
                      </pre>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 mb-1 px-1">
                        <span>Response Sample (200 OK)</span>
                      </div>
                      <pre className={`p-3.5 rounded-xl font-mono text-[10px] overflow-x-auto border ${
                        isDark ? "bg-slate-950 border-slate-800/50 text-slate-300" : "bg-slate-50 border-slate-200/50 text-slate-700"
                      }`}>
                        <code>{apiEndpoints[activeApiRoute as keyof typeof apiEndpoints].response}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-mono ${isDark ? "border-slate-800 text-slate-500" : "border-slate-150 text-slate-500"}`}>
                  <span>Rate Limit: 200 req/min</span>
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold uppercase py-2 px-4 rounded-xl cursor-pointer border-none"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mini Authority Notifications */}
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border shadow-xl flex items-center gap-3.5 max-w-sm ${
              isDark 
                ? "bg-slate-950/98 border-indigo-500/30 text-white" 
                : "bg-white/98 border-indigo-150 text-slate-900 shadow-indigo-150/20"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-505/10 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-550/20">
              <Lock className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] leading-snug font-mono font-bold tracking-tight">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="p-1 rounded opacity-50 hover:opacity-100 cursor-pointer border-0 bg-transparent"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}

