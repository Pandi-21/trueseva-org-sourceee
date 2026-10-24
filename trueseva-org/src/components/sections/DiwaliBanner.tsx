import bannerImg from "@/assets/banners.png";
import { Reveal } from "@/components/common/Reveal";
import { scrollToSection } from "@/lib/constants";

export function DiwaliBanner() {
  return (
    <section aria-label="Diwali Special Campaign Banner" className="pb-14 lg:pb-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-primary/20 bg-card shadow-xl transition-all duration-300 hover:shadow-2xl">
            <a
              href="#directory"
              onClick={(e) => scrollToSection("directory", e)}
              className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              title="Click to find verified care homes in your district"
            >
              <img
                src={bannerImg}
                alt="இந்த தீபாவளியில் ஆதரவற்றோர் வாழ்வில் ஒளியேற்றுங்கள் - TrueSeva Diwali Campaign Banner"
                width={1920}
                height={1080}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
