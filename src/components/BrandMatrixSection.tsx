import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, ChevronLeft, Wrench, ShieldCheck, Sparkles } from "lucide-react";
import { BRANDS_LIST } from "../data/brandsData";
import { Brand } from "../types";

interface BrandMatrixSectionProps {
  onSelectBrandForBooking: (brandName: string) => void;
  onDiagnoseBrand: (brandName: string) => void;
  onOpenBrandPage: (brand: Brand) => void;
}

export const BrandMatrixSection: React.FC<BrandMatrixSectionProps> = ({
  onSelectBrandForBooking,
  onDiagnoseBrand,
  onOpenBrandPage,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [expandedBrand, setExpandedBrand] = useState<string | null>("توشيبا");

  const categories = ["الكل", "ياباني", "ألماني", "إيطالي", "أمريكي", "محلي"];

  const filteredBrands = useMemo(() => {
    return BRANDS_LIST.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.desc.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === "الكل" || b.category.includes(selectedCategory);

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <section id="brands" className="py-16 px-4 md:px-8 bg-slate-50 scroll-mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-[#cc3333] border border-red-200 rounded-full text-xs font-black mb-3">
            <Wrench className="w-3.5 h-3.5" />
            تغطية شاملة لـ 25+ ماركة عالمية
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic mb-4 text-slate-900">
            مصفوفة ومراكز صيانة الماركات المعتمدة بالإسكندرية
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            مهندسون معتمدون وقطع غيار أصلية لكل ماركة مع كتالوجات تشخيص مبرمجة لبيئة التشغيل المصرية الساحلية.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedCategory === cat
                    ? "bg-[#cc3333] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              placeholder="ابحث عن ماركتك (توشيبا، زانوسي، بوش...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-red-500 shadow-sm"
            />
          </div>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBrands.map((b) => {
            const isExpanded = expandedBrand === b.name;
            return (
              <div
                key={b.name}
                className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden ${
                  isExpanded ? "border-[#cc3333] ring-1 ring-[#cc3333]/20" : "border-slate-200"
                }`}
              >
                <div
                  className="p-5 cursor-pointer flex items-center justify-between"
                  onClick={() => setExpandedBrand(isExpanded ? null : b.name)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-800 text-sm">
                      {b.englishName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900 text-base">{b.name}</h3>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          {b.englishName}
                        </span>
                      </div>
                      <span className="inline-block text-[10px] font-bold text-[#cc3333] bg-red-50 px-2 py-0.5 rounded-md mt-0.5">
                        {b.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4 text-right animate-in fade-in">
                    <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>

                    <div>
                      <span className="text-[11px] font-black text-slate-800 block mb-2 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        أبرز الأعطال التي نقوم بحلها:
                      </span>
                      <ul className="space-y-1.5">
                        {b.commonFaults.map((f, i) => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenBrandPage(b)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <span>فتح صفحة صيانة {b.name} المستقلة</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectBrandForBooking(b.name)}
                          className="flex-1 bg-[#cc3333] hover:bg-red-800 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          حجز صيانة {b.name}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDiagnoseBrand(b.name)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3 py-2 rounded-xl transition flex items-center justify-center gap-1"
                          title="فحص أكواد الأعطال بالذكاء الاصطناعي"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          فحص
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
