import { Newspaper, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function NewsEvents() {
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
