import { useState, useEffect } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

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

export function Gallery() {
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
