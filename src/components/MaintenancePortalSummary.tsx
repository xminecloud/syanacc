import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  CheckCircle2,
  Clock,
  Wrench,
  Calendar,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  PlusCircle,
  Inbox,
  ArrowLeft,
  Check,
  LayoutGrid,
  Milestone,
  Truck,
} from "lucide-react";
import { BookingTicket } from "../types";
import {
  TicketCompactTimeline,
  TicketTimelineCard,
  TicketTimelineModal,
} from "./TicketTimelineView";

interface MaintenancePortalSummaryProps {
  bookings: BookingTicket[];
  onRefresh: () => void;
  onStatusChange?: (id: string, newStatus: "pending" | "confirmed" | "in-progress" | "completed") => Promise<void>;
  onNavigateToBooking?: () => void;
}

// Friendly SVG empty state illustration component
const FriendlyEmptyStateIllustration: React.FC = () => {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto select-none">
      {/* Background Soft Glow & Orbit Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-100/60 via-amber-50 to-emerald-50 blur-xl animate-pulse" />
      
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        {/* Outer Orbit Circle */}
        <circle
          cx="120"
          cy="120"
          r="104"
          stroke="#e2e8f0"
          strokeWidth="2"
          strokeDasharray="6 6"
          className="opacity-70"
        />

        {/* Circular Platform */}
        <ellipse cx="120" cy="188" rx="76" ry="18" fill="#e2e8f0" />
        <ellipse cx="120" cy="184" rx="66" ry="14" fill="#f1f5f9" />

        {/* Friendly Service Clipboard / Tablet */}
        <rect
          x="62"
          y="42"
          width="116"
          height="142"
          rx="18"
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth="3"
        />

        {/* Top Metallic Clip */}
        <rect x="90" y="32" width="60" height="20" rx="8" fill="#334155" />
        <circle cx="120" cy="42" r="4" fill="#f8fafc" />

        {/* Screen/Sheet Header Banner */}
        <rect x="74" y="60" width="92" height="22" rx="6" fill="#fee2e2" />
        <rect x="82" y="68" width="48" height="6" rx="3" fill="#dc2626" />
        <circle cx="154" cy="71" r="3.5" fill="#ef4444" />

        {/* Checklist Item 1 (Scheduled) */}
        <rect x="74" y="90" width="92" height="18" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
        <circle cx="85" cy="99" r="5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
        <rect x="96" y="96" width="56" height="6" rx="3" fill="#94a3b8" />

        {/* Checklist Item 2 (Active/Completed) */}
        <rect x="74" y="114" width="92" height="18" rx="6" fill="#f8fafc" stroke="#e2e8f0" />
        <circle cx="85" cy="123" r="5" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
        <path d="M82.5 123L84.5 125L87.5 121" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="96" y="120" width="46" height="6" rx="3" fill="#94a3b8" />

        {/* Checklist Item 3 (New Ready Slot) */}
        <rect x="74" y="138" width="92" height="18" rx="6" fill="#eff6ff" stroke="#bfdbfe" />
        <circle cx="85" cy="147" r="5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
        <rect x="96" y="144" width="38" height="6" rx="3" fill="#60a5fa" />

        {/* Bottom Friendly Smile / Check Bar */}
        <rect x="86" y="166" width="68" height="5" rx="2.5" fill="#cbd5e1" />

        {/* Stylized Floating Wrench Tool with Shadow */}
        <g transform="translate(142, 78) rotate(22)">
          <rect x="6" y="14" width="38" height="9" rx="4" fill="#cc3333" />
          <circle cx="10" cy="18" r="9" fill="#991b1b" />
          <circle cx="10" cy="18" r="4.5" fill="#ffffff" />
          <circle cx="40" cy="18" r="8" fill="#991b1b" />
          <rect x="36" y="14" width="8" height="8" fill="#ffffff" />
        </g>

        {/* Floating Sparkles & Stars */}
        <g transform="translate(38, 70)">
          <path
            d="M8 0L10 6L16 8L10 10L8 16L6 10L0 8L6 6L8 0Z"
            fill="#f59e0b"
          />
        </g>
        <g transform="translate(196, 134)">
          <path
            d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z"
            fill="#cc3333"
          />
        </g>
        <circle cx="48" cy="154" r="3" fill="#3b82f6" />
        <circle cx="188" cy="62" r="4" fill="#10b981" />
      </svg>

      {/* Floating Badge 1: 12 Months Warranty */}
      <div className="absolute -bottom-2 -right-3 bg-white border border-emerald-200 shadow-md px-2.5 py-1 rounded-full text-[10px] font-black text-emerald-800 flex items-center gap-1 z-20">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>ضمان 12 شهراً</span>
      </div>

      {/* Floating Badge 2: Quick Home Visit */}
      <div className="absolute -top-2 -left-2 bg-white border border-red-200 shadow-md px-2.5 py-1 rounded-full text-[10px] font-black text-[#cc3333] flex items-center gap-1 z-20">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>جاهز لحجزك الأول</span>
      </div>
    </div>
  );
};

// Color palette with high optical contrast
const STATUS_CONFIG: Record<
  string,
  { label: string; english: string; color: string; bg: string; text: string; border: string; desc: string }
> = {
  pending: {
    label: "قيد الانتظار والمراجعة",
    english: "Pending",
    color: "#f59e0b", // Amber
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    desc: "في انتظار إسناد مهندس وفحص مبدئي",
  },
  confirmed: {
    label: "مؤكد الزيارة والميعاد",
    english: "Confirmed",
    color: "#3b82f6", // Blue
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    desc: "تم جدولة المهندس وتأكيد التوقيت",
  },
  "in-progress": {
    label: "جاري المعاينة والإصلاح",
    english: "In Progress",
    color: "#8b5cf6", // Purple
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    desc: "المهندس في الموقع أو يباشر الكشف الفني",
  },
  completed: {
    label: "تمت الصيانة بنجاح",
    english: "Completed",
    color: "#10b981", // Emerald
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    desc: "تم الإصلاح واختبار الجهاز وتسليم الضمان",
  },
};

export const MaintenancePortalSummary: React.FC<MaintenancePortalSummaryProps> = ({
  bookings,
  onRefresh,
  onStatusChange,
  onNavigateToBooking,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeChartTab, setActiveChartTab] = useState<"donut" | "bar" | "both">("both");
  const [viewMode, setViewMode] = useState<"cards" | "timeline">("cards");
  const [inspectingTicketTimeline, setInspectingTicketTimeline] = useState<BookingTicket | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Status breakdown calculations
  const statusCounts = useMemo(() => {
    const counts = {
      pending: 0,
      confirmed: 0,
      "in-progress": 0,
      completed: 0,
    };
    bookings.forEach((b) => {
      if (counts[b.status] !== undefined) {
        counts[b.status]++;
      } else {
        counts.pending++;
      }
    });
    return counts;
  }, [bookings]);

  const totalBookings = bookings.length;
  const completedRate = totalBookings > 0 ? Math.round((statusCounts.completed / totalBookings) * 100) : 0;
  const activeRate =
    totalBookings > 0
      ? Math.round(((statusCounts["in-progress"] + statusCounts.confirmed) / totalBookings) * 100)
      : 0;
  const pendingRate = totalBookings > 0 ? Math.round((statusCounts.pending / totalBookings) * 100) : 0;

  // Data for Recharts Pie/Donut Chart
  const pieChartData = useMemo(() => {
    return [
      {
        id: "completed",
        name: "تمت الصيانة",
        fullName: "تمت الصيانة بنجاح",
        value: statusCounts.completed,
        color: STATUS_CONFIG.completed.color,
      },
      {
        id: "in-progress",
        name: "جاري المعاينة",
        fullName: "جاري المعاينة والإصلاح",
        value: statusCounts["in-progress"],
        color: STATUS_CONFIG["in-progress"].color,
      },
      {
        id: "confirmed",
        name: "مؤكد الزيارة",
        fullName: "مؤكد الزيارة والميعاد",
        value: statusCounts.confirmed,
        color: STATUS_CONFIG.confirmed.color,
      },
      {
        id: "pending",
        name: "قيد الانتظار",
        fullName: "قيد الانتظار والمراجعة",
        value: statusCounts.pending,
        color: STATUS_CONFIG.pending.color,
      },
    ];
  }, [statusCounts]);

  // Data for Recharts Bar Chart
  const barChartData = useMemo(() => {
    return [
      {
        statusKey: "pending",
        name: "قيد الانتظار",
        count: statusCounts.pending,
        fill: STATUS_CONFIG.pending.color,
      },
      {
        statusKey: "confirmed",
        name: "مؤكد الزيارة",
        count: statusCounts.confirmed,
        fill: STATUS_CONFIG.confirmed.color,
      },
      {
        statusKey: "in-progress",
        name: "جاري المعاينة",
        count: statusCounts["in-progress"],
        fill: STATUS_CONFIG["in-progress"].color,
      },
      {
        statusKey: "completed",
        name: "تمت الصيانة",
        count: statusCounts.completed,
        fill: STATUS_CONFIG.completed.color,
      },
    ];
  }, [statusCounts]);

  // Filtered requests list
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      const query = searchQuery.trim().toLowerCase();
      const matchQuery =
        !query ||
        b.id.toLowerCase().includes(query) ||
        b.brand.toLowerCase().includes(query) ||
        b.appliance.toLowerCase().includes(query) ||
        (b.customerName && b.customerName.toLowerCase().includes(query)) ||
        (b.neighborhood && b.neighborhood.toLowerCase().includes(query)) ||
        (b.city && b.city.toLowerCase().includes(query));
      return matchStatus && matchQuery;
    });
  }, [bookings, filterStatus, searchQuery]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "pending" | "confirmed" | "in-progress" | "completed"
  ) => {
    if (!onStatusChange) return;
    setUpdatingId(id);
    try {
      await onStatusChange(id, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  // Custom Pie Chart Tooltip
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = totalBookings > 0 ? Math.round((data.value / totalBookings) * 100) : 0;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-right text-xs space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.fullName}</span>
          </div>
          <div className="text-slate-300 font-mono text-sm">
            عدد البلاغات: <strong className="text-white">{data.value}</strong> ({pct}%)
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Bar Chart Tooltip
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = totalBookings > 0 ? Math.round((data.count / totalBookings) * 100) : 0;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-xl border border-slate-700 text-right text-xs space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
            <span>{data.name}</span>
          </div>
          <div className="text-slate-300 font-mono text-sm">
            عدد الطلبات: <strong className="text-white">{data.count}</strong>
          </div>
          <div className="text-slate-400 text-[11px]">تمثل {pct}% من إجمالي البلاغات</div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      id="portal-summary"
      className="py-16 px-4 md:px-8 bg-slate-50 scroll-mt-16 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-50 text-[#cc3333] border border-red-200 rounded-full text-xs font-black mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              بوابة المستخدم ومتابعة البلاغات | Recharts Analytics
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              ملخص حالة طلبات الصيانة (Pending vs. Completed)
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
              لوحة بيانية تفاعلية مدعومة بمكتبة Recharts توضح توزيع مسار البلاغات المسجلة من مرحلة قيد الانتظار حتى اكتمال الصيانة وتسليم شهادة الضمان.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
              title="تحديث البيانات لحظياً"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>تحديث البلاغات</span>
            </button>

            {onNavigateToBooking && (
              <button
                onClick={onNavigateToBooking}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#cc3333] hover:bg-red-800 text-white text-xs font-black transition shadow"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>حجز طلب جديد</span>
              </button>
            )}
          </div>
        </div>

        {/* Conditional Rendering: Friendly Empty State when no bookings exist */}
        {bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center space-y-8 max-w-4xl mx-auto">
            {/* Friendly Empty State Illustration */}
            <FriendlyEmptyStateIllustration />

            {/* Empty State Message */}
            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>بوابة المتابعة بانتظار بلاغك الأول</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                لا توجد طلبات صيانة مسجلة حتى الآن
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                أهلاً بك! لم يتم تسجيل أي بلاغ صيانة بعد في النظام. عند قيامك بحجز أول زيارة منزلية لصيانة أجهزتك (غسالة، ثلاجة، ديب فريزر، أو تكييف)، ستظهر هنا تلقائياً الرسوم البيانية التفاعلية لحالة الطلب ومعدلات الإنجاز (Pending vs. Completed)، بالإضافة لمسار تحرك المهندس الميداني وشهادات الضمان المعتمدة.
              </p>
            </div>

            {/* Clear Primary & Secondary Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToBooking) {
                    onNavigateToBooking();
                  } else {
                    const el = document.getElementById("booking");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#cc3333] hover:bg-red-800 text-white text-sm font-black transition-all shadow-md hover:shadow-lg transform active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-5 h-5" />
                <span>حجز موعد صيانة جديد الآن</span>
              </button>

              <button
                type="button"
                onClick={onRefresh}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-sm font-bold transition shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>تحديث قائمة البلاغات</span>
              </button>
            </div>

            {/* Quick Appliance Selection Shortcuts */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 mb-3">
                أو اختر نوع جهازك للبدء الفوري في حجز موعد الفحص:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {[
                  "غسالة ملابس",
                  "ثلاجة نوفروست",
                  "ديب فريزر",
                  "غسالة أطباق",
                  "تكييف سبليت",
                  "سخان مياه",
                  "بوتاجاز وفرن",
                ].map((appliance) => (
                  <button
                    key={appliance}
                    type="button"
                    onClick={() => {
                      if (onNavigateToBooking) {
                        onNavigateToBooking();
                      } else {
                        const el = document.getElementById("booking");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="px-3.5 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#cc3333] border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    صيانة {appliance}
                  </button>
                ))}
              </div>
            </div>

            {/* 3 Steps Maintenance Process Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-right">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-[#cc3333] flex items-center justify-center text-[10px] font-mono font-bold">1</span>
                  تسجيل فوري وموعد محدد
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  تحديد موعد الزيارة المنزلية خلال 24 ساعة بأحياء الإسكندرية والبحيرة.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-mono font-bold">2</span>
                  فحص هندسي بقطع أصلية
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  سيارة صيانة مجهزة بأحدث أجهزة تشخيص أكواد الأعطال وقطع غيار بالباركود.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-mono font-bold">3</span>
                  ضمان معتمد 12 شهراً
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  شهادة ضمان معتمدة ومتابعة رقمية مباشرة لسلامة وكفاءة الجهاز.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 4 KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Requests */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500">إجمالي البلاغات المسجلة</span>
              <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Calendar className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {totalBookings}
            </div>
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 font-medium">
              <span>جميع الطلبات النشطة والأرشيف</span>
            </div>
            <div className="absolute top-0 right-0 left-0 h-1 bg-slate-900" />
          </div>

          {/* Pending Requests */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800">قيد الانتظار (Pending)</span>
              <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
              {statusCounts.pending}
            </div>
            <div className="mt-2 text-[11px] text-amber-700 flex items-center justify-between font-medium">
              <span>نسبة الانتظار: {pendingRate}%</span>
              <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">بانتظار الإسناد</span>
            </div>
            <div className="absolute top-0 right-0 left-0 h-1 bg-amber-500" />
          </div>

          {/* In-Progress / Confirmed */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-800">جاري المعاينة / مؤكد</span>
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Wrench className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 font-mono">
              {statusCounts["in-progress"] + statusCounts.confirmed}
            </div>
            <div className="mt-2 text-[11px] text-blue-700 flex items-center justify-between font-medium">
              <span>نسبة التنفيذ: {activeRate}%</span>
              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">الأسطول الميداني</span>
            </div>
            <div className="absolute top-0 right-0 left-0 h-1 bg-blue-500" />
          </div>

          {/* Completed Requests */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800">تمت الصيانة (Completed)</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
              {statusCounts.completed}
            </div>
            <div className="mt-2 text-[11px] text-emerald-700 flex items-center justify-between font-medium">
              <span>نسبة الإنجاز: {completedRate}%</span>
              <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">بضمان معتمد</span>
            </div>
            <div className="absolute top-0 right-0 left-0 h-1 bg-emerald-500" />
          </div>
        </div>

        {/* Recharts Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Chart 1: Donut Status Distribution (PieChart) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  مخطط التوزيع النسبي للبلاغات (Donut Distribution)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  مقارنة البلاغات المكتملة مقابل قيد الانتظار وجاري الفحص
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-600">
                {totalBookings} بلاغ
              </span>
            </div>

            {/* Donut Chart Container */}
            <div className="w-full h-72 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
                  {completedRate}%
                </span>
                <span className="text-[11px] font-bold text-slate-500">نسبة الإنجاز</span>
              </div>
            </div>

            {/* Custom Legend Cards */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {pieChartData.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setFilterStatus(filterStatus === item.id ? "all" : item.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between text-xs ${
                    filterStatus === item.id
                      ? "border-slate-800 bg-slate-50 shadow-xs"
                      : "border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-bold text-slate-800">{item.name}</span>
                  </div>
                  <span className="font-mono font-black text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Status Volume Comparison (BarChart) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  مقارنة أحجام البلاغات حسب الحالة (Status Volume Breakdown)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  رسم بياني بالأعمدة لمقارنة جاهزية الفرق الميدانية
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <span>Pending vs Completed</span>
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{ fontSize: 11, fontWeight: 700 }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  >
                    {barChartData.map((entry) => (
                      <Cell key={entry.statusKey} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* High Level Key Takeaways */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  متوسط زمن إنجاز البلاغ (SLA):
                </span>
                <span className="font-bold text-slate-900 font-mono">24 - 48 ساعة</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  نسبة توفر قطع الغيار الأصلية:
                </span>
                <span className="font-bold text-slate-900 font-mono">98.5% بالأسطول</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requests Management Table & Live Filter */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#cc3333]" />
                قائمة طلبات المستخدم وبلاغات الصيانة الحالية
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                يمكنك تصفية الطلبات حسب الحالة والبحث برقم البلاغ أو الماركة وتحديث مسار الصيانة مباشرة.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث برقم البلاغ، الماركة..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Filter Status Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterStatus === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>جميع الطلبات</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-white">
                {bookings.length}
              </span>
            </button>

            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const count = statusCounts[key as keyof typeof statusCounts] || 0;
              const isActive = filterStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    isActive
                      ? `${config.bg} ${config.text} ${config.border} shadow-xs`
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <span>{config.label}</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/70">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: Cards Grid vs. Interactive Timeline Progression */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Milestone className="w-4 h-4 text-[#cc3333]" />
              <span>نمط استعراض بلاغات الصيانة:</span>
              <span className="text-[11px] text-slate-400 font-normal">
                (استلام الطلب ← توجيه المهندس ← اكتمال الصيانة)
              </span>
            </div>

            <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>شبكة البطاقات</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "timeline"
                    ? "bg-[#cc3333] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Milestone className="w-3.5 h-3.5" />
                <span>المسار الزمني (Timeline)</span>
              </button>
            </div>
          </div>

          {/* Requests Grid / Table */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <Inbox className="w-7 h-7" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <div className="text-sm font-bold text-slate-900">
                  لم نتمكن من العثور على أي بلاغات مطابقة
                </div>
                <p className="text-xs text-slate-500">
                  {searchQuery
                    ? `لا توجد نتائج تطابق «${searchQuery}» ضمن الفلتر المختار حالياً.`
                    : "لا توجد بلاغات مسجلة في هذا القسم المحدد حالياً."}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {(searchQuery || filterStatus !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterStatus("all");
                    }}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
                  >
                    إعادة ضبط الفلاتر والبحث
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigateToBooking) {
                      onNavigateToBooking();
                    } else {
                      const el = document.getElementById("booking");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="px-4 py-2 bg-[#cc3333] hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>حجز بلاغ صيانة جديد</span>
                </button>
              </div>
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBookings.map((ticket) => {
                const config = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.pending;
                const isUpdating = updatingId === ticket.id;

                return (
                  <div
                    key={ticket.id}
                    className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Top Row: Ticket ID & Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                          {ticket.id}
                        </span>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${config.bg} ${config.text} ${config.border}`}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          {config.label}
                        </span>
                      </div>

                      {/* Device & Brand */}
                      <div className="pt-1">
                        <div className="font-black text-sm text-slate-900">
                          {ticket.brand} - {ticket.appliance}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          العميل: {ticket.customerName || "عميل VTEC"} ({ticket.customerPhone || "01025946505"})
                        </div>
                      </div>

                      {/* Location & Scheduled Date */}
                      <div className="text-[11px] text-slate-600 space-y-1 bg-white p-2 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">المنطقة:</span>
                          <span className="font-bold">
                            {ticket.neighborhood ? `${ticket.neighborhood}، ` : ""}
                            {ticket.city}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">موعد الزيارة:</span>
                          <span className="font-mono font-bold text-blue-700">
                            {ticket.scheduledDate || "اليوم"}
                          </span>
                        </div>
                        {ticket.technicianName && (
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">المهندس المسؤول:</span>
                            <span className="font-bold text-slate-800">{ticket.technicianName}</span>
                          </div>
                        )}
                      </div>

                      {/* Notes / Fault description */}
                      {ticket.notes && (
                        <p className="text-[11px] text-slate-600 line-clamp-2 bg-slate-100/70 p-2 rounded-lg">
                          {ticket.notes}
                        </p>
                      )}

                      {/* Compact 3-Step Visual Progression Timeline */}
                      <TicketCompactTimeline
                        ticket={ticket}
                        onViewDetailed={() => setInspectingTicketTimeline(ticket)}
                      />
                    </div>

                    {/* Action Bar: Change status to simulate workflow */}
                    {onStatusChange && (
                      <div className="pt-3 border-t border-slate-200/80 mt-2">
                        <div className="text-[10px] text-slate-400 mb-1 font-bold">
                          تحديث مرحلة الصيانة:
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[11px]">
                          <button
                            type="button"
                            disabled={isUpdating || ticket.status === "pending"}
                            onClick={() => handleUpdateStatus(ticket.id, "pending")}
                            className={`py-1 px-1.5 rounded text-center transition font-bold ${
                              ticket.status === "pending"
                                ? "bg-amber-500 text-white font-black"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"
                            }`}
                          >
                            انتظار
                          </button>
                          <button
                            type="button"
                            disabled={isUpdating || ticket.status === "in-progress"}
                            onClick={() => handleUpdateStatus(ticket.id, "in-progress")}
                            className={`py-1 px-1.5 rounded text-center transition font-bold ${
                              ticket.status === "in-progress"
                                ? "bg-purple-600 text-white font-black"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-purple-50"
                            }`}
                          >
                            جاري الفحص
                          </button>
                          <button
                            type="button"
                            disabled={isUpdating || ticket.status === "completed"}
                            onClick={() => handleUpdateStatus(ticket.id, "completed")}
                            className={`py-1 px-1.5 rounded text-center transition font-bold ${
                              ticket.status === "completed"
                                ? "bg-emerald-600 text-white font-black"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50"
                            }`}
                          >
                            اكتمال
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((ticket) => (
                <TicketTimelineCard
                  key={ticket.id}
                  ticket={ticket}
                  onStatusChange={handleUpdateStatus}
                  isUpdating={updatingId === ticket.id}
                  onOpenModal={() => setInspectingTicketTimeline(ticket)}
                />
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Full Detailed Timeline Modal */}
      <TicketTimelineModal
        ticket={inspectingTicketTimeline}
        onClose={() => setInspectingTicketTimeline(null)}
        onStatusChange={handleUpdateStatus}
        isUpdating={updatingId === inspectingTicketTimeline?.id}
      />
    </section>
  );
};
