import React, { useEffect, useState } from 'react'; import { ShieldCheck, AlertCircle, LogOut, Globe } from 'lucide-react';
export default function CustomerPortal() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [lang, setLang] = useState('EN');
  
  const fetchData = async () => { 
    const r = await fetch('https://revrescue-ai.onrender.com/api/customer/portal', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}); 
    const d = await r.json(); 
    setInvoices(d.invoices); 
  };
  useEffect(() => { fetchData(); }, []);
  
  const pay = async (id: string) => { 
    await fetch(`https://revrescue-ai.onrender.com/api/customer/pay/${id}`, { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}); 
    fetchData(); 
  };

  const texts = {
    EN: { title: "Manage Subscription", subtitle: "Secure checkout powered by RevRescue", risk: "Your subscription is at risk", offer: "Personalized Retention Offer", offerDesc: "We value your business. Settle your balance today and apply a courtesy discount to keep your service active.", payNow: "Securely Process Payment" },
    HI: { title: "सदस्यता प्रबंधित करें", subtitle: "RevRescue द्वारा सुरक्षित चेकआउट", risk: "आपकी सदस्यता खतरे में है", offer: "विशेष छूट प्रस्ताव", offerDesc: "आज ही अपना भुगतान पूरा करें और अपनी सेवा सक्रिय रखने के लिए छूट प्राप्त करें।", payNow: "सुरक्षित रूप से भुगतान करें" }
  };
  const t = lang === 'EN' ? texts.EN : texts.HI;

  return (
    <div className="max-w-2xl mx-auto p-6 py-12 animate-slide-up">
      <div className="mb-8 flex justify-between items-start border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold mb-1 text-white">{t.title}</h1>
          <p className="text-slate-400 text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500"/> {t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <select value={lang} onChange={e=>setLang(e.target.value)} className="bg-slate-900 border border-slate-700 text-sm rounded-lg px-2 text-white outline-none flex items-center"><option value="EN">English</option><option value="HI">Hinglish</option></select>
          <button onClick={()=> {localStorage.clear(); window.location.href='/';}} className="p-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"><LogOut className="w-4 h-4"/></button>
        </div>
      </div>
      
      <div className="space-y-6">
        {invoices.length === 0 ? <div className="text-center text-slate-500">No active invoices found.</div> : null}
        {invoices.map(inv => {
          const ai = inv.aiStrategy ? JSON.parse(inv.aiStrategy) : null;
          const discount = ai?.economics?.discount_cost ? (ai.economics.discount_cost / inv.amount) * 100 : 0;
          const finalAmount = inv.amount - (ai?.economics?.discount_cost || 0);
          
          return (
            <div key={inv.id} className={`p-8 rounded-3xl border shadow-2xl transition-all ${inv.status === 'FAILED' ? 'bg-slate-900 border-rose-500/30' : 'bg-emerald-950/20 border-emerald-500/30'}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2"><span className="font-mono text-slate-400 text-sm">{inv.invoiceNumber}</span> <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${inv.status === 'FAILED' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{inv.status}</span></div>
                  <div className={`text-4xl font-black ${inv.status === 'FAILED' ? 'text-white' : 'text-emerald-400'}`}>₹{inv.amount.toLocaleString()}</div>
                  {inv.status === 'FAILED' && <div className="text-sm flex items-center gap-1 text-rose-400 mt-3 font-bold bg-rose-500/10 inline-block px-3 py-1 rounded-lg"><AlertCircle className="w-4 h-4 inline"/> {t.risk}</div>}
                </div>
              </div>
              
              {inv.status === 'FAILED' && discount > 0 && (
                <div className="bg-indigo-600/10 border border-indigo-500/30 p-5 rounded-2xl mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">Save {discount}%</div>
                  <div className="font-bold text-indigo-400 mb-2 text-lg">{t.offer}</div>
                  <div className="text-sm text-indigo-200 mb-4">{t.offerDesc}</div>
                  <div className="text-3xl font-black text-white">₹{finalAmount.toLocaleString()}</div>
                  <div className="text-xs text-slate-400 line-through mt-1">₹{inv.amount.toLocaleString()}</div>
                </div>
              )}
              
              {inv.status === 'FAILED' ? (
                <button onClick={()=>pay(inv.id)} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                  <Globe className="w-5 h-5"/> {t.payNow}
                </button>
              ) : (
                <div className="bg-emerald-500/10 text-emerald-400 text-center font-bold py-4 rounded-xl border border-emerald-500/20">Payment Successful. Subscription Active.</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}