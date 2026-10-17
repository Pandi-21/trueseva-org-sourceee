import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  Menu, X, Leaf, ShieldCheck, Shirt, Handshake, Phone, Mail, MapPin,
  Building2, Loader2, CheckCircle2, AlertCircle, ImageIcon,
  ChevronDown, ChevronUp, Users, ShoppingBag, Clock, FileText,
  AlertTriangle, Newspaper, ArrowRight, Info, Sparkles,
  ChevronLeft, ChevronRight, Maximize2
} from "lucide-react";
import hero from "@/assets/image12.jpeg";
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
  getNgosForDistrict,
  getSmileHomeDetails,
  SMILE_HOMES,
  normaliseMobile,
  validateEnquiry,
  type EnquiryInput,
  type SmileHome,
} from "@/lib/enquiry";

export const WHATSAPP_NUMBER = "919150408850"; // Official WhatsApp Helpdesk Number

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, type: "image/webp", fetchPriority: "high" },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "shortcut icon", type: "image/png", href: "/logo.png" },
    ],
    meta: [
      { title: "TrueSeva — Support Elderly Care Homes in Tamil Nadu | TAFVA Verified Direct Assistance" },
      { name: "description", content: "Support 10 verified elderly care homes across 10 districts of Tamil Nadu directly. 100% transparent clothing, grocery & medical assistance with zero commission, field-verified by TAFVA." },
      { property: "og:title", content: "TrueSeva — Support Elderly Care Homes in Tamil Nadu | TAFVA Verified" },
      { property: "og:description", content: "Direct clothing, grocery and medical support for 10 elderly care homes identified through TAFVA fieldwork across Tamil Nadu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  } else {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
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
      alt="TrueSeva Logo"
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
          TrueSeva
        </span>
        <span className={`block text-[11px] md:text-xs ${isFooter ? "text-ink-foreground/75" : "text-muted-foreground"}`}>
          TAFVA Verified Elders Care Initiative
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
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "border-b bg-background/90 py-3 backdrop-blur" : "py-5"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
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
            href="#how"
            onClick={(e) => {
              setOpen(false);
              scrollToSection("how", e);
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
    <section id="home" className="relative overflow-hidden pt-28 lg:pt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-24">
        <div className="rise lg:col-span-5 lg:pt-10">
          {/* <p className="eyebrow">10 Districts · 10 Elderly Homes · Direct Support · No Intermediaries</p> */}
          <h1 className="mt-6 text-4xl font-bold leading-[1.15] md:text-5xl lg:text-6xl text-foreground">
            Bring a Smile to an <span className="text-primary">Elder&apos;s Face.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Provide new clothing, essential groceries, or direct medical and food assistance to 10 elderly care homes across 10 districts of Tamil Nadu, identified through the fieldwork of the Tamil Nadu Federation of Voluntary Agencies (TAFVA).
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <a
              href="#how"
              onClick={(e) => scrollToSection("how", e)}
              className="rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 cursor-pointer"
            >
              Explore How to Help
            </a>
            <a
              href="#about"
              onClick={(e) => scrollToSection("about", e)}
              className="font-semibold underline decoration-accent decoration-2 underline-offset-8 hover:text-primary cursor-pointer"
            >
              Our Initiative
            </a>
          </div>
        </div>
        <div className="rise lg:col-span-7" style={{ animationDelay: "150ms" }}>
          <div className="relative overflow-hidden rounded-xl shadow-md">
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

function About() {
  return (
    <section id="about" className="border-t py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <img
            src={about}
            alt="Supporting and honoring elderly care home residents in Tamil Nadu"
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
            <p className="font-display text-2xl leading-snug text-foreground">TrueSeva is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA).</p>
            <p>Before developing a comprehensive statewide fundraising platform in the future, this pilot initiative identifies 10 elderly care homes across 10 districts for direct, transparent support.</p>
            <p>The initiative focuses on actual needs: new clothing, essential kitchen groceries, and direct financial assistance for food and medical expenses.</p>
            <p className="border-l-2 border-primary pl-5">TrueSeva does not collect monetary or material donations from the public. It acts as a connecting platform between donors and elderly care homes, enabling direct support without intermediaries.</p>
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
  { icon: Handshake, t: "Zero Commission, Direct Support", d: "Connect donors directly with elderly care homes." },
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

// ==================== SECTION: ELDERLY HOMES DIRECTORY ====================

function ElderlyHomesDirectory() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      if (next !== null) {
        setTimeout(() => {
          const el = document.getElementById(`home-card-${id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }, 60);
      }
      return next;
    });
  };

  const handleSelectHome = (home: SmileHome, e: React.MouseEvent) => {
    scrollToSection("contact", e);
    window.dispatchEvent(
      new CustomEvent("select-smile-home", {
        detail: { city: home.city, ngo: home.label },
      })
    );
  };

  return (
    <section id="directory" className="pt-14 pb-10 lg:pt-16 lg:pb-12 bg-muted/20 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Elderly Homes Directory</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Explore SMILE Elderly Homes</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Explore the 16 verified SMILE elderly care homes across 10 cities and districts in Tamil Nadu. Connect directly to provide transparent support with dignity and care.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
          {SMILE_HOMES.map((home, index) => {
            const isExpanded = expandedId === home.id;
            return (
              <Reveal
                key={home.id}
                delay={(index % 4) * 80}
                className={isExpanded ? "lg:col-span-3 xl:col-span-4 md:col-span-2 w-full" : "h-full"}
              >
                <div
                  id={`home-card-${home.id}`}
                  className={`group relative flex flex-col h-full rounded-2xl border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 ${isExpanded
                      ? "border-primary ring-2 ring-primary/20 shadow-xl"
                      : "border-border hover:border-primary/50 hover:shadow-xl hover:-translate-y-1.5"
                    }`}
                >
                  {/* Top Meta Tag */}
                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                      Home {home.sNo > 9 ? `0${home.sNo}`.slice(-2) : `0${home.sNo}`}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground">
                      {home.city}
                    </span>
                  </div>

                  {/* Home Name & District */}
                  <div className="mt-3">
                    <h3 className="text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {home.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{home.city}, Tamil Nadu</span>
                    </p>
                  </div>

                  {/* Branch / Area subtitle */}
                  <p className="mt-2 text-xs font-medium text-foreground/85 line-clamp-1">
                    {home.label.replace(home.name + " – ", "")}
                  </p>

                  {/* Verification Status Badge */}
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>SMILE Verified Home</span>
                    </span>
                  </div>

                  {/* Compact Address Preview */}
                  <div className="mt-4 flex-1 rounded-lg bg-muted/30 p-3 text-xs space-y-2">
                    <p className="text-muted-foreground leading-relaxed line-clamp-2">
                      <strong className="text-foreground">Address: </strong>{home.address}
                    </p>
                    <div className="pt-1.5 border-t border-border/50 flex flex-col gap-1 text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="h-3 w-3 text-primary shrink-0" />
                        <a href={`tel:${home.phone}`} className="hover:text-primary font-medium text-[11px]">+91 {home.phone}</a>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3 w-3 text-primary shrink-0" />
                        <a href={`mailto:${home.email}`} className="hover:text-primary text-[11px] truncate">{home.email}</a>
                      </div>
                    </div>
                  </div>

                  {/* Support Status */}
                  <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">Open for Direct Support</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(home.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md cursor-pointer"
                    >
                      <span>{isExpanded ? "Close" : "View Contact"}</span>
                      {isExpanded ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleSelectHome(home, e)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary/90 shadow-xs cursor-pointer"
                    >
                      <span>Support</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Inline Expansion Area */}
                  {isExpanded && (
                    <div className="mt-6 border-t border-border pt-6 transition-all duration-300 text-left">
                      <h4 className="text-base font-semibold text-foreground">Official Home Verification & Contact</h4>

                      <div className="mt-4 space-y-4">
                        <div className="rounded-xl border bg-muted/20 p-4">
                          <h5 className="font-semibold text-foreground flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                            <Building2 className="h-4 w-4 text-primary" />
                            Home Information
                          </h5>
                          <div className="mt-2.5 grid gap-2 sm:grid-cols-2 text-xs text-muted-foreground">
                            <div><strong className="text-foreground">Full Name:</strong> {home.name}</div>
                            <div><strong className="text-foreground">City / District:</strong> {home.city}</div>
                            <div><strong className="text-foreground">Branch / Area:</strong> {home.label.replace(home.name + " – ", "")}</div>
                            <div><strong className="text-foreground">Registry No.:</strong> SMILE-TN-{home.sNo > 9 ? home.sNo : `0${home.sNo}`}</div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="rounded-xl border bg-card p-4 text-xs">
                            <h5 className="font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-muted-foreground">
                              <Phone className="h-3.5 w-3.5 text-primary" />
                              Direct Contact
                            </h5>
                            <div className="mt-2 space-y-1.5">
                              <div><a href={`tel:${home.phone}`} className="font-semibold text-foreground hover:text-primary text-sm">+91 {home.phone}</a></div>
                              <div><a href={`mailto:${home.email}`} className="text-muted-foreground hover:text-primary truncate block">{home.email}</a></div>
                            </div>
                          </div>

                          <div className="rounded-xl border bg-card p-4 text-xs">
                            <h5 className="font-semibold text-foreground flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              Official Physical Address
                            </h5>
                            <p className="mt-2 text-muted-foreground leading-relaxed">{home.address}</p>
                          </div>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={(e) => handleSelectHome(home, e)}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
                          >
                            <span>Support {home.name} ({home.city}) in Form</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==================== SECTION: DIRECT SUPPORT PROCESS ====================

const STEPS = [
  {
    t: "Explore",
    d: "Discover an elderly home's current essential needs and available information.",
  },
  {
    t: "Confirm",
    d: "Contact the administrator to confirm requirements, quantities, delivery details, and the preferred method of support.",
  },
  {
    t: "Support Directly",
    d: "Send clothing and groceries directly to the elderly home or transfer financial assistance directly to its verified official trust account.",
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
        <ol className="relative mt-12 grid gap-10 border-l border-border pl-8 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10">
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
              <Reveal delay={i * 120}>
                {/* Interactive Animated Dot on line */}
                <div
                  className="absolute -left-[37px] top-1 lg:-top-[46px] lg:left-0 flex items-center justify-center h-3 w-3"
                  aria-hidden
                >
                  {/* Outer animated ripple halo */}
                  <span className="absolute h-3 w-3 rounded-full bg-primary opacity-0 transition-all duration-500 ease-out group-hover:scale-[2.6] group-hover:opacity-30" />
                  {/* Medium ring glow */}
                  <span className="absolute h-3 w-3 rounded-full bg-primary/20 opacity-0 transition-all duration-300 ease-out group-hover:scale-[1.8] group-hover:opacity-75" />
                  {/* Core Dot with scale, ring and shadow glow */}
                  <span className="relative h-3 w-3 rounded-full bg-primary transition-all duration-300 ease-out group-hover:scale-125 group-hover:ring-4 group-hover:ring-primary/25 group-hover:shadow-[0_0_12px_rgba(233,88,40,0.5)]" />
                </div>
                <p className="eyebrow transition-colors duration-300 group-hover:text-primary">Step 0{i + 1}</p>
                <h3 className="mt-2 text-2xl transition-colors duration-300 group-hover:text-primary">{s.t}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{s.d}</p>
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
  return (
    <section id="standards" className="pt-12 pb-10 lg:pt-14 lg:pb-12 bg-muted/10 border-t border-border/50">
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
          <Reveal delay={0}>
            <div className="flex h-full flex-col rounded-2xl border bg-card p-6 md:p-8 shadow-xs">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shirt className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">New Clothing Only</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Accepted Items</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground flex-1">
                {["Men's dhotis", "Men's shirts", "Towels", "Women's sarees", "Blouse materials", "Nightwear"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300">
                <strong>Important Note:</strong> Only new clothing items are accepted. Used clothing is not accepted.
              </div>
            </div>
          </Reveal>

          {/* Column 2: Essential Groceries */}
          <Reveal delay={100}>
            <div className="flex h-full flex-col rounded-2xl border bg-card p-6 md:p-8 shadow-xs">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-turquoise/10 text-turquoise">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">Essential Groceries</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggested Items</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground flex-1">
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
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-turquoise shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300">
                <strong>Important Note:</strong> Confirm the home's current requirements and any dietary restrictions before sending groceries.
              </div>
            </div>
          </Reveal>

          {/* Column 3: Direct Financial Assistance */}
          <Reveal delay={200}>
            <div className="flex h-full flex-col rounded-2xl border bg-card p-6 md:p-8 shadow-xs">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">Direct Financial Assistance</h3>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Areas of Support</p>
              <ul className="mt-3 space-y-2 text-sm text-foreground flex-1">
                {[
                  "Food assistance",
                  "Medical assistance",
                  "Essential care expenses",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3.5 text-xs text-amber-800 dark:text-amber-300">
                <strong>Important Note:</strong> Financial transfers must go directly to verified official trust accounts. Confirm the current requirement and recipient details before making a transfer.
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
      description: "Preparation of detailed essential-needs lists for 10 elderly care homes across 10 districts of Tamil Nadu.",
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
      description: "Plans to explore a broader platform connecting eligible elderly care homes across Tamil Nadu following the pilot initiative.",
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
              <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-card/90 p-6 md:p-8 shadow-xs transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer">
                {/* Top Animated Gradient Accent Bar */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

                {/* Ambient Decorative Watermark Number */}
                <span className="absolute -bottom-5 -right-2 text-8xl font-black font-display text-foreground/[0.03] select-none pointer-events-none group-hover:text-primary/[0.07] group-hover:scale-110 transition-all duration-500">
                  0{i + 1}
                </span>

                <div className="relative z-10">
                  {/* Top Bar: Update No & Animated Beacon Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      <Newspaper className="h-4 w-4 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
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

                {/* Footer with Sliding Arrow Micro-interaction */}
                <div className="relative z-10 mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                  <span className="font-medium">Official Initiative Release</span>
                  <div className="flex items-center gap-1 text-primary font-semibold text-xs opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span>Read</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
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
            Real moments from verified elderly care homes across Tamil Nadu — highlighting compassionate care, healthcare support, community visits, and dignified living.
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
                src={GALLERY[active].src}
                alt={GALLERY[active].label}
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

  useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ city: string; ngo: string }>;
      if (customEvent.detail) {
        setV((prev) => ({
          ...prev,
          district: customEvent.detail.city,
          ngo: customEvent.detail.ngo,
        }));
        clearError("district");
        clearError("ngo");
      }
    };
    window.addEventListener("select-smile-home", handleSelect);
    return () => window.removeEventListener("select-smile-home", handleSelect);
  }, []);

  const selectedHome = getSmileHomeDetails(v.ngo);

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
      "New Support Enquiry - TrueSeva",
      "",
      `Name: ${v.full_name.trim()}`,
      `Mobile: +91 ${normaliseMobile(v.mobile)}`,
    ];
    if (v.email.trim()) lines.push(`Email: ${v.email.trim()}`);
    lines.push(`City / District: ${v.district}`);
    lines.push(`SMILE Care Home: ${v.ngo}`);
    if (selectedHome) {
      lines.push(`Home Address: ${selectedHome.address}`);
      lines.push(`Home Contact: +91 ${selectedHome.phone}`);
    }
    lines.push(`Support Type: ${v.support_type}`);
    if (amountVal) lines.push(`Amount: ${amountVal}`);
    if (v.message.trim()) lines.push(`Message: ${v.message.trim()}`);
    lines.push("");
    lines.push("Sent via TrueSeva initiative portal");
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
          <p className="mt-5 text-lg text-muted-foreground">Have questions about supporting an elderly care home? Share your details and the type of assistance you are interested in.</p>
          <div className="mt-10 space-y-6">
            {[
              { i: Building2, k: "Coordinating Organisation", val: "Tamil Nadu Federation of Voluntary Agencies (TAFVA)" },
              { i: Phone, k: "WhatsApp / Helpdesk", val: "+91 91504 08850", href: `https://wa.me/${WHATSAPP_NUMBER}` },
              { i: Mail, k: "Email", val: "elderscare@trueseva.org", href: "mailto:elderscare@trueseva.org" },
              { i: MapPin, k: "Office Address", val: "[Official state office address to be provided]" },
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
          <form noValidate onSubmit={submit} className="space-y-5 rounded-xl border bg-card p-6 md:p-10 shadow-sm">
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
                <p className="text-muted-foreground flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{selectedHome.address}</span>
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground pt-1.5 border-t border-primary/15">
                  <a href={`tel:${selectedHome.phone}`} className="flex items-center gap-1 hover:text-primary font-medium">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>+91 {selectedHome.phone}</span>
                  </a>
                  <a href={`mailto:${selectedHome.email}`} className="flex items-center gap-1 hover:text-primary font-medium">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>{selectedHome.email}</span>
                  </a>
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
                      <span>An official TrueSeva acknowledgement receipt will be sent automatically to your WhatsApp in 1–2 hours.</span>
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
      </div>
    </section>
  );
}

function FloatingWhatsApp() {
  const defaultMsg = encodeURIComponent(
    "Hello TrueSeva! I would like to know more about supporting elderly care homes across Tamil Nadu."
  );

  return (
    <aside aria-label="WhatsApp Quick Support" className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with TrueSeva on WhatsApp"
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
              TrueSeva is a transparent community guidance platform operating under the guidance of the <strong className="text-ink-foreground">Tamil Nadu Federation of Voluntary Agencies (TAFVA)</strong>. Connecting donors directly with verified elderly care homes across 10 districts.
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
                { id: "directory", label: "Elderly Homes Directory" },
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
                href="mailto:elderscare@trueseva.org"
                className="flex items-center gap-3 rounded-xl border border-ink-foreground/10 bg-ink-foreground/5 p-3 text-sm text-ink-foreground transition hover:border-accent/40 hover:bg-accent/5 group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-medium text-ink-foreground/60">Email Support</span>
                  <span className="font-medium text-ink-foreground">elderscare@trueseva.org</span>
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
          <p>© 2026 TrueSeva Initiative. Guided by Tamil Nadu Federation of Voluntary Agencies (TAFVA). All rights reserved to VND Media.</p>
        </div>
      </div>
    </footer>
  );
}

const JSON_LD_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "TrueSeva",
    "alternateName": "TrueSeva Elders Care Initiative",
    "url": "https://trueseva.org",
    "logo": "https://trueseva.org/logo.png",
    "image": "https://trueseva.org/hero.jpg",
    "description": "TrueSeva is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA), connecting donors directly with verified elderly care homes across 10 districts.",
    "telephone": "+91-9150408850",
    "email": "elderscare@trueseva.org",
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
    "name": "TrueSeva",
    "url": "https://trueseva.org"
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does TrueSeva support elderly care homes in Tamil Nadu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TrueSeva operates under TAFVA to identify authentic essential needs (new clothing, groceries, food and medical assistance) across 10 elderly homes in 10 Tamil Nadu districts, connecting donors directly without commission or intermediaries."
        }
      },
      {
        "@type": "Question",
        "name": "Does TrueSeva collect monetary donations directly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. TrueSeva does not collect or hold money or material donations. Donors send supplies directly to the homes or transfer funds directly to verified official trust accounts."
        }
      },
      {
        "@type": "Question",
        "name": "How are elderly care homes verified on TrueSeva?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every home listed on TrueSeva is personally verified through on-ground fieldwork assessments by member agencies of the Tamil Nadu Federation of Voluntary Agencies (TAFVA)."
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
      <main>
        <Hero />
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
