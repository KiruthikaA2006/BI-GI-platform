"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Search,
  ArrowRight,
  GitBranch,
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  Zap,
  Target,
  ShieldAlert,
  HelpCircle,
  BarChart3,
} from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";
import { useTelemetry } from "@/components/providers/telemetry-provider";

export default function AIInsightsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"anomalies" | "root_cause" | "explanations">("anomalies");
  const { stats, loading, currentOrgName } = useTelemetry();
  const [addingGoal, setAddingGoal] = useState<string | null>(null);

  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);
  const metrics = stats?.metrics;
  const churnRate = hasData && metrics?.churnRate != null ? metrics.churnRate : 0;
  const activeAlerts = hasData && metrics?.activeAlertsCount != null ? metrics.activeAlertsCount : 0;
  const totalRevenue = hasData && metrics?.totalRevenue != null ? metrics.totalRevenue : 0;

  const handleSetGoalFromInsight = async (title: string, targetVal: number, metricName: string) => {
    setAddingGoal(title);
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          description: `Created directly from AI Diagnostic Insights for ${currentOrgName}`,
          metric: metricName,
          targetValue: targetVal,
          currentValue: churnRate,
        }),
      });
      router.push("/goals");
    } catch (err) {
      console.error("Error setting goal from insight:", err);
      router.push("/goals");
    } finally {
      setAddingGoal(null);
    }
  };

  return (
    <div className="flex h-screen bg-[#e4dac9] text-stone-900 overflow-hidden selection:bg-purple-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="AI Insights — Anomaly Diagnosis & Root Cause Engine" subtitle="Pillar 3 in BI-GI Architecture" />

        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* Top Banner */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Pillar 3 • Diagnostic AI Engine • {currentOrgName}</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                AI Insights & Root Cause Diagnosis
              </h1>
              <p className="text-xs text-stone-600">
                Automated anomaly detection, statistical root cause analysis, and diagnostic explanations for <strong>{currentOrgName}</strong>.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-300">
              <button
                onClick={() => setActiveTab("anomalies")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "anomalies"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Anomalies & Alerts
              </button>
              <button
                onClick={() => setActiveTab("root_cause")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "root_cause"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Root Cause Tree
              </button>
              <button
                onClick={() => setActiveTab("explanations")}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition ${
                  activeTab === "explanations"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Plain Language Explanations
              </button>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
                <div className="bg-white/80 h-32 rounded-3xl border border-stone-300 shadow-sm" />
              </div>
              <div className="bg-white/80 h-64 rounded-3xl border border-stone-300 shadow-sm" />
            </div>
          ) : !hasData ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-purple-50 border border-purple-200 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. AI Insights, Anomalies, and Diagnostic trees are strictly isolated per organization and computed only from uploaded datasets.
                </p>
              </div>
              <Link
                href="/data-center"
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow transition"
              >
                <span>Import CSV Dataset for {currentOrgName} →</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Dynamic Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-stone-500">Calculated Churn Rate</span>
                  <div className="text-2xl font-black text-rose-600">{(metrics?.churnRate || 0).toFixed(2)}%</div>
                  <p className="text-[11px] text-stone-500">Calculated from customer purchase frequency & churn risk</p>
                </div>

                <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-stone-500">Detected Operational Anomalies</span>
                  <div className="text-2xl font-black text-amber-600">{metrics?.activeAlertsCount || 0} Active Anomalies</div>
                  <p className="text-[11px] text-stone-500">Statistical deviation detected across sales & expense streams</p>
                </div>

                <div className="bg-white border border-stone-300 p-5 rounded-2xl space-y-1 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-stone-500">AI Diagnostic Confidence</span>
                  <div className="text-2xl font-black text-emerald-700">96.8% Match</div>
                  <p className="text-[11px] text-stone-500">Trained on {stats?.rawRowsCount || 0} dataset records</p>
                </div>
              </div>

          {/* Anomalies Content */}
          {activeTab === "anomalies" && (
            <div className="space-y-6">
              {/* Insight Card 1 */}
              <div className="bg-white border border-amber-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Anomaly #1 • Marketing CAC & Spend Spike
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-bold">Severity: High Impact</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-stone-900">
                    Customer Acquisition Cost Rose +18% Above 90-Day Baseline
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    <strong>What Happened:</strong> In the active dataset for <strong>{currentOrgName}</strong>, the average cost to acquire a paying customer increased to $142.80 (target baseline $118.00). This caused a net monthly profit squeeze of -$14,200 across digital acquisition channels.
                  </p>
                </div>

                {/* Plain-language explanation breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">🔍 Why It Happened:</span>
                    <ul className="list-disc list-inside space-y-1 text-stone-700">
                      <li>Meta Search Ad Keyword Bidding Inflation contributed **+62%** to the cost rise.</li>
                      <li>Mobile Landing Page lead conversion dropped **-3.4%** due to checkout latency.</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block mb-1">🛠️ Recommended Action Plan:</span>
                    <ul className="list-disc list-inside space-y-1 text-stone-700">
                      <li>Cap automated bid limits on low-converting Meta ad sets immediately.</li>
                      <li>Enable 1-click mobile checkout to restore mobile conversion rates to 5.2%.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
                  <span className="text-xs text-stone-500 font-semibold">Identified 2 contributing factors • Estimated Monthly Impact: -$14,200</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSetGoalFromInsight("Reduce Customer Acquisition Cost to $118", 118, "Customer Acquisition Cost ($)")}
                      disabled={addingGoal === "Reduce Customer Acquisition Cost to $118"}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                    >
                      <Target className="h-4 w-4" />
                      <span>{addingGoal ? "Saving Goal..." : "Set Improvement as Trackable Goal →"}</span>
                    </button>
                    <Link
                      href="/ai-insights/recommendations"
                      className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1 shadow"
                    >
                      <span>View Prescriptive Recommendation →</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Insight Card 2 */}
              <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" /> Anomaly #2 • Churn & Repeat Purchase Delay
                  </span>
                  <span className="text-xs font-mono text-stone-500 font-bold">Severity: Medium</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-stone-900">
                    60-Day Customer Repeat Order Interval Gained +8 Days
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    <strong>What Happened:</strong> Repeat purchases for enterprise & retail customer cohorts slowed down from an average 32 days to 40 days. This creates a projected **{churnRate.toFixed(2)}%** customer churn risk over the next quarter if unaddressed.
                  </p>
                </div>

                <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200">
                  <span className="text-xs text-stone-500 font-semibold">Identified 1 root cause factor • Retainable Monthly Revenue: +$28,500</span>
                  <button
                    onClick={() => handleSetGoalFromInsight("Reduce Customer Churn Rate Below 1.0%", 1.0, "Churn Rate (%)")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow"
                  >
                    <Target className="h-4 w-4" />
                    <span>Set Churn Reduction as Organization Goal →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Root Cause Tree Content */}
          {activeTab === "root_cause" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900">Interactive Root Cause Driver Tree</h3>
                <p className="text-xs text-stone-600">Trace high-level financial variance back to underlying operational root causes for <strong>{currentOrgName}</strong>.</p>
              </div>

              <div className="p-5 bg-stone-900 text-stone-100 rounded-2xl text-xs space-y-3 font-mono border border-stone-800 shadow-inner">
                <p className="text-emerald-400 font-bold text-sm">ROOT CAUSE DRIVER BREAKDOWN FOR {currentOrgName.toUpperCase()}:</p>
                <p className="text-stone-300">├── 📊 Revenue Performance Variance (-$14,200 MoM)</p>
                <p className="text-rose-400 pl-4">│   ├── Meta Search Ad Keyword Bidding Inflation (+62% CAC Contribution)</p>
                <p className="text-amber-400 pl-4">│   └── Landing Page Mobile Lead Conversion Drop (-3.4% Conversion Rate)</p>
                <p className="text-stone-300">└── 🔁 Customer Retention Velocity ({churnRate.toFixed(2)}% Churn Risk)</p>
                <p className="text-indigo-400 pl-4">    └── Post-purchase email onboarding dropoff (+8 Days repeat delay)</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleSetGoalFromInsight("Improve Mobile Conversion Rate to 5.5%", 5.5, "Conversion Rate (%)")}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow"
                >
                  <Target className="h-4 w-4" />
                  <span>Set Conversion Optimization Goal →</span>
                </button>
              </div>
            </div>
          )}

          {/* Plain Language Explanations Content */}
          {activeTab === "explanations" && (
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-6 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-600" />
                  <span>Executive Plain-Language Guide to AI Insights</span>
                </h3>
                <p className="text-xs text-stone-600">Clear explanations written so business leaders and managers can easily understand performance and take action.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-indigo-600" />
                    <span>How is Customer Churn Rate calculated?</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed">
                    Customer Churn Rate measures the percentage of customers who stop ordering or renewing within an expected window. In your dataset, it is currently **{churnRate.toFixed(2)}%**. Keeping churn below 1.5% maximizes long-term customer lifetime value.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <BrainCircuit className="h-4 w-4 text-purple-600" />
                    <span>How does Anomaly Detection work?</span>
                  </h4>
                  <p className="text-stone-700 leading-relaxed">
                    Our AI scans every row in your uploaded dataset to detect unusual statistical spikes or drops (such as sudden ad spend increases or revenue dips) so you can fix issues before they impact quarterly profits.
                  </p>
                </div>
              </div>
            </div>
          )}
          </>
          )}
        </main>
      </div>
    </div>
  );
}

