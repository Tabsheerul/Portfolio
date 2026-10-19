'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import MagneticButton from '@/components/shared/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

export default function ContactForm() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !formRef.current) {
      gsap.set('.contact-form-field', { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo('.contact-form-field',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 80%',
          once: true,
        }
      }
    );
  }, { scope: formRef });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const isButtonDisabled = status === 'submitting' || status === 'success';

  return (
    <div className="z-10 relative max-w-[620px] mx-auto mt-16 p-7 md:p-11 bg-[#120a22]/70 border border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
      {/* Top Hairline Glow */}
      <div 
        className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/60 to-transparent pointer-events-none" 
        aria-hidden="true"
      />

      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Name Field */}
        <div className="contact-form-field group relative flex flex-col gap-2">
          <label 
            htmlFor="name" 
            className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9b8fc4] font-medium flex items-center gap-2 group-focus-within:text-purple-300 transition-colors duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-focus-within:bg-purple-400 group-focus-within:shadow-[0_0_8px_#a855f7] transition-all duration-200" />
            Your Name <span className="text-purple-400/80">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className="w-full bg-[#0d0a1a]/60 hover:bg-[#0d0a1a]/80 focus:bg-[#0d0a1a] border border-white/10 hover:border-white/20 focus:border-purple-400/80 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-[#9b8fc4]/35 focus:outline-none focus:ring-1 focus:ring-purple-400/30 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 font-sans"
          />
        </div>

        {/* Email Field */}
        <div className="contact-form-field group relative flex flex-col gap-2">
          <label 
            htmlFor="email" 
            className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9b8fc4] font-medium flex items-center gap-2 group-focus-within:text-purple-300 transition-colors duration-200"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-focus-within:bg-purple-400 group-focus-within:shadow-[0_0_8px_#a855f7] transition-all duration-200" />
            Your Email <span className="text-purple-400/80">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. john@example.com"
            className="w-full bg-[#0d0a1a]/60 hover:bg-[#0d0a1a]/80 focus:bg-[#0d0a1a] border border-white/10 hover:border-white/20 focus:border-purple-400/80 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-[#9b8fc4]/35 focus:outline-none focus:ring-1 focus:ring-purple-400/30 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 font-sans"
          />
        </div>

        {/* Message Field */}
        <div className="contact-form-field group relative flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label 
              htmlFor="message" 
              className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#9b8fc4] font-medium flex items-center gap-2 group-focus-within:text-purple-300 transition-colors duration-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500/50 group-focus-within:bg-purple-400 group-focus-within:shadow-[0_0_8px_#a855f7] transition-all duration-200" />
              Your Message <span className="text-purple-400/80">*</span>
            </label>
            <span className="text-[11px] font-mono text-[#666666]">
              {formData.message.length} / 1000
            </span>
          </div>
          <textarea
            id="message"
            name="message"
            required
            autoComplete="off"
            rows={5}
            maxLength={1000}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell me about your project, timeline, and goals..."
            className="w-full bg-[#0d0a1a]/60 hover:bg-[#0d0a1a]/80 focus:bg-[#0d0a1a] border border-white/10 hover:border-white/20 focus:border-purple-400/80 rounded-xl px-4 py-3.5 text-[15px] text-white placeholder:text-[#9b8fc4]/35 focus:outline-none focus:ring-1 focus:ring-purple-400/30 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 font-sans resize-none leading-relaxed"
          />
        </div>

        {/* Submit Action */}
        <div className="contact-form-field pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          <MagneticButton
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full sm:w-auto min-w-[200px] !px-8 !py-4 !text-[13px] !font-semibold !tracking-[0.08em] !uppercase !rounded-xl transition-all duration-300 shadow-lg ${
              status === 'success' 
                ? '!bg-emerald-500 !border-emerald-500 !text-white !shadow-emerald-500/25' 
                : status === 'error' 
                ? '!bg-rose-500 !border-rose-500 !text-white !shadow-rose-500/25' 
                : '!bg-[#a855f7] hover:!bg-[#9333ea] !border-[#a855f7] !text-white hover:!shadow-[0_0_30px_rgba(168,85,247,0.4)]'
            } ${status === 'submitting' ? 'opacity-80 cursor-wait' : ''}`}
            data-cursor={isButtonDisabled ? "" : "hover"}
          >
            {status === 'idle' && (
              <span className="flex items-center gap-2">
                SEND MESSAGE
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </span>
            )}
            {status === 'submitting' && (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SENDING...
              </span>
            )}
            {status === 'success' && 'MESSAGE SENT ✓'}
            {status === 'error' && 'FAILED TO SEND ✕'}
          </MagneticButton>

          <p className="text-[12px] font-mono text-[#666666] text-center sm:text-right">
            ⚡ Typical response: &lt; 24h
          </p>
        </div>

      </form>
    </div>
  );
}
