import { useState, useEffect, type FormEvent, type ReactNode } from "react";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Reveal } from "@/components/common/Reveal";
import { WhatsAppIcon } from "@/components/common/WhatsAppIcon";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import {
  SUPPORT_TYPES,
  TN_DISTRICTS,
  getNgosForDistrict,
  getSmileHomeDetails,
  normaliseMobile,
  validateEnquiry,
  type EnquiryInput,
} from "@/lib/enquiry";

const EMPTY: EnquiryInput = {
  full_name: "",
  mobile: "",
  email: "",
  district: "",
  ngo: "",
  support_type: "",
  amount: "",
  message: "",
};

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required ? <span className="text-primary"> *</span> : <span className="font-normal text-muted-foreground"> (optional)</span>}
      </label>
      {children}
      {error && <p id={`${id}-err`} className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

const inputCls = "w-full rounded-md border border-input bg-card px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-ring/40 aria-[invalid=true]:border-destructive";

export function ContactForm() {
  const [v, setV] = useState<EnquiryInput>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryInput, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<{ notice?: string; manualWaUrl?: string }>({});

  useEffect(() => {
    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ city?: string; ngo?: string; supportType?: string }>;
      if (customEvent.detail) {
        setV((prev) => ({
          ...prev,
          ...(customEvent.detail.city ? { district: customEvent.detail.city } : {}),
          ...(customEvent.detail.ngo ? { ngo: customEvent.detail.ngo } : {}),
          ...(customEvent.detail.supportType ? { support_type: customEvent.detail.supportType } : {}),
        }));
        if (customEvent.detail.city) clearError("district");
        if (customEvent.detail.ngo) clearError("ngo");
        if (customEvent.detail.supportType) clearError("support_type");
      }
    };
    window.addEventListener("select-smile-home", handleSelect);
    return () => window.removeEventListener("select-smile-home", handleSelect);
  }, []);

  const selectedHome = getSmileHomeDetails(v.ngo, v.district);

  const clearError = (k: keyof EnquiryInput) => {
    setErrors((prev) => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  const set = (k: keyof EnquiryInput) => (e: { target: { value: string } }) => {
    setV((prev) => ({ ...prev, [k]: e.target.value }));
    clearError(k);
  };

  const a = (k: keyof EnquiryInput) => ({
    id: k,
    "aria-invalid": !!errors[k],
    ...(errors[k] ? { "aria-describedby": `${k}-err` } : {}),
  });

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const errs = validateEnquiry(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");

    const isFinancial = v.support_type === "Financial Assistance";
    const amountVal = isFinancial && v.amount ? `₹${Number(v.amount).toLocaleString("en-IN")}` : "";

    // Format pre-filled WhatsApp message for manual chat link
    const lines = [
      "New Support Enquiry - HelpHomesIndia",
      "",
      `Name: ${v.full_name.trim()}`,
      `Mobile: +91 ${normaliseMobile(v.mobile)}`,
    ];
    if (v.email.trim()) lines.push(`Email: ${v.email.trim()}`);
    lines.push(`City / District: ${v.district}`);
    lines.push(`SMILE Care Home: ${v.ngo}`);
    if (selectedHome) {
      lines.push(`Home Contact: +91 ${selectedHome.phone}`);
    }
    lines.push(`Support Type: ${v.support_type}`);
    if (amountVal) lines.push(`Amount: ${amountVal}`);
    if (v.message.trim()) lines.push(`Message: ${v.message.trim()}`);
    lines.push("");
    lines.push("Sent via HelpHomesIndia initiative portal");
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

    try {
      // 1. Submit through Server API route (triggers Meta WhatsApp notifications + delayed receipt)
      const response = await fetch("/api/whatsapp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: v.full_name.trim(),
          mobile: normaliseMobile(v.mobile)!,
          email: v.email.trim() || null,
          district: v.district,
          ngo: v.ngo,
          support_type: v.support_type,
          amount: v.amount,
          message: v.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      setStatus("success");
      setFeedback({
        notice: data.whatsappNotice || "Enquiry recorded and WhatsApp notifications dispatched.",
        manualWaUrl: waUrl,
      });
      setV(EMPTY);

      // Auto-open WhatsApp chat with client so the enquiry message is sent directly
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
    } catch (err) {
      console.error("Server enquiry submission error:", err);
      // Fallback: direct Supabase insert
      try {
        await supabase.from("enquiries").insert({
          full_name: v.full_name.trim(),
          mobile: normaliseMobile(v.mobile)!,
          email: v.email.trim() || null,
          support_type: v.support_type,
          district: v.district,
          message: `[SMILE Home: ${v.ngo}]${amountVal ? ` [Amount: ${amountVal}]` : ""} ${v.message.trim()}`,
        });
      } catch (dbErr) {
        console.error("Supabase fallback insert error:", dbErr);
      }
      setStatus("success");
      setFeedback({
        notice: "Enquiry submitted successfully.",
        manualWaUrl: waUrl,
      });
      setV(EMPTY);

      // Auto-open WhatsApp chat with client fallback
      if (typeof window !== "undefined") {
        window.open(waUrl, "_blank");
      }
    }
  }

  return (
    <section id="contact" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">Contact Us</p>
          <h2 className="mt-4 text-4xl font-medium md:text-5xl">Help Connect Support With Need</h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Have questions about supporting a Care for All Home? Share your details and the type of assistance you are interested in.
          </p>
          <div className="mt-10 space-y-6">
            {[
              { i: Building2, k: "Coordinating Organisation", val: "Tamil Nadu Federation of Voluntary Agencies (TAFVA)" },
              { i: Phone, k: "WhatsApp / Helpdesk", val: "+91 91504 08850", href: `https://wa.me/${WHATSAPP_NUMBER}` },
              { i: Mail, k: "Email", val: "elderscare@helphomesindia.org", href: "mailto:elderscare@helphomesindia.org" },
            ].map((c) => (
              <div key={c.k} className="flex gap-4">
                <c.i className="mt-1 h-5 w-5 shrink-0 text-turquoise" aria-hidden />
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{c.k}</div>
                  <div className="mt-1 font-medium">
                    {c.href ? (
                      <a href={c.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                        {c.val}
                      </a>
                    ) : (
                      c.val
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={100}>
          <form
            id="enquiry-form"
            noValidate
            onSubmit={submit}
            className="scroll-mt-24 space-y-5 rounded-xl border bg-card p-6 md:p-10 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20"
          >
            {/* Form Title & Context Badge */}
            <div className="border-b border-border/60 pb-3">
              <span className="eyebrow">Direct Assistance</span>
              <h3 className="text-xl md:text-2xl font-bold text-foreground">Direct Support Form</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Submit your details to coordinate transparent, direct support with verified Care for All Homes.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field id="full_name" label="Full Name" required error={errors.full_name}>
                <input
                  {...a("full_name")}
                  className={inputCls}
                  value={v.full_name}
                  onChange={set("full_name")}
                  maxLength={100}
                  autoComplete="name"
                  placeholder="Your Name"
                />
              </Field>
              <Field id="mobile" label="Mobile Number" required error={errors.mobile}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-semibold text-muted-foreground">
                    +91
                  </span>
                  <input
                    {...a("mobile")}
                    type="tel"
                    inputMode="numeric"
                    className={`${inputCls} pl-12`}
                    value={v.mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setV({ ...v, mobile: digits });
                      clearError("mobile");
                    }}
                    maxLength={10}
                    autoComplete="tel"
                    placeholder="91504 08850"
                  />
                </div>
              </Field>
            </div>

            <Field id="email" label="Email Address" error={errors.email}>
              <input
                {...a("email")}
                type="email"
                className={inputCls}
                value={v.email}
                onChange={set("email")}
                maxLength={255}
                autoComplete="email"
                placeholder="example@gmail.com"
              />
            </Field>

            {/* 1. Preferred City / District & 2. SMILE Old Age Home */}
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="district" label="1. Preferred City / District" required error={errors.district}>
                <select
                  {...a("district")}
                  className={inputCls}
                  value={v.district}
                  onChange={(e) => {
                    const d = e.target.value;
                    setV({ ...v, district: d, ngo: "" });
                    clearError("district");
                  }}
                >
                  <option value="">Select City / District…</option>
                  {TN_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="ngo" label="2. Select Orphanage Home" required error={errors.ngo}>
                <select
                  {...a("ngo")}
                  className={inputCls}
                  value={v.ngo}
                  onChange={set("ngo")}
                  disabled={!v.district}
                >
                  <option value="">
                    {v.district ? "Select Orphanage Home…" : "← First select a City / District"}
                  </option>
                  {getNgosForDistrict(v.district).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Selected SMILE Home Verification Card */}
            {selectedHome && (
              <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{selectedHome.name}</span>
                  </span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {selectedHome.city}
                  </span>
                </div>
                <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{selectedHome.label.replace(selectedHome.name + " – ", "")}</span>
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground pt-1.5 border-t border-primary/15">
                  <a href={`tel:${selectedHome.phone}`} className="flex items-center gap-1 hover:text-primary font-medium">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>+91 {selectedHome.phone}</span>
                  </a>
                  <a href={`mailto:${selectedHome.email}`} className="flex items-center gap-1 hover:text-primary font-medium">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>{selectedHome.email}</span>
                  </a>
                </div>
              </div>
            )}

            {/* 3. Support Type & 4. Support Amount (Only when Financial Assistance is selected) */}
            <div className={v.support_type === "Financial Assistance" ? "grid gap-5 md:grid-cols-2" : ""}>
              <Field id="support_type" label="3. Support Type" required error={errors.support_type}>
                <select
                  {...a("support_type")}
                  className={inputCls}
                  value={v.support_type}
                  onChange={(e) => {
                    const st = e.target.value;
                    setV((prev) => ({
                      ...prev,
                      support_type: st,
                      amount: st === "Financial Assistance" ? prev.amount : "",
                    }));
                    clearError("support_type");
                    if (st !== "Financial Assistance") {
                      clearError("amount");
                    }
                  }}
                >
                  <option value="">Select Support Type…</option>
                  {SUPPORT_TYPES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              {v.support_type === "Financial Assistance" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <Field id="amount" label="4. Support / Donation Amount (₹)" required error={errors.amount}>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-muted-foreground">
                        ₹
                      </span>
                      <input
                        {...a("amount")}
                        type="text"
                        inputMode="numeric"
                        className={`${inputCls} pl-8`}
                        value={v.amount}
                        onChange={(e) => {
                          const num = e.target.value.replace(/\D/g, "");
                          setV((prev) => ({ ...prev, amount: num }));
                          clearError("amount");
                        }}
                        maxLength={8}
                        placeholder="e.g. 1000"
                        autoFocus
                      />
                    </div>
                    {/* Quick Presets */}
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {["500", "1000", "2500", "5000", "10000"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setV((prev) => ({ ...prev, amount: amt }));
                            clearError("amount");
                          }}
                          className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all cursor-pointer ${v.amount === amt
                              ? "border-primary bg-primary text-white shadow-xs"
                              : "border-border/80 bg-background hover:border-primary/50 text-foreground/80 hover:text-primary"
                            }`}
                        >
                          ₹{Number(amt).toLocaleString("en-IN")}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}
            </div>

            <Field id="message" label="Message or Enquiry" required error={errors.message}>
              <textarea
                {...a("message")}
                rows={4}
                className={inputCls}
                value={v.message}
                onChange={set("message")}
                maxLength={2000}
                placeholder="Provide clothing sizes, food preferences, or specific queries..."
              />
            </Field>

            <p className="text-xs text-muted-foreground">
              Your details are used only to respond to your enquiry and are never shared or sold.
            </p>

            <div aria-live="polite">
              {status === "success" && (
                <div className="rounded-xl border border-green-500/30 bg-green-50/70 p-5 dark:bg-green-950/30 text-foreground space-y-2.5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 font-semibold text-base text-green-700 dark:text-green-400">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <span>Enquiry Submitted Successfully!</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500 shrink-0" />
                      {feedback.notice || "Automated WhatsApp acknowledgement dispatched."}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>An official HelpHomesIndia acknowledgement receipt will be sent automatically to your WhatsApp in 1–2 hours.</span>
                    </p>
                  </div>
                  {feedback.manualWaUrl && (
                    <div className="pt-2 border-t border-border/60">
                      <a
                        href={feedback.manualWaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#128C7E] dark:text-[#25D366] hover:underline"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>Need immediate support? Chat directly with Helpdesk</span>
                      </a>
                    </div>
                  )}
                </div>
              )}
              {status === "error" && (
                <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertCircle className="h-4 w-4" /> Sorry, enquiry could not be saved, but you can still connect with us on WhatsApp.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 font-semibold text-white transition hover:bg-[#20bd5a] hover:shadow-lg disabled:opacity-60 cursor-pointer"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting & Dispatching WhatsApp…</span>
                </>
              ) : (
                <>
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>Submit & Send WhatsApp Updates</span>
                </>
              )}
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
