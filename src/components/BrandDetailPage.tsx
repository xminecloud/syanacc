import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Wrench,
  Phone,
  MessageSquare,
  Calendar,
  AlertTriangle,
  Cpu,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Search,
  Timer,
} from "lucide-react";
import { Brand, BookingTicket } from "../types";
import { BRANDS_LIST } from "../data/brandsData";

interface BrandDetailPageProps {
  brand: Brand;
  onBack: () => void;
  onSelectOtherBrand: (brand: Brand) => void;
  onBookVisit: (brandName: string, appliance: string, notes: string) => void;
  onStartDiagnosis: (brandName: string) => void;
}

// Detailed error codes and maintenance specs database per brand
const BRAND_TECHNICAL_SPECS: Record<
  string,
  {
    originBadge: string;
    flag: string;
    popularModels: string[];
    errorCodes: { code: string; meaning: string; cause: string; fix: string; part: string }[];
    coastalTips: string;
    warrantyMonths: number;
    inspectionPoints: string[];
  }
> = {
  توشيبا: {
    originBadge: "ياباني معتمد (توشيبا العربي)",
    flag: "🇯🇵",
    popularModels: [
      "غسالة فوق أتوماتيك 8 - 10 - 12 كجم",
      "غسالة نصف أتوماتيك بحوضين",
      "ثلاجة توشيبا نوفروست 2 و 3 باب (14 - 16 - 18 قدم)",
      "ديب فريزر توشيبا 4 و 5 درج إنفرتر",
      "غسالة أطباق توشيبا",
    ],
    errorCodes: [
      {
        code: "E1",
        meaning: "عطل تصريف المياه",
        cause: "انسداد طلمبة الطرد أو خرطوم الصرف أو عطل ميكانيكي بالطلمبة",
        fix: "تنظيف الفلتر السفلي واختبار جهد 220V على ملف الطلمبة واستبدالها عند التلف",
        part: "طلمبة طرد مياه توشيبا أصلية",
      },
      {
        code: "E2 / E21",
        meaning: "عطل مفتاح الباب أو قفل الأمان",
        cause: "تلف اللوك المغناطيسي أو عدم إغلاق الغطاء بإحكام أثناء العصر",
        fix: "فحص ميكرو-سويتش الأمان والأسلاك واستبدال حساس الباب",
        part: "مفتاح لوك باب توشيبا أصلي",
      },
      {
        code: "E23",
        meaning: "خلل قفل غطاء الحلة الإلكتروني",
        cause: "عطل في ريلاي القفل بكارتة التحكم",
        fix: "إعادة برمجة الكارتة وتغيير وحدة القفل الكهربية",
        part: "محبس قفل غطاء توشيبا ديجيتال",
      },
      {
        code: "Eb",
        meaning: "خلل كارتة التشغيل أو إمداد الطاقة",
        cause: "تذبذب التيار الكهربائي أو تلف مكثف الباور باللوحة",
        fix: "فحص منظم الجهد وتغيير مكثفات الباور أو استبدال الكارتة",
        part: "كارتة باور توشيبا مبرمجة",
      },
      {
        code: "C1",
        meaning: "ضعف أو انقطاع سحب مياه الغسيل",
        cause: "انسداد مصفاة صمام السحب أو تلف ملف الصمام",
        fix: "تنظيف فلاتر الدخول وقياس مقاومة ملف الصمام (4.5 kΩ)",
        part: "صمام دخول مياه مزدوج توشيبا",
      },
    ],
    coastalTips:
      "نظراً لرطوبة الإسكندرية والساحل، ينصح بوضع قاعدة مطاطية عازلة تحت غسالات وثلاجات توشيبا لمنع وصول الرطوبة والصدأ لأسفل الصاج، ورش كارتة الكهرباء بالورنيش العازل ضد الملوحة.",
    warrantyMonths: 12,
    inspectionPoints: [
      "فحص مساعدين الحلة وسوست التوازن لمنع الاهتزاز",
      "معايرة حساس منسوب المياه (البرشر Pressure Switch)",
      "فحص رولمان البلي وأويل سيل الحلة الداخلية",
      "قياس سحب أمبير ضاغط الثلاجة النوفروست",
    ],
  },
  زانوسي: {
    originBadge: "إيطالي شهير (إيديال زانوسي)",
    flag: "🇮🇹",
    popularModels: [
      "غسالة زانوسي أكواتك وجيت وكومفورت",
      "غسالة زانوسي بيرلا ماكس 7 - 8 كجم",
      "ثلاجات زانوسي جراند",
      "سخانات زانوسي ديجيتال غاز وكهرباء",
    ],
    errorCodes: [
      {
        code: "E40 / E41",
        meaning: "عطل قفل الباب الحراري (Door Lock)",
        cause: "تآكل بنز الباب أو تلف قفل PTC الإلكتروني",
        fix: "استبدال مقبض الباب وترموستات القفل وتوصيل التغذية",
        part: "لوك باب زانوسي حراري أصلي",
      },
      {
        code: "E20",
        meaning: "تأخر طرد المياه وتصريف الحلة",
        cause: "انسداد الفلتر بالخيوط أو توقف ريشة الطلمبة",
        fix: "تسليك الفلتر واختبار ملف الطلمبة واستبدالها",
        part: "طلمبة طرد زانوسي أصلية",
      },
      {
        code: "E10",
        meaning: "تأخر امتلاء الحلة بالمياه",
        cause: "ضعف ضغط صنبور المياه أو تلف الصمام المغناطيسي",
        fix: "فحص الصمام المزدوج وتنظيف المصفاة السلكية",
        part: "صمام دخول مياه زانوسي 2 مخرج",
      },
      {
        code: "E90",
        meaning: "فقدان برمجة كارتة التحكم الرئيسية",
        cause: "انقطاع مفاجئ للتيار أو شحنة استاتيكية",
        fix: "إعادة تحميل الفيرموير بالكود الهندسي لموديل الغسالة",
        part: "إعادة برمجة كارتة زانوسي",
      },
    ],
    coastalTips:
      "تتأثر غسالات زانوسي بالهواء المحمل باليود في أحياء المنتزه وميامي والعجمي؛ نوصي بتنظيف درج المسحوق دورياً بماء دافئ لمنع تكتل الأملاح وتآكل الوصلات.",
    warrantyMonths: 12,
    inspectionPoints: [
      "فحص شربون الموتور وحالة الكولكتور النحاسي",
      "اختبار ميكانيكا الحلة وصليبة الألمونيوم ضد التآكل",
      "معايرة سنسور السخان NTC وحساس الحرارة",
      "فحص كاوتشة الباب ومجرى تصريف المياه",
    ],
  },
  بوش: {
    originBadge: "ألماني فائق الدقة (Bosch Germany)",
    flag: "🇩🇪",
    popularModels: [
      "غسالات ملابس Bosch Serie 4 / 6 / 8",
      "غسالات أطباق Bosch SilencePlus",
      "ثلاجات بوش بنظام VitaFresh",
      "أفران ومسطحات بوش بلت إن",
    ],
    errorCodes: [
      {
        code: "E15",
        meaning: "تسريب مياه في الحوض السفلي (AquaStop Activated)",
        cause: "تجمع قطرات مياه في قاعدة الغسالة وتفعيل عوامة الأمان",
        fix: "تجفيف الحوض السفلي ومعالجة وصلات الخراطيم وموانع التسريب",
        part: "طقم جوانات وخراطيم AquaStop أصلية",
      },
      {
        code: "E18",
        meaning: "انسداد أو توقف مضخة تصريف المياه",
        cause: "جسم غريب في مروحة المضخة أو انسداد خرطوم الصرف",
        fix: "فك الغطاء السفلي وتنظيف غرفة المضخة واختبار الدوران",
        part: "مضخة طرد بوش Silence الأصلية",
      },
      {
        code: "E24",
        meaning: "عطل نظام تصريف غسالة الأطباق",
        cause: "عدم تدوير مياه الشطف أو انسداد صمام عدم الرجوع",
        fix: "تسليك صمام عدم الرجوع وتنظيف الفلاتر المعدنية",
        part: "صمام عدم رجوع بوش أصلي",
      },
      {
        code: "E22",
        meaning: "انسداد شبكة فلاتر الشطف الدقيقة",
        cause: "تراكم الدهون وبقايا الطعام على الشبك الدقيق",
        fix: "فك فلاتر الحوض وغسيلها بمحلول إزالة الدهون والخل",
        part: "طقم فلاتر بوش ستانلس ستيل",
      },
    ],
    coastalTips:
      "تعتمد أجهزة بوش على حساسات عالية الحساسية؛ يلزم استخدام منظم جهد كهربائي Stabilizer لحماية كارتات EcoSilence Drive من تذبذب تيار شبكة الكهرباء الساحلية.",
    warrantyMonths: 12,
    inspectionPoints: [
      "فحص حساسات AquaStop وعوامة الأمان السفلية",
      "معايرة ضغط طلمبة تدوير المياه ذات السخان المدمج Heat Pump",
      "فحص كارتة العاكس Inverter Board لموتور EcoSilence",
      "فحص رشاشات المياه العلوية والسفلية من الانسداد",
    ],
  },
  "إل جي": {
    originBadge: "كوري متطور (LG Electronics)",
    flag: "🇰🇷",
    popularModels: [
      "غسالات LG Direct Drive بالدفع المباشر 7 - 10.5 كجم",
      "غسالات LG AI DD الذكية بالبخار",
      "ثلاجات LG إنفرتر دور إن دور Door-in-Door",
      "غسالات أطباق LG QuadWash TrueSteam",
    ],
    errorCodes: [
      {
        code: "LE",
        meaning: "حمل زائد على محرك الدفع المباشر (Motor Overload)",
        cause: "تلف حساس هول (Hall Sensor) أو زيادة حمولة الملابس أو عطل بالمحرك",
        fix: "استبدال حساس السرعة Hall Sensor والتأكد من حرية دوران الحلة",
        part: "حساس سرعة محرك LG Hall Sensor أصلي",
      },
      {
        code: "OE",
        meaning: "عدم تصريف مياه الغسيل",
        cause: "انسداد خرطوم الطرد أو تلف ملف طلمبة الصرف",
        fix: "تنظيف الفلتر السفلي واستبدال طلمبة الطرد المعتمدة",
        part: "طلمبة طرد LG Direct Drive",
      },
      {
        code: "dE / dE1",
        meaning: "عطل إغلاق الباب الزجاجي",
        cause: "انحراف مفصلة الباب أو تلف قفل السولينويد",
        fix: "ضبط محاذاة الباب وتغيير قفل الباب الإلكتروني",
        part: "لوك باب LG أصلي",
      },
      {
        code: "CL",
        meaning: "تفعيل قفل أمان الأطفال (Child Lock)",
        cause: "تفعيل ميزة الحماية بالضغط المطول على زري القفل",
        fix: "الضغط لمدة 3 ثوان على الزر المخصص لإلغاء القفل",
        part: "إلغاء وضع الحماية عبر لوحة التحكم",
      },
    ],
    coastalTips:
      "تتميز مواتير LG Direct Drive بضمان 10 سنوات؛ وللحفاظ عليها بالإسكندرية ننصح بفحص رولمان البلي عند أدنى صوت طنين لمنع تسريب المياه إلى قلب ملفات الموتور.",
    warrantyMonths: 12,
    inspectionPoints: [
      "فحص ملفات الستاتور والروتور لموتور الدفع المباشر",
      "اختبار حساس الحركة وتوازن الحلة 6 Motion",
      "فحص دائرة البخار Steam Generator والتأكد من عدم وجود تكلسات",
      "فحص ضاغط Linear Inverter للثلاجة وقياس استهلاك الأمبير",
    ],
  },
  سامسونج: {
    originBadge: "كوري رقمي (Samsung Digital)",
    flag: "🇰🇷",
    popularModels: [
      "غسالات سامسونج EcoBubble و AddWash",
      "غسالات سامسونج الذكية بتقنية AI Control",
      "ثلاجات سامسونج Digital Inverter و Twin Cooling",
      "ديب فريزر سامسونج نوفروست",
    ],
    errorCodes: [
      {
        code: "4E / 4C",
        meaning: "انقطاع أو ضعف إمداد المياه",
        cause: "انسداد صمام السحب أو التواء خرطوم المياه المغذي",
        fix: "تنظيف المصفاة وفحص الصمام المغناطيسي المزدوج",
        part: "صمام دخول مياه سامسونج",
      },
      {
        code: "5E / 5C",
        meaning: "عطل في تصريف المياه",
        cause: "تراكم الشوائب في فلتر الطرد أو توقف محرك المضخة",
        fix: "تنظيف الفلتر السفلي واختبار المضخة",
        part: "طلمبة طرد مياه سامسونج",
      },
      {
        code: "dE / dC",
        meaning: "عطل قفل الباب أو مفتاح الأمان",
        cause: "تلف القفل الإلكتروني أو عدم غلق باب AddWash الصغير",
        fix: "فحص حساس باب AddWash وتغيير القفل الرئيسي",
        part: "مجموعة قفل باب سامسونج كاملة",
      },
      {
        code: "SUD",
        meaning: "رغوة زائدة داخل حلة الغسيل",
        cause: "استخدام مسحوق غير مخصص للأوتوماتيك أو كمية مفرطة",
        fix: "تشغيل دورة شطف وتصريف بدون مسحوق لتفريغ الرغوة",
        part: "إعادة ضبط الحساس والتوجيه بالمسحوق السليم",
      },
    ],
    coastalTips:
      "كارتات سامسونج الرقمية تحتاج حماية إضافية من الرطوبة والملوحة الساحلية؛ يوفر فريق VTEC تغليفاً إيبوكسياً عازلاً للكارتات للوقاية من التكثيف ورطوبة الشتاء السكندري.",
    warrantyMonths: 12,
    inspectionPoints: [
      "معايرة مولد الرغوة EcoBubble Generator",
      "فحص حساس الاهتزاز VRT Plus",
      "اختبار ضاغط Digital Inverter واللوحة العاكسة",
      "فحص نظام التبريد المزدوج Twin Cooling Plus في الثلاجات",
    ],
  },
};

export const BrandDetailPage: React.FC<BrandDetailPageProps> = ({
  brand,
  onBack,
  onSelectOtherBrand,
  onBookVisit,
  onStartDiagnosis,
}) => {
  const [selectedAppliance, setSelectedAppliance] = useState("غسالة ملابس");
  const [district, setDistrict] = useState("سموحة");
  const [city, setCity] = useState("الإسكندرية");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [faultNotes, setFaultNotes] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingTicketId, setBookingTicketId] = useState("");

  // Scroll to top on mount or brand change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [brand]);

  const specs = BRAND_TECHNICAL_SPECS[brand.name] || {
    originBadge: brand.category,
    flag: "🌍",
    popularModels: [
      `غسالة ملابس ${brand.name} أوتوماتيك وفوق أوتوماتيك`,
      `ثلاجة ${brand.name} نوفروست ديجيتال`,
      `ديب فريزر ${brand.name} رأسي وأفقي`,
      `غسالة أطباق ${brand.name}`,
    ],
    errorCodes: brand.commonFaults.map((f, i) => ({
      code: `F-${i + 1}`,
      meaning: f,
      cause: "استهلاك قطع التشغيل الميكانيكية أو تأثر كارتة التحكم بعوامل الرطوبة والحرارة",
      fix: "فحص هندسي شامل واستبدال القطع المتضررة بقطع أصلية معتمدة",
      part: `قطع غيار ${brand.name} أصلية بالضمان`,
    })),
    coastalTips: `تعتبر أجهزة ${brand.name} بحاجة لصيانة وقائية دورية في الإسكندرية ومحافظات الدلتا لحمايتها من التكثيف والأملاح الساحلية لضمان أطول عمر افتراضي.`,
    warrantyMonths: 12,
    inspectionPoints: [
      "فحص الدوائر الكهربائية والجهد الكهربائي",
      "معايرة الحساسات ومنظمات الحرارة والمياه",
      "فحص العوازل الميكانيكية ضد الصدأ الساحلي",
      "اختبار تجريبي كامل لدورة التشغيل",
    ],
  };

  const handleQuickBook = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNotes = faultNotes || `طلب صيانة ${brand.name} (${selectedAppliance}) - حي ${district}`;
    onBookVisit(brand.name, selectedAppliance, finalNotes);
    const mockId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingTicketId(mockId);
    setBookingSuccess(true);
  };

  const appliancesList = [
    "غسالة ملابس",
    "ثلاجة نوفروست",
    "ديب فريزر",
    "غسالة أطباق",
    "تكييف سبليت",
    "بوتاجاز أو فرن",
    "سخان مياه",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-['Cairo',sans-serif] pb-16">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-40 px-4 md:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 overflow-x-auto whitespace-nowrap">
            <button
              onClick={onBack}
              className="font-bold hover:text-[#cc3333] transition flex items-center gap-1 text-slate-500"
            >
              الرئيسية
            </button>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={onBack}
              className="font-bold hover:text-[#cc3333] transition text-slate-500"
            >
              دليل الماركات
            </button>
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-black text-[#cc3333]">
              صيانة {brand.name} ({brand.englishName})
            </span>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition shrink-0"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للمصفوفة العامة</span>
          </button>
        </div>
      </div>

      {/* Brand Hero Header */}
      <header className="relative bg-gradient-to-b from-white to-slate-100/70 border-b border-slate-200 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              {/* Country & Category Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-50 text-[#cc3333] border border-red-200">
                  <span className="text-base">{specs.flag}</span>
                  <span>{specs.originBadge}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>مركز صيانة معتمد - syana.cc</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  ضمان كتابي {specs.warrantyMonths} شهراً
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                مركز صيانة <span className="text-[#cc3333]">{brand.name}</span> المعتمد بالإسكندرية والبحيرة
              </h1>

              {/* English Subtitle */}
              <div className="text-xs sm:text-sm font-mono font-bold text-slate-400">
                Official Maintenance Service for {brand.englishName} Appliances | Alexandria, Beheira & Delta Fleet
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                {brand.desc} نقدم خدمة صيانة منزلية فورية بقطع غيار أصلية 100% مستوردة بالباركود، مهندسون متخصصون في تكنولوجيا {brand.name} مع سيارات مجهزة تغطي كافة أحياء الإسكندرية (سموحة، ميامي، المنتزه، لوران، العجمي) ودمنهور وكفر الشيخ.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:01025946505"
                  className="bg-[#cc3333] hover:bg-red-800 text-white px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4 animate-bounce" />
                  <span>الخط الساخن: 01025946505</span>
                </a>

                <a
                  href={`https://wa.me/201279177748?text=${encodeURIComponent(
                    `السلام عليكم مركز صيانة ${brand.name} VTEC، أود طلب زيارة صيانة منزلية معتمدة.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>واتساب طوارئ {brand.name}</span>
                </a>

                <button
                  onClick={() => onStartDiagnosis(brand.name)}
                  className="bg-slate-900 hover:bg-slate-800 text-amber-400 px-5 py-3 rounded-xl font-black text-xs sm:text-sm transition flex items-center gap-2 shadow"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>تشخيص أعطال {brand.name} بالذكاء الاصطناعي</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 lg:w-80 shrink-0">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#cc3333] flex items-center justify-center font-black text-lg border border-red-100">
                  {brand.englishName.charAt(0)}
                </div>
                <div>
                  <div className="font-black text-slate-900 text-base">{brand.name}</div>
                  <div className="text-xs text-slate-400 font-mono">{brand.englishName}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">زمن الاستجابة:</span>
                  <span className="font-mono font-bold text-slate-900">خلال 60 دقيقة</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">قطع الغيار:</span>
                  <span className="font-bold text-emerald-700">أصلية بالباركود</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">مكان الصيانة:</span>
                  <span className="font-bold text-blue-700">بالمنزل دون نقل</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-bold">شهادة الضمان:</span>
                  <span className="font-bold text-slate-900 font-mono">12 شهراً معتمد</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>سيارات متنقلة بجميع مناطق الإسكندرية والبحيرة</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-10 space-y-12">
        {/* Section 1: Appliances & Models Serviced */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#cc3333]" />
                الأجهزة والموديلات المشمولة في صيانة {brand.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                نوفر أحدث أجهزة الفحص المبرمجة لقراءة أعطال كافة موديلات {brand.name} الحديثة والقديمة.
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-red-50 text-[#cc3333] rounded-full border border-red-200">
              دعم فني معتمد 24/7
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.popularModels.map((model, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-red-300 transition space-y-2"
              >
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{model}</span>
                </div>
                <p className="text-[11px] text-slate-500 pr-6">
                  فحص الدوائر الكهربائية، استبدال القطع التالفة، وضبط المصنع بالضمان.
                </p>
              </div>
            ))}
          </div>

          {/* Coastal Engineering Recommendation Box */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 md:p-5 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs md:text-sm">
              <span className="font-black text-amber-900 block">
                توصية مهندسي VTEC لأجهزة {brand.name} في بيئة الإسكندرية الساحلية:
              </span>
              <p className="text-amber-800 leading-relaxed">{specs.coastalTips}</p>
            </div>
          </div>
        </section>

        {/* Section 2: Error Codes & Troubleshooting Matrix */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-black mb-2">
              <Cpu className="w-3.5 h-3.5" />
              دليل أكواد الأعطال الشائعة (Error Codes)
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              كتالوج أعطال {brand.name} وطرق الإصلاح الهندسي
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              جدول تشخيص أكواد الشاشات الديجيتال لأجهزة {brand.name} وقطع الغيار الأصلية المطلوبة لكل عطل.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200">
                  <th className="p-3.5 rounded-tr-xl">كود العطل</th>
                  <th className="p-3.5">معنى الكود الهندسي</th>
                  <th className="p-3.5">السبب المرجح</th>
                  <th className="p-3.5">إجراءات الصيانة المطلوبة</th>
                  <th className="p-3.5 rounded-tl-xl">القطعة الأصلية المعتمدة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {specs.errorCodes.map((err, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-mono font-black text-red-600 text-sm whitespace-nowrap">
                      {err.code}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{err.meaning}</td>
                    <td className="p-3.5 text-slate-600 leading-relaxed">{err.cause}</td>
                    <td className="p-3.5 text-slate-700 leading-relaxed">{err.fix}</td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {err.part}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Dedicated Booking Form for this Brand */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#cc3333]" />
                حجز موعد صيانة منزلي مخصص لأجهزة {brand.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                حدد الجهاز والعنوان لتنسيق زيارة مهندس متخصص في موديلات {brand.name} مع قطع الغيار الأصلية.
              </p>
            </div>
            <span className="text-xs font-mono font-black text-slate-400">
              Booking for {brand.englishName}
            </span>
          </div>

          {bookingSuccess ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-2xl space-y-3 animate-in fade-in text-right">
              <div className="flex items-center gap-2 text-emerald-800 font-black text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تم تسجيل طلب صيانة {brand.name} بنجاح برقم: {bookingTicketId}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                تم تحويل طلبك لمهندس صيانة {brand.name} المتواجد في نطاق ({district}، {city}). سيتم الاتصال بك لتأكيد ميعاد الزيارة المنزلية.
              </p>

              {/* Estimated Completion Date Notice */}
              <div className="bg-white/90 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Timer className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>موعد إنجاز الصيانة المتوقع:</span>
                  <span className="font-mono text-emerald-800 font-black">
                    {new Date(Date.now() + 48 * 60 * 60 * 1000).toLocaleDateString("ar-EG", {
                      weekday: "long",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 font-bold bg-emerald-100/80 px-2 py-0.5 rounded-md self-start sm:self-auto font-mono">
                  نافذة الخدمة القياسية: 48 ساعة عمل
                </span>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={`https://wa.me/201279177748?text=${encodeURIComponent(
                    `مرحباً مركز VTEC، لقد قمت بحجز صيانة ${brand.name} برقم البلاغ ${bookingTicketId} وأريد تأكيد الزيارة فوراً.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>تأكيد الموعد عبر واتساب</span>
                </a>
                <button
                  type="button"
                  onClick={() => setBookingSuccess(false)}
                  className="text-xs font-bold text-slate-600 hover:underline"
                >
                  تسجيل بلاغ آخر لماركة {brand.name}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleQuickBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الجهاز:</label>
                  <select
                    value={selectedAppliance}
                    onChange={(e) => setSelectedAppliance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    {appliancesList.map((app) => (
                      <option key={app} value={app}>
                        {app}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">المحافظة:</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="الإسكندرية">الإسكندرية (كافة الأحياء)</option>
                    <option value="البحيرة">البحيرة (دمنهور وكفر الدوار)</option>
                    <option value="كفر الشيخ">كفر الشيخ ومراكزها</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الحي / المنطقة بالتفصيل:</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="مثال: سموحة، شارع ألبرت الأول..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العميل:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="اسم صاحب البلاغ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 01025946505"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  وصف العطل أو كود الخطأ الظاهر على الشاشة:
                </label>
                <textarea
                  rows={2}
                  value={faultNotes}
                  onChange={(e) => setFaultNotes(e.target.value)}
                  placeholder={`وصف المشكلة في جهاز ${brand.name} لمساعدة المهندس في إحضار قطع الغيار المناسبة...`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#cc3333] hover:bg-red-800 text-white font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow"
                >
                  <Wrench className="w-4 h-4" />
                  <span>تأكيد حجز صيانة {brand.name} الآن</span>
                </button>

                <a
                  href={`https://wa.me/201279177748?text=${encodeURIComponent(
                    `طلب حجز صيانة ${brand.name}:\n- الجهاز: ${selectedAppliance}\n- العنوان: ${district}، ${city}\n- الهاتف: ${customerPhone}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>حجز فوري عبر واتساب</span>
                </a>
              </div>
            </form>
          )}
        </section>

        {/* Section 4: Other Brands Switcher */}
        <section className="bg-slate-100/80 rounded-3xl p-6 md:p-8 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base md:text-lg font-black text-slate-900">
                استعراض صفحات باقي الماركات المعتمدة
              </h3>
              <p className="text-xs text-slate-500">
                انتقل بضغطة زر إلى الصفحة المستقلة لأي ماركة أخرى من الـ 25 ماركة العالمية.
              </p>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-[#cc3333] hover:underline"
            >
              عرض مصفوفة الماركات كاملة
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
            {BRANDS_LIST.filter((b) => b.name !== brand.name).map((other) => (
              <button
                key={other.name}
                onClick={() => onSelectOtherBrand(other)}
                className="bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 p-3 rounded-2xl text-right transition flex flex-col justify-between group shadow-2xs"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-black text-xs text-slate-900 group-hover:text-[#cc3333] transition">
                    {other.name}
                  </span>
                  <ChevronLeft className="w-3 h-3 text-slate-400 group-hover:text-[#cc3333] transition" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1">
                  {other.englishName}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
