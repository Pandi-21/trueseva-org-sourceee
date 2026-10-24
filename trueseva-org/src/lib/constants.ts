import type React from "react";

export const WHATSAPP_NUMBER = "919150408850"; // Official WhatsApp Helpdesk Number

export const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "vision", label: "Vision & Mission" },
  { id: "how", label: "How It Works" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact Us" },
] as const;

export function scrollToSection(id: string, e?: React.MouseEvent) {
  if (e) e.preventDefault();
  if (id === "home") {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  }
  if (typeof document === "undefined" || typeof window === "undefined") return;

  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 115;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetY = rect.top + scrollTop - headerOffset;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });

    if (id === "enquiry-form") {
      setTimeout(() => {
        const firstInput = document.getElementById("full_name") as HTMLInputElement | null;
        if (firstInput && document.activeElement !== firstInput) {
          firstInput.focus({ preventScroll: true });
        }
      }, 500);
    }
  }
}
