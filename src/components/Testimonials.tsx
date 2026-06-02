import { motion } from "motion/react";
import { Star, MessageCircle, ArrowUpRight } from "lucide-react";

interface TestimonialsProps {
  isDark: boolean;
}

export function Testimonials({ isDark }: TestimonialsProps) {
  const reviews = [
    {
      quote: "We were historically buying AdWords for 'Emergency Orthodontist' costing us $24/click in Boston. We deployed exactly one Semantic Local Group using this generator, and inside 6 weeks we climbed to Rank #2 completely organically. This completely revolutionized our digital acquisition.",
      author: "Dr. Alistair Vance",
      role: "Medical Director, DentalCare Premium",
      metric: "+320% Inbound Leads",
      time: "45 Days",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200",
    },
    {
      quote: "Managing SEO portfolios for 14 different regional renovation contractors used to take me hours of keyword mapping. Now, I simply load the business type and zip code, generate the cluster links, review the EEAT guidelines, and copy the markup directly. Client organic growth averages 4x.",
      author: "Devon McKenzie",
      role: "SEO Architect, Apex Agency Studio",
      metric: "72 Hours Draft Turnover",
      time: "Saved 20hrs/wk",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    {
      quote: "I was skeptical about AI-generated SEO content. But the semantic bidirection linkage constructed here is brilliant. Search engines read it as dense, valuable documentation. Our boutique hotel portfolio organic bookings rose by 82% in a highly competitive metro area.",
      author: "Elena Petrova",
      role: "Head of Marketing, Grand Vista Inns",
      metric: "+82% Organic Bookings",
      time: "60 Days",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    }
  ];

  return (
    <div className="pt-16 border-t border-slate-150 dark:border-slate-850">
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-[10px] text-indigo-500 font-mono tracking-widest uppercase font-bold">Proof of Authority</span>
        <h3 className={`text-2xl font-light font-display mt-2 tracking-tight ${isDark ? "text-slate-100" : "text-slate-900"}`}>
          Partner Success Metrics
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Read how real-world marketers, business owners, and agency web designers utilize programmatic semantic structures to dominate regional SERPs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 ${
              isDark ? "bg-slate-950 border-slate-850/80" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div>
              {/* Star rating alignment */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-450 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className={`text-xs leading-relaxed italic mb-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                "{review.quote}"
              </blockquote>
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-900 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={review.image}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-205 dark:border-slate-800"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className={`text-xs font-bold leading-none ${isDark ? "text-slate-200" : "text-slate-850"}`}>
                    {review.author}
                  </h5>
                  <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                    {review.role}
                  </span>
                </div>
              </div>

              {/* Dynamic Metric Sticker */}
              <div className={`p-2 rounded-xl flex items-center justify-between border ${isDark ? "bg-slate-900/40 border-slate-800/85" : "bg-slate-50 border-slate-150"}`}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? "text-slate-350" : "text-slate-700"}`}>
                    {review.metric}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-slate-550 uppercase font-semibold">
                  {review.time}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
