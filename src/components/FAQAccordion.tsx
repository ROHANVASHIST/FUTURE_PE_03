import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FAQAccordionProps {
  isDark: boolean;
}

export function FAQAccordion({ isDark }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open first

  const faqs = [
    {
      question: "What exactly is. 'Topical Authority' and why does it matter?",
      answer: "Topical Authority is an SEO methodology where an website establishes complete comprehensive knowledge about a specific topic rather than just trying to rank individual landing pages with backlinks. By writing a high-quality 'Pillar' master article and connecting it with exactly three supporting sub-topic articles, search engines identify your local site as a reliable, authoritative document hub, ranking you higher across hundreds of related searches.",
    },
    {
      question: "How do bidirectional internal links work within the compiled draft?",
      answer: "When our semantic engine builds your Content Cluster, it automatically creates a context internal-link roadmap. Each supporting sub-article is drafted to contain a natural, contextually relevant sentence linking back to your main high-authority Pillar article with optimized anchor texts. Meanwhile, the main Pillar page links out to each supporting branch. This tells crawlers how your pages are semantically couple together.",
    },
    {
      question: "Will search engine algorithms penalize AI-drafted local SEO articles?",
      answer: "No. Modern search guidelines (like Google's custom E-E-A-T quality rater guidelines) judge content based on value, relevance, accuracy, and structure, not the tools used to create it. Our platform uses state-of-the-art context injection to ensure your drafts include real geo-location landmarks, service details, and professional structures, making them incredibly helpful to human visitors.",
    },
    {
      question: "Can I directly integrate these generated drafts with WordPress or Webflow?",
      answer: "Absolutely. When you generate a cluster, you can export the entire Content Portfolio in single standard Markdown (.md) format. It includes cleanly formatted structural elements (H1, H2, H3), lists, and links that copy directly into any standard rich text editor, Gutenberg block, or headless CMS. The raw HTML formatting in the PDF print output is also ideal for standard web copy insertion.",
    },
    {
      question: "Is there an agency layout with white-label client outputs?",
      answer: "Yes. Our Agency Portfolio plan allows digital agencies to export beautifully formatted PDF Content Cluster reports with clean, custom branding suitable to present to premium local clients directly as comprehensive quarterly SEO campaign deliverables.",
    },
  ];

  return (
    <div className="pt-16 border-t border-slate-150 dark:border-slate-850">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">Friction Elimination</span>
        <h3 className={`text-2xl font-light font-display mt-2 tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          Frequently Answered Questions
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Have questions about semantic mapping, algorithmic compliance, or integrations? We have answers.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-350 overflow-hidden ${
                isOpen
                  ? isDark
                    ? "bg-slate-950 border-indigo-500"
                    : "bg-white border-indigo-400 shadow-md shadow-indigo-100/30"
                  : isDark
                  ? "bg-slate-950 border-slate-850 hover:border-slate-750"
                  : "bg-white border-slate-200 hover:border-slate-350"
              }`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <span className={`text-[13px] font-bold tracking-normal ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                  {faq.question}
                </span>
                <span className={`p-1.5 rounded-lg border ${isOpen ? "bg-indigo-500 text-white border-indigo-550" : isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"}`}>
                  {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-100 dark:border-slate-900">
                      <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
