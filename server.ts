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
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in AI Studio Secrets.");
    }
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

// AI Search Grounding: Diagnostic & Troubleshooting with Gemini 3.5 Flash / 3.8 Flash
app.post("/api/ai/diagnose", async (req, res) => {
  try {
    const { brand, appliance, faultDescription, errorCode } = req.body;

    const ai = getGenAI();

    const prompt = `أنت مهندس خبير معتمد في صيانة الأجهزة المنزلية بمركز VTEC المتخصص بالاسكندرية syana.cc.
المطلوب تقديم تشخيص دقيق ومحدث باستخدام بحث Google للبيانات والكتالوجات الرسمية:
- الجهاز: ${appliance || "غسالة ملابس"}
- الماركة: ${brand || "توشيبا"}
${errorCode ? `- كود العطل (Error Code): ${errorCode}` : ""}
- وصف المشكلة: ${faultDescription || "صوت عالي أو عدم إتمام دورة التشغيل"}

يرجى تضمين:
1. معنى كود العطل أو تشخيص المشكلة هندسياً.
2. الأسباب الشائعة للعطل في بيئة الإسكندرية الرطبة ومصر.
3. إجراءات الإسعاف الأولي السريعة التي يقوم بها العميل فوراً بأمان.
4. قطع الغيار الأصلية المطلوبة (مثل: كارتة إلكترونية، ضاغط، رولمان بلي، طلمبة طرد، حساس إذابة الثلج...).
5. توصيات مهندسي VTEC لضمان عدم تكرار العطل والضمان المعتمد.

اكتب بلغة عربية احترافية وسهلة القراءة وموجهة للعميل السكندري.`;

    // Attempt with gemini-3.5-flash as explicitly instructed in prompt, fallback to gemini-3.8-flash
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

    res.json({
      success: true,
      diagnosis: text,
      sources: webSources,
    });
  } catch (error: any) {
    console.error("Diagnosis error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "تعذر إتمام التشخيص الذكي حالياً.",
    });
  }
});

// AI Maps Grounding: Service Center & Branch Locator
app.post("/api/ai/locate", async (req, res) => {
  try {
    const { region, neighborhood, brand, lat, lng } = req.body;
    const ai = getGenAI();

    const targetLoc = neighborhood ? `${neighborhood}، ${region || "الإسكندرية"}` : (region || "الإسكندرية ومحافظة البحيرة");
    const prompt = `أنت المنسق الميداني لأسطول صيانة VTEC (syana.cc) في مصر.
ابحث على خرائط Google عن أقرب نقاط الخدمة المعتمدة ومراكز قطع الغيار الأصلية لماركة (${brand || "توشيبا وكافة الماركات"}) في منطقة (${targetLoc}).
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

    res.json({
      success: true,
      report: text,
      mapLinks,
    });
  } catch (error: any) {
    console.error("Locate error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "تعذر تحديد الموقع الجغرافي للمراكز حالياً.",
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
