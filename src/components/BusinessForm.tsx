import { useState } from "react";
import { BusinessInput } from "../types";

interface Props {
  onSubmit: (input: BusinessInput) => void;
  isLoading: boolean;
}

export function BusinessForm({ onSubmit, isLoading }: Props) {
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

  return (
    <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-8">Business Details Configuration</h3>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Business Name</label>
            <input
              type="text"
              name="businessName"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs text-slate-700 font-medium"
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Business Type</label>
            <input
              type="text"
              name="businessType"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs text-slate-700 font-medium"
              value={formData.businessType}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">City</label>
            <input
              type="text"
              name="city"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs text-slate-700 font-medium"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Area / Neighbourhood</label>
            <input
              type="text"
              name="area"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs text-slate-700 font-medium"
              value={formData.area}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Core Services</label>
          <input
            type="text"
            name="services"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs text-slate-700 font-medium"
            value={formData.services}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Primary Keyword Goal</label>
          <input
            type="text"
            name="primaryKeyword"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all text-xs text-slate-700 font-medium"
            value={formData.primaryKeyword}
            onChange={handleChange}
          />
        </div>

        <button
          onClick={() => onSubmit(formData)}
          disabled={isLoading}
          className="w-full mt-6 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-4 rounded font-bold uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Executing Strategy..." : "Deploy Content Cluster"}
        </button>
      </div>
    </div>
  );
}
