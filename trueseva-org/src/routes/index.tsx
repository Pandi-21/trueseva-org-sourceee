import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Menu, X, Leaf, ShieldCheck, Shirt, Handshake, Phone, Mail, MapPin,
  Building2, Loader2, CheckCircle2, AlertCircle, ImageIcon,
  ChevronDown, ChevronUp, Users, ShoppingBag, Clock, FileText,
  AlertTriangle, Newspaper, ArrowRight, Info, Sparkles,
  ChevronLeft, ChevronRight, Maximize2, QrCode, Copy, Check
} from "lucide-react";
import hero from "@/assets/image12.jpeg";
import bannerImg from "@/assets/banners.png";
import qrCodeImg from "@/assets/rojavanam-qr.jpg";
import humanityTrustQrImg from "@/assets/humanity-trust-qr.jpg";
import about from "@/assets/image13.jpeg";
import logo from "@/assets/logo.png";
import img1 from "@/assets/image1.jpeg";
import img2 from "@/assets/image2.jpeg";
import img3 from "@/assets/image3.jpeg";
import img4 from "@/assets/image4.jpeg";
import img5 from "@/assets/image5.jpeg";
import img6 from "@/assets/image6.jpeg";
import img7 from "@/assets/image7.jpeg";
import img8 from "@/assets/image8.jpeg";
import img9 from "@/assets/image9.jpeg";
import img10 from "@/assets/image10.jpeg";
import img11 from "@/assets/image11.jpeg";
import { supabase } from "@/integrations/supabase/client";
import {
  SUPPORT_TYPES,
  TN_DISTRICTS,
  TN_DISTRICT_ALIASES,
  getNgosForDistrict,
  getSmileHomeDetails,
  SMILE_HOMES,
  normaliseMobile,
  validateEnquiry,
  type EnquiryInput,
  type SmileHome,
  type PaymentAccountId,
} from "@/lib/enquiry";

export const WHATSAPP_NUMBER = "919150408850"; // Official WhatsApp Helpdesk Number

type PaymentAccount = {
  beneficiary: string;
  upiId: string;
  bank: string;
  badge: string;
  apps: string;
  qrImg: string;
  qrAlt: string;
  /** Exact payload decoded from the bank-issued QR. Merchant VPAs need its mc/tr or signature fields, so never rebuild or append to it. */
  upiLink: string;
  accountNo?: string;
  ifsc?: string;
};

const PAYMENT_ACCOUNTS: Record<PaymentAccountId, PaymentAccount> = {
  rojavanam: {
    beneficiary: "M/S.ROJAVANAM",
    upiId: "ROJAVANAMTRUST@icici",
    bank: "ICICI Bank eazypay",
    badge: "ICICI Bank · eazypay",
    apps: "GPay, PhonePe, Paytm, BHIM, iMobile",
    qrImg: qrCodeImg,
    qrAlt: "ICICI eazypay QR Code - M/S ROJAVANAM (ROJAVANAMTRUST@icici)",
    upiLink: "upi://pay?pa=ROJAVANAMTRUST@icici&pn=M/S.ROJAVANAM&tr=EZYS7598841700&cu=INR&mc=5172",
  },
  "humanity-trust": {
    beneficiary: "Manithaneya Kappagam The Humanity Trust",
    upiId: "EZE0440429@CUB",
    bank: "City Union Bank",
    badge: "City Union Bank · UPI",
    apps: "GPay, PhonePe, Paytm, BHIM",
    qrImg: humanityTrustQrImg,
    qrAlt: "City Union Bank QR Code - Humanity Trust (EZE0440429@CUB)",
    upiLink: "upi://pay?pa=EzE0440429@CUB&pn=HUMANITY%20TRUST&cu=INR&mode=02&sign=ZSPli8DuxCwxuWNdXg38I7bRGbc+YzvzpShMebtKHt4=&orgid=932895441&signature=MzkwMjEwMDllYzMwZjhlZWFiZGY5OThkMjc4NGQ5OGZhNzM4M2YwYzM2ZmExODQ2ZjkwM2Y4MzIxYjFiZDM2YQ==",
    accountNo: "500101010833112",
    ifsc: "CIUB0000137",
  },
};

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, type: "image/webp", fetchPriority: "high" },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "shortcut icon", type: "image/png", href: "/logo.png" },
    ],
    meta: [
      { title: "HelpHomesIndia — Light Up Lives of the Destitute This Diwali | Verified Homes in Tamil Nadu" },
      { name: "description", content: "This Diwali, light up the lives of the destitute. Find genuinely run destitute and Care for All Homes in your district across Tamil Nadu. Direct monetary assistance or material support with zero intermediaries." },
      { property: "og:title", content: "Light Up the Lives of the Destitute This Diwali | HelpHomesIndia" },
      { property: "og:description", content: "Find genuinely run destitute and Care for All Homes in your district. Direct monetary or material support with zero commission, field-verified by TAFVA." },
      { property: "og:image", content: bannerImg },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: bannerImg },
    ],
  }),
  component: Index,
});

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "vision", label: "Vision & Mission" },
  { id: "how", label: "How It Works" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact Us" },
];

function Reveal({ children, className = "", delay = 0 }: { children?: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function scrollToSection(id: string, e?: React.MouseEvent) {
  if (e) e.preventDefault();
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 115;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - headerOffset;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });

    if (id === "enquiry-form") {
      setTimeout(() => {
        const firstInput = document.getElementById("full_name") as HTMLInputElement | null;
        if (firstInput && document.activeElement !== firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 500);
    }
  }
}

function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.888 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function Logo({ className = "h-12 w-12 md:h-14 md:w-14" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="HelpHomesIndia Logo"
      width={56}
      height={56}
      decoding="async"
      className={`object-contain shrink-0 ${className}`}
    />
  );
}

function Brand({ isFooter = false }: { isFooter?: boolean }) {
  return (
    <a
      href="#home"
      onClick={(e) => scrollToSection("home", e)}
      className="flex items-center gap-3.5 group cursor-pointer"
    >
      <Logo className="h-12 w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-105" />
      <span className="leading-tight">
        <span className={`block font-display text-xl md:text-2xl font-bold tracking-tight ${isFooter ? "text-ink-foreground" : "text-foreground"}`}>
          HelpHomesIndia
        </span>
        <span className={`block text-[11px] md:text-xs ${isFooter ? "text-ink-foreground/75" : "text-muted-foreground"}`}>
          TAFVA Verified Orphanages Homes
        </span>
      </span>
    </a>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      {/* Top Diwali Campaign Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-primary to-amber-700 text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 text-center text-xs sm:text-sm font-medium shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="shrink-0 text-sm">🪔</span>
            <span>
              <strong className="text-amber-200 font-bold">This Diwali:</strong>{" "}
              <span className="hidden sm:inline">Light up the lives of the destitute! Find genuinely run care homes in your district &amp; support directly with monetary or material aid.</span>
              <span className="sm:hidden">Light up lives of the destitute across Tamil Nadu!</span>
            </span>
          </span>
          <a
            href="#directory"
            onClick={(e) => scrollToSection("directory", e)}
            className="inline-flex items-center gap-1 font-bold underline underline-offset-4 hover:text-amber-200 transition-colors whitespace-nowrap cursor-pointer text-xs sm:text-sm shrink-0 ml-1"
          >
            Find Homes &rarr;
          </a>
        </div>
      </div>

      <div className={`transition-all duration-300 ${scrolled ? "border-b bg-background/95 py-2 backdrop-blur shadow-xs" : "bg-background/90 backdrop-blur-sm py-2.5 sm:py-3.5"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-5 lg:px-8">
          <Brand />
          <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => scrollToSection(n.id, e)}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary cursor-pointer"
              >
                {n.label}
              </a>
            ))}
            <a
              href="#directory"
              onClick={(e) => scrollToSection("directory", e)}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 cursor-pointer shadow-xs"
            >
              Elderly Care
            </a>
          </nav>
          <button
            type="button"
            className="lg:hidden p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg cursor-pointer"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-background px-5 py-4 lg:hidden">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={(e) => {
                setOpen(false);
                scrollToSection(n.id, e);
              }}
              className="block py-2.5 font-medium cursor-pointer"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#directory"
            onClick={(e) => {
              setOpen(false);
              scrollToSection("directory", e);
            }}
            className="mt-3 block rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground cursor-pointer"
          >
            Elderly Care
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-36 sm:pt-40 lg:pt-44">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-5 pb-8 sm:pb-12 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-16 items-center">
        <div className="rise lg:col-span-5 lg:pt-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span aria-hidden="true">🪔</span>
            <span>Diwali Special Campaign · Verified Direct Support</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-[1.18] sm:text-4xl md:text-5xl lg:text-6xl text-foreground">
            Light Up the Lives of the <span className="text-primary">Destitute This Diwali.</span> 🪔
          </h1>
          <p className="mt-4 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground">
            Find genuinely run destitute and Care for All Homes in your district across Tamil Nadu. Support them directly with monetary assistance or material donations like new clothing and essential groceries—with 100% transparency and zero intermediaries.
          </p>
          <p className="mt-3 text-xs sm:text-sm md:text-base font-medium text-primary flex items-center gap-2">
            <span aria-hidden="true">✨</span>
            <span>This Diwali, even a small help from you will bring immense joy to their lives.</span>
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <a
              href="#directory"
              onClick={(e) => scrollToSection("directory", e)}
              className="w-full sm:w-auto text-center rounded-full bg-primary px-6 sm:px-7 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-primary-foreground transition hover:opacity-90 active:scale-95 cursor-pointer shadow-md"
            >
              Find Homes in Your District
            </a>
            <a
              href="#how"
              onClick={(e) => scrollToSection("how", e)}
              className="w-full sm:w-auto text-center rounded-full border border-border bg-card px-5 sm:px-6 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-foreground transition hover:bg-muted active:scale-95 cursor-pointer"
            >
              How to Support
            </a>
          </div>
        </div>
        <div className="rise lg:col-span-7" style={{ animationDelay: "150ms" }}>
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-lg">
            <img
              src={hero}
              alt="Elderly care fieldwork and direct support in Tamil Nadu"
              width={1200}
              height={800}
              fetchPriority="high"
              decoding="async"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function DiwaliBanner() {
  return (
    <section aria-label="Diwali Special Campaign Banner" className="pb-12 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-8">
        <Reveal>
          <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-primary/25 bg-card shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-primary/50">
            <a
              href="#directory"
              onClick={(e) => scrollToSection("directory", e)}
              className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              title="Click to find verified care homes in your district"
            >
              <img
                src={bannerImg}
                alt="இந்த தீபாவளியில் ஆதரவற்றோர் வாழ்வில் ஒளியேற்றுங்கள் - HelpHomesIndia Diwali Campaign Banner"
                width={1672}
                height={941}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="border-t py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <img
            src={about}
            alt="Supporting and honoring Care for All Home residents in Tamil Nadu"
            loading="lazy"
            decoding="async"
            width={800}
            height={1003}
            className="aspect-[4/5] w-full rounded-xl object-cover shadow-md"
          />
        </Reveal>
        <Reveal className="lg:col-span-6 lg:col-start-7 lg:pt-8" delay={100}>
          <p className="eyebrow">About Us</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">A Pilot Initiative for Elderly Care</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/85">
            <p className="font-display text-2xl leading-snug text-foreground">HelpHomesIndia is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA).</p>
            <p>Before developing a comprehensive statewide fundraising platform in the future, this pilot initiative identifies 10 Care for All Homes across 10 districts for direct, transparent support.</p>
            <p>The initiative focuses on actual needs: new clothing, essential kitchen groceries, and direct financial assistance for food and medical expenses.</p>
            <p className="border-l-2 border-primary pl-5">HelpHomesIndia does not collect monetary or material donations from the public. It acts as a connecting platform between donors and Care for All Homes, enabling direct support without intermediaries.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const MISSION = [
  { icon: Shirt, t: "Needs-Based Support", d: "Match clothing quantities to the number of elderly men and women." },
  { icon: Leaf, t: "Nutritious Food Security", d: "Encourage suitable meals and essential groceries." },
  { icon: ShieldCheck, t: "Field Verification", d: "Recommend eligible homes assessed through actual fieldwork." },
  { icon: Handshake, t: "Zero Commission, Direct Support", d: "Connect donors directly with Care for All Homes." },
];

function Vision() {
  return (
    <section id="vision" className="bg-ink py-20 text-ink-foreground lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-2 lg:px-8">
        <Reveal>
          <h2 className="eyebrow !text-accent">Our Vision</h2>
          <p className="mt-6 font-display text-3xl leading-snug md:text-4xl">
            "No elderly person living without family support should feel forgotten. Every elder deserves dignity, loving care, nourishing food, and compassionate support."
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="eyebrow !text-accent">Our Mission</h2>
          <ol className="mt-6 divide-y divide-ink-foreground/15">
            {MISSION.map((m, i) => (
              <li key={m.t} className="flex gap-5 py-5">
                <span className="font-display text-sm text-primary">0{i + 1}</span>
                <div>
                  <h3 className="flex items-center gap-2 text-xl"><m.icon className="h-4 w-4 text-accent" aria-hidden />{m.t}</h3>
                  <p className="mt-1 text-ink-foreground/70">{m.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}

// ==================== SECTION: CARE FOR ALL HOMES DIRECTORY ====================

function ElderlyHomesDirectory() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedHomeId, setSelectedHomeId] = useState<string>("all");

  const normalizedDistrict = TN_DISTRICT_ALIASES[selectedDistrict] || selectedDistrict;
  const districtHomes = selectedDistrict
    ? SMILE_HOMES.filter((h) => h.city === selectedDistrict || h.city === normalizedDistrict)
    : [];

  const displayedHomes =
    selectedHomeId !== "all"
      ? districtHomes.filter((h) => h.id === Number(selectedHomeId))
      : districtHomes;

  const handleSelectHome = (home: SmileHome, e: React.MouseEvent) => {
    scrollToSection("enquiry-form", e);
    window.dispatchEvent(
      new CustomEvent("select-smile-home", {
        detail: { city: home.city, ngo: home.label },
      })
    );
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedHomeId("all");
  };

  return (
    <section id="directory" className="pt-14 pb-14 lg:pt-16 lg:pb-16 bg-muted/20 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Care for All Homes Directory</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Explore Care for All Homes</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Filter by district to find verified SMILE Care for All Homes in Tamil Nadu. Connect directly to provide transparent support with dignity and care.
          </p>
        </Reveal>

        {/* Filter Controls Bar */}
        <Reveal delay={100} className="mt-8">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 pb-4 border-b border-border/50">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground text-base">Care Homes by District</h3>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {/* Dropdown 1: Select District */}
              <div>
                <label htmlFor="directory-district-filter" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  1. Select District / City
                </label>
                <div className="relative">
                  <select
                    id="directory-district-filter"
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm font-medium text-foreground transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs cursor-pointer"
                  >
                    <option value="">-- Choose a District / City --</option>
                    {TN_DISTRICTS.map((d) => {
                      const count = SMILE_HOMES.filter((h) => h.city === d).length;
                      return (
                        <option key={d} value={d}>
                          {d} ({count} {count === 1 ? "Home" : "Homes"})
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Dropdown 2: Select Specific Home */}
              <div>
                <label htmlFor="directory-home-filter" className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  2. Select Care Home
                </label>
                <div className="relative">
                  <select
                    id="directory-home-filter"
                    value={selectedHomeId}
                    onChange={(e) => setSelectedHomeId(e.target.value)}
                    disabled={!selectedDistrict}
                    className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 pr-10 text-sm font-medium text-foreground transition-all hover:border-primary/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {!selectedDistrict ? (
                      <option value="all">← First select a District</option>
                    ) : (
                      <>
                        <option value="all">All Homes in {selectedDistrict} ({districtHomes.length})</option>
                        {districtHomes.map((home) => (
                          <option key={home.id} value={home.id}>
                            {home.name} – {home.label.replace(home.name + " – ", "")}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Dynamic Filter Results Area */}
        <div className="mt-8">
          {!selectedDistrict ? (
            /* Empty prompt state */
            <Reveal delay={150}>
              <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-foreground">Select a District to View Homes</h4>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Choose a district from the dropdown filter above to see verified SMILE Care for All Homes in that region.
                </p>
              </div>
            </Reveal>
          ) : displayedHomes.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <p className="text-muted-foreground">No Care for All Homes found for the selected filter.</p>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">
                  Showing <span className="text-foreground font-bold">{displayedHomes.length}</span> verified SMILE {displayedHomes.length === 1 ? "home" : "homes"} in <span className="text-primary font-bold">{selectedDistrict}</span>
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayedHomes.map((home, index) => (
                  <Reveal key={home.id} delay={index * 60} className="h-full">
                    <div className="group relative flex flex-col h-full rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between">
                        <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                          Home {home.sNo > 9 ? `0${home.sNo}`.slice(-2) : `0${home.sNo}`}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>SMILE Verified</span>
                        </span>
                      </div>

                      {/* Home Name */}
                      <div className="mt-4">
                        <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                          {home.name}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-foreground/85">
                          {home.label.replace(home.name + " – ", "")}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                          <span>{home.city}, Tamil Nadu</span>
                        </p>
                      </div>

                      {/* Contact Info (Unified Phone: +91 91504 08850, NO ADDRESS) */}
                      <div className="mt-5 rounded-xl bg-muted/30 p-3.5 text-xs space-y-2 border border-border/40">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="text-muted-foreground">Helpline / Contact:</span>
                          <a
                            href={`tel:${home.phone}`}
                            className="font-bold text-foreground hover:text-primary transition-colors text-xs ml-auto"
                          >
                            +91 {home.phone}
                          </a>
                        </div>
                        {home.email && (
                          <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                            <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="text-muted-foreground">Email:</span>
                            <a
                              href={`mailto:${home.email}`}
                              className="text-muted-foreground hover:text-primary transition-colors truncate text-xs ml-auto max-w-[180px]"
                            >
                              {home.email}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="inline-flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span>Verified Home</span>
                        </span>
                      </div>
                      <div className="mt-2 flex items-start gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 px-3 py-2 text-[11px] leading-snug">
                        <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                          Approved by Government of India · Tamil Nadu Member
                        </span>
                      </div>

                      {/* Action Button */}
                      <div className="mt-5 pt-4 border-t border-border/50">
                        <button
                          type="button"
                          onClick={(e) => handleSelectHome(home, e)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 active:scale-95 transition-all cursor-pointer"
                        >
                          <span>Support {home.name}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ==================== SECTION: DIRECT SUPPORT PROCESS ====================

const STEPS = [
  {
    t: "Explore",
    d: "Discover a Care for All Home's current essential needs and available information.",
  },
  {
    t: "Confirm",
    d: "Contact the administrator to confirm requirements, quantities, delivery details, and the preferred method of support.",
  },
  {
    t: "Support Directly",
    d: "Send clothing and groceries directly to the Care for All Home or transfer financial assistance directly to its verified official trust account.",
  },
  {
    t: "Follow Up",
    d: "Check confirmed updates on the home's essential needs and support status when verified records are available.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="pt-10 pb-12 lg:pt-12 lg:pb-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Direct Support Process</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Simple, Direct and Transparent</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Support elderly residents by meeting their essential needs directly. Contact the home administrator to confirm requirements before sending goods or financial assistance.
          </p>
        </Reveal>
        <ol className="relative mt-12 grid gap-10 border-l-2 border-primary/25 pl-8 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:border-t-2 lg:pl-0 lg:pt-10">
          {STEPS.map((s, i) => (
            <li
              key={s.t}
              className="relative group cursor-pointer transition-transform duration-300 hover:-translate-y-1 active:scale-[0.98]"
            >
              <Reveal delay={i * 120}>
                {/* Interactive Animated Dot on line with continuous radar pulse on all screens */}
                <div
                  className="absolute -left-[39px] top-1 lg:-top-[47px] lg:left-0 flex items-center justify-center h-3.5 w-3.5"
                  aria-hidden
                >
                  {/* Outer animated ripple halo - alive across all viewports with staggered ripple */}
                  <span
                    className="absolute h-3.5 w-3.5 rounded-full bg-primary animate-step-radar transition-all duration-500 ease-out group-hover:scale-[3] group-hover:opacity-40"
                    style={{ animationDelay: `${i * 1000}ms` }}
                  />
                  {/* Medium ring glow */}
                  <span
                    className="absolute h-3.5 w-3.5 rounded-full bg-primary/30 transition-all duration-300 ease-out group-hover:scale-[1.9] group-hover:opacity-80"
                  />
                  {/* Core Dot with glowing shadow pulse + hover magnification */}
                  <span
                    className="relative h-3.5 w-3.5 rounded-full bg-primary animate-step-glow transition-all duration-300 ease-out group-hover:scale-125 group-hover:ring-4 group-hover:ring-primary/30 group-hover:shadow-[0_0_14px_rgba(233,88,40,0.6)]"
                    style={{ animationDelay: `${i * 1000}ms` }}
                  />
                </div>
                <p className="eyebrow transition-colors duration-300 group-hover:text-primary">Step 0{i + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold transition-colors duration-300 group-hover:text-primary">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground text-sm md:text-base">{s.d}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// ==================== SECTION: DONATION STANDARDS ====================

function DonationStandards() {
  const handleSupportClick = (supportType: string, e: React.MouseEvent) => {
    scrollToSection("enquiry-form", e);
    window.dispatchEvent(
      new CustomEvent("select-smile-home", {
        detail: { supportType },
      })
    );
  };

  return (
    <section id="standards" className="pt-12 pb-14 lg:pt-14 lg:pb-16 bg-muted/10 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Donation Standards</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Support With Care and Dignity</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Choose suitable essentials based on the home's confirmed needs. Every contribution should respect the dignity, health, and well-being of elderly residents.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {/* Column 1: New Clothing Only */}
          <Reveal delay={0} className="h-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 active:scale-[0.99]">
              {/* Shimmer top gradient line - alive on all screens */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
              {/* Ambient radial glow - alive on all screens */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl opacity-60 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />

              {/* Floating Icon - organic float on mobile + hover bounce on desktop */}
              <div className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 animate-float group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/25">
                <Shirt className="h-7 w-7 transition-transform duration-300 group-hover:scale-105" />
              </div>

              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                New Clothing Only
              </h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Accepted Items</p>

              {/* Checklist with hover translate */}
              <ul className="mt-4 space-y-2 text-sm text-foreground flex-1">
                {["Men's dhotis", "Men's shirts", "Towels", "Women's sarees", "Blouse materials", "Nightwear"].map((item) => (
                  <li
                    key={item}
                    className="group/item flex items-center gap-2.5 rounded-lg px-2 py-1 -mx-2 transition-all duration-200 hover:bg-primary/5 hover:translate-x-1.5 active:bg-primary/5 cursor-default"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary transition-all duration-200 group-hover/item:scale-110 group-hover/item:bg-primary group-hover/item:text-white shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-foreground/90 transition-colors group-hover/item:text-primary">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Note Box */}
              <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300 transition-all duration-300 group-hover:border-amber-500/40 group-hover:bg-amber-500/15">
                <strong className="text-amber-900 dark:text-amber-200">Important Note:</strong> Only new clothing items are accepted. Used clothing is not accepted.
              </div>

              {/* Support CTA Button */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={(e) => handleSupportClick("New Clothing", e)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20 active:scale-95 cursor-pointer"
                >
                  <span>Support With Clothing</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 animate-arrow-nudge group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Column 2: Essential Groceries */}
          <Reveal delay={100} className="h-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:border-turquoise/50 hover:shadow-2xl hover:shadow-turquoise/10 active:scale-[0.98]">
              {/* Shimmer top gradient line - alive on all screens */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-turquoise to-transparent opacity-90 transition-opacity duration-300 animate-shimmer" />
              {/* Ambient radial glow - alive on all screens */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-turquoise/15 blur-3xl opacity-70 transition-opacity duration-500 animate-pulse-glow" />

              {/* Floating Icon - organic float with stagger */}
              <div
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-turquoise/10 text-turquoise ring-2 ring-turquoise/20 transition-all duration-300 animate-float group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-turquoise group-hover:text-white group-hover:shadow-lg group-hover:shadow-turquoise/25"
                style={{ animationDelay: "600ms" }}
              >
                <ShoppingBag className="h-7 w-7 transition-transform duration-300 group-hover:scale-105" />
              </div>

              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-turquoise">
                Essential Groceries
              </h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggested Items</p>

              {/* Checklist with hover translate */}
              <ul className="mt-4 space-y-2 text-sm text-foreground flex-1">
                {[
                  "Ponni rice or raw rice",
                  "Toor dal",
                  "Moong dal",
                  "Groundnut oil",
                  "Sesame oil",
                  "Ghee",
                  "Semolina",
                  "Wheat flour",
                ].map((item) => (
                  <li
                    key={item}
                    className="group/item flex items-center gap-2.5 rounded-lg px-2 py-1 -mx-2 transition-all duration-200 hover:bg-turquoise/5 hover:translate-x-1.5 active:bg-turquoise/5 cursor-default"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-turquoise/15 text-turquoise transition-all duration-200 group-hover/item:scale-110 group-hover/item:bg-turquoise group-hover/item:text-white shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-foreground/90 transition-colors group-hover/item:text-turquoise">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Note Box */}
              <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300 transition-all duration-300 group-hover:border-amber-500/40 group-hover:bg-amber-500/15">
                <strong className="text-amber-900 dark:text-amber-200">Important Note:</strong> Confirm the home's current requirements and any dietary restrictions before sending groceries.
              </div>

              {/* Support CTA Button */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={(e) => handleSupportClick("Essential Groceries", e)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-turquoise/30 bg-turquoise/5 px-4 py-2.5 text-xs font-semibold text-turquoise transition-all duration-300 hover:bg-turquoise hover:text-white hover:shadow-md hover:shadow-turquoise/20 active:scale-95 cursor-pointer"
                >
                  <span>Support With Groceries</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 animate-arrow-nudge group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Column 3: Direct Financial Assistance */}
          <Reveal delay={200} className="h-full">
            <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-xs transition-all duration-300 ease-out hover:-translate-y-2 hover:border-accent/60 hover:shadow-2xl hover:shadow-accent/15 active:scale-[0.98]">
              {/* Shimmer top gradient line - alive on all screens */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent opacity-90 transition-opacity duration-300 animate-shimmer" />
              {/* Ambient radial glow - alive on all screens */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl opacity-70 transition-opacity duration-500 animate-pulse-glow" />

              {/* Floating Icon - organic float with stagger */}
              <div
                className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent ring-2 ring-accent/30 transition-all duration-300 animate-float group-hover:scale-110 group-hover:-rotate-3 group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-lg group-hover:shadow-accent/25"
                style={{ animationDelay: "1200ms" }}
              >
                <Building2 className="h-7 w-7 transition-transform duration-300 group-hover:scale-105" />
              </div>

              <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-foreground">
                Direct Financial Assistance
              </h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Areas of Support</p>

              {/* Checklist with hover translate */}
              <ul className="mt-4 space-y-2 text-sm text-foreground flex-1">
                {[
                  "Food assistance",
                  "Medical assistance",
                  "Essential care expenses",
                ].map((item) => (
                  <li
                    key={item}
                    className="group/item flex items-center gap-2.5 rounded-lg px-2 py-1 -mx-2 transition-all duration-200 hover:bg-accent/10 hover:translate-x-1.5 active:bg-accent/10 cursor-default"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent transition-all duration-200 group-hover/item:scale-110 group-hover/item:bg-accent group-hover/item:text-accent-foreground shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium text-foreground/90 transition-colors group-hover/item:text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Note Box */}
              <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300 transition-all duration-300 group-hover:border-amber-500/40 group-hover:bg-amber-500/15">
                <strong className="text-amber-900 dark:text-amber-200">Important Note:</strong> Financial transfers must go directly to verified official trust accounts. Confirm the current requirement and recipient details before making a transfer.
              </div>

              {/* Support CTA Button */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={(e) => handleSupportClick("Financial Assistance", e)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-xs font-semibold text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-md active:scale-95 cursor-pointer"
                >
                  <span>Direct Financial Support</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 animate-arrow-nudge group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ==================== SECTION: NEWS & EVENTS ====================

function NewsEvents() {
  const news = [
    {
      title: "Diwali Elderly Care Pilot Launch",
      description: "Preparation of detailed essential-needs lists for 10 Care for All Homes across 10 districts of Tamil Nadu.",
      status: "In Progress",
      statusType: "progress",
      statusClass: "bg-primary/10 text-primary border-primary/25",
    },
    {
      title: "Elderly Welfare and Food Security Guidance",
      description: "Encouraging essential grocery support and appropriate food provisions while considering age-related dietary requirements, including the needs of residents with diabetes. Avoid unnecessary sweets and unsuitable food items.",
      status: "Active Guidance",
      statusType: "active",
      statusClass: "bg-turquoise/10 text-turquoise border-turquoise/25",
    },
    {
      title: "A Future Statewide Initiative",
      description: "Plans to explore a broader platform connecting eligible Care for All Homes across Tamil Nadu following the pilot initiative.",
      status: "Planned",
      statusType: "planned",
      statusClass: "bg-muted text-muted-foreground border-border",
    },
  ];

  return (
    <section id="news" className="pt-10 pb-12 lg:pt-12 lg:pb-14 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">News & Events</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Updates From the Initiative</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Stay informed about the elderly care initiative, essential-needs awareness, and plans to improve support for eligible care homes across Tamil Nadu.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3 items-stretch">
          {news.map((item, i) => (
            <Reveal key={item.title} delay={i * 120} className="h-full">
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/90 p-6 md:p-8 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98] cursor-pointer">
                {/* Top Animated Gradient Accent Bar - alive with shimmer on all screens */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer opacity-85 transition-all duration-500 ease-out" />

                {/* Ambient Decorative Watermark Number */}
                <span className="absolute -bottom-5 -right-2 text-8xl font-black font-display text-foreground/[0.04] select-none pointer-events-none group-hover:text-primary/[0.09] group-hover:scale-110 transition-all duration-500">
                  0{i + 1}
                </span>

                <div className="relative z-10">
                  {/* Top Bar: Update No & Animated Beacon Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      <Newspaper className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-float" style={{ animationDelay: `${i * 800}ms` }} />
                      Update 0{i + 1}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border transition-all duration-300 group-hover:shadow-xs ${item.statusClass}`}>
                      {item.statusType === "progress" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                        </span>
                      )}
                      {item.statusType === "active" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-turquoise opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-turquoise" />
                        </span>
                      )}
                      {item.statusType === "planned" && (
                        <span className="inline-flex rounded-full h-2 w-2 bg-muted-foreground/50" />
                      )}
                      <span>{item.status}</span>
                    </span>
                  </div>

                  {/* Title & Description with Hover Color Transitions */}
                  <h3 className="mt-4 text-xl font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Footer with Visible Arrow Micro-interaction on All Devices */}
                <div className="relative z-10 mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  <span className="font-medium">Official Initiative Release</span>
                  <div className="flex items-center gap-1 text-primary font-semibold text-xs transition-all duration-300 group-hover:translate-x-1">
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 animate-arrow-nudge group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const GALLERY = [
  {
    src: img4,
    label: "Rojavanam SMILE Old Age Home — Tenkasi",
    subtitle: "Elderly residents, dedicated staff, and coordinators at Courtallam, Tenkasi",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: img1,
    label: "Field Inspection & Elder Care Visit",
    subtitle: "Field verification visit and interaction with elderly residents",
    span: "",
  },
  {
    src: img2,
    label: "Nursing & Medical Care Support",
    subtitle: "Qualified healthcare nurses providing medical checkup and care",
    span: "",
  },
  {
    src: img3,
    label: "Clothing & Direct Support Distribution",
    subtitle: "Presenting new clothing, traditional shawls, and daily essentials",
    span: "",
  },
  {
    src: img5,
    label: "Youth Volunteers & Birthday Celebration",
    subtitle: "Bringing smiles, festive cake cutting, and warmth to elderly residents",
    span: "",
  },
  {
    src: img6,
    label: "Traditional Pongal Festival Celebration",
    subtitle: "Elders and caregivers gathering together in festive traditional celebration",
    span: "md:col-span-2",
  },
  {
    src: img7,
    label: "Festive Joy & Caregiver Support",
    subtitle: "Christmas celebration with wheelchair-assisted residents and medical staff",
    span: "",
  },
  {
    src: img8,
    label: "Community Celebration with Volunteers",
    subtitle: "Youth and care workers celebrating memorable milestones with residents",
    span: "md:col-span-2",
  },
  {
    src: img9,
    label: "Garden Environment & Companionship",
    subtitle: "Smiling elderly residents enjoying peaceful outdoor greenery together",
    span: "",
  },
  {
    src: img10,
    label: "Bringing Smiles to Senior Elders",
    subtitle: "Heartfelt happiness and dignity in elder care living",
    span: "",
  },
  {
    src: img11,
    label: "Comfortable Residential Facility",
    subtitle: "Clean living quarters, comfortable beds, and dedicated senior support",
    span: "",
  },
  {
    src: hero,
    label: "TAFVA Elders Care Fieldwork",
    subtitle: "Direct on-ground verification and mobility aid support across Tamil Nadu",
    span: "",
  },
];

function Gallery() {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") setActive((prev) => (prev! + 1) % GALLERY.length);
      if (e.key === "ArrowLeft") setActive((prev) => (prev! - 1 + GALLERY.length) % GALLERY.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  const prevImage = () => {
    setActive((prev) => (prev !== null ? (prev - 1 + GALLERY.length) % GALLERY.length : null));
  };

  const nextImage = () => {
    setActive((prev) => (prev !== null ? (prev + 1) % GALLERY.length : null));
  };

  return (
    <section id="gallery" className="border-t bg-secondary/30 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="eyebrow">Gallery</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">A Closer Look at the Initiative</h2>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-3xl">
            Real moments from verified Care for All Homes across Tamil Nadu — highlighting compassionate care, healthcare support, community visits, and dignified living.
          </p>
        </Reveal>

        <div className="mt-12 grid auto-rows-[220px] sm:auto-rows-[240px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {GALLERY.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative overflow-hidden rounded-xl border border-border/80 bg-card text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 ${g.span}`}
            >
              <img
                src={g.src}
                alt={g.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

              {/* Expand Hint Icon */}
              <div className="absolute top-3 right-3 rounded-full bg-black/50 backdrop-blur-xs p-1.5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="h-4 w-4" />
              </div>

              {/* Labels */}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="text-xs sm:text-sm font-semibold leading-snug drop-shadow-sm text-white">
                  {g.label}
                </p>
                <p className="mt-1 text-[11px] text-white/75 line-clamp-1">
                  {g.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={GALLERY[active]?.label}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all animate-in fade-in duration-200"
          onClick={() => setActive(null)}
        >
          {/* Close button */}
          <button
            autoFocus
            onClick={() => setActive(null)}
            className="fixed top-5 right-5 z-20 flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs transition cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span>Close</span>
          </button>

          {/* Navigation Prev Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous photo"
            className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 sm:p-3 backdrop-blur-xs transition shadow-lg cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Navigation Next Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next photo"
            className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 sm:p-3 backdrop-blur-xs transition shadow-lg cursor-pointer"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          {/* Main Content Modal Card */}
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden rounded-2xl bg-black/50 shadow-2xl max-h-[72vh] flex items-center justify-center border border-white/10">
              <img
                src={GALLERY[active]?.src}
                alt={GALLERY[active]?.label || "Fieldwork photo"}
                className="max-h-[72vh] w-auto max-w-full object-contain select-none"
              />
            </div>

            {/* Caption & Counter */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between w-full px-2 gap-2 text-white">
              <div className="text-center sm:text-left">
                <p className="text-base font-semibold text-white">{GALLERY[active]?.label}</p>
                <p className="text-xs text-white/70 mt-0.5">{GALLERY[active]?.subtitle}</p>
              </div>
              <span className="text-xs font-semibold text-white/70 bg-white/10 px-3 py-1 rounded-full whitespace-nowrap">
                {active + 1} / {GALLERY.length}
              </span>
            </div>

            {/* Thumbnail Strip */}
            <div className="mt-3 flex items-center gap-2 overflow-x-auto max-w-full py-1 px-2">
              {GALLERY.map((g, idx) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive(idx);
                  }}
                  className={`h-11 w-15 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${active === idx
                    ? "border-primary scale-105 shadow-md opacity-100"
                    : "border-transparent opacity-40 hover:opacity-90"
                    }`}
                >
                  <img src={g.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const EMPTY: EnquiryInput = {
  full_name: "",
  mobile: "",
  email: "",
  district: "",
  ngo: "",
  support_type: "",
  amount: "",
  message: "",
};

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string | undefined; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}{required ? <span className="text-primary"> *</span> : <span className="font-normal text-muted-foreground"> (optional)</span>}</label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-md border border-input bg-card px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40 aria-[invalid=true]:border-destructive";

function Contact() {
  const [v, setV] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryInput, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<{ notice?: string; manualWaUrl?: string }>({});
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ city?: string; ngo?: string; supportType?: string }>;
      if (customEvent.detail) {
        setV((prev) => ({
          ...prev,
          ...(customEvent.detail.city ? { district: customEvent.detail.city } : {}),
          ...(customEvent.detail.ngo ? { ngo: customEvent.detail.ngo } : {}),
          ...(customEvent.detail.supportType ? { support_type: customEvent.detail.supportType } : {}),
        }));
        if (customEvent.detail.city) clearError("district");
        if (customEvent.detail.ngo) clearError("ngo");
        if (customEvent.detail.supportType) clearError("support_type");
      }
    };
    window.addEventListener("select-smile-home", handleSelect);
    return () => window.removeEventListener("select-smile-home", handleSelect);
  }, []);

  const selectedHome = getSmileHomeDetails(v.ngo, v.district);
  const payment = PAYMENT_ACCOUNTS[selectedHome?.paymentAccount ?? "rojavanam"];

  const clearError = (k: keyof EnquiryInput) => {
    setErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };
  const set = (k: keyof EnquiryInput) => (e: { target: { value: string } }) => {
    setV((prev) => ({ ...prev, [k]: e.target.value }));
    clearError(k);
  };
  const a = (k: keyof EnquiryInput) => ({ id: k, "aria-invalid": !!errors[k], ...(errors[k] ? { "aria-describedby": `${k}-err` } : {}) });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const errs = validateEnquiry(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");

    const isFinancial = v.support_type === "Financial Assistance";
    const amountVal = isFinancial && v.amount ? `₹${Number(v.amount).toLocaleString("en-IN")}` : "";

    // Format pre-filled WhatsApp message for manual chat link
    const lines = [
      "New Support Enquiry - HelpHomesIndia",
      "",
      `Name: ${v.full_name.trim()}`,
      `Mobile: +91 ${normaliseMobile(v.mobile)}`,
    ];
    if (v.email.trim()) lines.push(`Email: ${v.email.trim()}`);
    lines.push(`City / District: ${v.district}`);
    lines.push(`SMILE Care Home: ${v.ngo}`);
    if (selectedHome) {
      lines.push(`Home Contact: +91 ${selectedHome.phone}`);
    }
    lines.push(`Support Type: ${v.support_type}`);
    if (amountVal) lines.push(`Amount: ${amountVal}`);
    if (v.message.trim()) lines.push(`Message: ${v.message.trim()}`);
    lines.push("");
    lines.push("Sent via HelpHomesIndia initiative portal");
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

    try {
      // 1. Submit through Server API route (which automatically triggers Meta WhatsApp notifications + delayed receipt)
      const response = await fetch("/api/whatsapp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: v.full_name.trim(),
          mobile: normaliseMobile(v.mobile)!,
          email: v.email.trim() || null,
          district: v.district,
          ngo: v.ngo,
          support_type: v.support_type,
          amount: v.amount,
          message: v.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      setStatus("success");
      setFeedback({
        notice: data.whatsappNotice || "Enquiry recorded and WhatsApp notifications dispatched.",
        manualWaUrl: waUrl,
      });
      setV(EMPTY);
    } catch (err) {
      console.error("Server enquiry submission error:", err);
      // Fallback: direct Supabase insert
      try {
        await supabase.from("enquiries").insert({
          full_name: v.full_name.trim(),
          mobile: normaliseMobile(v.mobile)!,
          email: v.email.trim() || null,
          support_type: v.support_type,
          district: v.district,
          message: `[SMILE Home: ${v.ngo}]${amountVal ? ` [Amount: ${amountVal}]` : ""} ${v.message.trim()}`,
        });
      } catch (dbErr) {
        console.error("Supabase fallback insert error:", dbErr);
      }
      setStatus("success");
      setFeedback({
        notice: "Enquiry submitted successfully.",
        manualWaUrl: waUrl,
      });
      setV(EMPTY);
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Contact Us</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Help Connect Support With Need</h2>
          <p className="mt-5 text-lg text-muted-foreground">Have questions about supporting a Care for All Home? Share your details and the type of assistance you are interested in.</p>
          <div className="mt-10 space-y-6">
            {[
              { i: Building2, k: "Coordinating Organisation", val: "Tamil Nadu Federation of Voluntary Agencies (TAFVA)" },
              { i: Phone, k: "WhatsApp / Helpdesk", val: "+91 91504 08850", href: `https://wa.me/${WHATSAPP_NUMBER}` },
              { i: Mail, k: "Email", val: "elderscare@helphomesindia.org", href: "mailto:elderscare@helphomesindia.org" },
            ].map((c) => (
              <div key={c.k} className="flex gap-4">
                <c.i className="mt-1 h-5 w-5 shrink-0 text-turquoise" aria-hidden />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.k}</div>
                  <div className="mt-1 font-medium">{c.href ? <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">{c.val}</a> : c.val}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal className="lg:col-span-7" delay={100}>
          <form id="enquiry-form" noValidate onSubmit={submit} className="scroll-mt-24 space-y-5 rounded-xl border bg-card p-6 md:p-10 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20">
            {/* Form Title & Context Badge for Mobile Clarity */}
            <div className="border-b border-border/60 pb-3">
              <span className="eyebrow">Direct Assistance</span>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Support Enquiry Form</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Submit your details to coordinate transparent, direct support with verified Care for All Homes.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field id="full_name" label="Full Name" required error={errors.full_name}>
                <input {...a("full_name")} className={inputCls} value={v.full_name} onChange={set("full_name")} maxLength={100} autoComplete="name" placeholder="Your Name" />
              </Field>
              <Field id="mobile" label="Mobile Number" required error={errors.mobile}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-semibold text-muted-foreground">
                    +91
                  </span>
                  <input
                    {...a("mobile")}
                    type="tel"
                    inputMode="numeric"
                    className={`${inputCls} pl-12`}
                    value={v.mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setV({ ...v, mobile: digits });
                      clearError("mobile");
                    }}
                    maxLength={10}
                    autoComplete="tel"
                    placeholder="91504 08850"
                  />
                </div>
              </Field>
            </div>

            <Field id="email" label="Email Address" error={errors.email}>
              <input {...a("email")} type="email" className={inputCls} value={v.email} onChange={set("email")} maxLength={255} autoComplete="email" placeholder="example@gmail.com" />
            </Field>

            {/* 1. First: City / District Selection & 2. Second: SMILE Old Age Home Selection */}
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="district" label="1. Preferred City / District" required error={errors.district}>
                <select
                  {...a("district")}
                  className={inputCls}
                  value={v.district}
                  onChange={(e) => {
                    const d = e.target.value;
                    setV({ ...v, district: d, ngo: "" });
                    clearError("district");
                  }}
                >
                  <option value="">Select City / District…</option>
                  {TN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </Field>

              <Field id="ngo" label="2. SMILE Old Age Home" required error={errors.ngo}>
                <select
                  {...a("ngo")}
                  className={inputCls}
                  value={v.ngo}
                  onChange={set("ngo")}
                  disabled={!v.district}
                >
                  <option value="">
                    {v.district ? "Select SMILE Old Age Home…" : "← First select a City / District"}
                  </option>
                  {getNgosForDistrict(v.district).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Selected SMILE Home Verification Card */}
            {selectedHome && (
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{selectedHome.name}</span>
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {selectedHome.city}
                  </span>
                </div>
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{selectedHome.label.replace(selectedHome.name + " – ", "")}</span>
                </p>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                  <span>Verified Home · Approved by Government of India · Tamil Nadu Member</span>
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground pt-1.5 border-t border-primary/15">
                  <a href={`tel:${selectedHome.phone}`} className="flex items-center gap-1 hover:text-primary font-medium">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>+91 {selectedHome.phone}</span>
                  </a>
                  {selectedHome.email && (
                    <a href={`mailto:${selectedHome.email}`} className="flex items-center gap-1 hover:text-primary font-medium">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{selectedHome.email}</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* 3. Third: Support Type & 4. Support Amount (Only when Financial Assistance is selected) */}
            <div className={v.support_type === "Financial Assistance" ? "grid gap-5 md:grid-cols-2" : ""}>
              <Field id="support_type" label="3. Support Type" required error={errors.support_type}>
                <select
                  {...a("support_type")}
                  className={inputCls}
                  value={v.support_type}
                  onChange={(e) => {
                    const st = e.target.value;
                    setV((prev) => ({
                      ...prev,
                      support_type: st,
                      amount: st === "Financial Assistance" ? prev.amount : "",
                    }));
                    clearError("support_type");
                    if (st !== "Financial Assistance") {
                      clearError("amount");
                    }
                  }}
                >
                  <option value="">Select Support Type…</option>
                  {SUPPORT_TYPES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              {v.support_type === "Financial Assistance" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Field id="amount" label="4. Support / Donation Amount (₹)" required error={errors.amount}>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-muted-foreground">
                        ₹
                      </span>
                      <input
                        {...a("amount")}
                        type="text"
                        inputMode="numeric"
                        className={`${inputCls} pl-8`}
                        value={v.amount}
                        onChange={(e) => {
                          const num = e.target.value.replace(/\D/g, "");
                          setV((prev) => ({ ...prev, amount: num }));
                          clearError("amount");
                        }}
                        maxLength={8}
                        placeholder="e.g. 1000"
                        autoFocus
                      />
                    </div>
                    {/* Quick Presets */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {["500", "1000", "2500", "5000", "10000"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setV((prev) => ({ ...prev, amount: amt }));
                            clearError("amount");
                          }}
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all cursor-pointer ${v.amount === amt
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-border/80 bg-background hover:border-primary/50 text-foreground/80 hover:text-primary"
                            }`}
                        >
                          ₹{Number(amt).toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}
            </div>

            {/* Direct Official Trust QR Code & UPI Payment Card (Visible whenever Financial Assistance is selected) */}
            {v.support_type === "Financial Assistance" && (
              <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-background p-5 md:p-6 dark:from-amber-950/30 dark:via-orange-950/15 dark:to-background dark:border-amber-500/25 shadow-sm animate-in fade-in slide-in-from-top-3 duration-300">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-4 border-b border-amber-200/70 dark:border-amber-800/40">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs shrink-0">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground flex flex-wrap items-center gap-2">
                        <span>Direct Financial Support via UPI</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          <ShieldCheck className="h-3 w-3" /> 100% Verified Trust
                        </span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedHome ? `Supporting: ${selectedHome.name} (${selectedHome.city})` : "Official Trust Account for Verified Orphanages Homes"}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-900/90 dark:text-amber-200 bg-amber-100/90 dark:bg-amber-900/50 px-2.5 py-1 rounded-md border border-amber-300/60 dark:border-amber-700/50">
                    {payment.badge}
                  </span>
                </div>

                <div className="mt-5 grid md:grid-cols-12 gap-6 items-center">
                  {/* Left: Scan QR Image */}
                  <div className="md:col-span-5 flex flex-col items-center">
                    <div
                      onClick={() => setShowQrModal(true)}
                      className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-amber-400/80 dark:border-amber-600/80 bg-white p-2.5 shadow-md transition-all hover:shadow-xl hover:scale-[1.02]"
                      title="Click to view full size QR code"
                    >
                      <img
                        src={payment.qrImg}
                        alt={payment.qrAlt}
                        className="w-52 h-auto max-w-full rounded-xl object-contain select-none"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-stone-900 shadow">
                          <Maximize2 className="h-3.5 w-3.5" /> Tap to Enlarge
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-600" /> Tap QR to view full screen
                    </p>
                  </div>

                  {/* Right: Payment Details & Instant Actions */}
                  <div className="md:col-span-7 space-y-3.5">
                    <div className="rounded-xl border border-border/80 bg-background/95 p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Beneficiary / Merchant Name</span>
                        <span className="font-bold text-foreground text-right">{payment.beneficiary}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                        <span className="text-muted-foreground font-medium">Official UPI ID (VPA)</span>
                        <span className="font-mono font-bold text-primary text-sm select-all">{payment.upiId}</span>
                      </div>
                      {payment.accountNo && (
                        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                          <span className="text-muted-foreground font-medium">Account Number</span>
                          <span className="font-mono font-bold text-foreground select-all">{payment.accountNo}</span>
                        </div>
                      )}
                      {payment.ifsc && (
                        <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                          <span className="text-muted-foreground font-medium">IFSC Code</span>
                          <span className="font-mono font-bold text-foreground select-all">{payment.ifsc}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                        <span className="text-muted-foreground font-medium">Banking Partner</span>
                        <span className="font-semibold text-foreground">{payment.bank}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1.5 border-t border-border/50">
                        <span className="text-muted-foreground font-medium">Accepted Apps</span>
                        <span className="text-muted-foreground text-[11px]">{payment.apps}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== "undefined" && navigator.clipboard) {
                            navigator.clipboard.writeText(payment.upiId);
                            setCopiedUpi(true);
                            setTimeout(() => setCopiedUpi(false), 2500);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20 cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span>UPI ID Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Simple Instructions */}
                    <div className="text-[12px] leading-relaxed text-muted-foreground space-y-1 rounded-lg bg-amber-500/5 p-3 border border-amber-500/15">
                      <p className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
                        <Info className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Direct Support Guidelines:</span>
                      </p>
                      <p>
                        1. Scan the QR code or copy the UPI ID, then enter the amount ({v.amount ? `₹${Number(v.amount).toLocaleString("en-IN")}` : "entered above"}).
                      </p>
                      <p>
                        2. All donations for verified homes are received into this audited trust account with zero commissions.
                      </p>
                      <p>
                        3. Submit this form below to receive your official verified acknowledgement receipt on WhatsApp!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Field id="message" label="Message or Enquiry" required error={errors.message}>
              <textarea {...a("message")} rows={4} className={inputCls} value={v.message} onChange={set("message")} maxLength={2000} placeholder="Provide clothing sizes, food preferences, or specific queries..." />
            </Field>

            <p className="text-xs text-muted-foreground">Your details are used only to respond to your enquiry and are never shared or sold.</p>

            <div aria-live="polite">
              {status === "success" && (
                <div className="rounded-xl border border-green-500/30 bg-green-50/70 p-5 dark:bg-green-950/30 text-foreground space-y-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 font-semibold text-base text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>Enquiry Submitted Successfully!</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
                      {feedback.notice || "Automated WhatsApp acknowledgement dispatched."}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>An official HelpHomesIndia acknowledgement receipt will be sent automatically to your WhatsApp in 1–2 hours.</span>
                    </p>
                  </div>
                  {feedback.manualWaUrl && (
                    <div className="pt-2 border-t border-border/60">
                      <a
                        href={feedback.manualWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#128C7E] dark:text-[#25D366] hover:underline"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>Need immediate support? Chat directly with Helpdesk</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
              {status === "error" && (
                <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" /> Sorry, enquiry could not be saved, but you can still connect with us on WhatsApp.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 font-semibold text-white transition hover:bg-[#20bd5a] hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting & Dispatching WhatsApp…</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>Submit & Send WhatsApp Updates</span>
                </>
              )}
            </button>
          </form>
        </Reveal>

        {/* Full Size QR Code Dialog Modal */}
        {showQrModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setShowQrModal(false)}
          >
            <div
              className="relative max-w-sm w-full rounded-2xl bg-white p-5 shadow-2xl text-stone-900 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-3 right-3 rounded-full bg-stone-100 p-1.5 text-stone-600 hover:bg-stone-200 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-center mb-3 pr-6">
                <h3 className="font-bold text-base text-stone-900">Scan to Pay via UPI</h3>
                <p className="text-xs text-stone-600 font-mono">{payment.beneficiary} · {payment.upiId}</p>
              </div>
              <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50 p-2">
                <img
                  src={payment.qrImg}
                  alt={`${payment.qrAlt} - Full View`}
                  className="w-full h-auto rounded-lg object-contain select-none"
                />
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                      navigator.clipboard.writeText(payment.upiId);
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2500);
                    }
                  }}
                  className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold py-2.5 text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="h-4 w-4 text-white" />
                      <span>UPI ID Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy {payment.upiId}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="w-full rounded-lg border border-stone-300 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FloatingWhatsApp() {
  const defaultMsg = encodeURIComponent(
    "Hello HelpHomesIndia! I would like to know more about supporting Care for All Homes across Tamil Nadu."
  );

  return (
    <aside aria-label="WhatsApp Quick Support" className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with HelpHomesIndia on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 active:scale-95"
      >
        {/* Animated Ripple Pulse */}
        <span className="absolute -inset-1.5 -z-10 rounded-full bg-[#25D366]/50 animate-ping opacity-75" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />

        {/* Floating Tooltip Label */}
        <span className="pointer-events-none absolute right-16 hidden rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground shadow-xl transition-all duration-200 md:group-hover:block whitespace-nowrap border border-ink-foreground/20">
          Chat on WhatsApp 💬
        </span>
      </a>
    </aside>
  );
}

function Footer() {
  return (
    <footer className="relative bg-ink text-ink-foreground overflow-hidden border-t border-ink-foreground/10">
      {/* Decorative gradient glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {/* Main Grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <Brand isFooter />
            <p className="text-sm leading-relaxed text-ink-foreground/80 max-w-md">
              HelpHomesIndia is a transparent community guidance platform operating under the guidance of the <strong className="text-ink-foreground">Tamil Nadu Federation of Voluntary Agencies (TAFVA)</strong>. Connecting donors directly with verified Care for All Homes across 10 districts.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TAFVA Fieldwork Monitored · 100% Direct Support</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About Us" },
                { id: "vision", label: "Vision & Mission" },
                { id: "directory", label: "Care for All Homes Directory" },
                { id: "how", label: "How It Works" },
                { id: "gallery", label: "Photo Gallery" },
                { id: "contact", label: "Contact Us" },
              ].map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => scrollToSection(n.id, e)}
                    className="inline-flex items-center gap-1.5 text-ink-foreground/75 hover:text-accent transition-colors duration-200 cursor-pointer group"
                  >
                    <span className="text-xs text-ink-foreground/40 group-hover:text-accent transition-colors">›</span>
                    <span>{n.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Helpdesk */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">
              Direct Contact & Helpdesk
            </h3>
            <p className="text-xs text-ink-foreground/70">
              Have questions or want to confirm home requirements directly? Reach our team anytime:
            </p>
            <div className="space-y-3 pt-1">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-ink-foreground transition hover:border-emerald-500/40 hover:bg-emerald-500/10 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366] text-white shrink-0 group-hover:scale-105 transition-transform">
                  <WhatsAppIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-emerald-400">WhatsApp Helpdesk</span>
                  <span className="font-semibold text-ink-foreground">+91 91504 08850</span>
                </div>
              </a>

              <a
                href="mailto:elderscare@helphomesindia.org"
                className="flex items-center gap-3 rounded-xl border border-ink-foreground/10 bg-ink-foreground/5 p-3 text-sm text-ink-foreground transition hover:border-accent/40 hover:bg-accent/5 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-ink-foreground/60">Email Support</span>
                  <span className="font-medium text-ink-foreground">elderscare@helphomesindia.org</span>
                </div>
              </a>

              <div className="flex items-center gap-3 rounded-xl border border-ink-foreground/10 bg-ink-foreground/5 p-3 text-sm text-ink-foreground">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-ink-foreground/60">Guidance Partner</span>
                  <span className="font-medium text-ink-foreground text-xs">Tamil Nadu Federation of Voluntary Agencies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-ink-foreground/10 text-xs text-ink-foreground/60 text-center sm:text-left">
          <p>© 2026 HelpHomesIndia Initiative. Guided by Tamil Nadu Federation of Voluntary Agencies (TAFVA). All rights reserved to VND Tech.</p>
        </div>
      </div>
    </footer>
  );
}

const JSON_LD_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "HelpHomesIndia",
    "alternateName": "HelpHomesIndia - TAFVA Verified Orphanages Homes",
    "url": "https://helphomesindia.org",
    "logo": "https://helphomesindia.org/logo.png",
    "image": "https://helphomesindia.org/hero.jpg",
    "description": "HelpHomesIndia is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA), connecting donors directly with verified Care for All Homes across 10 districts.",
    "telephone": "+91-9150408850",
    "email": "elderscare@helphomesindia.org",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Tamil Nadu"
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Tamil Nadu Federation of Voluntary Agencies (TAFVA)"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9150408850",
      "contactType": "support",
      "areaServed": "IN",
      "availableLanguage": ["Tamil", "English"]
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HelpHomesIndia",
    "url": "https://helphomesindia.org"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does HelpHomesIndia support Care for All Homes in Tamil Nadu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "HelpHomesIndia operates under TAFVA to identify authentic essential needs (new clothing, groceries, food and medical assistance) across 10 Care for All Homes in 10 Tamil Nadu districts, connecting donors directly without commission or intermediaries."
        }
      },
      {
        "@type": "Question",
        "name": "Does HelpHomesIndia collect monetary donations directly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. HelpHomesIndia does not collect or hold money or material donations. Donors send supplies directly to the homes or transfer funds directly to verified official trust accounts."
        }
      },
      {
        "@type": "Question",
        "name": "How are Care for All Homes verified on HelpHomesIndia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every home listed on HelpHomesIndia is personally verified through on-ground fieldwork assessments by member agencies of the Tamil Nadu Federation of Voluntary Agencies (TAFVA)."
        }
      }
    ]
  }
];

function Index() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      {/* Search Engine Rich Snippets & JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SCHEMAS) }}
      />
      <Header />
      <main className="overflow-x-hidden w-full max-w-full">
        <Hero />
        <DiwaliBanner />
        <About />
        <Vision />
        <ElderlyHomesDirectory />
        <HowItWorks />
        <DonationStandards />
        <NewsEvents />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
