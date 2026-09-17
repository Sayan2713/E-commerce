import { useState } from 'react';
import LegalDocument from '../components/LegalDocument';

const FAQS = [
  { q: 'Do you offer Cash on Delivery?', a: 'Yes—COD is currently our primary payment method. You pay when your order arrives at your door.' },
  { q: 'How long does delivery take?', a: 'Most orders arrive within 4–7 business days, depending on your location. You will see an estimated delivery window on each product page.' },
  { q: 'Can I cancel my order?', a: 'Yes, any time before it is marked "Shipped"—go to your Order History and select "Cancel Order" with zero cancellation charges.' },
  { q: 'Can I return an item?', a: 'Most items can be returned within a set window after delivery—see our Return Policy for details. Some items (like innerwear or clearance pieces) may not be eligible, which will be noted on the product page.' },
  { q: 'How do I track my order?', a: 'Once your order ships, you can see live status updates directly from your Order History.' },
  { q: 'Do you deliver across India?', a: 'Yes, we deliver nationwide—delivery charges depend on your location and are calculated transparently at checkout.' },
  { q: 'How do I use a coupon code?', a: 'Enter your code at checkout and tap "Apply"—the discount will immediately show in your price breakdown before placing your order.' },
  { q: 'I have another question—who do I contact?', a: 'Reach out through our Contact Us page, or via WhatsApp/phone/email listed in the support section.' },
];

export default function FAQ() {
  return (
    <LegalDocument title="Frequently Asked Questions" lastUpdated="September 2026">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {FAQS.map((item, index) => (
          <FaqItem key={item.q} item={item} defaultOpen={index === 0} />
        ))}
      </div>
    </LegalDocument>
  );
}

function FaqItem({ item, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAE2D6',
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          backgroundColor: isOpen ? '#F7F2EB' : hovered ? '#FAF7F2' : '#FFFFFF',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          outline: 'none',
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: '#2D2D2D',
            paddingRight: 12,
          }}
        >
          {item.q}
        </span>
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#8B9A6E',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            padding: '16px 20px',
            fontSize: 14,
            color: '#666666',
            lineHeight: 1.65,
            borderTop: '1px solid #EAE2D6',
            backgroundColor: '#FFFFFF',
          }}
        >
          {item.a}
        </div>
      )}
    </div>
  );
}