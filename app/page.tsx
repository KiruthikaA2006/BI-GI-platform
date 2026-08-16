"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  ArrowRight,
  Sparkles,
  Database,
  BarChart3,
  TrendingUp,
  Target,
  ShieldCheck,
  Building2,
  UserCheck,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#e4dac9] text-stone-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/25">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="font-extrabold text-white text-xl tracking-tight block">BI-GI PLATFORM</span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
                Business Intelligence • Growth Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition">Platform Features</a>
            <a href="#pillars" className="hover:text-white transition">3 Main Pillars</a>
            <a href="#loop" className="hover:text-white transition">Intelligence Loop</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/onboarding/organization"
              className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding/organization"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Next-Generation Enterprise Intelligence Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-tight">
            Turn Raw Business Data Into <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Predictive Growth & Executable Actions
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-700 max-w-3xl mx-auto leading-relaxed font-medium">
            BI-GI Platform seamlessly unites traditional Business Intelligence with AI-driven Growth Intelligence. Track company health, detect anomalies, forecast performance, receive AI recommendations, and execute goals in one closed-loop ecosystem.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/onboarding/organization"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <span>Launch Application Portal</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Main Pillars Section */}
      <section id="pillars" className="py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700">
              Core Architecture
            </span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              The 3 Pillars of BI-GI Platform
            </h2>
            <p className="text-xs text-stone-600">
              Connected directly from the Main Dashboard to process data, visualize KPIs, and extract root-cause insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm hover:border-indigo-400 transition">
              <div className="h-12 w-12 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-bold">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-cyan-800 tracking-wider">PILLAR 1</span>
                <h3 className="text-xl font-bold text-stone-900">Data Center</h3>
                <p className="text-xs text-stone-600 mt-1">
                  6-stage automated pipeline: Data Sources ➔ Data Collection ➔ Data Processing ➔ Data Validation ➔ KPI Calculation ➔ KPI Engine.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm hover:border-indigo-400 transition">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-800 tracking-wider">PILLAR 2</span>
                <h3 className="text-xl font-bold text-stone-900">Dashboards</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Real-time KPI Views, interactive scorecard matrices, executive dashboards, and automated scheduled reporting.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white border border-stone-300 p-6 rounded-3xl space-y-4 shadow-sm hover:border-indigo-400 transition">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-bold">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-purple-800 tracking-wider">PILLAR 3</span>
                <h3 className="text-xl font-bold text-stone-900">AI Insights</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Answers "What happened? Why?" with Trend & Anomaly Detection + AI Root Cause Analysis to explain underlying drivers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/90 py-8 px-6 text-center text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="font-bold text-white">BI-GI Platform © 2026</span>
          </div>
          <p className="text-slate-400">Next-Generation Business Intelligence & Growth Intelligence System</p>
        </div>
      </footer>
    </div>
  );
}
