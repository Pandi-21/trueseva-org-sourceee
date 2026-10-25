/**
 * Dynamic HelpHomesIndia PDF Generator
 * Generates official vector PDF receipts dynamically based on visitor form submission data.
 */

export interface ReceiptData {
  ref?: string;
  date?: string;
  fullName?: string;
  mobile?: string;
  ngo?: string;
  district?: string;
  supportType?: string;
  amount?: string;
}

export function createReceiptPdf(data: ReceiptData): Buffer {
  // Helper for PDF graphics and text
  function text(str: string, x: number, y: number, size = 11, font = "F1", r = 0.1, g = 0.1, b = 0.1) {
    const escaped = str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    return `BT /${font} ${size} Tf ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${y} Td (${escaped}) Tj ET\n`;
  }

  function rect(
    x: number,
    y: number,
    w: number,
    h: number,
    r = 0.9,
    g = 0.9,
    b = 0.9,
    stroke = false,
    sr = 0,
    sg = 0,
    sb = 0,
  ) {
    let s = `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${y} ${w} ${h} re f\n`;
    if (stroke) {
      s += `${sr.toFixed(3)} ${sg.toFixed(3)} ${sb.toFixed(3)} RG 1.5 w ${x} ${y} ${w} ${h} re S\n`;
    }
    return s;
  }

  function line(x1: number, y1: number, x2: number, y2: number, r = 0.8, g = 0.8, b = 0.8, width = 1) {
    return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S\n`;
  }

  let stream = "";

  // Page background: warm cream
  stream += rect(0, 0, 595, 842, 0.99, 0.98, 0.96);

  // Outer decorative border
  stream += rect(20, 20, 555, 802, 0.99, 0.98, 0.96, true, 0.82, 0.45, 0.22);
  stream += rect(24, 24, 547, 794, 0.99, 0.98, 0.96, true, 0.92, 0.75, 0.65);

  // Header Banner Box (Terracotta primary brand color)
  stream += rect(30, 725, 535, 85, 0.78, 0.32, 0.15); // #C75226 terracotta
  stream += text("HELPHOMESINDIA INITIATIVE", 50, 775, 20, "F2", 1, 1, 1);
  stream += text("TAFVA Verified Orphanages Homes Support Initiative - Tamil Nadu", 50, 755, 10, "F1", 1, 0.92, 0.85);
  stream += text("100% Direct Support * Zero Intermediaries", 50, 740, 9, "F2", 1, 0.85, 0.5);

  // Receipt Title Bar
  stream += rect(40, 680, 515, 32, 0.95, 0.92, 0.88);
  stream += text("OFFICIAL SUPPORT ACKNOWLEDGEMENT RECEIPT", 130, 692, 13, "F2", 0.78, 0.32, 0.15);

  const todayStr =
    data.date ||
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date());

  // Meta Info Box
  stream += line(40, 665, 555, 665, 0.85, 0.85, 0.85, 1);
  stream += text("Receipt Ref: #" + (data.ref || "TS-1082"), 50, 648, 10, "F2", 0.2, 0.2, 0.2);
  stream += text("Date: " + todayStr, 340, 648, 10, "F1", 0.4, 0.4, 0.4);
  stream += line(40, 635, 555, 635, 0.85, 0.85, 0.85, 1);

  // Supporter / Donor Details Section
  stream += rect(40, 440, 515, 180, 1, 1, 1, true, 0.88, 0.88, 0.88);
  stream += rect(40, 595, 515, 25, 0.94, 0.96, 0.95);
  stream += text("CONTRIBUTOR & SUPPORT DETAILS", 55, 604, 11, "F2", 0.2, 0.35, 0.3);

  const fields: [string, string][] = [
    ["Contributor Name:", data.fullName || "Supporter"],
    ["Mobile Number:", "+91 " + (data.mobile || "N/A")],
    ["Selected Care Home:", data.ngo || "Care for All Home"],
    ["District / City:", data.district || "Tamil Nadu"],
    ["Support Category:", data.supportType || "Elderly Care Assistance"],
    ["Coordination Status:", "TAFVA Field Verified - Direct Coordination Active"],
  ];

  let y = 570;
  for (const [label, val] of fields) {
    stream += text(label, 60, y, 10, "F2", 0.35, 0.35, 0.35);
    stream += text(val, 210, y, 10, "F1", 0.15, 0.15, 0.15);
    stream += line(60, y - 6, 535, y - 6, 0.94, 0.94, 0.94, 0.5);
    y -= 24;
  }

  // Field Verification Stamp Box
  stream += rect(40, 310, 515, 115, 0.95, 0.97, 0.96, true, 0.7, 0.85, 0.8);
  stream += text("VERIFICATION & DIRECT DISPATCH STATEMENT", 55, 400, 10, "F2", 0.15, 0.45, 0.4);
  stream += text("This support acknowledgement has been officially recorded by HelpHomesIndia operating", 55, 380, 9, "F1", 0.25, 0.3, 0.28);
  stream += text("under the field coordination of the Tamil Nadu Federation of Voluntary Agencies (TAFVA).", 55, 365, 9, "F1", 0.25, 0.3, 0.28);
  stream += text("All material contributions and monetary support connect directly with the registered elderly", 55, 350, 9, "F1", 0.25, 0.3, 0.28);
  stream += text("care homes identified through physical fieldwork across 10 districts of Tamil Nadu.", 55, 335, 9, "F1", 0.25, 0.3, 0.28);
  stream += text("Zero commissions are collected. Support reaches residents with 100% transparency.", 55, 320, 9, "F2", 0.78, 0.32, 0.15);

  // Gratitude Message Box
  stream += rect(40, 190, 515, 105, 0.99, 0.96, 0.93, true, 0.9, 0.75, 0.65);
  stream += text("HEARTFELT GRATITUDE FOR LIGHTING UP LIVES", 55, 275, 10, "F2", 0.78, 0.32, 0.15);
  stream += text("Thank you for your noble compassion. Your support brings smiles, dignity, nutrition,", 55, 255, 9, "F1", 0.3, 0.3, 0.3);
  stream += text("and essential care to elderly mothers and fathers this festive season.", 55, 240, 9, "F1", 0.3, 0.3, 0.3);
  stream += text("A dedicated coordinator from the respective care home or TAFVA helpdesk will connect", 55, 220, 9, "F1", 0.3, 0.3, 0.3);
  stream += text("with you directly to coordinate delivery and acknowledgement.", 55, 205, 9, "F1", 0.3, 0.3, 0.3);

  // Footer & Helpdesk
  stream += line(40, 160, 555, 160, 0.8, 0.8, 0.8, 1);
  stream += text("HelpHomesIndia Coordination Helpdesk: +91 91504 08850  |  Email: elderscare@helphomesindia.org", 85, 140, 9, "F2", 0.2, 0.2, 0.2);
  stream += text("Website: https://helphomesindia.org  |  TAFVA Secretariat, Tamil Nadu, India", 130, 125, 8.5, "F1", 0.45, 0.45, 0.45);
  stream += text("This is a system-generated electronic acknowledgement receipt issued under HelpHomesIndia.", 100, 95, 7.5, "F1", 0.55, 0.55, 0.55);

  const streamLength = Buffer.byteLength(stream, "utf-8");

  // Construct standard PDF objects
  const objects = [];
  objects.push(`%PDF-1.4\n`);
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n`);
  objects.push(`4 0 obj\n<< /Length ${streamLength} >>\nstream\n${stream}endstream\nendobj\n`);
  objects.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`);
  objects.push(`6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n`);

  let currentOffset = 0;
  const offsets: number[] = [];
  let pdfString = objects[0] || "";
  currentOffset += Buffer.byteLength(pdfString, "utf-8");

  for (let i = 1; i < objects.length; i++) {
    offsets.push(currentOffset);
    const objStr = objects[i] || "";
    pdfString += objStr;
    currentOffset += Buffer.byteLength(objStr, "utf-8");
  }

  const startxref = currentOffset;
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += String(offset).padStart(10, "0") + " 00000 n \n";
  }

  xref += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;
  pdfString += xref;

  return Buffer.from(pdfString, "utf-8");
}
