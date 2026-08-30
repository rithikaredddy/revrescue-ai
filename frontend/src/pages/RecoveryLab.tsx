import React, { useState } from 'react'; import { Link } from 'react-router-dom'; import { ArrowLeft, Play, BarChart2 } from 'lucide-react';
export default function RecoveryLab() {
  const [batchSize, setBatchSize] = useState(10000);
  const [result, setResult] = useState<any>(null); const [loading, setLoading] = useState(false);
  
  const runSim = async () => {
    setLoading(true);
    const r = await fetch('http://localhost:5005/api/merchant/lab', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ batchSize }) });
    setResult(await r.json()); setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 animate-slide-up">
      <Link to="/merchant/dashboard" className="flex items-center gap-2 text-indigo-400 mb-6 hover:text-indigo-300 font-bold"><ArrowLeft className="w-4 h-4"/> Back to Dashboard</Link>
      <h1 className="text-4xl font-extrabold mb-2 text-white">Recovery Lab Simulation</h1>
      <p className="text-slate-400 mb-8 text-lg">Run synthetic payment failure batches through the economics engine to compare Blind Retry baselines against RevRescue AI outcomes.</p>
      
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between mb-8 shadow-xl">
        <div className="flex gap-6 items-center">
          <div><div className="text-sm font-bold text-slate-500 mb-1">Select Payment Batch</div>
          <select value={batchSize} onChange={e=>setBatchSize(Number(e.target.value))} className="bg-slate-950 border border-slate-700 text-white rounded p-2 text-lg font-bold outline-none focus:border-indigo-500">
            <option value={100}>100 Payments</option>
            <option value={1000}>1,000 Payments</option>
            <option value={10000}>10,000 Payments</option>
            <option value={50000}>50,000 Payments</option>
          </select></div>
          <div className="pt-5"><span className="text-slate-400">Total Volume: </span><span className="text-xl font-bold text-white">₹{(batchSize * 2999).toLocaleString()}</span></div>
        </div>
        <button onClick={runSim} disabled={loading} className="bg-indigo-600 px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"><Play className="w-5 h-5"/> {loading ? 'Processing...' : 'Run Simulation'}</button>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-8 animate-slide-up">
          {/* BLIND RETRY */}
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-2xl font-bold text-slate-400 mb-8 pb-4 border-b border-slate-800">Baseline: Blind Retry</h3>
            <div className="space-y-6 text-lg">
              <div className="flex justify-between"><span>Revenue Recovered</span><span className="font-bold text-white">₹{Math.round(result.blind.recovered).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Recovery Rate</span><span className="font-bold text-white">{result.blind.rate}%</span></div>
              <div className="flex justify-between text-slate-400 text-sm"><span>Wasted Retries Executed</span><span>{result.blind.retries.toLocaleString()}</span></div>
              <div className="flex justify-between text-rose-400 text-sm pb-4 border-b border-slate-800"><span>Intervention Cost</span><span>-₹{Math.round(result.blind.cost).toLocaleString()}</span></div>
              
              <div className="flex justify-between pt-2"><span>Net Revenue</span><span className="font-black text-3xl text-white">₹{Math.round(result.blind.net).toLocaleString()}</span></div>
            </div>
          </div>

          {/* REVRESCUE AI */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-8 rounded-2xl border border-indigo-500/40 shadow-[0_0_40px_rgba(99,102,241,0.15)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10"><BarChart2 className="w-32 h-32 text-indigo-400"/></div>
             <h3 className="text-2xl font-bold text-indigo-400 mb-8 pb-4 border-b border-indigo-900/50 flex items-center gap-2">RevRescue AI Output</h3>
             <div className="space-y-6 text-lg relative z-10">
              <div className="flex justify-between"><span>Revenue Recovered</span><span className="font-bold text-white">₹{Math.round(result.ai.recovered).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Recovery Rate</span><span className="font-bold text-emerald-400">{result.ai.rate}%</span></div>
              <div className="flex justify-between text-slate-400 text-sm"><span>Smart Retries Executed</span><span>{result.ai.retries.toLocaleString()}</span></div>
              <div className="flex justify-between text-rose-400 text-sm pb-4 border-b border-indigo-900/50"><span>Intervention + Discount Cost</span><span>-₹{Math.round(result.ai.cost).toLocaleString()}</span></div>
              
              <div className="flex justify-between pt-2"><span>Net Revenue Optimized</span><span className="font-black text-3xl text-emerald-400">₹{Math.round(result.ai.net).toLocaleString()}</span></div>
            </div>

            <div className="mt-8 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl font-black text-xl text-center shadow-lg">
              + ₹{Math.round(result.additionalRevenue).toLocaleString()} Additional Revenue Yield
            </div>
          </div>
        </div>
      )}
    </div>
  );
}