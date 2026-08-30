import React, { useEffect, useState } from 'react'; import { Link } from 'react-router-dom'; import { Bot, Shield, Activity, Zap, FileText, LogOut, CheckCircle2 } from 'lucide-react';
export default function MerchantDash() {
  const [data, setData] = useState<any>(null); const [simulating, setSimulating] = useState(false);
  const [wowState, setWowState] = useState<string | null>(null);

  const fetchData = async () => { 
    const r = await fetch('http://localhost:5005/api/merchant/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}); 
    setData(await r.json()); 
  };
  useEffect(() => { fetchData(); }, []);
  
  const handleSimulate = async () => {
    setSimulating(true);
    
    // Wow Animation Sequence
    setWowState('PAYMENT FAILED'); await new Promise(r => setTimeout(r, 600));
    setWowState('ANALYZING...'); await new Promise(r => setTimeout(r, 600));
    setWowState('CUSTOMER RISK CALCULATED'); await new Promise(r => setTimeout(r, 600));
    setWowState('STRATEGY SELECTED'); await new Promise(r => setTimeout(r, 600));
    setWowState('POLICY APPROVED'); await new Promise(r => setTimeout(r, 600));
    
    await fetch('http://localhost:5005/api/webhook/simulate', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ eventId: `evt_${Date.now()}`, errorType: 'INSUFFICIENT_FUNDS', amount: 2999 }) });
    
    setWowState('RECOVERY EXECUTED'); await new Promise(r => setTimeout(r, 800));
    await fetchData(); 
    setWowState(null);
    setSimulating(false);
  };

  if(!data) return <div className="min-h-screen flex items-center justify-center text-indigo-400 animate-pulse font-bold text-xl"><Bot className="w-8 h-8 mr-3"/> Initializing AI Engine...</div>;
  
  return (
    <div className="max-w-7xl mx-auto p-6 animate-slide-up relative">
      
      {/* WOW Overlay */}
      {wowState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-indigo-600 text-white px-8 py-4 rounded-full text-2xl font-black tracking-widest shadow-[0_0_50px_rgba(79,70,229,0.5)] animate-bounce flex items-center gap-3">
             <Bot className="w-8 h-8"/> {wowState}
          </div>
        </div>
      )}

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2"><Bot className="text-indigo-500 w-8 h-8"/> Merchant AI Copilot</h1>
          <p className="text-slate-400 mt-1">Autonomous Revenue Recovery Infrastructure</p>
          <div className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded inline-block mt-2 font-mono">DEMO MODE: AI Provider Fallback Engine Active</div>
        </div>
        <div className="flex gap-4">
          <Link to="/merchant/lab" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-slate-700 transition shadow-lg shadow-black/20"><FileText className="w-4 h-4"/> Recovery Lab</Link>
          <button onClick={handleSimulate} disabled={simulating} className="px-4 py-2 bg-indigo-600 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"><Zap className="w-4 h-4"/> Simulate Gateway Failure</button>
          <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="px-4 py-2 bg-rose-500/10 text-rose-400 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-rose-500/20"><LogOut className="w-4 h-4"/> Logout</button>
        </div>
      </div>
      
      {/* KPI Section */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 p-5 rounded-xl col-span-2">
          <div className="text-indigo-300 text-sm font-bold">Total Revenue Recovered</div>
          <div className="text-4xl font-black text-indigo-400 mt-1">₹{data.kpis.revenueRecovered.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-slate-400 text-sm">Revenue At Risk</div>
          <div className="text-2xl font-bold text-white mt-1">₹{data.kpis.revenueAtRisk.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-slate-400 text-sm">Expected Recoverable</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">₹{Math.round(data.kpis.recoverableRevenue).toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="text-slate-400 text-sm">Recovery Rate</div>
          <div className="text-2xl font-bold text-sky-400 mt-1">{data.kpis.recoveryRate}%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">Revenue At Risk Engine</h3>
          <div className="space-y-4">
            {data.invoices.length === 0 ? <div className="text-slate-500 italic p-4 text-center">No at-risk invoices. Simulate a failure to see the AI in action.</div> : null}
            {data.invoices.map((inv: any) => {
              const ai = inv.aiStrategy ? JSON.parse(inv.aiStrategy) : null;
              const tl = inv.timeline ? JSON.parse(inv.timeline) : [];
              return (
                <div key={inv.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-slate-400">{inv.invoiceNumber}</span>
                        <span className="text-[10px] font-bold bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded uppercase">{inv.gatewayErrorCode}</span>
                      </div>
                      <div className="text-2xl font-black text-white">₹{inv.amount.toLocaleString()}</div>
                      <div className="text-xs text-slate-500 mt-1">Customer LTV: ₹{inv.user?.ltv.toLocaleString()}</div>
                    </div>
                    {/* Recovery Economics Block */}
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-right min-w-[180px]">
                      <div className="text-xs text-slate-400 flex justify-between mb-1"><span>Churn Risk:</span> <span className="text-rose-400 font-bold">{Math.round(inv.churnProb * 100)}%</span></div>
                      <div className="text-xs text-slate-400 flex justify-between mb-1"><span>Recovery Prob:</span> <span className="text-sky-400 font-bold">{Math.round(inv.recoveryProb * 100)}%</span></div>
                      <div className="h-px bg-slate-800 my-2"></div>
                      <div className="text-xs text-slate-400 flex justify-between mb-1"><span>Expected:</span> <span className="text-white">₹{Math.round(inv.expectedRecovery)}</span></div>
                      <div className="text-xs text-slate-400 flex justify-between mb-1"><span>Cost:</span> <span className="text-rose-400">-₹{Math.round(inv.interventionCost + inv.discountCost)}</span></div>
                      <div className="text-sm font-bold text-emerald-400 flex justify-between mt-1 pt-1 border-t border-slate-800"><span>Net Rec:</span> <span>₹{Math.round(inv.expectedNet)}</span></div>
                    </div>
                  </div>

                  {ai && (
                    <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-indigo-400 flex items-center gap-2"><Bot className="w-4 h-4"/> AI Decision: {ai.recommended_action}</div>
                        <div className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-0.5 rounded">Confidence: {Math.round(ai.confidence * 100)}%</div>
                      </div>
                      <div className="text-sm text-slate-300 mb-3">{ai.reason}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-slate-900 p-2 rounded"><Shield className="w-4 h-4"/> Policy Engine: {inv.policyStatus}</div>
                    </div>
                  )}

                  {tl.length > 0 && (
                    <div className="border-t border-slate-800 pt-4 mt-4">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Agent Timeline</div>
                      <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                        {tl.map((t: any, i: number) => (
                           <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                             <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                               <CheckCircle2 className="w-3 h-3" />
                             </div>
                             <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-2 rounded border border-slate-800 bg-slate-900 shadow text-xs flex justify-between">
                               <span className="text-slate-300">{t.event}</span>
                               <span className="text-slate-600 font-mono">{new Date(t.time).toLocaleTimeString()}</span>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Autopilot Log */}
        <div className="col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 h-fit sticky top-6">
          <h3 className="text-lg font-bold mb-4 flex items-center justify-between text-white">
            <span className="flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400"/> Autopilot Feed</span>
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
          </h3>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {data.logs.map((log: any) => (
              <div key={log.id} className="border-l-2 border-indigo-500 pl-3 py-1">
                <div className="text-xs text-slate-500 mb-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                <div className="text-sm font-bold text-white">{log.action}</div>
                <div className="text-xs text-slate-400 mt-1">{log.reason}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}