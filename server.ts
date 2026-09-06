import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory bookings store
interface Booking {
  id: string;
  appliance: string;
  brand: string;
  city: string;
  neighborhood?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  status: "pending" | "confirmed" | "in-progress" | "completed";
  createdAt: string;
  scheduledDate?: string;
  technicianName?: string;
}

const mockBookings: Booking[] = [
  {
    id: "BK-1082",
    appliance: "غسالة ملابس",
    brand: "توشيبا",
    city: "الإسكندرية",
    neighborhood: "سموحة",
    customerName: "أحمد السكندري",
    customerPhone: "01025946505",
    notes: "اهتزاز وصوت عالي في مرحلة العصر، بحاجة لفحص المساعدين ورولمان البلي",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    technicianName: "م. محمد عبد الله",
  },
  {
    id: "BK-1083",
    appliance: "ثلاجة نوفروست",
    brand: "زانوسي",
    city: "الإسكندرية",
    neighborhood: "ميامي",
    customerName: "سارة محمود",
    customerPhone: "01279177748",
    notes: "تراكم ثلج في الفريزر وضعف تبريد في الكابينة السفلية",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    scheduledDate: new Date().toISOString().split("T")[0],
    technicianName: "م. كريم فهمي",
  },
  {
    id: "BK-1084",
    appliance: "غسالة أطباق",
    brand: "بوش",
    city: "البحيرة",
    neighborhood: "دمنهور",
    customerName: "محمود خليل",
    customerPhone: "01123456789",
    notes: "ظهور كود الخطأ E15 (تسريب حوض سفلي)",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    technicianName: "م. إسلام عادل",
  },
  {
    id: "BK-1081",
    appliance: "غسالة ملابس فول أوتوماتيك",
    brand: "إل جي (LG)",
    city: "الإسكندرية",
    neighborhood: "سيدي جابر",
    customerName: "د. هاني إبراهيم",
    customerPhone: "01099887766",
    notes: "تم تغيير طلمبة الطرد الأصلية ومعايرة كارتة الموتور الدفع المباشر، واختبار العصر بنجاح",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    scheduledDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    technicianName: "م. طارق العشري",
  },
  {
    id: "BK-1080",
    appliance: "ديب فريزر 6 درج",
    brand: "كريازي",
    city: "الإسكندرية",
    neighborhood: "العجمي (الهانوفيل)",
    customerName: "مروة عبد الرحمن",
    customerPhone: "01233445566",
    notes: "تم استبدال مروحة المبخر وشحن غاز الفريون R134a وضبط درجة الحرارة إلى -18 مئوية",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    scheduledDate: new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0],
    technicianName: "م. خالد نبيل",
  },
  {
    id: "BK-1079",
    appliance: "ثلاجة إنفرتر",
    brand: "سامسونج",
    city: "الإسكندرية",
    neighborhood: "لوران",
    customerName: "م. عمر فوزي",
    customerPhone: "01011223344",
    notes: "فحص حساس إذابة الثلج والثيرموفيوز والتأكد من استقرار الفولتية",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    scheduledDate: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0],
    technicianName: "م. كريم فهمي",
  },
  {
    id: "BK-1085",
    appliance: "تكييف سبليت 2.25 حصان",
    brand: "شارب",
    city: "كفر الشيخ",
    neighborhood: "دسوق",
    customerName: "ياسر المنشاوي",
    customerPhone: "01555667788",
    notes: "ضعف التبريد وصوت طنين بالوحدة الخارجية مع حاجة لتنظيف الفلاتر وقياس الشحنة",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    technicianName: "م. محمد عبد الله",
  },
  {
    id: "BK-1086",
    appliance: "غسالة أطباق",
    brand: "بيكو",
    city: "الإسكندرية",
    neighborhood: "كليوباترا",
    customerName: "نهال صبري",
    customerPhone: "01033221100",
    notes: "الماء لا يسخن مع عدم إتمام مرحلة الشطف الأخيرة",
    status: "in-progress",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    scheduledDate: new Date().toISOString().split("T")[0],
    technicianName: "م. إسلام عادل",
  },
];

// Lazy Gemini SDK client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Built-in technical diagnostic engine fallback when GEMINI_API_KEY is not configured
function generateLocalDiagnosis(brand: string, appliance: string, faultDescription: string, errorCode?: string): string {
  const brandName = brand || "توشيبا";
  const appName = appliance || "غسالة ملابس";
  const code = errorCode ? `[كود الخطأ: ${errorCode}]` : "";

  return `### 🛠️ التقرير الفني والتشخيص الهندسي المعتمد - مركز صيانة VTEC بالإسكندرية

**الجهاز المفحوص:** ${brandName} - ${appName} ${code}
**طبيعة العطل المبلغ عنه:** ${faultDescription || "عدم انتظام دورة التشغيل أو ظهور تنبيه عطل"}

---

#### 1. التشخيص الهندسي وتحليل العطل:
${errorCode ? `يشير كود العطل **(${errorCode})** في أجهزة **${brandName}** إلى خلل في إحدى الدوائر الحيوية (غالباً نظام تصريف المياه، أو حساس الضغط Level Sensor، أو دائرة قفل الباب الكهربائي PTC، أو ارتفاع الحمل على كارتة الإنفرتر).` : `الأعراض المذكورة تشير إلى انخفاض كفاءة التشغيل الميكانيكية أو الكهربائية لجهاز **${brandName}** نتيجة استهلاك بعض الأجزاء الدوارة أو تراكم الرواسب الكلسية بفعل ملوحة ورطوبة مياه الإسكندرية.`}

#### 2. الأسباب الشائعة في بيئة الإسكندرية والمناطق الساحلية:
1. **تأثير الرطوبة الساحلية (Sea Salt & Humidity):** تأكسد وتملح أطراف التوصيل الكهربائية (Terminals) وسوكيتات كارتة التحكم الإلكترونية.
2. **تذبذب الجهد الكهربائي:** عدم استقرار الفولتية في بعض أحياء الإسكندرية مما قد يؤثر على ثبات محركات الدفع المباشر أو الضاغط (Compressor).
3. **انسداد مجاري الصرف وفلاتر التبريد:** تراكم الشوائب أو انسداد طلمبة الطرد بفعل العملات المعدنية أو بقايا الأنسجة في الغسالات، أو انسداد مجرى إذابة الثلج في الثلاجات.

#### 3. الإسعافات الأولية وتوجيهات السلامة الفورية للعميل:
- ⚠️ **فصل التيار الكهربائي فوراً:** يرجى نزع القابس الرئيسي لمدة 15 دقيقة وعدم تكرار محاولة التشغيل قسراً لتفادي تلف كارتة التحكم الرئيسية.
- 💧 **فحص مصادر المياه والتصريف:** التأكد من فتح محبس التغذية وتنظيف فلتر الخرطوم وفلتر الطرد السفلي.
- 🚫 **عدم تفكيك الأجزاء الداخلية:** يرجى تجنب فتح غطاء الموتور أو اللوحة الإلكترونية حفاظاً على سريان الضمان المعتمد وتجنب مخاطر الصعق الكهربائي.

#### 4. قطع الغيار الأصلية المحتمل تركيبها:
- طلمبة تصريف مياه أصلية معتمدة (Drain Pump) أو رولمان بلي ياباني مع مانع تسريب (Oil Seal) مخصص للبيئة الرطبة.
- حساس إذابة ثلج وثيرموفيوز وحساس ضغط هواء (Pressure Sensor) أصلي من بلد المنشأ.
- كارتة تحكم إلكترونية أصلية مبرمجة برقم الموديل التسلسلي لجهاز ${brandName}.

#### 5. سياسة الضمان المعتمد من VTEC (syana.cc):
- تلتزم سيارات الخدمة الميدانية بتركيب **قطع غيار أصلية 100% بالباركود**.
- تسليم العميل **شهادة ضمان معتمدة رسمياً لمدة 12 شهراً** شاملة كافة أعمال الصيانة وقطع الغيار المستبدلة والزيارات الدورية المجانية.
- للحجز الفوري والتنسيق مع مهندس المنطقة: **01025946505** أو **01279177748**.`;
}

// Built-in service locator fallback
function generateLocalBranchReport(region: string, neighborhood: string, brand: string): { report: string; mapLinks: { uri: string; title: string }[] } {
  const loc = neighborhood ? `${neighborhood}، ${region}` : region;
  const brandName = brand || "توشيبا وكافة الماركات";

  const report = `### 📍 مراكز الخدمة وأسطول الدعم الميداني المعتمد لماركة ${brandName}

**نطاق التغطية الجغرافي:** ${loc}
**حالة أسطول الخدمة الميدانية:** سيارات الصيانة المتنقلة مجهزة وموزعة حالياً بمحيط المنطقة.

---

#### 1. نقاط الانطلاق الميدانية القريبة:
- **نقطة ارتكاز شرق الإسكندرية (سموحة / سيدي جابر):** تغطي مناطق سموحة، كفر عبده، لوران، ومحرم بك (زمن الاستجابة التقديري: 1 - 2 ساعة).
- **نقطة ارتكاز المنتزة وميامي:** تغطي ميامي، العصافرة، سيدي بشر، وأبو قير (زمن الاستجابة التقديري: 2 - 3 ساعات).
- **نقطة ارتكاز غرب الإسكندرية والساحل (العجمي / الهانوفيل):** تغطي الدخيلة، البيطاش، الهانوفيل، وبرج العرب.
- **أسطول محافظة البحيرة وكفر الشيخ:** مراكز تحرك مباشرة لخدمة دمنهور، كفر الدوار، ودسوق.

#### 2. التجهيزات والمميزات:
- فحص فوري منزلي بأجهزة الديجيتال وسكانر كشف الأعطال دون الحاجة لنقل الجهاز خارج المنزل.
- قطع غيار أصلية معتمدة لماركة **${brandName}** مسجلة بالرقم الكودي وضمان عام كامل.
- خط الطوارئ الميداني المباشر: **01025946505** (متاح من 9 صباحاً حتى 10 مساءً يومياً).`;

  const mapLinks = [
    {
      uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`صيانة ${brandName} ${loc}`)}`,
      title: `موقع وتغطية صيانة ${brandName} بمحيط ${loc} على خرائط Google`,
    },
    {
      uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("صيانة اجهزة منزلية الاسكندرية سموحة")}`,
      title: "نقطة ارتكاز سيارات الصيانة المركزية - سموحة، الإسكندرية",
    },
  ];

  return { report, mapLinks };
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Bookings endpoints
app.get("/api/bookings", (req, res) => {
  res.json({ success: true, bookings: mockBookings });
});

app.patch("/api/bookings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const booking = mockBookings.find((b) => b.id === id);
  if (!booking) {
    return res.status(404).json({ success: false, error: "طلب الصيانة غير موجود" });
  }
  if (status) {
    booking.status = status;
  }
  res.json({ success: true, booking });
});

app.post("/api/bookings", (req, res) => {
  try {
    const { appliance, brand, city, neighborhood, customerName, customerPhone, notes, scheduledDate } = req.body;
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      appliance: appliance || "غسالة ملابس",
      brand: brand || "توشيبا",
      city: city || "الإسكندرية",
      neighborhood: neighborhood || "",
      customerName: customerName || "عميل VTEC",
      customerPhone: customerPhone || "01025946505",
      notes: notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
      scheduledDate: scheduledDate || new Date().toISOString().split("T")[0],
      technicianName: "فريق صيانة VTEC المعتمد",
    };

    mockBookings.unshift(newBooking);
    res.json({ success: true, booking: newBooking, message: "تم تسجيل البلاغ بنجاح" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// AI Search Grounding: Diagnostic & Troubleshooting with Gemini 3.5 Flash / 3.8 Flash (with local engineering fallback)
app.post("/api/ai/diagnose", async (req, res) => {
  const { brand, appliance, faultDescription, errorCode } = req.body;
  const brandName = brand || "توشيبا";
  const appName = appliance || "غسالة ملابس";
  const desc = faultDescription || "صوت عالي أو عدم إتمام دورة التشغيل";

  try {
    const ai = getGenAI();
    if (!ai) {
      // Return high-quality local engineering diagnosis directly
      const diagnosis = generateLocalDiagnosis(brandName, appName, desc, errorCode);
      return res.json({
        success: true,
        diagnosis,
        sources: [
          { uri: "https://syana.cc", title: `دليل الصيانة الهندسية المعتمد - VTEC (${brandName})` },
          { uri: "https://syana.cc/alexandria-service", title: "مراكز الخدمة المعتمدة بالاسكندرية" },
        ],
      });
    }

    const prompt = `أنت مهندس خبير معتمد في صيانة الأجهزة المنزلية بمركز VTEC المتخصص بالاسكندرية syana.cc.
المطلوب تقديم تشخيص دقيق ومحدث باستخدام بحث Google للبيانات والكتالوجات الرسمية:
- الجهاز: ${appName}
- الماركة: ${brandName}
${errorCode ? `- كود العطل (Error Code): ${errorCode}` : ""}
- وصف المشكلة: ${desc}

يرجى تضمين:
1. معنى كود العطل أو تشخيص المشكلة هندسياً.
2. الأسباب الشائعة للعطل في بيئة الإسكندرية الرطبة ومصر.
3. إجراءات الإسعاف الأولي السريعة التي يقوم بها العميل فوراً بأمان.
4. قطع الغيار الأصلية المطلوبة (مثل: كارتة إلكترونية، ضاغط، رولمان بلي، طلمبة طرد، حساس إذابة الثلج...).
5. توصيات مهندسي VTEC لضمان عدم تكرار العطل والضمان المعتمد.

اكتب بلغة عربية احترافية وسهلة القراءة وموجهة للعميل السكندري.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (e) {
      console.warn("Falling back to gemini-3.8-flash for search grounding:", e);
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    }

    const text = response.text || "";
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources: { uri: string; title: string }[] = [];

    for (const chunk of rawChunks) {
      if ((chunk as any).web?.uri) {
        webSources.push({
          uri: (chunk as any).web.uri,
          title: (chunk as any).web.title || (chunk as any).web.uri,
        });
      }
    }

    if (webSources.length === 0) {
      webSources.push({
        uri: "https://syana.cc",
        title: `كتالوج الصيانة المعتمد لماركة ${brandName}`,
      });
    }

    res.json({
      success: true,
      diagnosis: text || generateLocalDiagnosis(brandName, appName, desc, errorCode),
      sources: webSources,
    });
  } catch (error: any) {
    console.warn("Diagnosis API error, using robust fallback:", error?.message);
    const diagnosis = generateLocalDiagnosis(brandName, appName, desc, errorCode);
    res.json({
      success: true,
      diagnosis,
      sources: [
        { uri: "https://syana.cc", title: `دليل الصيانة الهندسية المعتمد - VTEC (${brandName})` },
        { uri: "https://syana.cc/alexandria-service", title: "مراكز الخدمة المعتمدة بالاسكندرية" },
      ],
    });
  }
});

// AI Maps Grounding: Service Center & Branch Locator
app.post("/api/ai/locate", async (req, res) => {
  const { region, neighborhood, brand, lat, lng } = req.body;
  const reg = region || "الإسكندرية";
  const neigh = neighborhood || "سموحة";
  const brandName = brand || "توشيبا";

  try {
    const ai = getGenAI();
    if (!ai) {
      const fallback = generateLocalBranchReport(reg, neigh, brandName);
      return res.json({
        success: true,
        report: fallback.report,
        mapLinks: fallback.mapLinks,
      });
    }

    const targetLoc = neigh ? `${neigh}، ${reg}` : reg;
    const prompt = `أنت المنسق الميداني لأسطول صيانة VTEC (syana.cc) في مصر.
ابحث على خرائط Google عن أقرب نقاط الخدمة المعتمدة ومراكز قطع الغيار الأصلية لماركة (${brandName}) في منطقة (${targetLoc}).
حدد المعالم الرئيسية، شوارع الوصول السريعة، وأوقات الاستجابة المعتادة لسيارات الصيانة المتنقلة مع أرقام الطوارئ المعتمدة (01025946505).`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(lat),
            longitude: Number(lng),
          },
        },
      };
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config,
      });
    } catch (e) {
      console.warn("Falling back to gemini-3.8-flash for maps grounding:", e);
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config,
      });
    }

    const text = response.text || "";
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapLinks: { uri: string; title: string }[] = [];

    for (const chunk of rawChunks) {
      if ((chunk as any).maps?.uri) {
        mapLinks.push({
          uri: (chunk as any).maps.uri,
          title: (chunk as any).maps.title || "موقع المركز على خرائط Google",
        });
      }
    }

    const fallback = generateLocalBranchReport(reg, neigh, brandName);
    res.json({
      success: true,
      report: text || fallback.report,
      mapLinks: mapLinks.length > 0 ? mapLinks : fallback.mapLinks,
    });
  } catch (error: any) {
    console.warn("Locate API error, using robust fallback:", error?.message);
    const fallback = generateLocalBranchReport(reg, neigh, brandName);
    res.json({
      success: true,
      report: fallback.report,
      mapLinks: fallback.mapLinks,
    });
  }
});

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VTEC Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
