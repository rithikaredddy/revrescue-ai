import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import LoginGateway from './pages/LoginGateway'; 
import MerchantDash from './pages/MerchantDash';
import RecoveryLab from './pages/RecoveryLab'; 
import CustomerPortal from './pages/CustomerPortal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Entry Flow separated correctly */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginGateway />} />
        
        {/* Protected/Dashboard Routes remain completely untouched */}
        <Route path="/merchant/dashboard" element={<MerchantDash />} />
        <Route path="/merchant/lab" element={<RecoveryLab />} />
        <Route path="/customer/dashboard" element={<CustomerPortal />} />
      </Routes>
    </BrowserRouter>
  );
}