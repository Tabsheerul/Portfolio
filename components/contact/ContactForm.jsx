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
    <div className="z-10 relative max-w-[600px] mx-auto mt-20 p-6 md:p-12 bg-white/[0.02] border border-white/[0.06] rounded-xl backdrop-blur-sm">
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Name Field */}
        <div className="contact-form-field relative flex flex-col mt-4">
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="off"
            value={formData.name}
            onChange={handleChange}
            className="peer w-full bg-transparent border-b border-white/10 px-0 py-3 text-[16px] text-white focus:outline-none focus:border-[#00d4ff] transition-colors duration-300 shadow-[0_1px_0_0_transparent] focus:shadow-[0_1px_12px_rgba(0,212,255,0.15)] placeholder-transparent focus:placeholder-white/30"
            placeholder="John Doe"
          />
          <label 
            htmlFor="name" 
            className="absolute left-0 top-3 text-[12px] uppercase tracking-[0.05em] font-medium text-[#666666] transition-all duration-300 pointer-events-none origin-left peer-focus:-top-5 peer-focus:text-[#00d4ff] peer-focus:scale-90 peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-[#00d4ff] peer-[&:not(:placeholder-shown)]:scale-90"
          >
            Your Name
          </label>
        </div>

        {/* Email Field */}
        <div className="contact-form-field relative flex flex-col mt-4">
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
            className="peer w-full bg-transparent border-b border-white/10 px-0 py-3 text-[16px] text-white focus:outline-none focus:border-[#00d4ff] transition-colors duration-300 shadow-[0_1px_0_0_transparent] focus:shadow-[0_1px_12px_rgba(0,212,255,0.15)] placeholder-transparent focus:placeholder-white/30"
            placeholder="john@example.com"
          />
          <label 
            htmlFor="email" 
            className="absolute left-0 top-3 text-[12px] uppercase tracking-[0.05em] font-medium text-[#666666] transition-all duration-300 pointer-events-none origin-left peer-focus:-top-5 peer-focus:text-[#00d4ff] peer-focus:scale-90 peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-[#00d4ff] peer-[&:not(:placeholder-shown)]:scale-90"
          >
            Your Email
          </label>
        </div>

        {/* Message Field */}
        <div className="contact-form-field relative flex flex-col mt-4">
          <textarea
            id="message"
            name="message"
            required
            autoComplete="off"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className="peer w-full bg-transparent border-b border-white/10 px-0 py-3 text-[16px] text-white focus:outline-none focus:border-[#00d4ff] transition-colors duration-300 resize-y shadow-[0_1px_0_0_transparent] focus:shadow-[0_1px_12px_rgba(0,212,255,0.15)] leading-[1.5] placeholder-transparent focus:placeholder-white/30"
            placeholder="Tell me about your project..."
          />
          <label 
            htmlFor="message" 
            className="absolute left-0 top-3 text-[12px] uppercase tracking-[0.05em] font-medium text-[#666666] transition-all duration-300 pointer-events-none origin-left peer-focus:-top-5 peer-focus:text-[#00d4ff] peer-focus:scale-90 peer-[&:not(:placeholder-shown)]:-top-5 peer-[&:not(:placeholder-shown)]:text-[#00d4ff] peer-[&:not(:placeholder-shown)]:scale-90"
          >
            Your Message
          </label>
        </div>

        <div className="contact-form-field mt-4 flex justify-center md:justify-start">
          <MagneticButton
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full md:w-auto min-w-[200px] !px-10 !py-4 !text-[14px] !font-semibold !tracking-[0.05em] !uppercase transition-all duration-300 ${
              status === 'success' ? '!bg-[#00ff88] !border-[#00ff88] !text-black' : 
              status === 'error' ? '!bg-[#ff4444] !border-[#ff4444] !text-white' : 
              '!bg-transparent !border-white/20 !text-white hover:!bg-[#00d4ff] hover:!border-[#00d4ff] hover:!text-black'
            } ${status === 'submitting' ? 'opacity-80 cursor-not-allowed' : ''}`}
            data-cursor={isButtonDisabled ? "" : "hover"}
          >
            {status === 'idle' && 'SEND MESSAGE'}
            {status === 'submitting' && 'SENDING...'}
            {status === 'success' && 'MESSAGE SENT ✓'}
            {status === 'error' && 'FAILED TO SEND ✕'}
          </MagneticButton>
        </div>

      </form>
    </div>
  );
}
