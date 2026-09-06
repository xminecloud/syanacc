import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, Auth } from "firebase/auth";
import { auth } from "./firebase";
import { BookingTicket } from "../types";

// Active OAuth scopes required for Google Calendar API
export const CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
];

// Setup Google Auth Provider with Calendar Scope
const provider = new GoogleAuthProvider();
CALENDAR_SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: "consent",
  access_type: "offline",
});

// IN-MEMORY TOKEN CACHING ONLY (Strictly forbidden to store in localStorage/sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

/**
 * Initialize Google Auth State Listener
 */
export const initCalendarAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      cachedUser = user;
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token might need re-acquisition or popup
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      cachedUser = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google using popup and acquire Calendar OAuth access token
 */
export const signInWithGoogleCalendar = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Check firebase-applet-config.json");
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error("لم يتم استلام تصريح الدخول (Access Token) من Google");
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Google Calendar sign-in error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory cached access token
 */
export const getCalendarAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

/**
 * Get currently authenticated Google user
 */
export const getCalendarUser = (): User | null => {
  return cachedUser || auth?.currentUser || null;
};

/**
 * Logout and purge in-memory cached token
 */
export const logoutGoogleCalendar = async () => {
  if (auth) {
    await auth.signOut();
  }
  cachedAccessToken = null;
  cachedUser = null;
};

export interface CreateRecurringEventParams {
  booking: BookingTicket;
  scheduledTime?: string;
  firstReminderDate?: string;
  intervalYears?: number;
  notes?: string;
}

export interface GoogleCalendarEventResult {
  success: boolean;
  eventId?: string;
  htmlLink?: string;
  summary?: string;
  recurrence?: string[];
  firstReminderDate?: string;
  error?: string;
}

/**
 * Calculates the first recurrence date (1 year after the initial booking visit)
 */
export function calculateNextYearDate(baseDateStr?: string): string {
  const base = baseDateStr ? new Date(baseDateStr) : new Date();
  if (isNaN(base.getTime())) {
    const fallback = new Date();
    fallback.setFullYear(fallback.getFullYear() + 1);
    return fallback.toISOString().split("T")[0];
  }
  const nextYear = new Date(base);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  return nextYear.toISOString().split("T")[0];
}

/**
 * Create an annual recurring maintenance reminder event in Google Calendar
 * using Google Calendar REST API v3
 */
export async function createRecurringMaintenanceEvent(
  params: CreateRecurringEventParams
): Promise<GoogleCalendarEventResult> {
  const token = await getCalendarAccessToken();
  if (!token) {
    return {
      success: false,
      error: "AUTH_REQUIRED",
    };
  }

  const { booking, scheduledTime = "11:00", notes = "" } = params;

  // Compute first annual reminder date (exactly 1 year after scheduled service)
  const firstAnnualDate = params.firstReminderDate || calculateNextYearDate(booking.scheduledDate);
  const timeStart = scheduledTime.length === 5 ? `${scheduledTime}:00` : "11:00:00";
  const [h, m] = scheduledTime.split(":").map(Number);
  const endHour = String((h || 11) + 1).padStart(2, "0");
  const timeEnd = `${endHour}:${String(m || 0).padStart(2, "0")}:00`;

  const startDateTime = `${firstAnnualDate}T${timeStart}`;
  const endDateTime = `${firstAnnualDate}T${timeEnd}`;

  const summary = `صيانة دورية سنوية: ${booking.brand} (${booking.appliance}) - VTEC`;
  const description = [
    `📅 تذكير الفحص السنوي الدوري المجدول للأجهزة المنزلية - مركز صيانة VTEC`,
    `--------------------------------------------------`,
    `• الجهاز: ${booking.appliance}`,
    `• الماركة: ${booking.brand}`,
    `• صاحب البلاغ: ${booking.customerName || "عميل VTEC"}`,
    `• رقم الهاتف: ${booking.customerPhone || "01025946505"}`,
    `• العنوان المسجل: ${booking.neighborhood || ""}، ${booking.city || "الإسكندرية"}`,
    `• رقم البلاغ التأسيسي: ${booking.id}`,
    notes ? `• ملاحظات إضافية: ${notes}` : "",
    ``,
    `🛡️ أهمية الفحص السنوي:`,
    `- فحص دورة التبريد والفريون / مواتير الدوران وتصريف المياه.`,
    `- تنظيف الفلاتر وسربنتينات المكثف وتفادي التآكل بفعل رطوبة الساحل.`,
    `- تجديد الضمان واستبدال القطع الاستهلاكية بأصلية معتمدة.`,
    ``,
    `📞 لحجز ميعاد الفحص الفعلي:`,
    `الخط الساخن: 01025946505`,
    `واتساب الدعم السريع: https://wa.me/201279177748`,
    `الموقع الإلكتروني: https://syana.cc`,
  ].filter(Boolean).join("\n");

  const location = `${booking.neighborhood || ""}، ${booking.city || "الإسكندرية"}، مصر`;

  // RFC 5545 Recurrence Rule: Repeat annually forever
  const recurrenceRule = ["RRULE:FREQ=YEARLY;INTERVAL=1"];

  const eventPayload = {
    summary,
    description,
    location,
    start: {
      dateTime: new Date(startDateTime).toISOString(),
      timeZone: "Africa/Cairo",
    },
    end: {
      dateTime: new Date(endDateTime).toISOString(),
      timeZone: "Africa/Cairo",
    },
    recurrence: recurrenceRule,
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 1440 }, // 1 day before
        { method: "email", minutes: 10080 }, // 1 week before
        { method: "popup", minutes: 10080 }, // 1 week before
      ],
    },
    colorId: "5", // Yellow / Banana color in Google Calendar
  };

  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventPayload),
      }
    );

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Google Calendar API response error:", errData);
      if (response.status === 401) {
        cachedAccessToken = null;
        return { success: false, error: "AUTH_EXPIRED" };
      }
      return {
        success: false,
        error: errData?.error?.message || `فشل إنشاء التذكير (${response.status})`,
      };
    }

    const createdEvent = await response.json();
    return {
      success: true,
      eventId: createdEvent.id,
      htmlLink: createdEvent.htmlLink,
      summary: createdEvent.summary,
      recurrence: createdEvent.recurrence || recurrenceRule,
      firstReminderDate: firstAnnualDate,
    };
  } catch (err: any) {
    console.error("Error creating Google Calendar recurring reminder:", err);
    return {
      success: false,
      error: err.message || "فشل الاتصال بـ Google Calendar API",
    };
  }
}

/**
 * Direct web URL fallback for adding annual recurring reminder to Google Calendar
 */
export function getRecurringCalendarWebUrl(booking: BookingTicket, scheduledTime = "11:00"): string {
  const nextYearDate = calculateNextYearDate(booking.scheduledDate);
  const title = encodeURIComponent(`صيانة دورية سنوية: ${booking.brand} (${booking.appliance}) - VTEC`);
  const details = encodeURIComponent(
    `تذكير سنوي دوري مجدول لصيانة ${booking.brand} (${booking.appliance}).\nرقم البلاغ: ${booking.id}\nالعميل: ${booking.customerName || "عميل VTEC"}\nالهاتف: ${booking.customerPhone || "01025946505"}\nالخط الساخن: 01025946505\nواتساب: https://wa.me/201279177748`
  );
  const location = encodeURIComponent(`${booking.neighborhood || ""}، ${booking.city || "الإسكندرية"}، مصر`);

  const dateClean = nextYearDate.replace(/-/g, "");
  const timeStart = scheduledTime.replace(":", "") + "00";
  const startIso = `${dateClean}T${timeStart}`;
  const [h, m] = scheduledTime.split(":").map(Number);
  const endHour = String((h || 11) + 1).padStart(2, "0");
  const endIso = `${dateClean}T${endHour}${String(m || 0).padStart(2, "0")}00`;

  // recur=RRULE:FREQ=YEARLY is supported in web Google Calendar
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}&recur=RRULE:FREQ=YEARLY&sf=true&output=xml`;
}
