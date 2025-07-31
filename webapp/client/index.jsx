import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DataEntryForm from './DataEntryForm';
import ViewEntries from './ViewEntries';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <nav style={{ width: 220, background: '#222b3a', color: '#fff', padding: '2rem 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 style={{ color: '#fff', fontSize: 22, marginBottom: 32 }}>CDISC BC Web</h2>
           <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, marginBottom: 8 }}>Home</Link>
           <Link to="/data-entry" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, marginBottom: 8 }}>Biomedical Concepts Data Entry</Link>
           <Link to="/view" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>View Biomedical Concepts Entries</Link>
        </nav>
        <main style={{ flex: 1, background: '#f4f6fa', minHeight: '100vh', padding: '2rem 2rem' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/data-entry" element={<DataEntryForm />} />
            <Route path="/view" element={<ViewEntries />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Landing() {
  return (
    <div style={{ maxWidth: 600, margin: '3rem auto', textAlign: 'center' }}>
      <h1>Welcome to the CDISC Biomedical Concepts and Data Set Specializations Web App</h1>
      <p style={{ fontSize: 18, margin: '2rem 0' }}>
        Use the navigation bar on the left to access the Data Entry or View Entries pages for Biomedical Concepts and Data Set Specializations
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
        <Link to="/data-entry" style={{ padding: '12px 32px', background: '#1976d2', color: '#fff', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 18 }}>Go to Biomedical Concepts Data Entry</Link>
        <Link to="/view" style={{ padding: '12px 32px', background: '#1976d2', color: '#fff', borderRadius: 6, fontWeight: 600, textDecoration: 'none', fontSize: 18 }}>Go to View Biomedical Concepts Entries</Link>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
