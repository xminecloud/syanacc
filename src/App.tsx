import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { AiDiagnosisSection } from "./components/AiDiagnosisSection";
import { AiMapLocatorSection } from "./components/AiMapLocatorSection";
import { BrandMatrixSection } from "./components/BrandMatrixSection";
import { BrandDetailPage } from "./components/BrandDetailPage";
import { BookingAndCalendarSection } from "./components/BookingAndCalendarSection";
import { MaintenancePortalSummary } from "./components/MaintenancePortalSummary";
import { GoogleFormsSection } from "./components/GoogleFormsSection";
import { GoogleContactsSection } from "./components/GoogleContactsSection";
import { AboutAndBlogSection } from "./components/AboutAndBlogSection";
import { Footer } from "./components/Footer";
import { Phone, MessageSquare, ArrowUp } from "lucide-react";
import { BookingTicket, Brand } from "./types";
import { BRANDS_LIST } from "./data/brandsData";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedBrandPage, setSelectedBrandPage] = useState<Brand | null>(null);
  const [bookings, setBookings] = useState<BookingTicket[]>([]);
  const [bookingPrefill, setBookingPrefill] = useState({
    brand: "توشيبا",
    appliance: "غسالة ملابس",
    notes: "",
  });

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.warn("Failed to fetch bookings:", e);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // URL hash routing for separate brand pages
  useEffect(() => {
    const handleHash = () => {
      const hash = decodeURIComponent(window.location.hash || "");
      if (hash.startsWith("#brand-")) {
        const brandQuery = hash.replace("#brand-", "").trim();
        const found = BRANDS_LIST.find(
          (b) =>
            b.name.toLowerCase() === brandQuery.toLowerCase() ||
            b.englishName.toLowerCase() === brandQuery.toLowerCase()
        );
        if (found) {
          setSelectedBrandPage(found);
          return;
        }
      } else if (!hash || hash === "#home" || hash === "#brands") {
        setSelectedBrandPage(null);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleOpenBrandPage = (brand: Brand) => {
    setSelectedBrandPage(brand);
    window.location.hash = `brand-${encodeURIComponent(brand.name)}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenBrandPageByName = (brandName: string) => {
    const found = BRANDS_LIST.find((b) => b.name === brandName || b.englishName.toLowerCase() === brandName.toLowerCase());
    if (found) {
      handleOpenBrandPage(found);
    }
  };

  const handleBackFromBrandPage = () => {
    setSelectedBrandPage(null);
    window.location.hash = "brands";
    setTimeout(() => {
      const el = document.getElementById("brands");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleBookingCreated = (newBooking: BookingTicket) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "pending" | "confirmed" | "in-progress" | "completed"
  ) => {
    try {
      // Optimistic local update
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );

      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.booking) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? data.booking : b))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
      // Re-sync on failure
      fetchBookings();
    }
  };

  const handleApplyDiagnosisToBooking = (brand: string, appliance: string, notes: string) => {
    setSelectedBrandPage(null);
    setBookingPrefill({ brand, appliance, notes });
    setActiveTab("booking");
    setTimeout(() => {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleSelectBrandForBooking = (brandName: string) => {
    setSelectedBrandPage(null);
    setBookingPrefill((prev) => ({ ...prev, brand: brandName }));
    setActiveTab("booking");
    setTimeout(() => {
      const el = document.getElementById("booking");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleDiagnoseBrand = (brandName: string) => {
    setSelectedBrandPage(null);
    setActiveTab("ai-diagnose");
    setTimeout(() => {
      const el = document.getElementById("ai-diagnose");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const scrollToSection = (tab: string) => {
    if (selectedBrandPage) {
      setSelectedBrandPage(null);
    }
    setActiveTab(tab);
    if (tab === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setTimeout(() => {
      const el = document.getElementById(tab);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-red-600 selection:text-white font-['Cairo',sans-serif]">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 text-center border-b border-slate-800 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          مراكز الصيانة المعتمدة تعمل 24 ساعة بالإسكندرية والبحيرة وكفر الشيخ
        </span>
        <span className="hidden sm:inline text-slate-600">|</span>
        <span className="font-bold text-amber-400">
          الخط الساخن: 01025946505
        </span>
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={selectedBrandPage ? "brands" : activeTab}
        setActiveTab={scrollToSection}
        onBookNow={() => scrollToSection("booking")}
      />

      {/* Main Content Sections: Either Dedicated Brand Page or Full Portal */}
      <main className="flex-1">
        {selectedBrandPage ? (
          <BrandDetailPage
            brand={selectedBrandPage}
            onBack={handleBackFromBrandPage}
            onSelectOtherBrand={handleOpenBrandPage}
            onBookVisit={handleApplyDiagnosisToBooking}
            onStartDiagnosis={handleDiagnoseBrand}
          />
        ) : (
          <>
            <HeroSection
              onStartDiagnosis={() => scrollToSection("ai-diagnose")}
              onLocateCenters={() => scrollToSection("ai-map")}
              onBookVisit={() => scrollToSection("booking")}
              onOpenBrandPage={handleOpenBrandPageByName}
              onViewAllBrands={() => scrollToSection("brands")}
            />

            {/* Gemini AI with Google Search Grounding */}
            <AiDiagnosisSection onApplyToBooking={handleApplyDiagnosisToBooking} />

            {/* Gemini AI with Google Maps Grounding */}
            <AiMapLocatorSection />

            {/* 25+ Brand Directory */}
            <BrandMatrixSection
              onSelectBrandForBooking={handleSelectBrandForBooking}
              onDiagnoseBrand={handleDiagnoseBrand}
              onOpenBrandPage={handleOpenBrandPage}
            />

            {/* Booking & Google Calendar Integration */}
            <BookingAndCalendarSection
              initialBrand={bookingPrefill.brand}
              initialAppliance={bookingPrefill.appliance}
              initialNotes={bookingPrefill.notes}
              bookings={bookings}
              onBookingCreated={handleBookingCreated}
              onRefreshBookings={fetchBookings}
            />

            {/* Recharts Maintenance Request Statuses Visualization & User Portal Summary */}
            <MaintenancePortalSummary
              bookings={bookings}
              onRefresh={fetchBookings}
              onStatusChange={handleStatusChange}
              onNavigateToBooking={() => scrollToSection("booking")}
            />

            {/* Google Forms Quality Inspection Checklist */}
            <GoogleFormsSection />

            {/* Google Contacts & Emergency Hotline */}
            <GoogleContactsSection />

            {/* About Experience & Engineering Blog */}
            <AboutAndBlogSection />
          </>
        )}
      </main>

      {/* Floating Action Buttons for Emergency Access */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2.5">
        <a
          href="https://wa.me/201279177748"
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xl hover:bg-emerald-700 hover:scale-105 transition"
          title="مراسلة واتساب فورية"
        >
          <MessageSquare className="w-6 h-6" />
        </a>

        <a
          href="tel:01025946505"
          className="w-13 h-13 rounded-full bg-[#cc3333] text-white flex items-center justify-center shadow-xl hover:bg-red-800 hover:scale-105 transition"
          title="اتصال بالخط الساخن 01025946505"
        >
          <Phone className="w-6 h-6 animate-pulse" />
        </a>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
