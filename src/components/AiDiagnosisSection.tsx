import React, { useState } from "react";
import { Sparkles, Search, ExternalLink, AlertTriangle, ShieldCheck, Wrench, RefreshCw } from "lucide-react";
import { DiagnosticResult } from "../types";

interface AiDiagnosisSectionProps {
  onApplyToBooking?: (brand: string, appliance: string, notes: string) => void;
}

export const AiDiagnosisSection: React.FC<AiDiagnosisSectionProps> = ({ onApplyToBooking }) => {
  const [appliance, setAppliance] = useState("غسالة ملابس");
  const [brand, setBrand] = useState("توشيبا");
  const [errorCode, setErrorCode] = useState("");
  const [faultDescription, setFaultDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDiagnose = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance,
          brand,
          errorCode: errorCode.trim(),
          faultDescription: faultDescription.trim() || "صوت غير طبيعي أو توقف عن العمل",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          diagnosis: data.diagnosis,
          sources: data.sources || [],
        });
      } else {
        setErrorMsg(data.error || "تعذر إتمام التشخيص حالياً.");
      }
    } catch (err: any) {
      setErrorMsg("حدث خطأ أثناء الاتصال بمركز التشخيص الذكي. يرجى التأكد من اتصال الإنترنت.");
    } finally {
      setLoading(false);
    }
  };

  const sampleQuickCodes = [
    { label: "E1 توشيبا فوق أتوماتيك", code: "E1", brand: "توشيبا", app: "غسالة ملابس", desc: "عدم تصريف المياه" },
    { label: "E15 بوش غسالة أطباق", code: "E15", brand: "بوش", app: "غسالة أطباق", desc: "تسريب مياه في الحوض السفلي" },
    { label: "LE غسالة إل جي", code: "LE", brand: "إل جي", app: "غسالة ملابس", desc: "حمل زائد على محرك الدفع المباشر" },
    { label: "E40 زانوسي أتوماتيك", code: "E40", brand: "زانوسي", app: "غسالة ملابس", desc: "مشكلة في قفل الباب الكهربائي" },
  ];

  return (
    <section id="ai-diagnose" className="py-16 px-4 md:px-8 bg-slate-900 text-white scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-950/80 text-red-400 border border-red-800/60 rounded-full text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Gemini AI + Google Search Grounding
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic mb-4">
            التشخيص الهندسي الذكي للأعطال وكتالوجات الصيانة
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            فحص فوري لأكواد الأعطال ومشاكل الأجهزة المنزلية مستنداً إلى أحدث بيانات البحث المعتمدة وتقارير مهندسي VTEC بالإسكندرية.
          </p>
        </div>

        {/* Quick error code chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-bold text-slate-400 ml-2">أكواد شائعة للتجربة:</span>
          {sampleQuickCodes.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setBrand(s.brand);
                setAppliance(s.app);
                setErrorCode(s.code);
                setFaultDescription(s.desc);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs px-3 py-1.5 rounded-xl transition font-bold"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Diagnostic Form Box */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl mb-10">
          <form onSubmit={handleDiagnose} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">نوع الجهاز:</label>
                <select
                  value={appliance}
                  onChange={(e) => setAppliance(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="غسالة ملابس">غسالة ملابس أتوماتيك / فوق أتوماتيك</option>
                  <option value="ثلاجة نوفروست">ثلاجة نوفروست / دوبلكس</option>
                  <option value="ديب فريزر">ديب فريزر رأسي / أفقي</option>
                  <option value="غسالة أطباق">غسالة أطباق</option>
                  <option value="بوتاجاز">بوتاجاز أو فرن بلت إن</option>
                  <option value="تكييف">تكييف سبليت إنفرتر</option>
                  <option value="سخان مياه">سخان مياه غاز / كهرباء</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">الماركة:</label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="توشيبا">توشيبا (Toshiba)</option>
                  <option value="زانوسي">زانوسي (Zanussi)</option>
                  <option value="ويت وستنجهاوس">ويت وستنجهاوس (Westinghouse)</option>
                  <option value="بوش">بوش (Bosch)</option>
                  <option value="بيكو">بيكو (Beko)</option>
                  <option value="هاير">هاير (Haier)</option>
                  <option value="إل جي">إل جي (LG)</option>
                  <option value="سامسونج">سامسونج (Samsung)</option>
                  <option value="شارب">شارب (Sharp)</option>
                  <option value="تورنيدو">تورنيدو (Tornado)</option>
                  <option value="فريش">فريش (Fresh)</option>
                  <option value="يونيفرسال">يونيفرسال (Universal)</option>
                  <option value="ويرلبول">ويرلبول (Whirlpool)</option>
                  <option value="اريستون">اريستون (Ariston)</option>
                  <option value="كريازي">كريازي (Kiriazi)</option>
                  <option value="سيمنز">سيمنز (Siemens)</option>
                  <option value="جنرال اليكتريك">جنرال اليكتريك (GE)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">كود العطل في الشاشة (إن وجد):</label>
                <input
                  type="text"
                  placeholder="مثال: E1, E2, E15, LE, OE, 4E..."
                  value={errorCode}
                  onChange={(e) => setErrorCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-amber-300 focus:outline-none focus:border-red-500 placeholder:text-slate-600 uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">أعراض العطل والملاحظات:</label>
              <textarea
                rows={3}
                placeholder="صف العطل باختصار: مثلاً عدم تصريف المياه، صوت حكة بالماتور عند الدوران، تسريب مياه أسفل الغسالة، ثلج كثيف في الفريزر وضعف تبريد الكابينة..."
                value={faultDescription}
                onChange={(e) => setFaultDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 placeholder:text-slate-600"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#cc3333] hover:bg-red-800 disabled:opacity-50 text-white font-black py-3.5 px-8 rounded-2xl transition flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري البحث الهندسي والتحليل الذكي...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 text-amber-400" />
                    <span>بدء الفحص والتشخيص المعتمد</span>
                  </>
                )}
              </button>

              <div className="text-xs text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>نتائج فورية مستخرجة من كتالوجات الصيانة المعتمدة</span>
              </div>
            </div>
          </form>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Diagnostic Results Card */}
        {result && (
          <div className="bg-slate-800 border-2 border-red-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-700 pb-4 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center text-amber-400 font-black">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">تقرير التشخيص الفني المعتمد</h3>
                  <div className="text-xs text-slate-400 font-bold">
                    الجهاز: {appliance} | الماركة: {brand} {errorCode && `| كود: ${errorCode}`}
                  </div>
                </div>
              </div>

              {onApplyToBooking && (
                <button
                  type="button"
                  onClick={() => onApplyToBooking(brand, appliance, `كود: ${errorCode} - ${faultDescription}`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
                >
                  <Wrench className="w-4 h-4" />
                  حجز زيارة صيانة لهذا العطل فوراً
                </button>
              )}
            </div>

            {/* Markdown/Text Report Content */}
            <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line font-medium">
              {result.diagnosis}
            </div>

            {/* Grounding Sources (Google Search) */}
            {result.sources && result.sources.length > 0 && (
              <div className="border-t border-slate-700/80 pt-4 mt-6">
                <div className="text-xs font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  المصادر الرسمية وكتالوجات الأعطال المستند إليها (Google Search Grounding):
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.sources.map((src, index) => (
                    <a
                      key={index}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs px-3 py-1.5 rounded-lg transition"
                    >
                      <ExternalLink className="w-3 h-3 text-red-400" />
                      <span className="truncate max-w-xs">{src.title || src.uri}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
