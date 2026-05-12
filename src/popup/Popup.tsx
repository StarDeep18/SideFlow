import React from 'react';
import ReactDOM from 'react-dom/client';
import '../sidepanel/styles/tokens.css';
import '../sidepanel/styles/reset.css';

const Popup: React.FC = () => {
  const openSidePanel = async () => {
    try {
      // Opening side panel programmatically requires user gesture
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.windowId) {
        await chrome.sidePanel.open({ windowId: tab.windowId });
      }
    } catch (error) {
      console.error('Failed to open side panel:', error);
    }
    window.close();
  };

  return (
    <div style={{
      width: '260px',
      padding: '20px',
      fontFamily: 'var(--font-sans)',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚡</div>
        <h1 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: 600, 
          marginBottom: '4px',
          letterSpacing: '-0.02em'
        }}>
          SideFlow
        </h1>
        <p style={{ 
          fontSize: 'var(--text-xs)', 
          color: 'var(--text-secondary)',
          marginBottom: '16px'
        }}>
          Productivity Sidebar
        </p>
        <button
          onClick={openSidePanel}
          style={{
            width: '100%',
            padding: '10px',
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 150ms',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'var(--accent)')}
        >
          Open Sidebar
        </button>
        <p style={{ 
          fontSize: 'var(--text-xs)', 
          color: 'var(--text-tertiary)',
          marginTop: '12px'
        }}>
          <kbd style={{
            fontFamily: 'var(--font-mono)',
            padding: '1px 4px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-default)',
            borderRadius: '3px',
            fontSize: '10px',
          }}>Ctrl+Shift+Space</kbd> to toggle
        </p>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('popup-root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
