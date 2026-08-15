"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Sparkles, Send, TrendingUp, AlertTriangle, Lightbulb, CheckCircle, ArrowRight } from "lucide-react";
import { mockAIInsights } from "@/lib/mock-data";

export default function AIInsightsPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any | null>(null);

  const sampleQuestions = [
    "Why is our South region outperforming other territories?",
    "Show customers from Chennai generating more than ₹5L annually.",
    "Compare this quarter's revenue with last year's quarter.",
  ];

  const handleAsk = async (userQuery: string) => {
    setLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuery }),
      });
      const data = await res.json();
      setAiResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Sidebar currentRole="ORGANIZATION_ADMIN" />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title="AI Business Insights" subtitle="Ask natural language questions to gain instant BI intelligence & recommendations" />

        <main className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
          {/* Natural Language Query Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-8 rounded-2xl space-y-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ask Growth Intelligence AI</h2>
                <p className="text-xs text-indigo-300">Natural language business query engine powered by tenant datasets</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (query) handleAsk(query);
              }}
              className="relative"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask any BI question (e.g. 'Why is South region underperforming?')"
                className="w-full bg-slate-950 border border-indigo-500/40 rounded-2xl pl-5 pr-32 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 shadow-inner"
              />
              <button
                type="submit"
                disabled={loading || !query}
                className="absolute right-2 top-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition disabled:opacity-50"
              >
                <span>{loading ? "Analyzing..." : "Ask AI"}</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Prompt Chips */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Suggested Questions</span>
              <div className="flex flex-wrap gap-2">
                {sampleQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuery(q);
                      handleAsk(q);
                    }}
                    className="bg-slate-900 hover:bg-indigo-900/40 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Response Render */}
          {aiResponse && (
            <div className="bg-slate-900 border border-indigo-500/40 p-6 rounded-2xl space-y-6 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-base font-bold text-white">AI Analysis Result</h3>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  Confidence 96.2%
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Executive Synthesis</h4>
                <p className="text-base text-white font-medium mt-1 leading-relaxed">{aiResponse.answer}</p>
              </div>

              {/* Supporting Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {aiResponse.supportingMetrics?.map((m: any, idx: number) => (
                  <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block">{m.label}</span>
                    <span className="text-lg font-bold text-indigo-400 mt-1 block">{m.value}</span>
                  </div>
                ))}
              </div>

              {/* Key Drivers */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Key Contributing Drivers</h4>
                <div className="space-y-1.5">
                  {aiResponse.mainFactors?.map((factor: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-200">
                <div className="flex items-center gap-2 font-bold text-indigo-300 mb-1">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  <span>Strategic Recommendation</span>
                </div>
                <p>{aiResponse.recommendation}</p>
              </div>
            </div>
          )}

          {/* Historical Automated AI Insights Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">Automated System Intelligence Logs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockAIInsights.map((insight) => (
                <div key={insight.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {insight.type}
                    </span>
                    <span className="text-[10px] text-slate-500">{insight.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{insight.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{insight.description}</p>
                  <div className="pt-3 border-t border-slate-800 text-xs text-slate-300">
                    <span className="text-indigo-400 font-semibold">Action: </span>
                    {insight.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
