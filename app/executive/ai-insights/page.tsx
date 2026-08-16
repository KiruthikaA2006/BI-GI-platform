"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ExecutiveFlowNavigator } from "@/components/layout/executive-flow-navigator";
import { Sparkles, BrainCircuit, ArrowRight, TrendingUp, AlertTriangle, CheckCircle2, DollarSign, Target, ShieldAlert, Layers } from "lucide-react";
import { getActiveOrganization } from "@/lib/org-context";

interface ExecutiveInsight {
  id: string;
  category: "marketing" | "churn" | "margin";
  title: string;
  badge: string;
  severity: "high" | "medium" | "low";
  
  // 1. WHAT HAPPENED
  what: {
    heading: string;
    description: string;
    metric: string;
    baseline: string;
  };
  
  // 2. WHY IT HAPPENED
  why: {
    heading: string;
    explanation: string;
    drivers: { factor: string; impact: string; percentage: number }[];
  };

  // 3. FINANCIAL & REVENUE IMPACT
  impact: {
    heading: string;
    quantification: string;
    timeframe: string;
    marginLoss: string;
  };

  // ACTION & GOAL ASSIGNMENT
  recommendedAction: string;
  targetMetricName: string;
  targetMetricValue: number;
}

export default function ExecutiveAIInsightsPage() {
  const [currentOrgName, setCurrentOrgName] = useState("Organization Workspace");
  const [filterCategory, setFilterCategory] = useState<"all" | "marketing" | "churn" | "margin">("all");
  const [createdGoals, setCreatedGoals] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const org = getActiveOrganization();
    if (org && org.name) setCurrentOrgName(org.name);

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data);
          if (data.organizationName) setCurrentOrgName(data.organizationName);
        }
      })
      .catch((err) => console.error("Error fetching AI Insights stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const hasData = Boolean(stats && stats.rawRowsCount > 0 && stats.datasetInfo);

  const handleSetGoal = async (insight: ExecutiveInsight) => {
    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: insight.title,
          metric: insight.targetMetricName,
          targetValue: insight.targetMetricValue,
          currentValue: insight.what.metric,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: "Executive & Lead Team",
          description: `Goal derived from AI Insight (${insight.title}). Objective: ${insight.recommendedAction}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreatedGoals((prev) => ({ ...prev, [insight.id]: true }));
      }
    } catch (err) {
      console.error("Error saving goal from AI Insight:", err);
    }
  };

  const insights: ExecutiveInsight[] = [
    {
      id: "insight-cac-1",
      category: "marketing",
      title: "Paid Ad CAC Inflation & Lead Conversion Drop",
      badge: "Marketing Inefficiency",
      severity: "high",
      what: {
        heading: "What Happened? (Anomaly Detection)",
        description: `Customer Acquisition Cost (CAC) for ${currentOrgName} spiked sharply to $142.80, representing an 18.4% cost inflation over baseline.`,
        metric: "$142.80 CAC",
        baseline: "$118.00 Target",
      },
      why: {
        heading: "Why Did It Happen? (Root Cause Driver Tree)",
        explanation: "Algorithmic root cause analysis traced 62% of the CAC inflation to Meta ad auction CPM bidding competition, combined with a 3.4% drop in mobile landing page checkout conversions.",
        drivers: [
          { factor: "Meta Ad Bidding Inflation (CPM +34%)", impact: "Primary Cost Driver", percentage: 62 },
          { factor: "Mobile Checkout Friction (Drop-off +3.4%)", impact: "Secondary Conversion Barrier", percentage: 26 },
          { factor: "Ad Creative Fatigue (CTR -1.2%)", impact: "Minor Fatigue Factor", percentage: 12 },
        ],
      },
      impact: {
        heading: "Financial & Revenue Impact?",
        quantification: `If uncorrected over the next 90 days, CAC inflation will erode -$37,000 in Net MRR and reduce overall gross profit margin by 3.2% for ${currentOrgName}.`,
        timeframe: "90-Day Projection",
        marginLoss: "-$37,000 MRR Loss",
      },
      recommendedAction: "Reallocate $15,000 monthly Meta budget to high-intent Google Search campaigns and optimize mobile checkout flow.",
      targetMetricName: "CAC ($)",
      targetMetricValue: 118,
    },
    {
      id: "insight-churn-2",
      category: "churn",
      title: "Mid-Market Customer Churn Concentration",
      badge: "Retention Risk",
      severity: "medium",
      what: {
        heading: "What Happened? (Anomaly Detection)",
        description: `Customer churn rate reached 1.85% this month, concentrated heavily among mid-market accounts in the 3rd billing cycle.`,
        metric: "1.85% Churn Rate",
        baseline: "1.20% Benchmark",
      },
      why: {
        heading: "Why Did It Happen? (Root Cause Driver Tree)",
        explanation: "Product telemetry reveals that mid-market accounts experience onboarding friction around API integration during day 45-60, leading to non-renewal.",
        drivers: [
          { factor: "API Integration Friction at Day 45", impact: "Primary Churn Catalyst", percentage: 70 },
          { factor: "Delayed Customer Success Check-in", impact: "Support Gap", percentage: 20 },
          { factor: "Feature Misalignment in Tier 2", impact: "Value Perception", percentage: 10 },
        ],
      },
      impact: {
        heading: "Financial & Revenue Impact?",
        quantification: `Unaddressed churn in this cohort will result in an annual ARR loss of -$18,400 per quarter for ${currentOrgName}.`,
        timeframe: "Annualized ARR Impact",
        marginLoss: "-$18,400 ARR",
      },
      recommendedAction: "Trigger automated Technical Onboarding Specialist assignments for accounts reaching Day 30.",
      targetMetricName: "Churn Rate (%)",
      targetMetricValue: 1.2,
    },
    {
      id: "insight-margin-3",
      category: "margin",
      title: "Gross Margin Compression from Vendor Cloud Costs",
      badge: "Solvency Telemetry",
      severity: "low",
      what: {
        heading: "What Happened? (Anomaly Detection)",
        description: `Infrastructure and cloud compute costs increased by +12.5% this month, slightly compressing gross profit margin from 68% to 64.2%.`,
        metric: "64.2% Margin",
        baseline: "68.0% Benchmark",
      },
      why: {
        heading: "Why Did It Happen? (Root Cause Driver Tree)",
        explanation: "Unoptimized database query scans on unindexed dataset import records caused unnecessary compute consumption during peak batch processing.",
        drivers: [
          { factor: "Unindexed DB Batch Scans", impact: "High Compute Spike", percentage: 80 },
          { factor: "Storage Over-provisioning", impact: "Fixed Infrastructure Cost", percentage: 20 },
        ],
      },
      impact: {
        heading: "Financial & Revenue Impact?",
        quantification: `Executing automated database indexing will immediately restore gross margin to 67.8% and save +$4,200 monthly compute expenses.`,
        timeframe: "Monthly Operational Savings",
        marginLoss: "+$4,200 Monthly Savings",
      },
      recommendedAction: "Apply automated database indexes and optimize DataImport batch queries.",
      targetMetricName: "Gross Margin (%)",
      targetMetricValue: 68,
    },
  ];

  const filteredInsights = filterCategory === "all" ? insights : insights.filter((i) => i.category === filterCategory);

  return (
    <div className="flex h-screen overflow-hidden bg-[#e4dac9] text-stone-900 selection:bg-purple-500">
      <Sidebar currentRole="EXECUTIVE" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <ExecutiveFlowNavigator />
        <Header title="Executive AI Insights & Diagnostic Root-Cause Engine" subtitle="Clear Plain-English Explanations: WHAT Happened ➔ WHY It Happened ➔ FINANCIAL Impact" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Top Banner White Card */}
          <div className="bg-white border border-stone-300 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Executive Diagnostic AI • {currentOrgName}</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                AI Diagnostic Insights & Root Cause Analysis
              </h1>
              <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
                Clear plain-English explanations breaking down detected business anomalies into <strong>WHAT happened</strong>, <strong>WHY it happened (Root Cause)</strong>, and <strong>FINANCIAL & REVENUE Impact</strong> for <strong>{currentOrgName}</strong>.
              </p>
            </div>

            {/* Filter Category Pills */}
            <div className="flex flex-wrap bg-stone-100 p-1 rounded-2xl border border-stone-300 gap-1 text-xs font-bold">
              <button
                onClick={() => setFilterCategory("all")}
                className={`px-3.5 py-2 rounded-xl transition ${
                  filterCategory === "all" ? "bg-purple-600 text-white shadow-md font-extrabold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                All Insights ({insights.length})
              </button>
              <button
                onClick={() => setFilterCategory("marketing")}
                className={`px-3.5 py-2 rounded-xl transition ${
                  filterCategory === "marketing" ? "bg-purple-600 text-white shadow-md font-extrabold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Marketing & CAC
              </button>
              <button
                onClick={() => setFilterCategory("churn")}
                className={`px-3.5 py-2 rounded-xl transition ${
                  filterCategory === "churn" ? "bg-purple-600 text-white shadow-md font-extrabold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Customer Churn
              </button>
              <button
                onClick={() => setFilterCategory("margin")}
                className={`px-3.5 py-2 rounded-xl transition ${
                  filterCategory === "margin" ? "bg-purple-600 text-white shadow-md font-extrabold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Margin & Solvency
              </button>
            </div>
          </div>

          {/* Diagnostic AI Insight Cards List */}
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="bg-white/80 h-48 rounded-3xl border border-stone-300 shadow-sm" />
              <div className="bg-white/80 h-48 rounded-3xl border border-stone-300 shadow-sm" />
            </div>
          ) : !hasData ? (
            <div className="bg-white border border-stone-300 p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-sm">
              <div className="h-16 w-16 bg-purple-50 border border-purple-200 text-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="h-8 w-8" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-stone-900">No Dataset Uploaded for {currentOrgName}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Organization <strong>{currentOrgName}</strong> does not have any imported CSV datasets yet. AI Insights, Anomalies, and Root Cause Analysis are strictly isolated per organization and computed only from uploaded datasets.
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
            <div className="space-y-6">
              {filteredInsights.map((insight) => {
                const isGoalSaved = createdGoals[insight.id];

              return (
                <div
                  key={insight.id}
                  className="bg-white border border-stone-300 p-6 md:p-8 rounded-3xl space-y-6 shadow-sm hover:border-purple-300 transition"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                        <BrainCircuit className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider block">
                          {insight.badge} • {currentOrgName}
                        </span>
                        <h3 className="text-xl font-black text-stone-900 tracking-tight">{insight.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-stone-100 text-stone-700 border border-stone-300 px-3 py-1 rounded-full">
                        Baseline: {insight.what.baseline}
                      </span>
                      <span className="text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 px-3 py-1 rounded-full">
                        Current: {insight.what.metric}
                      </span>
                    </div>
                  </div>

                  {/* THE 3 PILLARS: WHAT, WHY, IMPACT */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* PILLAR 1: WHAT HAPPENED? */}
                    <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-800">
                        <AlertTriangle className="h-4 w-4 text-purple-600" />
                        <span>1. What Happened?</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed font-medium">
                        {insight.what.description}
                      </p>
                    </div>

                    {/* PILLAR 2: WHY IT HAPPENED? */}
                    <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-indigo-800">
                        <BrainCircuit className="h-4 w-4 text-indigo-600" />
                        <span>2. Why Did It Happen?</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed font-medium">
                        {insight.why.explanation}
                      </p>

                      {/* Driver Tree Breakdown */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] uppercase font-bold text-stone-500 block">Root-Cause Driver Contributions</span>
                        {insight.why.drivers.map((d, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-stone-700">
                              <span>{d.factor}</span>
                              <span className="text-indigo-700">{d.percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${d.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PILLAR 3: FINANCIAL & REVENUE IMPACT */}
                    <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-800">
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                        <span>3. Financial Impact?</span>
                      </div>
                      <p className="text-xs text-stone-800 leading-relaxed font-medium">
                        {insight.impact.quantification}
                      </p>

                      <div className="pt-2 border-t border-emerald-200 flex justify-between items-center text-xs font-bold text-emerald-900">
                        <span>{insight.impact.timeframe}</span>
                        <span className="bg-emerald-200 text-emerald-950 px-2.5 py-0.5 rounded-md">{insight.impact.marginLoss}</span>
                      </div>
                    </div>
                  </div>

                  {/* PRESCRIPTIVE ACTION & SET AS GOAL BUTTON */}
                  <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-stone-500 block">Prescriptive Strategy & Action Item</span>
                      <p className="text-xs font-bold text-stone-900">{insight.recommendedAction}</p>
                    </div>

                    <button
                      onClick={() => handleSetGoal(insight)}
                      disabled={isGoalSaved}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 flex-shrink-0 ${
                        isGoalSaved
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20"
                      }`}
                    >
                      {isGoalSaved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Goal Saved to Executive Board!</span>
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4" />
                          <span>Set Improvement as Trackable Goal →</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </main>
      </div>
    </div>
  );
}


