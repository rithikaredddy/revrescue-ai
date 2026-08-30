import React, { useState } from 'react'; import { useNavigate } from 'react-router-dom'; import { Bot, Briefcase, UserCircle } from 'lucide-react';
export default function LoginGateway() {
  const [mode, setMode] = useState<'GATEWAY' | 'MERCHANT' | 'CUSTOMER'>('GATEWAY');
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('Demo@123');
  const [error, setError] = useState(''); const nav = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault(); setError('');
    try {
      const res = await fetch('https://revrescue-ai.onrender.com/api/auth/login', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password}) });
      const data = await res.json();
      if(!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('token', data.token); 
      nav(data.user.role === 'ADMIN' ? '/merchant/dashboard' : '/customer/dashboard');
    } catch (err: any) { setError(err.message); }
  };

  if (mode === 'GATEWAY') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-slide-up">
        <Bot className="w-16 h-16 text-indigo-500 mb-6"/>
        <h1 className="text-4xl font-extrabold mb-2">RevRescue AI</h1>
        <p className="text-slate-400 mb-12 text-lg">Autonomous Revenue Recovery</p>
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition cursor-pointer flex flex-col items-center text-center" onClick={() => {setMode('MERCHANT'); setEmail('merchant@revrescue.demo');}}>
            <Briefcase className="w-12 h-12 text-indigo-400 mb-4"/>
            <h3 className="text-2xl font-bold mb-2">Merchant Console</h3>
            <p className="text-slate-400 mb-6">Monitor, predict, and autonomously recover at-risk subscription revenue.</p>
            <button className="w-full py-3 bg-indigo-600 rounded-lg font-bold text-white">Enter Merchant Console</button>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition cursor-pointer flex flex-col items-center text-center" onClick={() => {setMode('CUSTOMER'); setEmail('customer@revrescue.demo');}}>
            <UserCircle className="w-12 h-12 text-emerald-400 mb-4"/>
            <h3 className="text-2xl font-bold mb-2">Customer Portal</h3>
            <p className="text-slate-400 mb-6">Resolve your failed subscription payment and keep your service active.</p>
            <button className="w-full py-3 bg-slate-800 rounded-lg font-bold text-white">Continue as Customer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 animate-slide-up">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-center">{mode === 'MERCHANT' ? 'Merchant Login' : 'Customer Login'}</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Demo Mode credentials pre-filled</p>
        {error && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded mb-4 text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3" required />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3" required />
          <button className={`w-full p-3 rounded-lg font-bold ${mode === 'MERCHANT' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>Authenticate</button>
        </form>
        <button onClick={() => setMode('GATEWAY')} className="w-full mt-4 p-3 text-sm text-slate-400 hover:text-white">← Back to Gateway</button>
      </div>
    </div>
  );
}