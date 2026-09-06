import React from "react";
import {
  Calendar,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  BellRing,
  ExternalLink,
  LogOut,
  Info,
} from "lucide-react";
import { User } from "firebase/auth";
import { calculateNextYearDate } from "../services/googleCalendar";

interface RecurringMaintenanceToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  scheduledDate: string;
  scheduledTime: string;
  appliance: string;
  brand: string;
  googleUser: User | null;
  isAuthenticating: boolean;
  onGoogleSignIn: () => void;
  onGoogleSignOut?: () => void;
}

export const RecurringMaintenanceToggle: React.FC<RecurringMaintenanceToggleProps> = ({
  enabled,
  onToggle,
  scheduledDate,
  scheduledTime,
  appliance,
  brand,
  googleUser,
  isAuthenticating,
  onGoogleSignIn,
  onGoogleSignOut,
}) => {
  const nextYearDateStr = calculateNextYearDate(scheduledDate);
  const formattedNextDate = new Date(nextYearDateStr).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        enabled
          ? "bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border-amber-300 shadow-sm"
          : "bg-slate-50/80 border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Main Toggle Header */}
      <div className="p-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              enabled
                ? "bg-amber-500 text-white shadow-sm shadow-amber-200"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <label
                htmlFor="recurring-maintenance-switch"
                className="text-sm font-black text-slate-900 cursor-pointer"
              >
                جدولة الصيانة الدورية السنوية (Schedule Recurring Maintenance)
              </label>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5" />
                Google Calendar API
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ضبط تذكير سنوي تلقائي في تقويم Google لفحص كفاءة الجهاز وتغيير القطع الاستهلاكية سنوياً.
            </p>
          </div>
        </div>

        {/* The Toggle Switch */}
        <button
          id="recurring-maintenance-switch"
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
            enabled ? "bg-amber-600" : "bg-slate-300"
          }`}
        >
          <span className="sr-only">تفعيل جدولة الصيانة الدورية</span>
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5 rtl:-translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Expanded Details when Toggle is Active */}
      {enabled && (
        <div className="px-4 pb-4 pt-1 border-t border-amber-200/60 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Annual Recurrence Info Card */}
          <div className="bg-white rounded-xl p-3 border border-amber-200/80 shadow-2xs space-y-2 text-xs">
            <div className="flex items-center justify-between flex-wrap gap-2 text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <BellRing className="w-4 h-4 text-amber-600 shrink-0" />
                <span>الموعد السنوي الأول:</span>
                <span className="font-mono text-amber-900 font-black">{formattedNextDate}</span>
                <span className="text-slate-500 font-mono">({scheduledTime})</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                تكرار سنوي (RRULE:FREQ=YEARLY)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>إشعار قبل الموعد بأسبوع ويوم</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>تمديد أمان وتشغيل الجهاز</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>أولوية الحجز لعملاء VTEC</span>
              </div>
            </div>
          </div>

          {/* Google Account Connection Status */}
          {googleUser ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-2">
                {googleUser.photoURL ? (
                  <img
                    src={googleUser.photoURL}
                    alt={googleUser.displayName || "Google Account"}
                    className="w-7 h-7 rounded-full border border-emerald-300 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                    G
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">
                      {googleUser.displayName || "حساب Google"}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      جاهز للمزامنة
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {googleUser.email}
                  </p>
                </div>
              </div>

              {onGoogleSignOut && (
                <button
                  type="button"
                  onClick={onGoogleSignOut}
                  className="text-[11px] text-slate-500 hover:text-red-600 font-bold flex items-center gap-1 px-2 py-1 rounded hover:bg-white transition"
                >
                  <LogOut className="w-3 h-3" />
                  <span>تبديل الحساب</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-amber-100/50 border border-amber-200 rounded-xl p-3 space-y-2.5">
              <div className="flex items-start gap-2 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  لجدولة التذكير تلقائياً عبر <strong>Google Calendar API</strong> بصلاحية التقويم، يلزم ربط حساب Google الخاص بك (بإذن منك).
                </p>
              </div>

              {/* Official styled "Sign in with Google" button per skill guidelines */}
              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={isAuthenticating}
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-300 shadow-2xs transition flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                    <span>جاري الربط مع Google...</span>
                  </>
                ) : (
                  <>
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-4 h-4 shrink-0"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                      <path fill="none" d="M0 0h48v48H0z" />
                    </svg>
                    <span>تسجيل الدخول باستخدام Google لتأكيد الجدولة التلقائية</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
