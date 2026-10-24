import logo from "@/assets/logo.png";
import { scrollToSection } from "@/lib/constants";

export function Logo({ className = "h-12 w-12 md:h-14 md:w-14" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="TrueSeva Logo"
      width={56}
      height={56}
      decoding="async"
      className={`object-contain shrink-0 ${className}`}
    />
  );
}

export function Brand({ isFooter = false }: { isFooter?: boolean }) {
  return (
    <a
      href="#home"
      onClick={(e) => scrollToSection("home", e)}
      className="flex items-center gap-3.5 group cursor-pointer"
    >
      <Logo className="h-12 w-12 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-105" />
      <span className="leading-tight">
        <span
          className={`block font-display text-xl md:text-2xl font-bold tracking-tight ${
            isFooter ? "text-ink-foreground" : "text-foreground"
          }`}
        >
          TrueSeva
        </span>
        <span
          className={`block text-[11px] md:text-xs ${
            isFooter ? "text-ink-foreground/75" : "text-muted-foreground"
          }`}
        >
          TAFVA Verified Elders Care Initiative
        </span>
      </span>
    </a>
  );
}
