import type React from "react";
import { Shirt, ShoppingBag, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { scrollToSection } from "@/lib/constants";

export function DonationStandards() {
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
