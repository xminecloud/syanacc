import React, { useState } from "react";
import { MapPin, Navigation, ExternalLink, RefreshCw, AlertTriangle, ShieldCheck, Car } from "lucide-react";
import { MapLocationResult } from "../types";

export const AiMapLocatorSection: React.FC = () => {
  const [region, setRegion] = useState("الإسكندرية");
  const [neighborhood, setNeighborhood] = useState("سموحة");
  const [brand, setBrand] = useState("توشيبا");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MapLocationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const neighborhoodsByRegion: Record<string, string[]> = {
    الإسكندرية: [
      "سموحة",
      "سيدي جابر",
      "المنتزة",
      "ميامي",
      "العصافرة",
      "محرم بك",
      "السيوف",
      "الإبراهيمية",
      "العجمي والهانوفيل",
      "لوران",
      "كفر عبده",
      "الساحل الشمالي",
    ],
    "البحيرة (دمنهور / كفر الدوار)": [
      "دمنهور",
      "كفر الدوار",
      "أبو حمص",
      "إيتاي البارود",
      "رشيد",
      "كوم حمادة",
    ],
    "كفر الشيخ": [
      "مدينة كفر الشيخ",
      "الحامول",
      "دسوق",
      "فوه",
      "بلطيم",
      "سيدي سالم",
    ],
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg("المتصفح لا يدعم تحديد الموقع الجغرافي التلقائي.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setErrorMsg("");
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err);
        setErrorMsg("تعذر الحصول على إحداثيات GPS، سيتم استخدام اسم الحي المحدد يدوياً.");
      }
    );
  };

  const handleLocate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/locate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          neighborhood,
          brand,
          lat: userCoords?.lat,
          lng: userCoords?.lng,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult({
          report: data.report,
          mapLinks: data.mapLinks || [],
        });
      } else {
        setErrorMsg(data.error || "تعذر تحديد الموقع الجغرافي.");
      }
    } catch (err) {
      setErrorMsg("حدث خطأ أثناء الاتصال بخدمة الخرائط الذكية.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="ai-map" className="py-16 px-4 md:px-8 bg-slate-950 text-white scroll-mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full text-xs font-black mb-3">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            Gemini AI + Google Maps Grounding
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic mb-4">
            أسطول الانتشار الميداني ومراكز الصيانة المعتمدة
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            استعلام جغرافي دقيق عن أقرب نقطة دعم فني وسيارات الصيانة المتنقلة لماركة جهازك بالإسكندرية والمحافظات المجاورة.
          </p>
        </div>

        {/* Search / Selection Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl mb-10">
          <form onSubmit={handleLocate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">المحافظة / النطاق:</label>
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  const firstNeighbor = neighborhoodsByRegion[e.target.value]?.[0] || "";
                  setNeighborhood(firstNeighbor);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              >
                <option value="الإسكندرية">محافظة الإسكندرية</option>
                <option value="البحيرة (دمنهور / كفر الدوار)">محافظة البحيرة</option>
                <option value="كفر الشيخ">محافظة كفر الشيخ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الحي أو المركز:</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              >
                {(neighborhoodsByRegion[region] || []).map((n, i) => (
                  <option key={i} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">الماركة المستهدفة:</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-red-500"
              >
                <option value="توشيبا">توشيبا (Toshiba)</option>
                <option value="زانوسي">زانوسي (Zanussi)</option>
                <option value="ويت وستنجهاوس">ويت وستنجهاوس</option>
                <option value="بوش">بوش (Bosch)</option>
                <option value="إل جي">إل جي (LG)</option>
                <option value="سامسونج">سامسونج (Samsung)</option>
                <option value="شارب وتورنيدو">شارب وتورنيدو</option>
                <option value="بيكو">بيكو (Beko)</option>
                <option value="هاير">هاير (Haier)</option>
                <option value="كافة الماركات">كافة الماركات المعتمدة</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#cc3333] hover:bg-red-800 disabled:opacity-50 text-white font-black py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 text-amber-400" />}
                <span>استعلام النطاق</span>
              </button>

              <button
                type="button"
                onClick={handleGetLocation}
                className={`p-3 rounded-xl border transition ${
                  userCoords ? "bg-emerald-900/50 border-emerald-600 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                }`}
                title="استخدام موقع GPS الحالي"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </form>

          {userCoords && (
            <div className="mt-3 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              تم تفعيل إحداثيات GPS الحالية لزيادة دقة البحث الجغرافي: ({userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)})
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Results Container */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Map Report */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">تقرير أسطول الدعم الميداني</h3>
                <p className="text-xs text-slate-400">النطاق: {neighborhood}، {region}</p>
              </div>
            </div>

            {result ? (
              <>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium">
                  {result.report}
                </div>

                {result.mapLinks && result.mapLinks.length > 0 && (
                  <div className="border-t border-slate-800 pt-4">
                    <div className="text-xs font-bold text-emerald-400 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      روابط المواقع المعتمدة على Google Maps:
                    </div>
                    <div className="space-y-2">
                      {result.mapLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs text-white transition font-bold"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            {link.title || "موقع المركز على خرائط Google"}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-400 text-sm leading-relaxed space-y-3">
                <p>
                  نغطي محافظة الإسكندرية بالكامل (من أبو قير حتى الساحل الشمالي)، بالإضافة إلى مراكز محافظة البحيرة (دمنهور، كفر الدوار) وكفر الشيخ بأسطول متحرك مجهز بأحدث أجهزة الفحص الرقمي وقطع الغيار الأصلية.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
                    <span className="block text-2xl font-black text-amber-400 font-mono">100%</span>
                    <span className="text-[11px] text-slate-400 font-bold">تغطية أحياء الإسكندرية</span>
                  </div>
                  <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-center">
                    <span className="block text-2xl font-black text-emerald-400 font-mono">45-90</span>
                    <span className="text-[11px] text-slate-400 font-bold">دقيقة متوسط الاستجابة</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Alexandria Map */}
          <div className="overflow-hidden rounded-3xl border border-slate-800 shadow-2xl h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d436402.7788537554!2d29.8327918!3d31.2000924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c49126710fd3%3A0xb4a0c554b1d86013!2sAlexandria%2C%20Egypt!5e0!3m2!1sen!2seg!4v1715456000000!5m2!1sen!2seg"
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              title="خريطة انتشار مراكز VTEC بالإسكندرية والبحيرة"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
