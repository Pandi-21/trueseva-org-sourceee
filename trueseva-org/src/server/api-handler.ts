import {
  sendWhatsAppTemplate,
  sendWhatsAppText,
  sendReceiptToUser,
  sendEnquiryWhatsAppNotifications,
  type WhatsAppEnquiryPayload,
} from "./whatsapp";
import { supabase } from "@/integrations/supabase/client";

export async function handleWhatsAppApiRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/api/whatsapp")) {
    return null;
  }

  const jsonHeaders = {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: jsonHeaders });
  }

  // 1. Submit Enquiry & Trigger Automated WhatsApp (Called from frontend form)
  if (url.pathname === "/api/whatsapp/submit" && request.method === "POST") {
    try {
      const data = (await request.json().catch(() => ({}))) as {
        full_name?: string;
        mobile?: string;
        email?: string | null;
        district?: string;
        ngo?: string;
        support_type?: string;
        amount?: string;
        message?: string;
      };

      const isFinancial = data.support_type === "Financial Assistance";
      const amountVal = isFinancial && data.amount ? `₹${Number(data.amount).toLocaleString("en-IN")}` : "";

      // 1. Record enquiry in Supabase database
      const fullMessage = `[SMILE Home: ${data.ngo || ""}]${amountVal ? ` [Amount: ${amountVal}]` : ""} ${(data.message || "").trim()}`;

      const { data: inserted, error: dbError } = await supabase
        .from("enquiries")
        .insert({
          full_name: (data.full_name || "").trim(),
          mobile: (data.mobile || "").trim(),
          email: data.email?.trim() || null,
          support_type: data.support_type || "",
          district: data.district || "",
          message: fullMessage,
        })
        .select("id")
        .single();

      if (dbError) {
        console.error("[Database Insert Error]:", dbError);
      }

      const enquiryId = inserted?.id || `local-${Date.now()}`;

      // 2. Automated Meta WhatsApp Dispatch
      const payload: WhatsAppEnquiryPayload = {
        id: enquiryId,
        full_name: data.full_name || "",
        mobile: data.mobile || "",
        email: data.email,
        district: data.district || "",
        ngo: data.ngo || "",
        support_type: data.support_type || "",
        amount: data.amount,
        message: data.message,
      };

      const { userResult } = await sendEnquiryWhatsAppNotifications(payload);

      let notice = "Enquiry recorded successfully.";
      if (userResult.success) {
        notice = "Automated WhatsApp acknowledgement sent to your mobile number.";
      }

      return new Response(
        JSON.stringify({ success: true, id: enquiryId, whatsappNotice: notice }),
        { status: 200, headers: jsonHeaders },
      );
    } catch (err) {
      console.error("[WhatsApp Submit API Error]:", err);
      return new Response(
        JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  // 1. Health & Configuration Status Check
  if (url.pathname === "/api/whatsapp/status" && request.method === "GET") {
    const hasToken = Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_TOKEN.trim() !== "");
    const hasPhoneId = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_PHONE_NUMBER_ID.trim() !== "");
    const adminPhone = process.env.WHATSAPP_ADMIN_PHONE || "919150408850";
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "hello_world";
    const delayHours = process.env.WHATSAPP_RECEIPT_DELAY_HOURS || "1";

    return new Response(
      JSON.stringify({
        status: "ok",
        configured: hasToken && hasPhoneId,
        hasToken,
        hasPhoneId,
        adminPhone,
        templateName,
        receiptDelayHours: delayHours,
      }),
      { status: 200, headers: jsonHeaders },
    );
  }

  // 2. Direct Test Message
  if (url.pathname === "/api/whatsapp/test" && request.method === "POST") {
    try {
      const body = (await request.json().catch(() => ({}))) as { to?: string; message?: string };
      const targetPhone = body.to || process.env.WHATSAPP_ADMIN_PHONE || "919150408850";
      const templateName = process.env.WHATSAPP_TEMPLATE_NAME || "hello_world";

      // Try sending template first
      const templateResult = await sendWhatsAppTemplate(targetPhone, templateName);
      if (templateResult.success) {
        return new Response(
          JSON.stringify({
            success: true,
            method: "template",
            template: templateName,
            result: templateResult,
          }),
          { status: 200, headers: jsonHeaders },
        );
      }

      // If template failed, attempt direct text message
      const textResult = await sendWhatsAppText(
        targetPhone,
        body.message || "Test message from TrueSeva WhatsApp Integration",
      );

      return new Response(
        JSON.stringify({
          success: textResult.success,
          method: "text",
          result: textResult,
          templateError: templateResult.error,
        }),
        { status: textResult.success ? 200 : 400, headers: jsonHeaders },
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  // 3. Process Pending Receipts (Can be triggered by Vercel Cron or QStash)
  if (url.pathname === "/api/whatsapp/process-receipts" && (request.method === "POST" || request.method === "GET")) {
    try {
      const { data: enquiries, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        return new Response(JSON.stringify({ success: false, error }), { status: 500, headers: jsonHeaders });
      }

      const results = [];
      for (const item of enquiries || []) {
        // Parse details from stored message
        const homeMatch = item.message.match(/\[SMILE Home: (.*?)\]/);
        const amountMatch = item.message.match(/\[Amount: (.*?)\]/);
        const ngo = homeMatch ? homeMatch[1] : "SMILE Care Home";
        const amount = amountMatch ? amountMatch[1] : undefined;

        const payload: WhatsAppEnquiryPayload = {
          id: item.id,
          full_name: item.full_name,
          mobile: item.mobile,
          email: item.email,
          district: item.district,
          ngo,
          support_type: item.support_type,
          amount,
        };

        const res = await sendReceiptToUser(payload);
        results.push({ id: item.id, mobile: item.mobile, result: res });
      }

      return new Response(JSON.stringify({ success: true, processed: results.length, results }), {
        status: 200,
        headers: jsonHeaders,
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err instanceof Error ? err.message : String(err) }),
        { status: 500, headers: jsonHeaders },
      );
    }
  }

  return new Response(JSON.stringify({ error: "Endpoint not found" }), { status: 404, headers: jsonHeaders });
}
