import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Wrench,
  ExternalLink,
  RefreshCw,
  User,
  MapPin,
  Sparkles,
  BellRing,
} from "lucide-react";
import { BookingTicket } from "../types";
import { TicketCompactTimeline } from "./TicketTimelineView";
import { RecurringMaintenanceToggle } from "./RecurringMaintenanceToggle";
import { CalendarConfirmModal } from "./CalendarConfirmModal";
import {
  initCalendarAuth,
  signInWithGoogleCalendar,
  logoutGoogleCalendar,
  createRecurringMaintenanceEvent,
  getRecurringCalendarWebUrl,
  calculateNextYearDate,
  GoogleCalendarEventResult,
} from "../services/googleCalendar";
import { User as FirebaseUser } from "firebase/auth";

interface BookingAndCalendarSectionProps {
  initialBrand?: string;
  initialAppliance?: string;
  initialNotes?: string;
  bookings?: BookingTicket[];
  onBookingCreated?: (booking: BookingTicket) => void;
  onRefreshBookings?: () => void;
}

export const BookingAndCalendarSection: React.FC<BookingAndCalendarSectionProps> = ({
  initialBrand = "توشيبا",
  initialAppliance = "غسالة ملابس",
  initialNotes = "",
  bookings: externalBookings,
  onBookingCreated,
  onRefreshBookings,
}) => {
  const [appliance, setAppliance] = useState(initialAppliance);
  const [brand, setBrand] = useState(initialBrand);
  const [city, setCity] = useState("الإسكندرية");
  const [neighborhood, setNeighborhood] = useState("سموحة");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState(initialNotes);
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [scheduledTime, setScheduledTime] = useState("11:00");

  const [loading, setLoading] = useState(false);
  const [internalBookings, setInternalBookings] = useState<BookingTicket[]>([]);
  const [latestBooking, setLatestBooking] = useState<BookingTicket | null>(null);
  const [successNotice, setSuccessNotice] = useState("");

  // Recurring Maintenance & Google Calendar State
  const [scheduleRecurring, setScheduleRecurring] = useState(false);
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSchedulingCalendar, setIsSchedulingCalendar] = useState(false);
  const [showCalendarConfirmModal, setShowCalendarConfirmModal] = useState(false);
  const [pendingBookingToSchedule, setPendingBookingToSchedule] = useState<BookingTicket | null>(null);
  const [calendarScheduleResult, setCalendarScheduleResult] = useState<GoogleCalendarEventResult | null>(null);

  // Initialize Calendar Auth
  useEffect(() => {
    const unsubscribe = initCalendarAuth(
      (user) => setGoogleUser(user),
      () => setGoogleUser(null)
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const res = await signInWithGoogleCalendar();
      if (res?.user) {
        setGoogleUser(res.user);
      }
    } catch (err: any) {
      console.error("Failed to sign in with Google:", err);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleSignOut = async () => {
    await logoutGoogleCalendar();
    setGoogleUser(null);
    setCalendarScheduleResult(null);
  };

  const executeScheduleRecurringEvent = async (targetBooking: BookingTicket) => {
    setIsSchedulingCalendar(true);
    try {
      const result = await createRecurringMaintenanceEvent({
        booking: targetBooking,
        scheduledTime,
        notes,
      });
      setCalendarScheduleResult(result);
    } catch (e: any) {
      console.error("Failed to schedule recurring calendar event:", e);
      setCalendarScheduleResult({
        success: false,
        error: e.message || "حدث خطأ أثناء الاتصال بـ Google Calendar",
      });
    } finally {
      setIsSchedulingCalendar(false);
      setShowCalendarConfirmModal(false);
    }
  };

  const bookings = externalBookings || internalBookings;

  // Sync props when user transfers from AI Diagnosis
  useEffect(() => {
    if (initialBrand) setBrand(initialBrand);
    if (initialAppliance) setAppliance(initialAppliance);
    if (initialNotes) setNotes(initialNotes);
  }, [initialBrand, initialAppliance, initialNotes]);

  // Fetch current bookings if not provided externally
  const fetchBookings = async () => {
    if (onRefreshBookings) {
      onRefreshBookings();
      return;
    }
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success && data.bookings) {
        setInternalBookings(data.bookings);
      }
    } catch (e) {
      console.warn("Failed to fetch bookings:", e);
    }
  };

  useEffect(() => {
    if (!externalBookings) {
      fetchBookings();
    }
  }, [externalBookings]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessNotice("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appliance,
          brand,
          city,
          neighborhood,
          customerName: customerName || "عميل VTEC",
          customerPhone: customerPhone || "01025946505",
          notes,
          scheduledDate,
        }),
      });

      const data = await res.json();
      if (data.success && data.booking) {
        setLatestBooking(data.booking);
        setPendingBookingToSchedule(data.booking);
        setSuccessNotice(`تم تسجيل طلب الصيانة بنجاح برقم البلاغ: ${data.booking.id}`);

        if (scheduleRecurring) {
          if (googleUser) {
            setShowCalendarConfirmModal(true);
          }
        }

        if (onBookingCreated) {
          onBookingCreated(data.booking);
        } else {
          fetchBookings();
        }
      }
    } catch (err) {
      console.error("Booking error:", err);
      setSuccessNotice("تم حفظ البلاغ محلياً وسيتم التواصل معك فوراً.");
    } finally {
      setLoading(false);
    }
  };

  // Generate Google Calendar Link
  const getGoogleCalendarUrl = (booking: BookingTicket) => {
    const title = encodeURIComponent(`صيانة ${booking.brand} (${booking.appliance}) - VTEC`);
    const details = encodeURIComponent(
      `رقم البلاغ: ${booking.id}\nالعميل: ${booking.customerName || "عميل VTEC"}\nالهاتف: ${booking.customerPhone || "01025946505"}\nالعنوان: ${booking.neighborhood || ""}، ${booking.city}\nالفني: ${booking.technicianName || "فريق صيانة VTEC المعتمد"}\nملاحظات: ${booking.notes || "فحص وصيانة بقطع غيار أصلية"}\nالخط الساخن: 01025946505`
    );
    const location = encodeURIComponent(`${booking.neighborhood || ""}، ${booking.city}، مصر`);

    const dateClean = (booking.scheduledDate || scheduledDate).replace(/-/g, "");
    const timeStart = scheduledTime.replace(":", "") + "00";
    const startIso = `${dateClean}T${timeStart}`;
    const endHour = String(Number(scheduledTime.split(":")[0]) + 2).padStart(2, "0");
    const endIso = `${dateClean}T${endHour}${scheduledTime.split(":")[1]}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}&sf=true&output=xml`;
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">مؤكد الزيارة</span>;
      case "in-progress":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">جاري المعاينة</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">تمت الصيانة</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">قيد المراجعة</span>;
    }
  };

  return (
    <section id="booking" className="py-16 px-4 md:px-8 bg-slate-100 scroll-mt-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-black mb-3">
            <Calendar className="w-3.5 h-3.5" />
            حجز المواعيد والربط مع Google Calendar
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic mb-4 text-slate-900">
            طلب زيارة صيانة منزلية فورية ومزامنة المواعيد
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            سجل بيانات العطل لتأكيد ميعاد زيارة مهندس VTEC وإضافة الموعد بضغطة زر إلى تقويم Google مع تذكير آلي بالزيارة.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Booking Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Wrench className="w-5 h-5 text-[#cc3333]" />
              تسجيل بلاغ صيانة جديد
            </h3>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع الجهاز:</label>
                  <select
                    value={appliance}
                    onChange={(e) => setAppliance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="غسالة ملابس">غسالة ملابس</option>
                    <option value="ثلاجة نوفروست">ثلاجة نوفروست</option>
                    <option value="ديب فريزر">ديب فريزر</option>
                    <option value="غسالة أطباق">غسالة أطباق</option>
                    <option value="بوتاجاز">بوتاجاز أو فرن</option>
                    <option value="تكييف">تكييف سبليت</option>
                    <option value="سخان مياه">سخان مياه</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الماركة:</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="توشيبا">توشيبا (Toshiba)</option>
                    <option value="زانوسي">زانوسي (Zanussi)</option>
                    <option value="ويت وستنجهاوس">ويت وستنجهاوس</option>
                    <option value="بوش">بوش (Bosch)</option>
                    <option value="بيكو">بيكو (Beko)</option>
                    <option value="هاير">هاير (Haier)</option>
                    <option value="إل جي">إل جي (LG)</option>
                    <option value="سامسونج">سامسونج (Samsung)</option>
                    <option value="شارب">شارب (Sharp)</option>
                    <option value="تورنيدو">تورنيدو (Tornado)</option>
                    <option value="كريازي">كريازي (Kiriazi)</option>
                    <option value="يونيفرسال">يونيفرسال (Universal)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">المحافظة:</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-500"
                  >
                    <option value="الإسكندرية">الإسكندرية (كافة الأحياء)</option>
                    <option value="البحيرة">البحيرة (دمنهور / كفر الدوار)</option>
                    <option value="كفر الشيخ">كفر الشيخ ومراكزها</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الحي / المنطقة بالتفصيل:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: سموحة، شارع فوزي معاذ..."
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم العميل:</label>
                  <input
                    type="text"
                    placeholder="اسم صاحب البلاغ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الهاتف:</label>
                  <input
                    type="tel"
                    required
                    placeholder="مثال: 01025946505"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">تاريخ الزيارة المقترح:</label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">الموعد المفضل:</label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">وصف العطل بالتفصيل:</label>
                <textarea
                  rows={2}
                  placeholder="وصف المشكلة لمساعدة المهندس في تحضير قطع الغيار..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Schedule Recurring Maintenance Toggle (Google Calendar API) */}
              <RecurringMaintenanceToggle
                enabled={scheduleRecurring}
                onToggle={(val) => {
                  setScheduleRecurring(val);
                }}
                scheduledDate={scheduledDate}
                scheduledTime={scheduledTime}
                appliance={appliance}
                brand={brand}
                googleUser={googleUser}
                isAuthenticating={isAuthenticating}
                onGoogleSignIn={handleGoogleSignIn}
                onGoogleSignOut={handleGoogleSignOut}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#cc3333] hover:bg-red-800 disabled:opacity-50 text-white font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wrench className="w-4 h-4" />}
                  <span>تأكيد حجز ميعاد الصيانة</span>
                </button>

                <a
                  href={`https://wa.me/201279177748?text=${encodeURIComponent(
                    `السلام عليكم مركز VTEC،\nطلب حجز صيانة:\n- الجهاز: ${appliance}\n- الماركة: ${brand}\n- العنوان: ${neighborhood}، ${city}\n- الهاتف: ${customerPhone}\n- الملاحظات: ${notes}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 shadow"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>إرسال لواتساب</span>
                </a>
              </div>
            </form>

            {/* Success Box with Google Calendar Integration */}
            {successNotice && latestBooking && (
              <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl space-y-3.5 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-800 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successNotice}</span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  تم اعتماد البلاغ. تم تفعيل المتابعة الفورية وجدولة الموعد في نظام الدعم الميداني.
                </p>

                {/* Live Progression Timeline for newly booked ticket */}
                <div className="pt-1">
                  <TicketCompactTimeline ticket={latestBooking} />
                </div>

                {/* Recurring Maintenance Status Banner */}
                {scheduleRecurring && (
                  <div className="bg-white/90 border border-amber-300 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-1.5 font-black text-slate-900">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span>جدولة الصيانة الدورية السنوية (Google Calendar):</span>
                      </div>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        سنوياً (RRULE)
                      </span>
                    </div>

                    {calendarScheduleResult?.success ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>تم إنشاء التذكير السنوي بنجاح في تقويم Google الشخصي!</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          أول موعد للفحص: <strong>{new Date(calendarScheduleResult.firstReminderDate || "").toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })}</strong>، وسيتكرر تلقائياً كل عام مع إشعارات استباقية.
                        </p>
                        {calendarScheduleResult.htmlLink && (
                          <a
                            href={calendarScheduleResult.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition shadow-xs"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>فتح التذكير السنوي في تقويم Google</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-600">
                          {googleUser
                            ? `حساب Google متصل (${googleUser.email}). اضغط لتأكيد الإضافة إلى تقويمك:`
                            : "لتسجيل التذكير السنوي المتكرر تلقائياً، يرجى تسجيل الدخول بحساب Google:"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {!googleUser ? (
                            <button
                              type="button"
                              onClick={handleGoogleSignIn}
                              disabled={isAuthenticating}
                              className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-2xs transition"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                              <span>تسجيل الدخول بـ Google لإتمام الجدولة</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => executeScheduleRecurringEvent(latestBooking)}
                              disabled={isSchedulingCalendar}
                              className="bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-xs transition"
                            >
                              {isSchedulingCalendar ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  <span>جاري المزامنة...</span>
                                </>
                              ) : (
                                <>
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>تأكيد المزامنة مع تقويم Google</span>
                                </>
                              )}
                            </button>
                          )}

                          <a
                            href={getRecurringCalendarWebUrl(latestBooking, scheduledTime)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-slate-600 hover:text-slate-900 underline font-medium"
                          >
                            أو فتح رابط التقويم السنوي المباشر
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Visit Calendar Link */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <a
                    href={getGoogleCalendarUrl(latestBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow transition"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>حفظ موعد الزيارة الحالية في Google Calendar 📅</span>
                    <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Recent Live Tickets List & Calendar Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#cc3333]" />
                  سجل البلاغات وجدول الزيارات الميدانية
                </h4>
                <div className="flex items-center gap-2">
                  <a
                    href="#portal-summary"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition"
                    title="الانتقال للمخططات البيانية Recharts"
                  >
                    <span>تحليل الحالات 📊</span>
                  </a>
                  <button
                    type="button"
                    onClick={fetchBookings}
                    className="text-xs text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
                    title="تحديث القائمة"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {bookings.map((b) => (
                  <div key={b.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-right">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-800">{b.id}</span>
                      {statusBadge(b.status)}
                    </div>

                    <div className="font-bold text-xs text-slate-900">
                      {b.brand} - {b.appliance}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>{b.neighborhood || "الإسكندرية"}، {b.city}</span>
                      <span className="text-slate-300">|</span>
                      <span>{b.scheduledDate || "اليوم"}</span>
                    </div>

                    {b.notes && (
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded-xl border border-slate-100">
                        {b.notes}
                      </div>
                    )}

                    {/* Timeline Progression */}
                    <TicketCompactTimeline ticket={b} />

                    <div className="pt-1 flex items-center justify-between border-t border-slate-200/60">
                      <span className="text-[10px] text-slate-400">الفني: {b.technicianName}</span>
                      <a
                        href={getGoogleCalendarUrl(b)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        حفظ بالتقويم
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Google Calendar Recurring Event */}
      {pendingBookingToSchedule && (
        <CalendarConfirmModal
          isOpen={showCalendarConfirmModal}
          onConfirm={() => executeScheduleRecurringEvent(pendingBookingToSchedule)}
          onCancel={() => setShowCalendarConfirmModal(false)}
          isSubmitting={isSchedulingCalendar}
          brand={pendingBookingToSchedule.brand}
          appliance={pendingBookingToSchedule.appliance}
          firstReminderDate={calculateNextYearDate(pendingBookingToSchedule.scheduledDate || scheduledDate)}
          scheduledTime={scheduledTime}
          user={googleUser}
        />
      )}
    </section>
  );
};
