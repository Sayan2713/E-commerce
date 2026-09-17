import { useEffect, useState } from 'react';
import api from '../api/client';

export default function ReferralCard({ referralCode }) {
  const [coupons, setCoupons] = useState([]);
  const [copied, setCopied] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    api.get('/users/me/coupons').then((r) => setCoupons(r.data.coupons)).catch(() => {});
  }, []);

  if (!referralCode) return null;

  const shareLink = `${window.location.origin}/register?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        marginTop: 20,
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAE2D6',
        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Category Tag */}
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
        Rewards & Referrals
      </span>

      <h4
        style={{
          marginTop: 12,
          marginBottom: 6,
          fontSize: 18,
          fontWeight: 700,
          color: '#2D2D2D',
        }}
      >
        Refer a Friend
      </h4>

      <p
        style={{
          fontSize: 13,
          color: '#666666',
          lineHeight: 1.6,
          margin: '0 0 16px 0',
        }}
      >
        Share your referral code—when a friend signs up and completes their first order, you both get ₹100 off your next purchase.
      </p>

      {/* Referral Code Box + Copy Button */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <code
          style={{
            backgroundColor: '#F7F2EB',
            color: '#2D2D2D',
            padding: '10px 16px',
            borderRadius: 10,
            border: '1.5px dashed #8B9A6E',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '1px',
          }}
        >
          {referralCode}
        </code>

        <button
          onClick={copyLink}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          style={{
            backgroundColor: copied ? '#8B9A6E' : btnHover ? '#7A895E' : '#8B9A6E',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}
        >
          {copied ? '✓ Link Copied!' : 'Copy Referral Link'}
        </button>
      </div>

      {/* Coupons List */}
      {coupons.length > 0 && (
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #EAE2D6' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: '#2D2D2D',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: 12,
            }}
          >
            Your Earned Coupons
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {coupons.map((c) => (
              <div
                key={c._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#F7F2EB',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #EAE2D6',
                  fontSize: 13,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <code style={{ fontWeight: 800, color: '#2D2D2D' }}>{c.code}</code>
                  <span style={{ color: '#666666' }}>({c.reason || 'Special Reward'})</span>
                </div>

                <span
                  style={{
                    backgroundColor: '#8B9A6E',
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 11,
                  }}
                >
                  {c.discountType === 'FLAT' ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}