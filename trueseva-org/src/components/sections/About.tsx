import about from "@/assets/image13.jpeg";
import { Reveal } from "@/components/common/Reveal";

export function About() {
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
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">A Pilot Initiative for Orphan Homes</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-foreground/85">
            <p className="font-display text-2xl leading-snug text-foreground">
              HelpHomesIndia is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA).
            </p>
            <p>
              Before developing a comprehensive statewide fundraising platform in the future, this pilot initiative identifies 10 Care for All Homes across 10 districts for direct, transparent support.
            </p>
            <p>
              The initiative focuses on actual needs: new clothing, essential kitchen groceries, and direct financial assistance for food and medical expenses.
            </p>
            <p className="border-l-2 border-primary pl-5">
              HelpHomesIndia does not collect monetary or material donations from the public. It acts as a connecting platform between donors and Care for All Homes, enabling direct support without intermediaries.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
