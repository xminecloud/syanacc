import React, { useState } from "react";
import { ClipboardCheck, CheckCircle2, AlertCircle, ShieldAlert, FileText, Send, ExternalLink } from "lucide-react";
import { InspectionItem } from "../types";

export const GoogleFormsSection: React.FC = () => {
  const [deviceModel, setDeviceModel] = useState("غسالة توشيبا فوق أتوماتيك 10 كجم");
  const [serialNumber, setSerialNumber] = useState("TSH-2024-9981X");
  const [inspectorName, setInspectorName] = useState("م. أحمد طارق (مهندس جودة VTEC)");
  const [customerName, setCustomerName] = useState("عميل الإسكندرية");
  const [notes, setNotes] = useState("تم استبدال طلمبة الطرد الأصلية واختبار دورة العصر بكفاءة 100%.");

  const [items, setItems] = useState<InspectionItem[]>([
    { id: "1", label: "فحص الدائرة الكهربائية وكارتة التحكم الرئيسية وتوافق الفولت 220V", checked: true, status: "good" },
    { id: "2", label: "قياس ضغط شحنة الفريون وسلامة مواسير التبريد من التسريب والصدأ الساحلي", checked: true, status: "good" },
    { id: "3", label: "اختبار ميكانيكا الحلة والمساعدين ورولمان البلي ومانع الاهتزاز", checked: true, status: "needs-repair" },
    { id: "4", label: "فحص طلمبة الطرد، خراطيم الصرف، ومصيدة الشوائب السفلية", checked: true, status: "good" },
    { id: "5", label: "معاينة كاوتش الباب المغناطيسي والعزل الحراري ضد الرطوبة", checked: true, status: "good" },
    { id: "6", label: "تشغيل دورة فحص تجريبية كاملة تحت الحمل والتأكد من هدوء الصوت", checked: true, status: "good" },
  ]);

  const [formGenerated, setFormGenerated] = useState(false);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );
  };

  const setItemStatus = (id: string, status: "good" | "needs-repair" | "critical") => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status } : it))
    );
  };

  return (
    <section id="inspection" className="py-16 px-4 md:px-8 bg-white scroll-mt-16 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-black mb-3">
            <ClipboardCheck className="w-3.5 h-3.5" />
            تكامل نماذج Google Forms والاستلام الهندسي
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic mb-4 text-slate-900">
            استمارة الفحص الفني وتقييم جودة الصيانة
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            نموذج الفحص الميداني الرقمي المعتمد من مهندسي VTEC لتوثيق حالة الجهاز، قياس معايير الجودة، وإصدار شهادة الضمان.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">طراز الجهاز والموديل:</label>
              <input
                type="text"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">الرقم التسلسلي (Serial No):</label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">اسم المهندس الفاحص:</label>
              <input
                type="text"
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900 font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">اسم العميل ورقم البلاغ:</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-900"
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#cc3333]" />
              بنود الفحص الهندسي المعتمد (6 محاور رقابية):
            </h4>

            <div className="space-y-3">
              {items.map((it) => (
                <div
                  key={it.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    it.checked ? "bg-white border-slate-200" : "bg-slate-100/70 border-dashed border-slate-300"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={it.checked}
                      onChange={() => toggleItem(it.id)}
                      className="w-5 h-5 accent-[#cc3333] rounded cursor-pointer"
                    />
                    <span className="text-xs md:text-sm font-bold text-slate-800">{it.label}</span>
                  </label>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setItemStatus(it.id, "good")}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                        it.status === "good" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "text-slate-400 hover:text-emerald-700"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      مطابق
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemStatus(it.id, "needs-repair")}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                        it.status === "needs-repair" ? "bg-amber-100 text-amber-800 border border-amber-300" : "text-slate-400 hover:text-amber-700"
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      إصلاح
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemStatus(it.id, "critical")}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                        it.status === "critical" ? "bg-red-100 text-red-800 border border-red-300" : "text-slate-400 hover:text-red-700"
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      تالف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">ملاحظات وشهادة الضمان المعتمد:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setFormGenerated(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs md:text-sm px-6 py-3 rounded-xl transition flex items-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>إصدار واعتماد نموذج الفحص</span>
              </button>
            </div>

            <a
              href="https://docs.google.com/forms/create"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1.5 hover:underline"
            >
              <span>فتح منشئ نماذج Google Forms</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Generated Form Receipt */}
          {formGenerated && (
            <div className="bg-purple-50 border-2 border-purple-400 p-5 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-purple-900 font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                <span>تم توثيق استمارة الفحص بنجاح برقم تسجيل معتمد: VTEC-QC-{(Math.random() * 10000).toFixed(0)}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                تم حفظ بيانات الفحص الفني لجهاز ({deviceModel}) تحت إشراف {inspectorName}. تم تفعيل فترة الضمان الكتابي المعتمدة لقطع الغيار الأصلية.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
