import React, { useState } from 'react';
import Landing from './pages/Landing';
import AppPage from './pages/App';

export default function App() {
  const [view, setView] = useState('landing');
  
  return (
    <div className="font-sans antialiased text-slate-900 overflow-x-hidden">
      {view === 'landing' ? (
        <Landing onStart={() => setView('app')} />
      ) : (
        <AppPage onBack={() => setView('landing')} />
      )}
    </div>
  );
}
