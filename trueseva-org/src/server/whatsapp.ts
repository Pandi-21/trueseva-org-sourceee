/**
 * Meta WhatsApp Cloud API Service for TrueSeva
 * Handles automated notification dispatch, acknowledgements, and delayed receipts.
 */

export interface WhatsAppEnquiryPayload {
  id?: string;
  full_name: string;
  mobile: string;
  email?: string | null;
  district: string;
  ngo: string;
  support_type: string;
  amount?: string;
  message?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: unknown;
}

import fs from "fs";
import path from "path";

function readEnvFile(): Record<string, string> {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const result: Record<string, string> = {};
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const idx = trimmed.indexOf("=");
          const k = trimmed.slice(0, idx).trim();
          let v = trimmed.slice(idx + 1).trim();
          if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
            v = v.slice(1, -1);
          }
          result[k] = v;
        }
      }
      return result;
    }
  } catch {}
  return {};
}

let runtimeEnv: Record<string, string> = {};

export function setRuntimeEnv(env: unknown): void {
  if (env && typeof env === "object") {
    for (const [k, v] of Object.entries(env as Record<string, unknown>)) {
      if (typeof v === "string") {
        runtimeEnv[k] = v;
      }
    }
  }
}

export function getEnv(key: string, fallback = ""): string {
  if (runtimeEnv[key]) {
    return runtimeEnv[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key]!;
  }
  const fileEnv = readEnvFile();
  if (fileEnv[key]) {
    return fileEnv[key];
  }
  return fallback;
}

function cleanPhone(raw: string): string {
  let cleaned = (raw || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);
  if (!cleaned.startsWith("91") && cleaned.length === 10) {
    cleaned = `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Core function to send messages via AskEva REST API (https://backend.askeva.io)
 */
export async function sendWhatsAppMessage(payload: Record<string, unknown>): Promise<WhatsAppSendResult> {
  const apiKey = getEnv("ASKEVA_API_KEY") || getEnv("WHATSAPP_TOKEN");
  const metaPhoneId = getEnv("WHATSAPP_PHONE_NUMBER_ID");

  if (!apiKey) {
    console.warn("[WhatsApp] Warning: ASKEVA_API_KEY / WHATSAPP_TOKEN is not configured.");
    return { success: false, error: "WhatsApp API Key is not configured in .env" };
  }

  // 1. Official AskEva backend URL verified from dashboard
  const primaryUrl = `https://backend.askeva.io/v1/message/send-message?token=${apiKey}`;
  const customUrl = getEnv("ASKEVA_API_URL");
  const askEvaEndpoints = customUrl
    ? [customUrl]
    : [
        primaryUrl,
        `https://api.askeva.io/v1/message/send-message?token=${apiKey}`,
        "https://api.askeva.io/v1/messages",
      ];

  let lastError = "";

  for (const endpoint of askEvaEndpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (response.ok) {
        console.log(`[AskEva] Message dispatched successfully:`, data);
        const msgId =
          (typeof data["messageId"] === "string" ? data["messageId"] : undefined) ||
          (typeof data["id"] === "string" ? data["id"] : undefined) ||
          (Array.isArray(data["messages"]) && data["messages"][0]?.id ? String(data["messages"][0].id) : undefined) ||
          `msg-${Date.now()}`;
        return { success: true, messageId: msgId, details: data };
      } else {
        lastError = `AskEva HTTP ${response.status}: ${JSON.stringify(data)}`;
        console.warn(`[AskEva] ${endpoint} returned error:`, data);
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[AskEva] Failed connecting to ${endpoint}:`, lastError);
    }
  }

  // 2. Direct Meta Graph API fallback if a Phone Number ID is present
  if (metaPhoneId) {
    try {
      const metaUrl = `https://graph.facebook.com/v20.0/${metaPhoneId}/messages`;
      const response = await fetch(metaUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

      if (response.ok) {
        const msgArr = data["messages"] as Array<{ id?: string }> | undefined;
        const messageId = msgArr?.[0]?.id || `meta-${Date.now()}`;
        return { success: true, messageId, details: data };
      }
    } catch (err) {
      console.error("[Meta Graph API Error]", err);
    }
  }

  return { success: false, error: lastError || "Failed to dispatch message via WhatsApp API" };
}

// Backward compatibility alias
export const sendMetaRawMessage = sendWhatsAppMessage;

/**
 * Send template message matching AskEva exact schema
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode = "en",
  components?: unknown[],
  dynamicParams?: string[],
): Promise<WhatsAppSendResult> {
  const recipient = cleanPhone(to);

  let bodyComponents = components;
  if (!bodyComponents && dynamicParams && dynamicParams.length > 0) {
    bodyComponents = [
      {
        type: "body",
        parameters: dynamicParams.map((text) => ({ type: "text", text: String(text || "") })),
      },
    ];
  }

  const payload: Record<string, unknown> = {
    to: recipient,
    type: "template",
    template: {
      language: {
        policy: "deterministic",
        code: languageCode,
      },
      name: templateName,
      ...(bodyComponents && bodyComponents.length > 0 ? { components: bodyComponents } : {}),
    },
  };

  return sendWhatsAppMessage(payload);
}

/**
 * Send standard text message via AskEva
 */
export async function sendWhatsAppText(to: string, messageBody: string): Promise<WhatsAppSendResult> {
  const recipient = cleanPhone(to);

  const payload: Record<string, unknown> = {
    to: recipient,
    type: "text",
    text: {
      body: messageBody,
    },
    message: messageBody,
  };

  return sendWhatsAppMessage(payload);
}

/**
 * Send PDF / Document message via AskEva
 */
export async function sendWhatsAppDocument(
  to: string,
  documentUrl: string,
  filename = "TrueSeva_Official_Receipt.pdf",
  caption?: string,
): Promise<WhatsAppSendResult> {
  const recipient = cleanPhone(to);

  const payload: Record<string, unknown> = {
    to: recipient,
    type: "document",
    document: {
      link: documentUrl,
      filename: filename,
      ...(caption ? { caption } : {}),
    },
  };

  return sendWhatsAppMessage(payload);
}

/**
 * Formats full inquiry details into a readable notification string
 */
export function formatEnquirySummary(enquiry: WhatsAppEnquiryPayload): string {
  const amountStr = enquiry.amount ? `₹${Number(enquiry.amount).toLocaleString("en-IN")}` : "N/A";
  return [
    "📋 *New TrueSeva Support Enquiry*",
    "──────────────────────────",
    `👤 *Name:* ${enquiry.full_name}`,
    `📱 *Mobile:* +91 ${enquiry.mobile}`,
    enquiry.email ? `✉️ *Email:* ${enquiry.email}` : null,
    `📍 *District:* ${enquiry.district}`,
    `🏡 *SMILE Home:* ${enquiry.ngo}`,
    `🤝 *Support Type:* ${enquiry.support_type}`,
    enquiry.support_type === "Financial Assistance" ? `💰 *Amount:* ${amountStr}` : null,
    enquiry.message ? `💬 *Message:* ${enquiry.message}` : null,
    "──────────────────────────",
    "Sent automatically via TrueSeva initiative portal",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Formats a clean, professional Acknowledgement Receipt
 */
export function formatReceiptMessage(enquiry: WhatsAppEnquiryPayload): string {
  const refCode = enquiry.id
    ? `TS-${enquiry.id.slice(0, 8).toUpperCase()}`
    : `TS-${Date.now().toString().slice(-8)}`;

  const todayStr = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const amountStr = enquiry.amount ? `₹${Number(enquiry.amount).toLocaleString("en-IN")}` : null;

  return [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "  💐 *TRUESEVA INITIATIVE* 💐",
    "  *OFFICIAL ACKNOWLEDGEMENT RECEIPT*",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `*Receipt Reference:* ${refCode}`,
    `*Generated On:* ${todayStr}`,
    "",
    `*Contributor / Supporter:* ${enquiry.full_name}`,
    `*Contact Number:* +91 ${enquiry.mobile}`,
    `*Preferred SMILE Home:* ${enquiry.ngo}`,
    `*District:* ${enquiry.district}`,
    `*Support Category:* ${enquiry.support_type}`,
    amountStr ? `*Assistance Amount:* ${amountStr}` : null,
    "",
    "───────────────────────────",
    "🙏 *Heartfelt Gratitude!*",
    "Your compassion directly strengthens the care, nutrition, and healthcare provided to elderly mothers and fathers in Tamil Nadu care homes.",
    "",
    "Our field coordination team at TAFVA is currently reviewing your support details. A coordinator will reach out directly to coordinate delivery or next steps.",
    "───────────────────────────",
    "📞 *Coordination Helpdesk:* +91 91504 08850",
    "🌐 *Website:* https://trueseva.org",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Send automated WhatsApp notification immediately after form submission:
 * 1. Admin alert (full details)
 * 2. Visitor acknowledgement (template or text)
 */
export async function sendEnquiryWhatsAppNotifications(enquiry: WhatsAppEnquiryPayload): Promise<{
  adminResult: WhatsAppSendResult;
  userResult: WhatsAppSendResult;
}> {
  const adminPhone = getEnv("WHATSAPP_ADMIN_PHONE", "919150408850");
  const templateName = getEnv("ASKEVA_TEMPLATE_NAME") || getEnv("WHATSAPP_TEMPLATE_NAME", "trueseva_thank_you");

  console.log(`[WhatsApp / AskEva] Dispatching automated notifications for: ${enquiry.full_name} (${enquiry.mobile})`);

  // 1. Notify Admin with full details
  const adminMessage = formatEnquirySummary(enquiry);
  const adminResult = await sendWhatsAppText(adminPhone, adminMessage);

  // 2. Send instant acknowledgement to the user with dynamic variables {{1}}, {{2}}, {{3}}
  const userParams = [
    enquiry.full_name || "Supporter",
    enquiry.ngo || "Elderly Care Home",
    enquiry.district || "Tamil Nadu",
  ];

  let userResult: WhatsAppSendResult;

  if (templateName && templateName.trim() !== "") {
    userResult = await sendWhatsAppTemplate(enquiry.mobile, templateName, "en", undefined, userParams);
  } else {
    // Standard text fallback
    const welcomeText = `Hello ${enquiry.full_name},\n\nThank you for choosing to support our elderly care initiative through TrueSeva! 🪔\n\nWe have received your details for ${enquiry.ngo} (${enquiry.district}). Your verified enquiry receipt will be sent to this chat shortly.\n\nWarm regards,\nTrueSeva & TAFVA Elders Care Initiative`;
    userResult = await sendWhatsAppText(enquiry.mobile, welcomeText);
  }

  // 3. Schedule official PDF receipt to be sent exactly 1 hour later (via Upstash QStash)
  await scheduleDelayedReceipt(enquiry);

  return { adminResult, userResult };
}

/**
 * Send the PDF receipt to the user's WhatsApp via AskEva
 */
export async function sendReceiptToUser(enquiry: WhatsAppEnquiryPayload): Promise<WhatsAppSendResult> {
  console.log(`[WhatsApp / AskEva] Dispatching PDF receipt to: ${enquiry.full_name} (+91 ${enquiry.mobile})`);

  const receiptTemplate =
    getEnv("WHATSAPP_RECEIPT_TEMPLATE_NAME") ||
    getEnv("ASKEVA_RECEIPT_TEMPLATE") ||
    "trueseva_receipt";
  const refCode = enquiry.id ? `TS-${enquiry.id.slice(0, 8).toUpperCase()}` : "TS-1082";
  const siteUrl = getEnv("PUBLIC_SITE_URL") || getEnv("NEXT_PUBLIC_SITE_URL") || getEnv("SITE_URL");
  let pdfUrl = getEnv("RECEIPT_PDF_URL");

  // If a live public site URL is configured, build a 100% dynamic personalized PDF receipt URL
  if (!pdfUrl && siteUrl && siteUrl.startsWith("http") && !siteUrl.includes("localhost")) {
    const params = new URLSearchParams({
      ref: refCode,
      name: enquiry.full_name || "Supporter",
      mobile: enquiry.mobile || "",
      ngo: enquiry.ngo || "Elderly Care Home",
      dist: enquiry.district || "Tamil Nadu",
      supp: enquiry.support_type || "Elderly Care Support",
    });
    pdfUrl = `${siteUrl.replace(/\/$/, "")}/api/whatsapp/receipt.pdf?${params.toString()}`;
  }

  if (!pdfUrl) {
    pdfUrl =
      "https://cdn.jsdelivr.net/gh/Pandi-21/trueseva-org-sourceee@main/trueseva-org/public/TrueSeva_Sample_Receipt.pdf";
  }

  // 1. Try sending via FILE template if approved (trueseva_receipt)
  if (receiptTemplate && receiptTemplate.trim() !== "") {
    const templatePayload = {
      to: cleanPhone(enquiry.mobile),
      type: "template",
      template: {
        language: { policy: "deterministic", code: "en" },
        name: receiptTemplate,
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "document",
                document: {
                  link: pdfUrl,
                  filename: `TrueSeva_Receipt_${refCode}.pdf`,
                },
              },
            ],
          },
          {
            type: "body",
            parameters: [
              { type: "text", text: enquiry.full_name || "Supporter" },
              { type: "text", text: enquiry.ngo || "Elderly Care Home" },
              { type: "text", text: enquiry.district || "Tamil Nadu" },
              { type: "text", text: refCode },
            ],
          },
        ],
      },
    };

    const templateResult = await sendWhatsAppMessage(templatePayload);
    if (templateResult.success) {
      console.log("[AskEva] Successfully sent PDF via template:", templateResult);
      return templateResult;
    }
  }

  // 2. Direct Document Attachment Fallback
  console.log("[AskEva] Sending PDF receipt as direct document attachment...");
  const docResult = await sendWhatsAppDocument(
    enquiry.mobile,
    pdfUrl,
    `TrueSeva_Official_Receipt_${refCode}.pdf`,
    `TrueSeva Official Support Acknowledgement Receipt (#${refCode}) 🪔\n\nDear ${enquiry.full_name}, thank you for your noble support!`
  );

  // 3. Send formatted WhatsApp text summary alongside
  const receiptText = formatReceiptMessage(enquiry);
  await sendWhatsAppText(enquiry.mobile, receiptText);

  return docResult;
}

// In-memory registry to ensure receipts are not sent repeatedly
const scheduledReceipts = new Set<string>();

/**
 * Schedule delayed receipt sending (defaults to 1 hour via Upstash QStash)
 */
export async function scheduleDelayedReceipt(enquiry: WhatsAppEnquiryPayload): Promise<void> {
  const qstashToken = getEnv("QSTASH_TOKEN");
  const qstashUrl = getEnv("QSTASH_URL", "https://qstash-eu-central-1.upstash.io");
  const siteUrl = getEnv("PUBLIC_SITE_URL", "https://trueseva-org.vercel.app");
  const delaySecEnv = getEnv("WHATSAPP_RECEIPT_DELAY_SECONDS");
  const delayMinEnv = getEnv("WHATSAPP_RECEIPT_DELAY_MINUTES", "2");
  const delayHoursStr = getEnv("WHATSAPP_RECEIPT_DELAY_HOURS");

  let delaySec = 120; // 2 minutes default for live testing
  if (delaySecEnv) {
    delaySec = Math.max(10, parseInt(delaySecEnv, 10));
  } else if (delayMinEnv) {
    delaySec = Math.max(10, Math.round(parseFloat(delayMinEnv) * 60));
  } else if (delayHoursStr && delayHoursStr !== "1") {
    delaySec = Math.max(10, Math.round(parseFloat(delayHoursStr) * 3600));
  }

  if (qstashToken && qstashToken.trim() !== "") {
    const destination = `${siteUrl.replace(/\/$/, "")}/api/whatsapp/delayed-receipt`;
    const publishUrl = `${qstashUrl.replace(/\/$/, "")}/v2/publish/${destination}`;

    console.log(`[QStash] Scheduling delayed receipt for ${enquiry.full_name} in ${delaySec}s (${Math.round(delaySec / 60)} min) -> ${destination}`);

    try {
      const qstashRes = await fetch(publishUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${qstashToken.trim()}`,
          "Content-Type": "application/json",
          "Upstash-Delay": `${delaySec}s`,
        },
        body: JSON.stringify(enquiry),
      });

      const qstashData = (await qstashRes.json().catch(() => ({}))) as Record<string, unknown>;
      if (qstashRes.ok) {
        console.log(`[QStash] 1-hour delayed receipt successfully scheduled! Message ID:`, qstashData.messageId);
        return;
      } else {
        console.warn(`[QStash] Scheduling returned non-OK status:`, qstashData);
      }
    } catch (err) {
      console.error(`[QStash] Error scheduling delayed receipt:`, err);
    }
  }

  // Fallback in-memory timer (for local testing)
  const delayMs = Math.min(delaySec * 1000, 60_000);
  console.log(`[WhatsApp / Fallback Timer] Receipt scheduled in ${Math.round(delayMs / 1000)}s...`);
  const timer = setTimeout(async () => {
    try {
      await sendReceiptToUser(enquiry);
    } catch (err) {
      console.error("[WhatsApp] Error sending fallback scheduled receipt:", err);
    }
  }, delayMs);

  if (typeof timer.unref === "function") {
    timer.unref();
  }
}
