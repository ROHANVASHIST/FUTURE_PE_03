import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Star, Zap, HelpCircle, X, ShieldAlert, CreditCard, Lock, Sparkles, CheckCircle, Loader } from "lucide-react";

interface PricingTiersProps {
  isDark: boolean;
}

export function PricingTiers({ isDark }: PricingTiersProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"form" | "submitting" | "confirmed">("form");
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    email: "",
    businessName: "",
    cardNumber: "4111 2222 3333 4444",
    cardExpiry: "12/28",
    cardCvc: "123",
  });

  const plans = [
    {
      name: "Starter Cluster",
      price: billingPeriod === "monthly" ? 79 : 59,
      period: "per month",
      description: "Ideal for small local listings testing topical authority hierarchies.",
      features: [
        "1 Fully Cross-linked Semantic Map",
        "1 High-Authority Pillar Article",
        "3 Context-Linking Supporting Articles",
        "PDF Portfolio Compilation Pack",
        "Markdown (.md) Core Content Export",
        "Standard Gemini Core Drafting Model",
      ],
      highlight: false,
      badge: "Starter",
    },
    {
      name: "Professional Scale",
      price: billingPeriod === "monthly" ? 149 : 119,
      period: "per month",
      description: "Best for active marketing teams, agencies, & local high-visibility brands.",
      features: [
        "8 Dense Multi-Linked Cluster Maps",
        "8 High-Authority Core Pillar Articles",
        "24 Bidirectional Anchor Support Articles",
        "E-E-A-T Content Layout Audit",
        "Advanced Demographic Persona Guarding",
        "Fine-tuned Ultra-Low Noise Model (Pro)",
        "Direct WordPress / Webflow Integration Client",
        "Priority Speed Generator Pipeline",
      ],
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Agency Portfolio",
      price: billingPeriod === "monthly" ? 349 : 279,
      period: "per / month",
      description: "Fully loaded semantic suite designed for professional agencies handling multi-location client nodes.",
      features: [
        "Unlimited Custom Cluster Workspaces",
        "Unlimited Multi-Intent Article Drafting",
        "White-label Custom Client Web Reports",
        "Custom Keyword Map Integration (API)",
        "Exclusive Semantic Authority Expert Consultant",
        "Dedicated High-Ingress Cloud Server Capacity",
        "Direct Export to GDocs, Slack & CMS",
      ],
      highlight: false,
      badge: "Performance",
    },
  ];

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.email.trim()) return;

    setCheckoutStep("submitting");
    try {
      const response = await fetch("/api/checkout-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: checkoutForm.email.trim(),
          planName: selectedPlan.name,
          price: selectedPlan.price,
          billingPeriod,
          businessName: checkoutForm.businessName.trim()
        })
      });

      if (!response.ok) throw new Error("Receipt submission failed");
      const data = await response.json();

      // Dispatch simulated email to user Sandbox
      const event = new CustomEvent("SIMULATED_EMAIL_RECEIVED", {
        detail: {
          id: Math.random().toString(36).substring(2, 11),
          sender: data.headers["x-smtp-sender"] || "billing@seoclustersuite.com",
          recipient: checkoutForm.email.trim(),
          subject: data.subject,
          htmlContent: data.htmlContent,
          textContent: data.textContent,
          timestamp: data.timestamp,
          headers: data.headers
        }
      });
      window.dispatchEvent(event);

      setCheckoutStep("confirmed");
    } catch (err: any) {
      console.error(err);
      alert("Error generating sandbox purchase receipt: " + err.message);
      setCheckoutStep("form");
    }
  };


  const resetCheckout = () => {
    setSelectedPlan(null);
    setCheckoutStep("form");
    setCheckoutForm({
      name: "",
      email: "",
      businessName: "",
      cardNumber: "4111 2222 3333 4444",
      cardExpiry: "12/28",
      cardCvc: "123",
    });
  };

  return (
    <div className="pt-16 border-t border-slate-150 dark:border-slate-850">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">Invest In Authority</span>
        <h3 className={`text-2xl font-light font-display mt-2 tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          Professional Authority Packages
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Unlock maximum programmatic SEO authority output with transparent, conversion-focused pricing models tailored to your brand scale.
        </p>
      </div>

      {/* Toggler */}
      <div className="flex justify-center items-center gap-3 mb-10">
        <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-indigo-500" : "text-slate-400"}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setBillingPeriod(prev => prev === "monthly" ? "yearly" : "monthly")}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-850 transition-colors pointer cursor-pointer focus:outline-none"
        >
          <span
            className={`${
              billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-indigo-500 transition-transform`}
          />
        </button>
        <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === "yearly" ? "text-indigo-500" : "text-slate-400"}`}>
          Yearly Billing
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Save 20%
          </span>
        </span>
      </div>

      {/* Grid of Tiers */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className={`rounded-3xl border p-8 flex flex-col justify-between transition-all duration-350 relative ${
              plan.highlight
                ? isDark
                  ? "bg-slate-950 border-indigo-600 shadow-xl shadow-indigo-950/20"
                  : "bg-white border-indigo-500 shadow-xl shadow-indigo-100"
                : isDark
                ? "bg-slate-950 border-slate-850/80"
                : "bg-white border-slate-200"
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[9px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3 h-3 fill-current" /> {plan.badge}
              </div>
            )}
            
            <div>
              <div className="mb-6">
                {!plan.highlight && (
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${isDark ? "bg-slate-900 border border-slate-800 text-slate-400" : "bg-slate-100 text-slate-500 border border-slate-250"}`}>
                    {plan.badge}
                  </span>
                )}
                <h4 className={`text-lg font-light font-display tracking-tight mt-3 ${isDark ? "text-slate-100" : "text-slate-900"}`}>
                  {plan.name}
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed h-12">
                  {plan.description}
                </p>
              </div>

              {/* Pricing section with custom discount rendering */}
              <div className="mb-6 pt-5 border-t border-slate-100 dark:border-slate-850">
                <span className={`text-4xl font-light font-display tracking-tight ${isDark ? "text-slate-100" : "text-slate-950"}`}>
                  ${plan.price}
                </span>
                <span className="text-xs text-slate-400 ml-1 font-mono">{plan.period}</span>
                {billingPeriod === "yearly" && (
                  <span className="block text-[10px] text-emerald-500 mt-1 font-mono">
                    Billed annually (${(plan.price * 12).toLocaleString()}/year)
                  </span>
                )}
              </div>

              {/* Feature Listing */}
              <ul className="space-y-3.5 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? "text-indigo-500" : "text-slate-400"}`} />
                    <span className={isDark ? "text-slate-350" : "text-slate-650"}>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedPlan(plan)}
              className={`w-full py-3.5 px-4 rounded-xl text-center text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                plan.highlight
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25 border border-indigo-550"
                  : isDark
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-850 hover:border-slate-700 text-slate-200"
                  : "bg-slate-100 border border-slate-200 hover:bg-slate-150 text-slate-700"
              }`}
            >
              Get Started Now
            </button>
          </motion.div>
        ))}
      </div>

      {/* Custom Checkout Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 border shadow-2xl relative ${isDark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}
            >
              {/* Close Button */}
              <button
                onClick={resetCheckout}
                className={`absolute top-4 right-4 p-1.5 rounded-lg border hover:scale-105 transition cursor-pointer ${isDark ? "bg-slate-850 border-slate-800 text-slate-400 hover:text-white" : "bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"}`}
              >
                <X className="w-4 h-4" />
              </button>

              {checkoutStep === "form" && (
                <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">Secure Gateway Integration</span>
                      <h4 className="text-base font-bold font-display tracking-tight leading-none mt-1">
                        Acquire {selectedPlan.name}
                      </h4>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border text-xs flex justify-between items-center ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono">SELECTED LEVEL</span>
                      <span className="font-semibold font-display text-[13px]">{selectedPlan.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px] font-mono">PRICE ({billingPeriod.toUpperCase()})</span>
                      <span className="font-mono font-bold text-base text-emerald-500">${selectedPlan.price}/mo</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Business Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corporation"
                        value={checkoutForm.businessName}
                        onChange={e => setCheckoutForm({...checkoutForm, businessName: e.target.value})}
                        className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:border-indigo-500 font-medium transition ${isDark ? "bg-slate-950 border-slate-850 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Contact Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={checkoutForm.name}
                          onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:border-indigo-500 font-medium transition ${isDark ? "bg-slate-950 border-slate-850 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Contact Email</label>
                        <input
                          type="email"
                          required
                          placeholder="you@domain.com"
                          value={checkoutForm.email}
                          onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})}
                          className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:border-indigo-500 font-medium transition ${isDark ? "bg-slate-950 border-slate-850 text-white placeholder-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"}`}
                        />
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${isDark ? "bg-slate-950/40 border-slate-850" : "bg-slate-100/40 border-slate-150"}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2.5 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-500" /> Secure Card Sandbox Protocol
                      </span>
                      <div className="space-y-3">
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Card Number"
                            value={checkoutForm.cardNumber}
                            onChange={e => setCheckoutForm({...checkoutForm, cardNumber: e.target.value})}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:border-indigo-500 font-mono transition ${isDark ? "bg-slate-950 border-slate-850 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            required
                            placeholder="Expiry MM/YY"
                            value={checkoutForm.cardExpiry}
                            onChange={e => setCheckoutForm({...checkoutForm, cardExpiry: e.target.value})}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:border-indigo-500 font-mono transition ${isDark ? "bg-slate-950 border-slate-850 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                          />
                          <input
                            type="text"
                            required
                            placeholder="CVC"
                            value={checkoutForm.cardCvc}
                            onChange={e => setCheckoutForm({...checkoutForm, cardCvc: e.target.value})}
                            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:border-indigo-500 font-mono transition ${isDark ? "bg-slate-950 border-slate-850 text-white" : "bg-slate-50 border-slate-200 text-slate-900"}`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-500" /> SSL 256-Bit Encrypted Secure Session</span>
                    <span>Stripe Standard API</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-center text-xs font-bold uppercase tracking-widest transition shadow-lg shadow-indigo-500/25 border border-indigo-550 cursor-pointer"
                  >
                    Confirm & Start Cluster Workspace
                  </button>
                </form>
              )}

              {checkoutStep === "submitting" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 shadow-md relative ${isDark ? "bg-slate-950 border-slate-800" : "bg-indigo-50/55 border-indigo-100"}`}>
                    <Loader className="w-7 h-7 text-indigo-500 animate-spin" />
                  </div>
                  <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold mb-1">Acquisition Pipeline</span>
                  <h4 className="text-base font-bold font-display tracking-tight">Verifying Credentials with Stripe...</h4>
                  <p className="text-[11px] text-slate-500 mt-2 max-w-xs leading-relaxed">
                    Executing test sandbox ledger entry for the {selectedPlan.name}. This is fully integrated with mockup databases.
                  </p>
                </div>
              )}

              {checkoutStep === "confirmed" && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 mx-auto">
                    <CheckCircle className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[10px] text-emerald-500 font-mono tracking-widest uppercase font-bold">Successfully Subscribed</span>
                    <h4 className="text-lg font-bold font-display tracking-tight mt-1">
                      Welcome to {selectedPlan.name}!
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm mx-auto">
                      Your high-ingress semantic workspace token is active! A dummy receipt and custom SOC2 compliance certificate have been dispatched to <strong className="font-semibold">{checkoutForm.email || "your provided address"}</strong>.
                    </p>
                  </div>

                  <div className={`p-4 rounded-2xl border max-w-sm mx-auto text-left text-xs ${isDark ? "bg-slate-950 border-slate-850" : "bg-slate-50 border-slate-150"}`}>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block mb-2 font-mono">Next Conversion Steps</span>
                    <ul className="space-y-2 text-slate-400 leading-tight">
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Launch your first 4-node cluster</li>
                      <li className="flex gap-2 items-start"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Export compliant Markdown files</li>
                    </ul>
                  </div>

                  <button
                    onClick={resetCheckout}
                    className="w-full max-w-xs py-3 px-4 bg-slate-900 border border-slate-800 text-white rounded-xl text-center text-xs font-bold uppercase tracking-widest transition hover:bg-slate-800 cursor-pointer mx-auto block font-mono"
                  >
                    Return to Suite
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
