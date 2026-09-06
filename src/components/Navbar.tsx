import React from "react";
import { Phone, MessageSquare, Wrench, ShieldCheck, Calendar, MapPin, Search, BarChart3 } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookNow: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onBookNow }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3 px-4 md:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
          <div className="flex items-center">
            <span className="text-3xl md:text-4xl font-black italic tracking-tighter">
              <span className="text-amber-400">V</span>
              <span className="text-[#cc3333]">TEC</span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400 border-r border-slate-300 pr-3 mr-1">
            syana.cc
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 font-bold text-slate-700 text-xs xl:text-sm">
          <button
            onClick={() => setActiveTab("home")}
            className={`transition hover:text-[#cc3333] ${activeTab === "home" ? "text-[#cc3333] font-black" : ""}`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => setActiveTab("ai-diagnose")}
            className={`flex items-center gap-1.5 transition hover:text-[#cc3333] ${activeTab === "ai-diagnose" ? "text-[#cc3333] font-black" : ""}`}
          >
            <Search className="w-3.5 h-3.5 text-[#cc3333]" />
            تشخيص الأعطال بالذكاء الاصطناعي
          </button>
          <button
            onClick={() => setActiveTab("ai-map")}
            className={`flex items-center gap-1.5 transition hover:text-[#cc3333] ${activeTab === "ai-map" ? "text-[#cc3333] font-black" : ""}`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            المراكز والأسطول
          </button>
          <button
            onClick={() => setActiveTab("brands")}
            className={`transition hover:text-[#cc3333] ${activeTab === "brands" ? "text-[#cc3333] font-black" : ""}`}
          >
            دليل الماركات الـ 25
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`flex items-center gap-1.5 transition hover:text-[#cc3333] ${activeTab === "booking" ? "text-[#cc3333] font-black" : ""}`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            الحجز والتقويم
          </button>
          <button
            onClick={() => setActiveTab("portal-summary")}
            className={`flex items-center gap-1.5 transition hover:text-[#cc3333] ${activeTab === "portal-summary" ? "text-[#cc3333] font-black" : ""}`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            بوابة البلاغات
          </button>
          <button
            onClick={() => setActiveTab("inspection")}
            className={`flex items-center gap-1.5 transition hover:text-[#cc3333] ${activeTab === "inspection" ? "text-[#cc3333] font-black" : ""}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            استمارة الفحص
          </button>
        </div>

        {/* Quick Contact & Action Buttons */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href="https://wa.me/201279177748"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-emerald-600 text-white px-3.5 py-2 rounded-full font-bold text-xs hover:bg-emerald-700 transition shadow"
            title="مراسلة واتساب"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="font-mono">01279177748</span>
          </a>

          <a
            href="tel:01025946505"
            className="bg-[#cc3333] text-white px-4 py-2 rounded-full font-black text-xs md:text-sm hover:bg-red-800 transition shadow flex items-center gap-2"
            title="اتصال هاتفي بالخط الساخن"
          >
            <Phone className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono">01025946505</span>
          </a>

          <button
            onClick={onBookNow}
            className="hidden md:inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs px-4 py-2 rounded-full transition shadow"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            طلب صيانة
          </button>
        </div>
      </div>
    </nav>
  );
};
