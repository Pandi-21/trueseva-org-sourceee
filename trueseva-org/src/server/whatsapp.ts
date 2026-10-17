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

function getEnv(key: string, fallback = ""): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key]!;
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
 * Make direct request to Meta Graph API for WhatsApp Cloud messages
 */
export async function sendMetaRawMessage(payload: Record<string, unknown>): Promise<WhatsAppSendResult> {
  const token = getEnv("WHATSAPP_TOKEN");
  const phoneNumberId = getEnv("WHATSAPP_PHONE_NUMBER_ID");

  if (!token) {
    console.warn("[WhatsApp] Warning: WHATSAPP_TOKEN is not configured.");
    return { success: false, error: "WHATSAPP_TOKEN is not configured in .env" };
  }

  if (!phoneNumberId) {
    console.warn("[WhatsApp] Warning: WHATSAPP_PHONE_NUMBER_ID is not configured.");
    return {
      success: false,
      error: "WHATSAPP_PHONE_NUMBER_ID is not configured in .env. Find it in Meta Developers > WhatsApp > API Setup.",
    };
  }

  const url = `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as Record<string, unknown>;

    if (!response.ok) {
      console.error("[WhatsApp API Error]", response.status, data);
      return {
        success: false,
        error: (data?.error as { message?: string })?.message || `HTTP ${response.status}`,
        details: data,
      };
    }

    const messages = data.messages as Array<{ id: string }> | undefined;
    const messageId = messages?.[0]?.id;

    console.log("[WhatsApp] Message sent successfully. ID:", messageId);
    return { success: true, messageId, details: data };
  } catch (err) {
    console.error("[WhatsApp API Network Exception]", err);
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Send template message (required for initial outbound business message)
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode = "en_US",
  components?: unknown[],
): Promise<WhatsAppSendResult> {
  const recipient = cleanPhone(to);

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    to: recipient,
    type: "template",
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      ...(components && components.length > 0 ? { components } : {}),
    },
  };

  return sendMetaRawMessage(payload);
}

/**
 * Send standard text message
 */
export async function sendWhatsAppText(to: string, messageBody: string): Promise<WhatsAppSendResult> {
  const recipient = cleanPhone(to);

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipient,
    type: "text",
    text: {
      preview_url: false,
      body: messageBody,
    },
  };

  return sendMetaRawMessage(payload);
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
  const templateName = getEnv("WHATSAPP_TEMPLATE_NAME", "hello_world");

  console.log(`[WhatsApp] Dispatching automated notifications for: ${enquiry.full_name} (${enquiry.mobile})`);

  // 1. Notify Admin with full details
  const adminMessage = formatEnquirySummary(enquiry);
  const adminResult = await sendWhatsAppText(adminPhone, adminMessage);

  // 2. Send instant acknowledgement to the user
  let userResult: WhatsAppSendResult;

  if (templateName && templateName.trim() !== "") {
    // If template configured (e.g. 'hello_world' or custom approved template)
    userResult = await sendWhatsAppTemplate(enquiry.mobile, templateName);
  } else {
    // Standard text fallback
    const welcomeText = `Hello ${enquiry.full_name},\n\nThank you for reaching out to TrueSeva for ${enquiry.support_type}.\n\nWe have received your details for ${enquiry.ngo}. Your acknowledgement receipt will be sent shortly.\n\nWarm regards,\nTrueSeva Team`;
    userResult = await sendWhatsAppText(enquiry.mobile, welcomeText);
  }

  // Schedule delayed receipt (1-2 hours later)
  scheduleDelayedReceipt(enquiry);

  return { adminResult, userResult };
}

/**
 * Send the receipt to the user's WhatsApp
 */
export async function sendReceiptToUser(enquiry: WhatsAppEnquiryPayload): Promise<WhatsAppSendResult> {
  console.log(`[WhatsApp] Dispatching delayed receipt to: ${enquiry.full_name} (+91 ${enquiry.mobile})`);
  const receiptText = formatReceiptMessage(enquiry);
  const customReceiptTemplate = getEnv("WHATSAPP_RECEIPT_TEMPLATE_NAME");

  if (customReceiptTemplate && customReceiptTemplate.trim() !== "") {
    // If an approved Meta receipt template exists
    return sendWhatsAppTemplate(enquiry.mobile, customReceiptTemplate);
  }

  // Send formatted WhatsApp receipt message
  return sendWhatsAppText(enquiry.mobile, receiptText);
}

// In-memory registry to ensure receipts are not sent repeatedly
const scheduledReceipts = new Set<string>();

/**
 * Schedule delayed receipt sending
 */
export function scheduleDelayedReceipt(enquiry: WhatsAppEnquiryPayload): void {
  const delayHours = parseFloat(getEnv("WHATSAPP_RECEIPT_DELAY_HOURS", "1"));
  const delayMs = Math.max(10_000, delayHours * 60 * 60 * 1000); // minimum 10 seconds

  const receiptKey = `${enquiry.mobile}_${enquiry.full_name}_${enquiry.support_type}`;
  if (scheduledReceipts.has(receiptKey)) {
    console.log(`[WhatsApp] Receipt already scheduled for ${receiptKey}, skipping duplicate timer.`);
    return;
  }
  scheduledReceipts.add(receiptKey);

  console.log(
    `[WhatsApp] Receipt scheduled for ${enquiry.full_name} in ${delayHours} hour(s) (${Math.round(delayMs / 1000)}s)...`,
  );

  const timer = setTimeout(async () => {
    try {
      await sendReceiptToUser(enquiry);
    } catch (err) {
      console.error("[WhatsApp] Error sending scheduled receipt:", err);
    } finally {
      scheduledReceipts.delete(receiptKey);
    }
  }, delayMs);

  // Unref timer so it doesn't hold open node CLI or testing process if applicable
  if (typeof timer.unref === "function") {
    timer.unref();
  }
}
