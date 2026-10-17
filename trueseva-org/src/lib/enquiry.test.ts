import { describe, it, expect } from "vitest";
import { normaliseMobile, validateEnquiry } from "./enquiry";

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
});
