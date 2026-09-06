import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  User,
  Phone,
  Wrench,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  X,
} from "lucide-react";
import { BookingTicket } from "../types";

export interface TimelineStep {
  id: "received" | "dispatched" | "completed";
  label: string;
  englishLabel: "Request Received" | "Technician Dispatched" | "Completed";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isDone: boolean;
  isActive: boolean;
  isUpcoming: boolean;
  detailBadge: string;
  timestamp: string;
  technicianNote?: string;
}

export function getTicketTimelineData(ticket: BookingTicket): {
  steps: TimelineStep[];
  currentStepIndex: number;
  progressPercent: number;
  currentStageLabel: string;
} {
  const isPending = ticket.status === "pending";
  const isConfirmed = ticket.status === "confirmed";
  const isInProgress = ticket.status === "in-progress";
  const isCompleted = ticket.status === "completed";

  let currentStepIndex = 0;
  let progressPercent = 33;
  let currentStageLabel = "Request Received";

  if (isCompleted) {
    currentStepIndex = 2;
    progressPercent = 100;
    currentStageLabel = "Completed";
  } else if (isInProgress || isConfirmed) {
    currentStepIndex = 1;
    progressPercent = isInProgress ? 70 : 50;
    currentStageLabel = "Technician Dispatched";
  } else {
    currentStepIndex = 0;
    progressPercent = 25;
    currentStageLabel = "Request Received";
  }

  const createdTime = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "تم تسجيل البلاغ";

  const scheduledTime = ticket.scheduledDate
    ? `موعد الزيارة: ${ticket.scheduledDate}`
    : "خلال 24 ساعة بمحيط الإسكندرية";

  const steps: TimelineStep[] = [
    {
      id: "received",
      label: "استلام الطلب",
      englishLabel: "Request Received",
      description: `تم إدراج بلاغ صيانة ${ticket.brand} (${ticket.appliance}) في المنظومة ومطابقة بيانات العميل.`,
      icon: FileText,
      isDone: isConfirmed || isInProgress || isCompleted,
      isActive: isPending,
      isUpcoming: false,
      detailBadge: `بلاغ رقم #${ticket.id}`,
      timestamp: createdTime,
      technicianNote: ticket.notes ? `وصف العطل المبلغ عنه: ${ticket.notes}` : undefined,
    },
    {
      id: "dispatched",
      label: "توجيه المهندس",
      englishLabel: "Technician Dispatched",
      description:
        isConfirmed || isInProgress || isCompleted
          ? `تم تعيين الفني المختص (${ticket.technicianName || "مهندس صيانة معتمد"}) وتجهيز سيارة الخدمة بقطع الغيار المعتمدة.`
          : "بانتظار اكتمال توزيع خط السير الميداني وتأكيد انطلاق المهندس.",
      icon: Truck,
      isDone: isCompleted,
      isActive: isConfirmed || isInProgress,
      isUpcoming: isPending,
      detailBadge:
        isInProgress
          ? "المهندس في الموقع حالياً"
          : isConfirmed
          ? "تم توجيه الفريق للزيارة"
          : "قيد جدولة المسار",
      timestamp: scheduledTime,
      technicianNote: ticket.neighborhood
        ? `وجهة التحرك الميداني: ${ticket.neighborhood}، ${ticket.city}`
        : `وجهة التحرك: ${ticket.city}`,
    },
    {
      id: "completed",
      label: "اكتمال الصيانة",
      englishLabel: "Completed",
      description: isCompleted
        ? "تم إتمام أعمال الفحص الهندسي، استبدال القطع التالفة بقطع أصلية، واختبار دورة التشغيل وتسليم شهادة الضمان 12 شهراً."
        : "المرحلة النهائية: الفحص الشامل واختبار الجهاز وإصدار شهادة ضمان VTEC المعتمدة.",
      icon: ShieldCheck,
      isDone: isCompleted,
      isActive: false,
      isUpcoming: !isCompleted,
      detailBadge: isCompleted ? "ضمان 12 شهراً ساري" : "بانتظار إنهاء الزيارة",
      timestamp: isCompleted ? "تم تسليم الجهاز بنجاح" : "بعد اكتمال المعاينة",
      technicianNote: isCompleted
        ? "تمت المعاينة وفق المواصفات القياسية وحماية الجهاز من رطوبة المناخ الساحلي."
        : undefined,
    },
  ];

  return { steps, currentStepIndex, progressPercent, currentStageLabel };
}

interface TicketCompactTimelineProps {
  ticket: BookingTicket;
  onViewDetailed?: () => void;
}

/**
 * Compact horizontal 3-step timeline for ticket cards
 */
export const TicketCompactTimeline: React.FC<TicketCompactTimelineProps> = ({
  ticket,
  onViewDetailed,
}) => {
  const { steps, progressPercent, currentStageLabel } = getTicketTimelineData(ticket);

  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-2.5">
      {/* Header: Stage Tracker Summary */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-slate-700">مسار الإنجاز:</span>
          <span className="text-[11px] font-mono font-bold text-slate-900 px-1.5 py-0.5 rounded bg-slate-100">
            {currentStageLabel}
          </span>
        </div>
        <span className="font-mono font-bold text-xs text-[#cc3333]">
          {progressPercent}%
        </span>
      </div>

      {/* Progress Bar Track */}
      <div className="relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-600 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Visual Step Markers: Request Received -> Technician Dispatched -> Completed */}
      <div className="grid grid-cols-3 gap-1 relative pt-1 text-center">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isDone = step.isDone;
          const isActive = step.isActive;

          return (
            <div key={step.id} className="flex flex-col items-center space-y-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                  isDone
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : isActive
                    ? "bg-[#cc3333] text-white border-red-600 ring-2 ring-red-100 animate-pulse"
                    : "bg-slate-100 text-slate-400 border-slate-200"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : <Icon className="w-3 h-3" />}
              </div>
              <div className="w-full">
                <div
                  className={`text-[10px] font-bold leading-tight truncate ${
                    isActive
                      ? "text-[#cc3333]"
                      : isDone
                      ? "text-emerald-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </div>
                <div className="text-[9px] text-slate-400 font-mono hidden sm:block truncate">
                  {step.englishLabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Detailed Progression Button */}
      {onViewDetailed && (
        <button
          type="button"
          onClick={onViewDetailed}
          className="w-full mt-1 py-1.5 text-center text-[11px] font-bold text-slate-700 hover:text-[#cc3333] bg-slate-50 hover:bg-red-50 rounded-lg transition border border-slate-200/60 hover:border-red-200 flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>عرض المخطط الزمني الكامل والتفاصيل</span>
          <ChevronLeft className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

interface TicketTimelineCardProps {
  ticket: BookingTicket;
  onStatusChange?: (id: string, newStatus: "pending" | "confirmed" | "in-progress" | "completed") => Promise<void>;
  isUpdating?: boolean;
  onOpenModal?: () => void;
}

/**
 * Full Detailed Timeline view card for individual maintenance ticket
 */
export const TicketTimelineCard: React.FC<TicketTimelineCardProps> = ({
  ticket,
  onStatusChange,
  isUpdating = false,
  onOpenModal,
}) => {
  const { steps, progressPercent, currentStageLabel } = getTicketTimelineData(ticket);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              #{ticket.id}
            </span>
            <h4 className="text-base font-black text-slate-900">
              {ticket.brand} - {ticket.appliance}
            </h4>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                ticket.status === "completed"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : ticket.status === "in-progress"
                  ? "bg-purple-50 text-purple-800 border-purple-200"
                  : ticket.status === "confirmed"
                  ? "bg-blue-50 text-blue-800 border-blue-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {currentStageLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {ticket.customerName || "عميل VTEC"}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              {ticket.customerPhone || "01025946505"}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {ticket.neighborhood ? `${ticket.neighborhood}، ` : ""}
              {ticket.city}
            </span>
            <span className="flex items-center gap-1 font-mono font-bold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {ticket.scheduledDate || "اليوم"}
            </span>
          </div>
        </div>

        {/* Action Button: Open Detailed Timeline Modal */}
        {onOpenModal && (
          <button
            type="button"
            onClick={onOpenModal}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#cc3333] border border-slate-200 hover:border-red-200 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>عرض السجل الزمني الفني</span>
          </button>
        )}
      </div>

      {/* Visual Timeline Progression: 3 Major Milestones */}
      <div className="relative space-y-4 pt-1">
        {/* Background Vertical Connecting Line */}
        <div className="absolute right-5 top-5 bottom-5 w-0.5 bg-slate-200 -z-0" />

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = step.isDone;
            const isActive = step.isActive;
            const isUpcoming = step.isUpcoming;

            return (
              <div
                key={step.id}
                className={`relative z-10 flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${
                  isActive
                    ? "bg-red-50/40 border-red-200 shadow-2xs"
                    : isDone
                    ? "bg-slate-50/60 border-slate-200/80"
                    : "bg-white border-slate-100 opacity-70"
                }`}
              >
                {/* Step Circle Indicator */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all ${
                    isDone
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : isActive
                      ? "bg-[#cc3333] text-white border-red-600 ring-4 ring-red-100"
                      : "bg-white text-slate-400 border-slate-200"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                </div>

                {/* Step Details */}
                <div className="flex-1 space-y-1 text-right">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">
                        {step.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-400">
                        ({step.englishLabel})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isDone
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : isActive
                            ? "bg-red-100 text-[#cc3333] border-red-200 animate-pulse"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}
                      >
                        {step.detailBadge}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  {step.technicianNote && (
                    <div className="text-[11px] text-slate-700 bg-white p-2 rounded-xl border border-slate-200/80 mt-1 flex items-start gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{step.technicianNote}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stage Controls (Workflow simulation) */}
      {onStatusChange && (
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>محاكاة وتحديث المرحلة المباشرة للبلاغ:</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              disabled={isUpdating || ticket.status === "pending"}
              onClick={() => onStatusChange(ticket.id, "pending")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ticket.status === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-amber-50 text-slate-700 border border-slate-200"
              }`}
            >
              1. استلام الطلب
            </button>
            <button
              type="button"
              disabled={isUpdating || ticket.status === "in-progress"}
              onClick={() => onStatusChange(ticket.id, "in-progress")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ticket.status === "in-progress" || ticket.status === "confirmed"
                  ? "bg-[#cc3333] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-red-50 text-slate-700 border border-slate-200"
              }`}
            >
              2. توجيه المهندس
            </button>
            <button
              type="button"
              disabled={isUpdating || ticket.status === "completed"}
              onClick={() => onStatusChange(ticket.id, "completed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                ticket.status === "completed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200"
              }`}
            >
              3. اكتمال الصيانة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface TicketTimelineModalProps {
  ticket: BookingTicket | null;
  onClose: () => void;
  onStatusChange?: (id: string, newStatus: "pending" | "confirmed" | "in-progress" | "completed") => Promise<void>;
  isUpdating?: boolean;
}

/**
 * Modal showing full detailed timeline roadmap for a single ticket
 */
export const TicketTimelineModal: React.FC<TicketTimelineModalProps> = ({
  ticket,
  onClose,
  onStatusChange,
  isUpdating = false,
}) => {
  if (!ticket) return null;

  const { steps, progressPercent, currentStageLabel } = getTicketTimelineData(ticket);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-red-600 text-white px-2 py-0.5 rounded">
                #{ticket.id}
              </span>
              <h3 className="text-lg font-black">
                المسار الزمني لبلاغ صيانة {ticket.brand} ({ticket.appliance})
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              المتابعة الحية لمراحل الصيانة الهندسية من البلاغ وحتى تسليم الضمان
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Progress Overview */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">المرحلة الحالية:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {currentStageLabel}
                </span>
                <span className="font-mono font-black text-[#cc3333]">
                  {progressPercent}%
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Detailed Timeline Steps */}
          <div className="space-y-4 relative">
            <div className="absolute right-5 top-4 bottom-4 w-0.5 bg-slate-200" />
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.id}
                  className={`relative z-10 flex items-start gap-4 p-4 rounded-2xl border ${
                    step.isActive
                      ? "bg-red-50/50 border-red-200 shadow-2xs"
                      : step.isDone
                      ? "bg-emerald-50/30 border-emerald-200/70"
                      : "bg-white border-slate-200 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                      step.isDone
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : step.isActive
                        ? "bg-[#cc3333] text-white border-red-600 ring-4 ring-red-100"
                        : "bg-white text-slate-400 border-slate-200"
                    }`}
                  >
                    {step.isDone ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5 text-right">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900">
                        {step.label} ({step.englishLabel})
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                    {step.technicianNote && (
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 mt-1">
                        {step.technicianNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket Information Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">العميل:</span>
              <span className="font-bold text-slate-800">
                {ticket.customerName || "عميل VTEC"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">رقم الهاتف:</span>
              <span className="font-mono font-bold text-slate-800">
                {ticket.customerPhone || "01025946505"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">المدينة / الحي:</span>
              <span className="font-bold text-slate-800">
                {ticket.neighborhood ? `${ticket.neighborhood}، ` : ""}
                {ticket.city}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">المهندس المسؤول:</span>
              <span className="font-bold text-slate-800">
                {ticket.technicianName || "فريق الصيانة الساحلي المعتمد"}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            إغلاق المخطط الزمني
          </button>
        </div>
      </div>
    </div>
  );
};
