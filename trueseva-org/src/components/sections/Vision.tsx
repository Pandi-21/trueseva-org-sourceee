import { Shirt, Leaf, ShieldCheck, Handshake } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

const MISSION = [
  { icon: Shirt, t: "Needs-Based Support", d: "Match clothing quantities to the number of elderly men and women." },
  { icon: Leaf, t: "Nutritious Food Security", d: "Encourage suitable meals and essential groceries." },
  { icon: ShieldCheck, t: "Field Verification", d: "Recommend eligible homes assessed through actual fieldwork." },
  { icon: Handshake, t: "Zero Commission, Direct Support", d: "Connect donors directly with elderly care homes." },
];

export function Vision() {
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
                  <h3 className="flex items-center gap-2 text-xl">
                    <m.icon className="h-4 w-4 text-accent" aria-hidden />
                    {m.t}
                  </h3>
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
