export const SUPPORT_TYPES = [
  "New Clothing",
  "Essential Groceries",
  "Financial Assistance",
  "Medical & Food Assistance",
  "Other Direct Support",
] as const;

export type PaymentAccountId = "rojavanam" | "humanity-trust";

export interface SmileHome {
  id: number;
  sNo: number;
  city: string;
  name: string;
  label: string;
  address: string;
  phone: string;
  email?: string;
  /** Donation account for this home; defaults to the Rojavanam trust account. */
  paymentAccount?: PaymentAccountId;
}

export const CENTRAL_PHONE = "9150408850";

export const SMILE_HOMES: SmileHome[] = [
  {
    id: 1,
    sNo: 1,
    city: "Tirunelveli",
    name: "AMK SMILE Oldage Home",
    label: "AMK SMILE Oldage Home – Melapalayam, Tirunelveli",
    address: "Melapalayam, Tirunelveli – 627 005",
    phone: CENTRAL_PHONE,
    email: "amkcentre@gmail.com",
  },
  {
    id: 2,
    sNo: 2,
    city: "Kanniyakumari",
    name: "AMK SMILE Oldage Home",
    label: "AMK SMILE Oldage Home – Paramarthalingapuram, Kanyakumari",
    address: "No.114, Amirtha School Road, Paramarthalingapuram, Kanyakumari – 629 702",
    phone: CENTRAL_PHONE,
    email: "amkcentre@gmail.com",
  },
  {
    id: 3,
    sNo: 3,
    city: "Tiruchendur",
    name: "Brindavanam SMILE Oldage Home",
    label: "Brindavanam SMILE Oldage Home – Near Municipality, Tiruchendur",
    address: "Near Tiruchendur Municipality, Tiruchendur",
    phone: CENTRAL_PHONE,
    email: "brindavanamtrust70@gmail.com",
  },
  {
    id: 4,
    sNo: 4,
    city: "Rameswaram",
    name: "Brindavanam SMILE Oldage Home",
    label: "Brindavanam SMILE Oldage Home – Near Municipality, Rameswaram",
    address: "Near Rameswaram Municipality, Rameswaram",
    phone: CENTRAL_PHONE,
    email: "brindavanamtrust70@gmail.com",
  },
  {
    id: 5,
    sNo: 5,
    city: "Kanchipuram",
    name: "Brindavanam SMILE Oldage Home",
    label: "Brindavanam SMILE Oldage Home – Panchu Pettai, Oli Muhammed Salai",
    address: "Kanchipuram, Panchu Pettai, Oli Muhammed Salai, Kanchipuram",
    phone: CENTRAL_PHONE,
    email: "brindavanamtrust70@gmail.com",
  },
  {
    id: 6,
    sNo: 6,
    city: "Madurai",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Uthankudi (No.1, Melur Road)",
    address: "No.1, Melur Road, Uthankudi, Madurai – 625 107",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 7,
    sNo: 7,
    city: "Madurai",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Shenoy Nagar (Jagajeevan Ram St)",
    address: "Jagajeevan Ram Street, Shenoy Nagar, Madurai – 625 020",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 8,
    sNo: 8,
    city: "Madurai",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Keeraithurai / Chinthamani",
    address: "Rani Ponnammal Road, Keeraithurai, Chinthamani Main Road, Madurai – 625 009",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 9,
    sNo: 9,
    city: "Madurai",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Chimmakal (Hanumarkovil Padithurai Rd)",
    address: "Sandhana Mariamman Kovil Street, Hanumarkovil Padithurai Road, Chimmakal – 625 001",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 10,
    sNo: 10,
    city: "Palani",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Rajaj Road (Opp. Amman Petrol Bunk)",
    address: "Rajaj Road, Amman Petrol Bunk Opposite, Palani – 624 601",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 11,
    sNo: 11,
    city: "Coimbatore",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Thudiyalur (Cheron Colony)",
    address: "CVPV Nagar, Cheron Colony, Thudiyalur, Coimbatore – 641 034",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 12,
    sNo: 12,
    city: "Coimbatore",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Ondipudur (Nesavalar Colony, Pattanam Rd)",
    address: "Nesavalar colony, Pattanam Road, Ondipudur – 641 016",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 13,
    sNo: 13,
    city: "Coimbatore",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – Peelamedu (North Zone, Mullai Nagar)",
    address: "North Zone, Mullai Nagar, Peelamedu, Coimbatore – 641 004",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 14,
    sNo: 14,
    city: "Tiruchirappalli",
    name: "Rojavanam SMILE Oldage Home",
    label: "Rojavanam SMILE Oldage Home – E.B. Road (Near Murugan Theatre)",
    address: "E.B. Road, Near Murugan Theature, Tiruchirappalli – 620 008",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 15,
    sNo: 15,
    city: "Kanniyakumari",
    name: "Rojavanam Oldage Home",
    label: "Rojavanam Oldage Home – Vellalar Colony, Nagercoil",
    address: "No.41, Vellalar Colony, Nagercoil – 629 001",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 16,
    sNo: 16,
    city: "Tenkasi",
    name: "Rojavanam Oldage Home",
    label: "Rojavanam Oldage Home – Courtallam (Five Falls Road)",
    address: "No.1, Near Boat House, Five Falls Road, Courtallam, Tenkasi – 627 802",
    phone: CENTRAL_PHONE,
    email: "rojavanam.trust123@gmail.com",
  },
  {
    id: 17,
    sNo: 17,
    city: "Theni",
    name: "Manithaneyam Orphanage Home",
    label: "Manithaneyam Orphanage Home – Kodangipatti, Theni District",
    address: "Kodangipatti, Theni District",
    phone: CENTRAL_PHONE,
    paymentAccount: "humanity-trust",
  },
];

export const TN_DISTRICTS = [
  "Coimbatore",
  "Kanchipuram",
  "Kanniyakumari",
  "Madurai",
  "Palani",
  "Rameswaram",
  "Tenkasi",
  "Theni",
  "Tiruchendur",
  "Tiruchirappalli",
  "Tirunelveli",
] as const;

export const TN_DISTRICT_ALIASES: Record<string, string> = {
  Kaniyakumari: "Kanniyakumari",
  Kanyakumari: "Kanniyakumari",
  Tiruchirappallli: "Tiruchirappalli",
};

export const DISTRICT_NGOS: Record<string, string[]> = {
  Coimbatore: [
    "Rojavanam SMILE Oldage Home – Thudiyalur (Cheron Colony)",
    "Rojavanam SMILE Oldage Home – Ondipudur (Nesavalar Colony, Pattanam Rd)",
    "Rojavanam SMILE Oldage Home – Peelamedu (North Zone, Mullai Nagar)",
  ],
  Kanchipuram: [
    "Brindavanam SMILE Oldage Home – Panchu Pettai, Oli Muhammed Salai",
  ],
  Kanniyakumari: [
    "AMK SMILE Oldage Home – Paramarthalingapuram, Kanyakumari",
    "Rojavanam Oldage Home – Vellalar Colony, Nagercoil",
  ],
  Kaniyakumari: [
    "AMK SMILE Oldage Home – Paramarthalingapuram, Kanyakumari",
    "Rojavanam Oldage Home – Vellalar Colony, Nagercoil",
  ],
  Madurai: [
    "Rojavanam SMILE Oldage Home – Uthankudi (No.1, Melur Road)",
    "Rojavanam SMILE Oldage Home – Shenoy Nagar (Jagajeevan Ram St)",
    "Rojavanam SMILE Oldage Home – Keeraithurai / Chinthamani",
    "Rojavanam SMILE Oldage Home – Chimmakal (Hanumarkovil Padithurai Rd)",
  ],
  Palani: [
    "Rojavanam SMILE Oldage Home – Rajaj Road (Opp. Amman Petrol Bunk)",
  ],
  Rameswaram: [
    "Brindavanam SMILE Oldage Home – Near Rameswaram Municipality",
  ],
  Tenkasi: [
    "Rojavanam Oldage Home – Courtallam (Five Falls Road)",
  ],
  Theni: [
    "Manithaneyam Orphanage Home – Kodangipatti, Theni District",
  ],
  Tiruchendur: [
    "Brindavanam SMILE Oldage Home – Near Municipality, Tiruchendur",
  ],
  Tiruchirappalli: [
    "Rojavanam SMILE Oldage Home – E.B. Road (Near Murugan Theatre)",
  ],
  Tirunelveli: [
    "AMK SMILE Oldage Home – Melapalayam, Tirunelveli",
  ],
};

export const DEFAULT_NGOS: string[] = [];

export function getNgosForDistrict(district: string): string[] {
  if (!district) return [];
  const normalizedKey = TN_DISTRICT_ALIASES[district] || district;
  return DISTRICT_NGOS[normalizedKey] || DISTRICT_NGOS[district] || [];
}

function cleanText(str: string): string {
  return (str || "")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function getSmileHomeDetails(ngoLabelOrName: string, district?: string): SmileHome | undefined {
  if (!ngoLabelOrName) return undefined;
  const target = cleanText(ngoLabelOrName);

  // If district is supplied, restrict lookup to homes in that district first!
  const districtPool = district
    ? SMILE_HOMES.filter((h) => {
        const dNorm = (TN_DISTRICT_ALIASES[district] || district).toLowerCase();
        return h.city.toLowerCase() === district.toLowerCase() || h.city.toLowerCase() === dNorm;
      })
    : [];

  const searchPool = districtPool.length > 0 ? districtPool : SMILE_HOMES;

  // 1. Strict exact match on label within the district
  const exact = searchPool.find((h) => cleanText(h.label) === target);
  if (exact) return exact;

  // 2. Strict exact match on label across all homes
  const exactGlobal = SMILE_HOMES.find((h) => cleanText(h.label) === target);
  if (exactGlobal) return exactGlobal;

  // 3. Match within district pool by branch identifier
  if (districtPool.length > 0) {
    const branchMatch = districtPool.find((h) => {
      const branchOnly = cleanText(h.label.replace(h.name, ""));
      return branchOnly && (target.includes(branchOnly) || branchOnly.includes(target));
    });
    if (branchMatch) return branchMatch;

    // If only 1 home in this district, return it
    if (districtPool.length === 1) return districtPool[0];
  }

  // 4. Strict match on name within district pool
  if (districtPool.length > 0) {
    const nameMatch = districtPool.find((h) => cleanText(h.name) === target);
    if (nameMatch) return nameMatch;
  }

  // 5. Global fallback if exact match on name and only 1 home shares that name
  const nameMatches = SMILE_HOMES.filter((h) => cleanText(h.name) === target);
  if (nameMatches.length === 1) return nameMatches[0];

  return undefined;
}

export type EnquiryInput = {
  full_name: string;
  mobile: string;
  email: string;
  district: string;
  ngo: string;
  support_type: string;
  amount: string;
  message: string;
};

/** Accepts Indian mobile numbers, optionally prefixed with +91 / 0; returns 10 digits or null. */
export function normaliseMobile(raw: string): string | null {
  if (!raw) return null;
  let d = raw.replace(/[\s\-\(\)\+]/g, "");
  if (d.startsWith("91") && d.length === 12) d = d.slice(2);
  else if (d.startsWith("0") && d.length === 11) d = d.slice(1);
  return /^[6-9]\d{9}$/.test(d) ? d : null;
}

export function validateAmount(val: string): string | null {
  if (!val || !val.trim()) {
    return "Please enter an amount.";
  }
  const clean = val.replace(/,/g, "").trim();
  const num = Number(clean);
  if (isNaN(num) || !/^\d+$/.test(clean)) {
    return "Amount must contain only valid numbers.";
  }
  if (num < 100) {
    return "Minimum support amount is ₹100.";
  }
  if (num > 10000000) {
    return "Please enter a valid amount up to ₹1,00,00,000.";
  }
  return null;
}

export function validateEnquiry(v: EnquiryInput): Partial<Record<keyof EnquiryInput, string>> {
  const e: Partial<Record<keyof EnquiryInput, string>> = {};
  
  // Full Name
  if (!v.full_name || v.full_name.trim().length < 2) {
    e.full_name = "Please enter your full name.";
  }
  
  // Mobile Number (Strict 10-digit Indian mobile validation)
  if (!v.mobile || !v.mobile.trim()) {
    e.mobile = "Mobile number is required.";
  } else if (!normaliseMobile(v.mobile)) {
    e.mobile = "Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.";
  }
  
  // Email (Optional, but validated if provided)
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    e.email = "Enter a valid email address.";
  }
  
  // District
  if (!v.district || (!(TN_DISTRICTS as readonly string[]).includes(v.district) && !TN_DISTRICT_ALIASES[v.district])) {
    e.district = "Please select a preferred city / district.";
  }
  
  // NGO
  if (!v.ngo.trim()) {
    e.ngo = "Please choose a Care for All Home.";
  }
  
  // Support Type
  if (!v.support_type.trim()) {
    e.support_type = "Please choose a support type.";
  }

  // Amount (Only required when "Financial Assistance" is selected)
  if (v.support_type === "Financial Assistance") {
    const amountErr = validateAmount(v.amount);
    if (amountErr) {
      e.amount = amountErr;
    }
  }
  
  // Message
  if (!v.message || v.message.trim().length < 3) {
    e.message = "Please write a short message or requirement details.";
  }
  
  return e;
}
