import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import hero from "@/assets/image12.jpeg";

import { scrollToSection, WHATSAPP_NUMBER } from "@/lib/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

import { Hero } from "@/components/sections/Hero";
import { DiwaliBanner } from "@/components/sections/DiwaliBanner";
import { About } from "@/components/sections/About";
import { Vision } from "@/components/sections/Vision";
import { ElderlyHomesDirectory } from "@/components/sections/ElderlyHomesDirectory";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DonationStandards } from "@/components/sections/DonationStandards";
import { NewsEvents } from "@/components/sections/NewsEvents";
import { Gallery } from "@/components/sections/Gallery";
import { ContactForm } from "@/components/sections/ContactForm";

export { WHATSAPP_NUMBER };

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, type: "image/webp", fetchPriority: "high" },
      { rel: "icon", type: "image/png", href: "/logo.png" },
      { rel: "shortcut icon", type: "image/png", href: "/logo.png" },
    ],
    meta: [
      { title: "TrueSeva — Light Up Lives of the Destitute This Diwali | Verified Homes in Tamil Nadu" },
      {
        name: "description",
        content:
          "TrueSeva is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA), connecting donors directly with verified elderly care homes across 10 districts in Tamil Nadu.",
      },
      {
        name: "keywords",
        content:
          "elderly care homes Tamil Nadu, old age homes donation, Diwali charity Tamil Nadu, TAFVA verified homes, direct elderly support, donate clothes groceries old age home, destitute elders care",
      },
      { name: "author", content: "Tamil Nadu Federation of Voluntary Agencies (TAFVA)" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },

      // Open Graph / Facebook
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://trueseva.org" },
      { property: "og:site_name", content: "TrueSeva — Elders Care Initiative" },
      { property: "og:title", content: "TrueSeva — Light Up Lives of the Destitute This Diwali" },
      {
        property: "og:description",
        content:
          "100% direct, transparent support for verified elderly care homes in Tamil Nadu. Zero commission, verified trust accounts, direct delivery of clothing and groceries.",
      },
      { property: "og:image", content: "https://trueseva.org/hero.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Caring for elderly residents across Tamil Nadu" },
      { property: "og:locale", content: "en_IN" },

      // Twitter Card
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TrueSeva — Light Up Lives of the Destitute This Diwali" },
      {
        name: "twitter:description",
        content:
          "Support destitute elderly residents directly with verified needs, groceries, clothing, and care across Tamil Nadu.",
      },
      { name: "twitter:image", content: "https://trueseva.org/hero.jpg" },

      // Theme Colors & Mobile WebApp
      { name: "theme-color", content: "#E95828" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    ],
  }),
  component: Index,
});

const JSON_LD_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "NonprofitOrganization",
    "name": "TrueSeva",
    "alternateName": "TrueSeva Elders Care Initiative",
    "url": "https://trueseva.org",
    "logo": "https://trueseva.org/logo.png",
    "image": "https://trueseva.org/hero.jpg",
    "description":
      "TrueSeva is a transparent community guidance platform operating under the guidance of the Tamil Nadu Federation of Voluntary Agencies (TAFVA), connecting donors directly with verified elderly care homes across 10 districts.",
    "telephone": "+91-9150408850",
    "email": "elderscare@trueseva.org",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN",
    },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Tamil Nadu",
    },
    "parentOrganization": {
      "@type": "Organization",
      "name": "Tamil Nadu Federation of Voluntary Agencies (TAFVA)",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9150408850",
      "contactType": "support",
      "areaServed": "IN",
      "availableLanguage": ["Tamil", "English"],
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TrueSeva",
    "url": "https://trueseva.org",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does TrueSeva support elderly care homes in Tamil Nadu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "TrueSeva operates under TAFVA to identify authentic essential needs (new clothing, groceries, food and medical assistance) across 10 elderly homes in 10 Tamil Nadu districts, connecting donors directly without commission or intermediaries.",
        },
      },
      {
        "@type": "Question",
        "name": "Does TrueSeva collect monetary donations directly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "No. TrueSeva does not collect or hold money or material donations. Donors send supplies directly to the homes or transfer funds directly to verified official trust accounts.",
        },
      },
      {
        "@type": "Question",
        "name": "How are elderly care homes verified on TrueSeva?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text":
            "Every home listed on TrueSeva is personally verified through on-ground fieldwork assessments by member agencies of the Tamil Nadu Federation of Voluntary Agencies (TAFVA).",
        },
      },
    ],
  },
];

function Index() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <>
      {/* Search Engine Rich Snippets & JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_SCHEMAS) }}
      />
      <Header />
      <main>
        <Hero />
        <DiwaliBanner />
        <About />
        <Vision />
        <ElderlyHomesDirectory />
        <HowItWorks />
        <DonationStandards />
        <NewsEvents />
        <Gallery />
        <ContactForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
export default Index;
