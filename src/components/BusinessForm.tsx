import { useState } from "react";
import { BusinessInput } from "../types";
import { Sparkles, Landmark, Coffee, HeartPulse, HardHat } from "lucide-react";

interface Props {
  onSubmit: (input: BusinessInput) => void;
  isLoading: boolean;
  isDark?: boolean;
}

const PRESETS = [
  {
    label: "Healthcare",
    icon: HeartPulse,
    data: {
      businessName: "SmileCraft Dental Clinic",
      businessType: "Dental Clinic",
      city: "Bengaluru",
      area: "Koramangala",
      services: "Dental Implants, Teeth Whitening, Root Canal, Cosmetic Dentistry",
      primaryKeyword: "best dental clinic in Bengaluru",
    }
  },
  {
    label: "Cafe / Hospitality",
    icon: Coffee,
    data: {
      businessName: "Artisanal Brew Roasters",
      businessType: "Specialty Coffee Shop",
      city: "Melbourne",
      area: "Fitzroy",
      services: "Single Origin Espresso, Pour Over, Cold Brew, Pastries",
      primaryKeyword: "best specialty coffee Fitzroy",
    }
  },
  {
    label: "Wellness & Spa",
    icon: Sparkles,
    data: {
      businessName: "Soma Ayurvedic Sanctuary",
      businessType: "Wellness Spa",
      city: "Kochi",
      area: "Fort Kochi",
      services: "Abhyanga Massage, Panchakarma, Herbal Steam, Yoga",
      primaryKeyword: "authentic Ayurvedic therapy in Fort Kochi",
    }
  },
  {
    label: "Legal / Boutique Firm",
    icon: Landmark,
    data: {
      businessName: "Summit Law Partners",
      businessType: "Corporate Law Firm",
      city: "London",
      area: "Mayfair",
      services: "IP Licensing, Corporate Mergers, Tech Startup Legal Counsel",
      primaryKeyword: "boutique startup lawyers London",
    }
  },
  {
    label: "Home Services",
    icon: HardHat,
    data: {
      businessName: "VoltMaster Precision Electrical",
      businessType: "Electrical Services",
      city: "Austin",
      area: "Downtown",
      services: "EV Charger Installation, Smart Home Setup, Panel Upgrades",
      primaryKeyword: "electrician near Downtown Austin",
    }
  }
];

export function BusinessForm({ onSubmit, isLoading, isDark }: Props) {
  const [formData, setFormData] = useState<BusinessInput>({
    businessName: "SmileCraft Dental Clinic",
    businessType: "Dental Clinic",
    city: "Bengaluru",
    area: "Koramangala",
    services: "Implants, Teeth Whitening, Root Canal",
    primaryKeyword: "best dental clinic in Bengaluru",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const applyPreset = (presetData: BusinessInput) => {
    setFormData(presetData);
  };

  return (
    <div className={`p-8 rounded-xl border shadow-sm relative overflow-hidden transition-colors duration-200 ${isDark ? "bg-slate-950 border-slate-800" : "bg-white border-slate-200"}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
      
      {/* Quick Play Presets */}
      <div className="mb-8">
        <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          Instant Business Profiles
        </h4>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p.data)}
                className={`flex items-center gap-2 text-xs border rounded-lg font-medium transition cursor-pointer px-3.5 py-2 ${isDark ? "border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:border-slate-700" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-neutral-100"}`}
              >
                <Icon className="w-3.5 h-3.5 text-slate-400" />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 ${isDark ? "text-slate-200" : "text-slate-900"}`}>Business Details Configuration</h3>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Business Name</label>
            <input
              type="text"
              name="businessName"
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Business Type</label>
            <input
              type="text"
              name="businessType"
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.businessType}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>City</label>
            <input
              type="text"
              name="city"
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Area / Neighbourhood</label>
            <input
              type="text"
              name="area"
              className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
              value={formData.area}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Core Services</label>
          <input
            type="text"
            name="services"
            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
            value={formData.services}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className={`block text-[10px] uppercase tracking-widest font-bold mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Primary Keyword Goal</label>
          <input
            type="text"
            name="primaryKeyword"
            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 transition-all text-xs font-medium ${isDark ? "bg-slate-900 border border-slate-800 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
            value={formData.primaryKeyword}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={() => onSubmit(formData)}
          disabled={isLoading}
          className="w-full mt-6 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-4 rounded font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Executing Strategy..." : "Deploy Content Cluster"}
        </button>
      </div>
    </div>
  );
}
