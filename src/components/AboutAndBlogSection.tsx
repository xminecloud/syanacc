import React from "react";
import { Award, ShieldCheck, CheckCircle2, BookOpen, ArrowLeft, Waves, Cpu, Sparkles } from "lucide-react";

export const AboutAndBlogSection: React.FC = () => {
  const articles = [
    {
      title: "تأثير ملوحة ورطوبة هواء الإسكندرية على الأجهزة وطرق حمايتها",
      category: "وقاية هندسية",
      icon: Waves,
      excerpt:
        "تتعرض الأجهزة المنزلية بالمناطق الساحلية (ميامي، المنتزة، العجمي) لتآكل صليبة الغسالة وتكثف الرطوبة على كروت الباور. نوضح هنا إجراءات العزل المعتمدة لحماية جهازك.",
    },
    {
      title: "محركات الإنفرتر الرقمية (Inverter) مقابل المواتير التقليدية",
      category: "تكنولوجيا الأجهزة",
      icon: Cpu,
      excerpt:
        "تحليل هندسي لكيفية عمل كروت الإنفرتر في خفض استهلاك الطاقة بنسبة 40% وضمان عدم اهتزاز الغسالات والثلاجات، ومحاذير التعامل مع ذبذبات التيار.",
    },
    {
      title: "دليل التمييز بين قطع الغيار الأصلية 100% والمقلدة تجارياً",
      category: "إرشادات الجودة",
      icon: ShieldCheck,
      excerpt:
        "لماذا نحرص في VTEC على تركيب القطع بباركود المصنع فقط؟ الفارق في عمر رولمان البلي الأصلي وضواغط التبريد وكيف تضمن حقك بالضمان الكتابي.",
    },
  ];

  return (
    <section id="about" className="py-16 px-4 md:px-8 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* About Us Block */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-50 text-[#cc3333] border border-red-200 rounded-full text-xs font-black">
              <Award className="w-3.5 h-3.5" />
              المركز الهندسي المتخصص بالإسكندرية (syana.cc)
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic text-slate-900 leading-tight">
              أكثر من 23 عاماً من التميز في هندسة صيانة الأجهزة المنزلية
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              تأسس مركز VTEC لتقديم خدمة صيانة ترتقي للمعايير العالمية في الإسكندرية ومحافظات الدلتا. نؤمن بأن الصيانة المنزلية الصحيحة تبدأ من التشخيص الدقيق بأحدث أجهزة قياس التردد والفحص الرقمي، وتكتمل بقطع غيار أصلية مستوردة بضمان معتمد.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-black text-2xl text-[#cc3333] font-mono">100%</div>
                <div className="text-xs font-bold text-slate-700 mt-1">صيانة فورية بالمنزل</div>
                <div className="text-[10px] text-slate-500">دون نقل الجهاز إلا للضرورة القصوى</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="font-black text-2xl text-emerald-600 font-mono">12 شهر</div>
                <div className="text-xs font-bold text-slate-700 mt-1">ضمان كتابي معتمد</div>
                <div className="text-[10px] text-slate-500">على القطع المستبدلة والمصنعية</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 md:p-10 rounded-3xl shadow-xl space-y-6">
            <h3 className="text-xl font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              لماذا يثق بنا أكثر من 45,000 عميل؟
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">كوادر هندسية مدربة</div>
                  <div className="text-xs text-slate-400">مهندسون وفنيون معتمدون في صيانة أحدث موديلات الإنفرتر والكروت الذكية.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">أسطول سيارات مجهز بالكامل</div>
                  <div className="text-xs text-slate-400">سيارات صيانة متنقلة مزودة بمخزون قطع الغيار الأصلية لتنفيذ الصيانة في نفس اليوم.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">التزام تسعيري وشفافية كاملة</div>
                  <div className="text-xs text-slate-400">فحص الجهاز وتحديد التكلفة وقطع الغيار المطلوبة قبل البدء في أي عمل مع فاتورة رسمية.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Blog / Articles Section */}
        <div className="pt-8 border-t border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-black mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              المدونة الهندسية والإرشادات التوعوية
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">
              نصائح الخبراء للحفاظ على الأجهزة المنزلية
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((art, idx) => {
              const IconComponent = art.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:shadow-md transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#cc3333] bg-red-100/60 px-2.5 py-0.5 rounded-full">
                        {art.category}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                        <IconComponent className="w-4 h-4 text-[#cc3333]" />
                      </div>
                    </div>

                    <h4 className="font-black text-base text-slate-900 leading-snug">
                      {art.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 text-xs font-bold text-[#cc3333] flex items-center gap-1">
                    <span>قراءة التقرير الهندسي</span>
                    <ArrowLeft className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
