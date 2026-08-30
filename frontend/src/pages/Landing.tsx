import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ShieldCheck, Zap } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 animate-slide-up">
      <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 flex items-center gap-2">
        <Bot className="w-4 h-4"/> AI-Powered Revenue Recovery Infrastructure
      </div>
      
      <h1 className="text-5xl lg:text-7xl font-extrabold max-w-5xl tracking-tight leading-tight text-white">
        Recover revenue. Prevent involuntary churn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">Autonomously.</span>
      </h1>
      
      <p className="mt-8 text-xl text-slate-400 max-w-3xl leading-relaxed">
        RevRescue AI analyzes payment failures, predicts recovery opportunities and autonomously executes the safest recovery strategy — from intelligent retries to personalized retention offers.
      </p>
      
      <div className="mt-12 flex gap-4">
        <Link 
          to="/login" 
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(79,70,229,0.3)]"
        >
          Get Started / Enter Console
        </Link>
      </div>
      
      <div className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl w-full text-left">
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <Zap className="w-8 h-8 text-amber-400 mb-4"/>
          <h3 className="text-xl font-bold mb-2 text-white">AI Diagnosis</h3>
          <p className="text-slate-400">Identifies true root cause of failure (temporary vs permanent).</p>
        </div>
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <Bot className="w-8 h-8 text-indigo-400 mb-4"/>
          <h3 className="text-xl font-bold mb-2 text-white">Recovery Autopilot</h3>
          <p className="text-slate-400">Executes economics-optimized strategies dynamically.</p>
        </div>
        <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4"/>
          <h3 className="text-xl font-bold mb-2 text-white">Policy Guardrails</h3>
          <p className="text-slate-400">Deterministic bounds ensure safe financial execution.</p>
        </div>
      </div>
    </div>
  );
}