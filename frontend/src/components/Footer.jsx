import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../api/client';

const SOCIAL_ICONS = { instagram: '📷', facebook: '📘', twitter: '🐦', youtube: '▶️' };

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const [social, setSocial] = useState({});

  useEffect(() => {
    api.get('/settings/contact').then((r) => setSocial(r.data.socialLinks || {})).catch(() => {});
  }, []);

  const socialEntries = Object.entries(social).filter(([, url]) => url);

  return (
    <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-muted)', marginTop: 40 }}>
      <div className="container" style={{ padding: '32px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>ClothStore</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-soft)' }}>
            Quality clothing, delivered with Cash on Delivery.
          </div>
          {socialEntries.length > 0 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              {socialEntries.map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noreferrer" title={platform} style={{ fontSize: 18 }}>
                  {SOCIAL_ICONS[platform] || '🔗'}
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Company</div>
          <FooterLink to="/about">{t('aboutUs')}</FooterLink>
          <FooterLink to="/contact">{t('contactUs')}</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/careers">Careers</FooterLink>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Policies</div>
          <FooterLink to="/policies/shipping">Shipping Policy</FooterLink>
          <FooterLink to="/policies/return">Return & Refund Policy</FooterLink>
          <FooterLink to="/policies/cancellation">Cancellation Policy</FooterLink>
          <FooterLink to="/policies/privacy">Privacy Policy</FooterLink>
          <FooterLink to="/policies/terms">Terms & Conditions</FooterLink>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Account</div>
          <FooterLink to="/profile">{t('profile')}</FooterLink>
          <FooterLink to="/search">{t('search')}</FooterLink>
          <FooterLink to="/sitemap">Sitemap</FooterLink>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--color-muted)', textAlign: 'center', padding: 16, fontSize: 12, color: 'var(--color-text-soft)' }}>
        © {year} ClothStore. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} style={{ display: 'block', fontSize: 13, color: 'var(--color-text-soft)', marginBottom: 6 }}>
      {children}
    </Link>
  );
}
