'use client';

import { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ICONS = {
  Mail: 'M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7',
  MailBox: 'M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z',
  Phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  MapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
};

export default function ContactInfo() {
  const [copied, setCopied] = useState(null);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const contactItems = [
    {
      id: 'email',
      label: 'EMAIL',
      value: 'tabsheerul07@gmail.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS.MailBox} />
          <path d={ICONS.Mail} />
        </svg>
      ),
      isCopyable: true,
    },
    {
      id: 'phone',
      label: 'PHONE',
      value: '+91 8102623810',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS.Phone} />
        </svg>
      ),
      isCopyable: true,
    },
    {
      id: 'location',
      label: 'LOCATION',
      value: 'Jamshedpur, Jharkhand, India',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={ICONS.MapPin} />
        </svg>
      ),
      isCopyable: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mt-16 z-10 relative">
      {contactItems.map((item) => (
        <div key={item.id} className="flex flex-col items-start md:items-center text-left md:text-center relative">
          
          {/* Tooltip */}
          {item.isCopyable && (
            <div
              className="absolute -top-10 bg-[#00d4ff] text-black text-[11px] font-semibold px-[10px] py-[4px] rounded transition-all duration-300 pointer-events-none"
              style={{
                opacity: copied === item.id ? 1 : 0,
                transform: `translateY(${copied === item.id ? 0 : 10}px)`,
              }}
              aria-hidden={copied !== item.id}
            >
              Copied to clipboard!
            </div>
          )}

          <div className="text-[#00d4ff] mb-4">
            {item.icon}
          </div>
          
          <div className="text-[12px] uppercase tracking-[0.1em] text-[#666666] mb-2 font-medium">
            {item.label}
          </div>
          
          {item.isCopyable ? (
            <button
              onClick={() => handleCopy(item.value, item.id)}
              className="text-[16px] font-medium text-white hover:text-[#00d4ff] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 -mx-2"
              data-cursor="hover"
              aria-label={`Copy ${item.label.toLowerCase()} to clipboard`}
            >
              {item.value}
            </button>
          ) : (
            <div className="text-[16px] font-medium text-white px-2 py-1">
              {item.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
