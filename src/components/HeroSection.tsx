import React from "react";
import { Phone, MessageSquare, ShieldCheck, Sparkles, Clock, CheckCircle2, MapPin } from "lucide-react";

interface HeroSectionProps {
  onStartDiagnosis: () => void;
  onLocateCenters: () => void;
  onBookVisit: () => void;
  onOpenBrandPage?: (brandName: string) => void;
  onViewAllBrands?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartDiagnosis,
  onLocateCenters,
  onBookVisit,
  onOpenBrandPage,
  onViewAllBrands,
}) => {
  return (
    <header className="relative bg-slate-50 border-b border-slate-200 py-12 md:py-20 px-4 md:px-8 text-center overflow-hidden">
      {/* Subtle background mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Verification badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-[#cc3333] border border-red-200 rounded-full text-xs font-black mb-6 tracking-wide shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#cc3333] animate-ping" />
          المركز الهندسي المعتمد | الإسكندرية والبحيرة وكفر الشيخ
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
          صيانة <span className="text-[#cc3333] underline underline-offset-8 decoration-4 decoration-amber-400>ا الاسكندرية</span> وكافة الماركات العالمية
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 font-medium leading-relaxed max-w-3xl mx-auto">
          بنية تحتية هندسية عالية الاعتمادية لصيانة الغسالات، الثلاجات، والديب فريزر بقطع غيار أصلية 100% وضمان كتابي معتمد بالمنزل فوراً مع تشخيص ذكي مدعوم بمحرك Google.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center max-w-2xl mx-auto mb-10">
          <a
            href="tel:01025946505"
            className="w-full sm:w-auto bg-[#cc3333] text-white px-7 py-3.5 rounded-2xl font-black text-sm md:text-base shadow-lg shadow-red-500/20 hover:bg-red-800 transition flex items-center justify-center gap-2.5"
          >
            <Phone className="w-4 h-4 animate-bounce" />
            <span>اتصال مباشر: 01025946505</span>
          </a>

          <a
            href="https://wa.me/201279177748?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D8%B2%D9%8A%D8%A7%D8%B1%D8%A9%20%D8%B5%D9%8A%D8%A7%D9%86%D8%A9%20%D9%85%D9%86%D8%B2%D9%84%D9%8A%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 text-white px-7 py-3.5 rounded-2xl font-black text-sm md:text-base shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-2.5"
          >
            <MessageSquare className="w-4 h-4" />
            <span>حجز عبر واتساب: 01279177748</span>
          </a>

          <button
            onClick={onStartDiagnosis}
            className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-sm md:text-base hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>تشخيص العطل بالـ AI</span>
          </button>
        </div>

        {/* Separate Brand Pages Quick Links */}
        {onOpenBrandPage && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs font-bold">
            <span className="text-slate-500 font-bold ml-1">تصفح الصفحات المخصصة للماركات:</span>
            {["توشيبا", "زانوسي", "بوش", "إل جي", "سامسونج", "شارب", "بيكو", "كريازي"].map((brandName) => (
              <button
                key={brandName}
                onClick={() => onOpenBrandPage(brandName)}
                className="px-3 py-1 bg-white hover:bg-red-50 text-slate-800 hover:text-[#cc3333] border border-slate-200 hover:border-red-300 rounded-xl transition shadow-2xs cursor-pointer"
              >
                صيانة {brandName}
              </button>
            ))}
            {onViewAllBrands && (
              <button
                onClick={onViewAllBrands}
                className="px-3 py-1 bg-red-50 text-[#cc3333] border border-red-200 rounded-xl hover:bg-red-100 transition"
              >
                + كل الـ 25 ماركة
              </button>
            )}
          </div>
        )}

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-right">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center text-[#cc3333] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-xs text-slate-800">قطع غيار أصلية 100%</div>
              <div className="text-[10px] text-slate-500 font-bold">بضمان كتابي معتمد</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-xs text-slate-800">استجابة فورية 24h</div>
              <div className="text-[10px] text-slate-500 font-bold">سيارات صيانة متنقلة</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-xs text-slate-800">23+ عاماً خبرة</div>
              <div className="text-[10px] text-slate-500 font-bold">كوادر هندسية معتمدة</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-xs text-slate-800">تغطية الإسكندرية والدلتا</div>
              <div className="text-[10px] text-slate-500 font-bold">سموحة، ميامي، البحيرة</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
