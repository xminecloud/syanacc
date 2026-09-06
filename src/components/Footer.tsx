import React from "react";
import { Phone, MessageSquare, ShieldCheck, MapPin, Mail, ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 pt-16 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-black italic tracking-tighter">
                <span className="text-amber-400">V</span>
                <span className="text-[#cc3333]">TEC</span>
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">syana.cc</span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              المركز الهندسي المعتمد لصيانة أجهزة توشيبا، زانوسي، بوش، وكافة الماركات العالمية بالإسكندرية والبحيرة وكفر الشيخ بقطع غيار أصلية وضمان كتابي.
            </p>

            <div className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ترخيص صيانة معتمد | كادر فني متخصص</span>
            </div>
          </div>

          {/* Col 2: Fast Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white border-b border-slate-800 pb-2">
              أرقام الطوارئ السريعة
            </h4>
            <div className="space-y-2.5">
              <a
                href="tel:01025946505"
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white font-mono transition"
              >
                <Phone className="w-4 h-4 text-[#cc3333]" />
                <span className="font-bold text-sm">01025946505</span>
                <span className="text-[10px] text-slate-500">(الخط الساخن)</span>
              </a>

              <a
                href="https://wa.me/201279177748"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-white font-mono transition"
              >
                <MessageSquare className="w-4 h-4 text-emerald-500" />
                <span className="font-bold text-sm">01279177748</span>
                <span className="text-[10px] text-slate-500">(واتساب الدعم)</span>
              </a>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Mail className="w-4 h-4 text-amber-500" />
                <span className="font-mono">sales@lanksh.com</span>
              </div>
            </div>
          </div>

          {/* Col 3: Coverage */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white border-b border-slate-800 pb-2">
              نطاق تغطية أسطول الصيانة
            </h4>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>الإسكندرية: سموحة، سيدي جابر، ميامي، المنتزة، العجمي</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>البحيرة: دمنهور، كفر الدوار، رشيد، أبو حمص</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>كفر الشيخ: عاصمة المحافظة والمراكز الرئيسية</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>الساحل الشمالي ومارينا خلال موسم الصيف</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Guaranteed Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-white border-b border-slate-800 pb-2">
              الضمان والجودة المعتمدة
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              جميع عمليات الصيانة تتم بفواتير رسمية مختومة وضمان كتابي ساري على قطع الغيار الأصلية المستبدلة مع متابعة دورية عبر الهاتف لضمان رضا العميل الكامل.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToTop}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                <span>العودة لأعلى الصفحة</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة لـ <span className="font-bold text-slate-400">VTEC الصيانة المعتمدة syana.cc</span> © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">سياسة الضمان</span>
            <span className="hover:text-slate-400 cursor-pointer">شروط الخدمة</span>
            <span className="hover:text-slate-400 cursor-pointer">الموثوقية الهندسية</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
