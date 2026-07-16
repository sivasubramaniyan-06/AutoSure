import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ─── Error Boundary ───────────────────────────────────────────
// Catches crashes (e.g. missing Firebase env vars) that would otherwise
// produce a completely blank page — shows a readable message instead.
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh',
          background: '#0B1220', color: '#f1f5f9', fontFamily: 'sans-serif',
          padding: '2rem', textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            ⚠️ Application failed to start
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
            Missing environment variables. Configure them in Vercel → Project Settings → Environment Variables.
          </p>
          <pre style={{
            background: '#1e293b', padding: '1rem', borderRadius: '0.5rem',
            color: '#f87171', fontSize: '0.8rem', maxWidth: '600px',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {(this.state.error as Error).message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Mount ────────────────────────────────────────────────────
const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
