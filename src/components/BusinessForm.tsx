import { useState } from "react";
import { motion } from "motion/react";
import { BusinessInput } from "../types";
import { 
  Sparkles, 
  Landmark, 
  Coffee, 
  HeartPulse, 
  HardHat, 
  FileEdit, 
  Check, 
  MessageSquare, 
  Users, 
  Layers, 
  Settings2,
  ArrowRight
} from "lucide-react";

interface Props {
  onSubmit: (input: BusinessInput) => void;
  isLoading: boolean;
  isDark?: boolean;
}

const PRESETS = [
  {
    label: "Healthcare",
    icon: HeartPulse,
    color: "text-rose-500",
    data: {
      businessName: "SmileCraft Dental Clinic",
      businessType: "Dental Clinic",
      city: "Bengaluru",
      area: "Koramangala",
      services: "Dental Implants, Teeth Whitening, Root Canal, Cosmetic Dentistry",
      primaryKeyword: "best dental clinic in Bengaluru",
      toneOfVoice: "Authoritative / Expert",
      intendedAudience: "Urban professionals and families seeking premium dental care",
      contentDepth: "Comprehensive Focus"
    }
  },
  {
    label: "Cafe / Hospitality",
    icon: Coffee,
    color: "text-amber-600",
    data: {
      businessName: "Artisanal Brew Roasters",
      businessType: "Specialty Coffee Shop",
      city: "Melbourne",
      area: "Fitzroy",
      services: "Single Origin Espresso, Pour Over, Cold Brew, Pastries",
      primaryKeyword: "best specialty coffee Fitzroy",
      toneOfVoice: "Conversational / Friendly",
      intendedAudience: "Coffee connoisseurs, remote developers, and local cafe lovers",
      contentDepth: "Standard Focus"
    }
  },
  {
    label: "Wellness & Spa",
    icon: Sparkles,
    color: "text-emerald-500",
    data: {
      businessName: "Soma Ayurvedic Sanctuary",
      businessType: "Wellness Spa",
      city: "Kochi",
      area: "Fort Kochi",
      services: "Abhyanga Massage, Panchakarma, Herbal Steam, Yoga",
      primaryKeyword: "authentic Ayurvedic therapy in Fort Kochi",
      toneOfVoice: "Educational / Analytical",
      intendedAudience: "Wellness travelers and health-conscious local residents",
      contentDepth: "Comprehensive Focus"
    }
  },
  {
    label: "Legal / Corporate",
    icon: Landmark,
    color: "text-blue-500",
    data: {
      businessName: "Summit Law Partners",
      businessType: "Corporate Law Firm",
      city: "London",
      area: "Mayfair",
      services: "IP Licensing, Corporate Mergers, Tech Startup Legal Counsel",
      primaryKeyword: "boutique startup lawyers London",
      toneOfVoice: "Authoritative / Expert",
      intendedAudience: "Tech startup founders, venture capitalists, and brand owners",
      contentDepth: "Standard Focus"
    }
  },
  {
    label: "Home Maintenance",
    icon: HardHat,
    color: "text-violet-500",
    data: {
      businessName: "VoltMaster Precision Electrical",
      businessType: "Electrical Services",
      city: "Austin",
      area: "Downtown",
      services: "EV Charger Installation, Smart Home Setup, Panel Upgrades",
      primaryKeyword: "electrician near Downtown Austin",
      toneOfVoice: "Conversational / Friendly",
      intendedAudience: "Local residential properties, landlords, and tech homeowners",
      contentDepth: "Short Focus"
    }
  }
];

export function BusinessForm({ onSubmit, isLoading, isDark }: Props) {
  const [formData, setFormData] = useState<BusinessInput>({
    businessName: "SmileCraft Dental Clinic",
    businessType: "Dental Clinic",
    city: "Bengaluru",
    area: "Koramangala",
    services: "Dental Implants, Teeth Whitening, Root Canal",
    primaryKeyword: "best dental clinic in Bengaluru",
    toneOfVoice: "Authoritative / Expert",
    intendedAudience: "Urban professionals and families seeking premium dental care",
    contentDepth: "Comprehensive Focus"
  });
  
  const [activePreset, setActivePreset] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setActivePreset(null); // Clear active preset label tag when custom input is changed
  };

  const applyPreset = (presetData: BusinessInput, index: number) => {
    setFormData(presetData);
    setActivePreset(index);
  };

  return (
    <div className={`p-8 rounded-2xl border shadow-md relative overflow-hidden transition-all duration-300 ${isDark ? "bg-slate-950 border-slate-800 shadow-slate-950/40" : "bg-white border-slate-200"}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
      
      {/* Quick Play Presets */}
      <div className="mb-8">
        <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3.5 flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse shrink-0" />
          Fast Configuration Profiles
        </h4>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => {
            const Icon = p.icon;
            const isSelected = activePreset === idx;
            return (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => applyPreset(p.data, idx)}
                className={`flex items-center gap-2 text-xs border rounded-xl font-medium transition-all duration-200 cursor-pointer px-3.5 py-2.5 relative overflow-hidden ${isSelected 
                  ? (isDark ? "bg-indigo-950 border-indigo-750 text-slate-100" : "bg-indigo-50 border-indigo-200 text-indigo-850") 
                  : (isDark ? "border-slate-850 bg-slate-900/60 text-slate-350 hover:bg-slate-850 hover:border-slate-700" : "border-slate-150 bg-slate-50 text-slate-700 hover:bg-slate-100")
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${p.color}`} />
                {p.label}
                {isSelected && (
                  <motion.div 
                    layoutId="activePresetGlow"
                    className="absolute inset-0 border border-indigo-500 pointer-events-none rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Core Details Frame */}
      <div className="flex items-center gap-2 mb-6 border-b pb-3 border-slate-150 dark:border-slate-800">
        <FileEdit className="w-4 h-4 text-indigo-500" />
        <h3 className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-200" : "text-slate-800"}`}>
          Theme Target Matrix
        </h3>
      </div>
      
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Business Name</label>
            <input
              type="text"
              name="businessName"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Business Type</label>
            <input
              type="text"
              name="businessType"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.businessType}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>City Hub</label>
            <input
              type="text"
              name="city"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Area / Neighbourhood</label>
            <input
              type="text"
              name="area"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.area}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Core Offerings & Services</label>
          <input
            type="text"
            name="services"
            className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
            value={formData.services}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Primary Search Intent Keyword Target</label>
          <input
            type="text"
            name="primaryKeyword"
            className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-600" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
            value={formData.primaryKeyword}
            onChange={handleChange}
          />
        </div>

        {/* Premium Strategy Section */}
        <div className="pt-4 border-t border-slate-150 dark:border-slate-850">
          <div className="flex items-center gap-2 mb-5">
            <Settings2 className="w-4 h-4 text-indigo-500" />
            <h4 className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-slate-350" : "text-slate-600"}`}>
              Expert Engine Parameters
            </h4>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                Tone of Voice
              </label>
              <select
                name="toneOfVoice"
                value={formData.toneOfVoice || "Authoritative / Expert"}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium cursor-pointer ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              >
                <option value="Authoritative / Expert">Authoritative / Expert (EE AT Premium)</option>
                <option value="Conversational / Friendly">Conversational / Friendly (High CTR)</option>
                <option value="Educational / Analytical">Educational / Analytical (Detail Rich)</option>
                <option value="Creative / Narrative">Creative / Narrative (High Engagement)</option>
              </select>
            </div>

            <div>
              <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Campaign Target Depth
              </label>
              <select
                name="contentDepth"
                value={formData.contentDepth || "Comprehensive Focus"}
                onChange={handleChange}
                className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium cursor-pointer ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              >
                <option value="Short Focus">Short Focus (approx 800 words/node)</option>
                <option value="Standard Focus">Standard Focus (approx 1200 words/node)</option>
                <option value="Comprehensive Focus">Comprehensive Focus (approx 1800 words/node)</option>
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Intended Audience Profile
            </label>
            <input
              type="text"
              name="intendedAudience"
              placeholder="e.g. Wellness travelers and health-conscious local residents"
              className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-650" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.intendedAudience}
              onChange={handleChange}
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => onSubmit(formData)}
          disabled={isLoading}
          className="w-full mt-6 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-4 rounded-xl font-bold uppercase tracking-wider transition-colors shadow-md hover:shadow-indigo-500/10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full"
              />
              Sourcing Semantic Schema...
            </>
          ) : (
            <>
              Generate Topic Map & Articles
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
