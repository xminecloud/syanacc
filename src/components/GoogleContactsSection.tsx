import React, { useState } from "react";
import { Users, Phone, MessageSquare, Download, ExternalLink, ShieldCheck, Check } from "lucide-react";

export const GoogleContactsSection: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  // Generate and download a standard .vcf (vCard) file
  const handleDownloadVCard = () => {
    const vCardData = `BEGIN:VCARD
VERSION:3.0
FN:مركز صيانة VTEC المعتمد (syana.cc)
ORG:VTEC Maintenance Engineering Alexandria
TEL;TYPE=WORK,VOICE:01025946505
TEL;TYPE=CELL,VOICE,MSG:01279177748
EMAIL:sales@lanksh.com
URL:https://syana.cc
ADR;TYPE=WORK:;;سموحة، شارع فوزي معاذ;الإسكندرية;;;مصر
NOTE:المركز المعتمد لصيانة توشيبا وزانوسي وبوش والأجهزة المنزلية بالإسكندرية والبحيرة وكفر الشيخ. خدمة 24 ساعة.
END:VCARD`;

    const blob = new Blob([vCardData], { type: "text/vcard;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "VTEC_Maintenance_Contacts.vcf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 4000);
  };

  return (
    <section id="contacts" className="py-16 px-4 md:px-8 bg-slate-50 scroll-mt-16 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-black mb-3">
            <Users className="w-3.5 h-3.5" />
            تكامل جهات الاتصال (Google Contacts)
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic mb-4 text-slate-900">
            حفظ أرقام طوارئ الصيانة والخط الساخن
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            احفظ جهات اتصال مهندسي VTEC المعتمدين مباشرة على هاتفك أو في حساب Google Contacts لتسهيل الاتصال وقت الأعطال الطارئة.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Contact Card 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-[#cc3333] font-black">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">الخط الساخن المركزي المعتمد</h4>
                  <div className="text-xs text-slate-500 font-bold">طوارئ صيانة الإسكندرية والبحيرة</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-[#cc3333]">
                24/7 متاح
              </span>
            </div>

            <div className="font-mono text-2xl font-black text-slate-900 tracking-wider">
              01025946505
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              استقبال بلاغات الأعطال العاجلة، مشاكل تسريب المياه، توقف التبريد المفاجئ، وأعطال لوحات التحكم الإلكترونية.
            </p>

            <a
              href="tel:01025946505"
              className="w-full bg-[#cc3333] hover:bg-red-800 text-white font-black py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>اتصال هاتفي فوري</span>
            </a>
          </div>

          {/* Contact Card 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">الدعم الفني والواتساب الرسمي</h4>
                  <div className="text-xs text-slate-500 font-bold">إرسال صور الأعطال وأكواد الشاشة</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700">
                رد فوري
              </span>
            </div>

            <div className="font-mono text-2xl font-black text-slate-900 tracking-wider">
              01279177748
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              أرسل صورة موديل الجهاز وكود العطل الظاهر على الشاشة لفحصها من مهندسي المركز وتحضير القطع البديلة فوراً.
            </p>

            <a
              href="https://wa.me/201279177748"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>مراسلة واتساب</span>
            </a>
          </div>
        </div>

        {/* Sync & Download Banner */}
        <div className="mt-8 bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start gap-2 font-black text-base text-amber-400">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              حفظ بطاقة جهات الاتصال VTEC (vCard / Contacts)
            </div>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              قم بتنزيل بطاقة جهة الاتصال لحفظ أرقام المركز وعناوين الورش المركزية بضغطة زر واحدة على هاتفك أو مزامنتها مع Google Contacts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadVCard}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs md:text-sm px-5 py-3 rounded-xl transition flex items-center gap-2 shadow"
            >
              {downloaded ? <Check className="w-4 h-4 text-emerald-800" /> : <Download className="w-4 h-4" />}
              <span>{downloaded ? "تم تنزيل البطاقة بنجاح!" : "تنزيل بطاقة vCard للهاتف"}</span>
            </button>

            <a
              href="https://contacts.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs md:text-sm px-4 py-3 rounded-xl transition flex items-center gap-1.5"
            >
              <span>فتح Google Contacts</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
