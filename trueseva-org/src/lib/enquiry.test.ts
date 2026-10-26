import { describe, it, expect } from "vitest";
import { normaliseMobile, validateEnquiry, getSmileHomeDetails, getNgosForDistrict } from "./enquiry";

describe("enquiry rules", () => {
  it("accepts +91 mobile numbers", () => expect(normaliseMobile("+91 94123 45678")).toBe("9412345678"));
  it("rejects numbers not starting 6-9", () => expect(normaliseMobile("5412345678")).toBeNull());
  it("email and amount are optional for non-financial support", () => {
    const e = validateEnquiry({
      full_name: "Ravi",
      mobile: "9412345678",
      email: "",
      district: "Madurai",
      ngo: "Rojavanam SMILE Oldage Home – Uthankudi (No.1, Melur Road)",
      support_type: "New Clothing",
      amount: "",
      message: "Hello there",
    });
    expect(e).toEqual({});
  });

  it("validates amount only when Financial Assistance is selected", () => {
    const emptyAmount = validateEnquiry({
      full_name: "Ravi",
      mobile: "9412345678",
      email: "",
      district: "Madurai",
      ngo: "Rojavanam SMILE Oldage Home – Uthankudi (No.1, Melur Road)",
      support_type: "Financial Assistance",
      amount: "",
      message: "Hello there",
    });
    expect(emptyAmount.amount).toBe("Please enter an amount.");

    const lowAmount = validateEnquiry({
      full_name: "Ravi",
      mobile: "9412345678",
      email: "",
      district: "Madurai",
      ngo: "Rojavanam SMILE Oldage Home – Uthankudi (No.1, Melur Road)",
      support_type: "Financial Assistance",
      amount: "50",
      message: "Hello there",
    });
    expect(lowAmount.amount).toBe("Minimum support amount is ₹100.");

    const validAmount = validateEnquiry({
      full_name: "Ravi",
      mobile: "9412345678",
      email: "",
      district: "Madurai",
      ngo: "Rojavanam SMILE Oldage Home – Uthankudi (No.1, Melur Road)",
      support_type: "Financial Assistance",
      amount: "2500",
      message: "Hello there",
    });
    expect(validAmount).toEqual({});
  });

  it("resolves Coimbatore homes to Coimbatore and never Madurai", () => {
    const cbeNgos = getNgosForDistrict("Coimbatore");
    expect(cbeNgos.length).toBe(3);

    for (const ngo of cbeNgos) {
      const home = getSmileHomeDetails(ngo, "Coimbatore");
      expect(home).toBeDefined();
      expect(home?.city).toBe("Coimbatore");
      expect(home?.phone).toBe("9150408860");
    }
  });

  it("resolves Manithaneyam Orphanage Home in Theni with Kodangipatti, Theni District", () => {
    const theniNgos = getNgosForDistrict("Theni");
    expect(theniNgos).toContain("Manithaneyam Orphanage Home – Kodangipatti, Theni District");

    const home = getSmileHomeDetails("Manithaneyam Orphanage Home – Kodangipatti, Theni District", "Theni");
    expect(home).toBeDefined();
    expect(home?.name).toBe("Manithaneyam Orphanage Home");
    expect(home?.city).toBe("Theni");
    expect(home?.address).toBe("Kodangipatti, Theni District");
    expect(home?.paymentAccount).toBe("humanity-trust");
  });
});
