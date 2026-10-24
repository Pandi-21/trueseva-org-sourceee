import { useState } from "react";
import { Building2, ChevronDown, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { scrollToSection } from "@/lib/constants";
import {
  TN_DISTRICTS,
  TN_DISTRICT_ALIASES,
  SMILE_HOMES,
  type SmileHome,
} from "@/lib/enquiry";

export function ElderlyHomesDirectory() {
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
          <p className="eyebrow">Elderly Homes Directory</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Explore SMILE Elderly Homes</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Filter by district to find verified SMILE elderly care homes in Tamil Nadu. Connect directly to provide transparent support with dignity and care.
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
                <label
                  htmlFor="directory-district-filter"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
                >
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
                <label
                  htmlFor="directory-home-filter"
                  className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
                >
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
                        <option value="all">
                          All Homes in {selectedDistrict} ({districtHomes.length})
                        </option>
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
            <Reveal delay={150}>
              <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-7 w-7" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-foreground">Select a District to View Homes</h4>
                <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                  Choose a district from the dropdown filter above to see verified SMILE elderly care homes in that region.
                </p>
              </div>
            </Reveal>
          ) : displayedHomes.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center">
              <p className="text-muted-foreground">No elderly care homes found for the selected filter.</p>
            </div>
          ) : (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-muted-foreground">
                  Showing <span className="text-foreground font-bold">{displayedHomes.length}</span> verified SMILE{" "}
                  {displayedHomes.length === 1 ? "home" : "homes"} in{" "}
                  <span className="text-primary font-bold">{selectedDistrict}</span>
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

                      {/* Contact Info */}
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
