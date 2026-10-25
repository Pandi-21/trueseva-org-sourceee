import { Mail, Building2 } from "lucide-react";
import { Brand } from "@/components/common/Brand";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { WHATSAPP_NUMBER, scrollToSection } from "@/lib/constants";

export function Footer() {
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
              HelpHomesIndia is a transparent community guidance platform operating under the guidance of the{" "}
              <strong className="text-ink-foreground">Tamil Nadu Federation of Voluntary Agencies (TAFVA)</strong>.
              Connecting donors directly with verified Care for All Homes across 10 districts.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TAFVA Fieldwork Monitored · 100% Direct Support</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">Quick Links</h3>
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
            <h3 className="text-xs font-bold uppercase tracking-widest text-accent">Direct Contact &amp; Helpdesk</h3>
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
                  <span className="font-medium text-ink-foreground text-xs">
                    Tamil Nadu Federation of Voluntary Agencies
                  </span>
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
