import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Check, Loader, Send, Sparkles, Inbox, ShieldCheck } from "lucide-react";
import { BusinessInput } from "../types";

interface Props {
  isDark: boolean;
  activeInput: BusinessInput | null;
  onSubscribeSuccess: (email: string) => void;
}

export function NewsletterBriefing({ isDark, activeInput, onSubscribeSuccess }: Props) {
  const [email, setEmail] = useState<string>("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          businessInput: activeInput || null
        })
      });

      if (!response.ok) throw new Error("Failed to dispatch briefing subscription");
      const data = await response.json();

      // Trigger custom email client event
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
      onSubscribeSuccess(email.trim());
      setEmail("");
    } catch (err: any) {
      console.error(err);
      alert("Error sending dynamic subscription dispatch: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
      id="newsletter-section"
      className="scroll-mt-20 mt-16"
    >
      <div className={`relative rounded-3xl p-8 sm:p-12 overflow-hidden border shadow-xl ${
        isDark 
          ? "bg-gradient-to-br from-indigo-950/20 via-slate-950 to-slate-950 border-slate-800 shadow-indigo-950/10" 
          : "bg-gradient-to-br from-indigo-50/20 via-white to-white border-slate-200/80 shadow-indigo-150/15"
      }`}>
        {/* Abstract decorative geometric nodes */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute left-10 bottom-0 w-60 h-60 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-2xl -z-10 pointer-events-none"></div>
        
        <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100/60 dark:bg-indigo-950/45 rounded-lg border border-indigo-200/30 dark:border-indigo-800/40 text-[10px] font-mono tracking-widest font-bold uppercase text-indigo-650 dark:text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-505 animate-pulse" />
              Strategic SEO Intel briefings
            </div>
            
            <h3 className="text-2xl sm:text-3.5xl font-display font-light tracking-tight leading-tight">
              Subscribe to the <span className="font-semibold text-indigo-600 dark:text-indigo-400">Intel Feed</span>
            </h3>
            
            <p className={`text-xs sm:text-sm leading-relaxed max-w-xl ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Receive high-level tactical algorithmic updates, core semantic link strategies, and Google update analyses parsed by our fine-tuned Gemini model directly into your workspace. {activeInput ? (
                <span>We will immediately compile a customized authority briefing for <strong className="text-indigo-500 font-semibold">{activeInput.businessName}</strong> and dispatch it to your SMTP Interceptor.</span>
              ) : (
                <span>Define your target vertical in the builder above, or subscribe now.</span>
              )}
            </p>
            
            <div className={`flex flex-wrap gap-x-5 gap-y-2 text-[10.5px] font-mono ${isDark ? "text-slate-450" : "text-slate-500"}`}>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Zero Spam policy
              </div>
              <div className="flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-indigo-500" />
                Real-time Sandbox SMTP intercepts
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        disabled={isLoading}
                        placeholder="Enter your strategic email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-xs sm:text-sm border outline-none font-mono focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-505 transition-all ${
                          isDark 
                            ? "bg-slate-900/85 border-slate-800 text-white placeholder-slate-550 shadow-inner" 
                            : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm"
                        }`}
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-[10.5px] uppercase tracking-widest py-3.5 rounded-2xl border border-indigo-550 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Constructing Custom Dispatch...
                        </>
                      ) : (
                        <>
                          Get Custom Strategy Briefing
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className={`p-6 sm:p-8 rounded-2xl border text-center relative overflow-hidden ${
                    isDark 
                      ? "bg-slate-900/60 border-emerald-900 text-emerald-300" 
                      : "bg-emerald-50/50 border-emerald-200 text-emerald-850"
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Check className="w-6 h-6 stroke-[3px]" />
                  </div>
                  
                  <h4 className="font-bold text-sm uppercase tracking-wider font-display">
                    Personalized Briefing Dispatched!
                  </h4>
                  
                  <p className="text-[11px] leading-relaxed mt-2 opacity-90 max-w-xs mx-auto">
                    The outbound SMTP relay has successfully intercepted and logged your custom strategy. Click the <span className="underline font-bold font-mono">SMTP View</span> button in the header bar to inspect it now!
                  </p>
                  
                  <motion.div 
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="mt-4 inline-flex items-center gap-1.5 text-[9.5px] font-mono uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    <span>MTA Route: Dispatched</span>
                    <span>→</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
