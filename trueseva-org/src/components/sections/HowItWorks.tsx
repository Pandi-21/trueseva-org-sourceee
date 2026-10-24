import { Reveal } from "@/components/common/Reveal";

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

export function HowItWorks() {
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
