export interface Brand {
  name: string;
  englishName: string;
  category: string;
  desc: string;
  commonFaults: string[];
}

export interface BookingTicket {
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

export interface DiagnosticResult {
  diagnosis: string;
  sources: { uri: string; title: string }[];
}

export interface MapLocationResult {
  report: string;
  mapLinks: { uri: string; title: string }[];
}

export interface InspectionItem {
  id: string;
  label: string;
  checked: boolean;
  status: "good" | "needs-repair" | "critical";
}
