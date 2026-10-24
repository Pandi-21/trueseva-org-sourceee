import hero from "@/assets/image12.jpeg";
import { scrollToSection } from "@/lib/constants";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-36 lg:pt-40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:pb-24">
        <div className="rise lg:col-span-5 lg:pt-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span>🪔</span>
            <span>Diwali Special Campaign · Verified Direct Support</span>
          </div>
          <h1 className="mt-5 text-4xl font-bold leading-[1.15] md:text-5xl lg:text-6xl text-foreground">
            Light Up the Lives of the <span className="text-primary">Destitute This Diwali.</span> 🪔
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            Find genuinely run destitute and elderly care homes in your district across Tamil Nadu. Support them directly with monetary assistance or material donations like new clothing and essential groceries—with 100% transparency and zero intermediaries.
          </p>
          <p className="mt-4 text-base font-medium text-primary flex items-center gap-2">
            <span aria-hidden="true">✨</span>
            <span>This Diwali, even a small help from you will bring immense joy to their lives.</span>
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#directory"
              onClick={(e) => scrollToSection("directory", e)}
              className="rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground transition hover:opacity-90 cursor-pointer shadow-xs"
            >
              Find Homes in Your District
            </a>
            <a
              href="#how"
              onClick={(e) => scrollToSection("how", e)}
              className="rounded-full border border-border bg-card px-6 py-3.5 font-semibold text-foreground transition hover:bg-muted cursor-pointer"
            >
              How to Support
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
