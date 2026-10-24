import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function FloatingWhatsApp() {
  const defaultMsg = encodeURIComponent(
    "Hello TrueSeva! I would like to know more about supporting elderly care homes across Tamil Nadu."
  );

  return (
    <aside aria-label="WhatsApp Quick Support" className="fixed bottom-6 right-6 z-50">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with TrueSeva on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/40 active:scale-95"
      >
        {/* Animated Ripple Pulse */}
        <span className="absolute -inset-1.5 -z-10 rounded-full bg-[#25D366]/50 animate-ping opacity-75" />

        {/* WhatsApp Icon */}
        <WhatsAppIcon className="h-8 w-8 text-white transition-transform duration-300 group-hover:scale-110" />

        {/* Floating Tooltip Label */}
        <span className="pointer-events-none absolute right-16 hidden rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground shadow-xl transition-all duration-200 md:group-hover:block whitespace-nowrap border border-ink-foreground/20">
          Chat on WhatsApp 💬
        </span>
      </a>
    </aside>
  );
}
