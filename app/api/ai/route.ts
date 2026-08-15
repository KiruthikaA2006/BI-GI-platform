import { NextResponse } from "next/server";
import { mockAIInsights } from "@/lib/mock-data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question } = body;

    let response = {
      answer: `Analysis of Qubertrix dataset for prompt "${question}": Revenue in South region grew 22.4% MoM driven by Chennai enterprise conversions.`,
      supportingMetrics: [
        { label: "Chennai Conversion Rate", value: "5.8% (+1.7%)" },
        { label: "Quarterly Revenue Impact", value: "₹ 1.02 Cr" },
        { label: "Customer Acquisition Cost", value: "₹ 4,200" },
      ],
      mainFactors: [
        "Strong mid-market enterprise adoption in Chennai IT corridor.",
        "Improved sales cadence following new product demo launch.",
        "Increased Google Search Ad spend efficiency.",
      ],
      recommendation: "Deploy 2 additional enterprise account managers to Chennai sales branch immediately.",
    };

    if (question.toLowerCase().includes("chennai")) {
      response.answer = "Chennai branch generated ₹1.02 Cr revenue with 4,850 active subscription users and 22.4% YoY growth.";
    }

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    return NextResponse.json({ success: false, error: "AI Processing Error" }, { status: 500 });
  }
}
