import { useEffect, useState } from 'react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(247, 242, 235, 0.96)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid #EAE2D6',
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* Offline Badge Icon */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            backgroundColor: '#FFF5F5',
            border: '1px solid #F5C6CB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: 26,
          }}
        >
          📡
        </div>

        {/* Status Pill */}
        <span
          style={{
            background: '#EAE2D6',
            color: '#8B9A6E',
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Connection Lost
        </span>

        <h2
          style={{
            fontSize: 22,
            color: '#2D2D2D',
            marginTop: 16,
            marginBottom: 8,
            fontWeight: 700,
          }}
        >
          No Internet Connection
        </h2>

        <p
          style={{
            color: '#666666',
            fontSize: 14,
            lineHeight: 1.6,
            margin: '0 auto 24px auto',
            maxWidth: 320,
          }}
        >
          You are currently offline. Check your network connection—this page will automatically reconnect once you&apos;re back online.
        </p>

        {/* Retry Action */}
        <button
          onClick={() => setIsOffline(!navigator.onLine)}
          style={{
            backgroundColor: '#8B9A6E',
            color: '#FFFFFF',
            padding: '12px 28px',
            border: 'none',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            transition: 'background 0.2s ease',
          }}
        >
          Check Connection
        </button>
      </div>
    </div>
  );
}