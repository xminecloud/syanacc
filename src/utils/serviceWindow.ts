import { BookingTicket } from "../types";

export interface EstimatedCompletionInfo {
  requestDate: Date;
  formattedRequestDate: string;
  formattedRequestTime: string;
  estimatedDate: Date;
  formattedEstimatedDate: string;
  formattedEstimatedFull: string;
  serviceWindowHours: number;
  serviceWindowDays: number;
  serviceWindowLabel: string;
  isCompleted: boolean;
  isOverdue: boolean;
  isOnTrack: boolean;
  hoursRemaining: number;
  daysRemaining: number;
  statusBadge: {
    label: string;
    englishLabel: string;
    bg: string;
    text: string;
    border: string;
  };
}

export const DEFAULT_SERVICE_WINDOW_HOURS = 48; // 2 business days standard for VTEC maintenance

/**
 * Calculates the estimated completion date for a maintenance ticket
 * based on the request date (ticket.createdAt) plus the default service window.
 */
export function calculateEstimatedCompletion(
  ticket: BookingTicket,
  customWindowHours?: number
): EstimatedCompletionInfo {
  const windowHours = customWindowHours || ticket.serviceWindowHours || DEFAULT_SERVICE_WINDOW_HOURS;
  const windowDays = Math.round((windowHours / 24) * 10) / 10;

  // Parse request date
  let reqDate = new Date();
  if (ticket.createdAt) {
    const parsed = new Date(ticket.createdAt);
    if (!isNaN(parsed.getTime())) {
      reqDate = parsed;
    }
  }

  // Calculate estimated completion date: request date + service window
  const estimatedDate = new Date(reqDate.getTime() + windowHours * 60 * 60 * 1000);

  const now = new Date();
  const isCompleted = ticket.status === "completed";
  const diffMs = estimatedDate.getTime() - now.getTime();
  const hoursRemaining = Math.round(diffMs / (1000 * 60 * 60));
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  const isOverdue = !isCompleted && diffMs < 0;
  const isOnTrack = !isCompleted && !isOverdue;

  // Formatting
  const formattedRequestDate = reqDate.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedRequestTime = reqDate.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEstimatedDate = estimatedDate.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedEstimatedFull = `${formattedEstimatedDate} (${estimatedDate.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  })})`;

  let statusBadge: EstimatedCompletionInfo["statusBadge"];

  if (isCompleted) {
    statusBadge = {
      label: "تم الإنجاز بنجاح",
      englishLabel: "Completed on Schedule",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
    };
  } else if (isOverdue) {
    const overdueHours = Math.abs(hoursRemaining);
    statusBadge = {
      label: `تجاوز الموعد بنحو ${overdueHours} ساعة (متابعة فورية)`,
      englishLabel: "Attention: Service Window Exceeded",
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
    };
  } else if (hoursRemaining <= 12) {
    statusBadge = {
      label: `متبقي ${hoursRemaining} ساعة فقط (أولوية عاجلة)`,
      englishLabel: "Target Closing Soon",
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
    };
  } else {
    statusBadge = {
      label: `في الموعد المحدد (متبقي ${Math.max(1, Math.round(hoursRemaining / 24))} يوم)`,
      englishLabel: "On Track",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    };
  }

  const serviceWindowLabel =
    windowHours === 24
      ? "24 ساعة (يوم عمل واحد)"
      : windowHours === 48
      ? "48 ساعة (يومان عمل - قياسي)"
      : windowHours === 72
      ? "72 ساعة (3 أيام عمل)"
      : `${windowHours} ساعة`;

  return {
    requestDate: reqDate,
    formattedRequestDate,
    formattedRequestTime,
    estimatedDate,
    formattedEstimatedDate,
    formattedEstimatedFull,
    serviceWindowHours: windowHours,
    serviceWindowDays: windowDays,
    serviceWindowLabel,
    isCompleted,
    isOverdue,
    isOnTrack,
    hoursRemaining,
    daysRemaining,
    statusBadge,
  };
}
