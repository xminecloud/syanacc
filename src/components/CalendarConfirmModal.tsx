import React from "react";
import { Calendar, BellRing, Check, X, ShieldAlert, Sparkles } from "lucide-react";
import { User } from "firebase/auth";

interface CalendarConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  brand: string;
  appliance: string;
  firstReminderDate: string;
  scheduledTime: string;
  user: User | null;
}

export const CalendarConfirmModal: React.FC<CalendarConfirmModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isSubmitting,
  brand,
  appliance,
  firstReminderDate,
  scheduledTime,
  user,
}) => {
  if (!isOpen) return null;

  const formattedDate = new Date(firstReminderDate).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">
                تأكيد جدولة الصيانة الدورية السنوية
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Google Calendar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              سيتم إنشاء حدث متكرر سنوياً في تقويم Google الأساسي لحسابك.
            </p>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">اسم الحدث في التقويم:</span>
            <span className="font-black text-slate-900 text-left">
              صيانة دورية سنوية: {brand} ({appliance}) - VTEC
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">الموعد السنوي الأول:</span>
            <span className="font-mono font-bold text-amber-800">
              {formattedDate} ({scheduledTime})
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold">قاعدة التكرار (Recurrence):</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-[11px]">
              سنوياً (كل 12 شهر)
            </span>
          </div>

          {user && (
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-500 font-bold">حساب Google المستهدف:</span>
              <span className="font-mono text-slate-800 font-semibold text-[11px]">
                {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
          <BellRing className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            ستصلك تنبيهات تلقائية على هاتفك وبريدك الإلكتروني قبل كل موعد فحص سنوي بأسبوع ويوم لتفقد حالة الجهاز. يمكنك تعديل أو إلغاء التذكير في أي وقت مباشرة من تطبيق Google Calendar.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-black shadow transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جاري الإضافة لـ Google Calendar...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>تأكيد وجدولة التذكير السنوي</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
