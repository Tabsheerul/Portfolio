'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Moon, Sun, Play, Pause, Hand, MousePointer } from 'lucide-react';
import { VenomButton } from '@/components/ui/VenomButton';

export default function VenomDemoPage() {
  const [theme, setTheme] = useState('light');
  const [cursor, setCursor] = useState('glove');
  const [autoplay, setAutoplay] = useState(false);
  const [strands, setStrands] = useState(7);
  const [label, setLabel] = useState("let’s collaborate");
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#0d0a1a] text-[#f0eeff] px-4 pt-28 pb-16 md:px-12 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-xs font-mono text-purple-300">
          <Sparkles size={13} className="text-purple-400" /> Nexus UI Symbiote Component
        </div>
      </div>

      <div className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
          Venom Button
        </h1>
        <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto">
          A glossy black pill that hunts for a host. Bring your cursor near to watch pseudopods ooze out, lunge, wrap your fingers in tendril webs, and snap back when you pull away!
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="w-full max-w-3xl mb-8">
        <VenomButton 
          label={label}
          theme={theme}
          cursor={cursor}
          autoplay={autoplay}
          strands={strands}
          height={400}
          onClick={() => setClickCount(c => c + 1)}
          className="shadow-2xl"
        />
        {clickCount > 0 && (
          <p className="text-center text-xs font-mono text-emerald-400 mt-3 animate-fade-in">
            Symbiote clicked {clickCount} {clickCount === 1 ? 'time' : 'times'}!
          </p>
        )}
      </div>

      {/* Controls Playground */}
      <div className="w-full max-w-3xl bg-[#140d27] border border-purple-500/20 rounded-2xl p-6 shadow-xl">
        <h2 className="text-sm font-mono uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
          Playground Controls
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Theme Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-mono">Stage Theme</label>
            <button
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono transition-colors"
            >
              {theme === 'light' ? (
                <>
                  <Sun size={14} className="text-amber-400" /> Light (Nexus UI)
                </>
              ) : (
                <>
                  <Moon size={14} className="text-purple-400" /> Dark Cosmic
                </>
              )}
            </button>
          </div>

          {/* Cursor Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-mono">Cursor Style</label>
            <button
              onClick={() => setCursor(c => c === 'glove' ? 'native' : 'glove')}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono transition-colors"
            >
              {cursor === 'glove' ? (
                <>
                  <Hand size={14} className="text-cyan-400" /> Cartoon Glove
                </>
              ) : (
                <>
                  <MousePointer size={14} className="text-neutral-300" /> Native Pointer
                </>
              )}
            </button>
          </div>

          {/* Autoplay Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-mono">Autoplay Ghost</label>
            <button
              onClick={() => setAutoplay(a => !a)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono transition-colors"
            >
              {autoplay ? (
                <>
                  <Pause size={14} className="text-emerald-400" /> Active (Ghost)
                </>
              ) : (
                <>
                  <Play size={14} className="text-neutral-400" /> Off (Cursor only)
                </>
              )}
            </button>
          </div>

          {/* Strands Count */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-neutral-400 font-mono">Tendril Strands: {strands}</label>
            <input 
              type="range" 
              min={2} 
              max={7} 
              value={strands} 
              onChange={(e) => setStrands(Number(e.target.value))}
              className="w-full accent-purple-500 mt-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Custom Text input */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 items-center">
          <label className="text-xs text-neutral-400 font-mono whitespace-nowrap">Button Text:</label>
          <input 
            type="text" 
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-purple-500/30 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
            placeholder="e.g. let's collaborate, send message..."
          />
        </div>
      </div>

      {/* Code Snippet for User */}
      <div className="w-full max-w-3xl mt-6 p-4 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-neutral-400">
        <p className="text-purple-300 mb-2">// How to use anywhere in your project:</p>
        <code className="text-purple-200 block">
          import &#123; VenomButton &#125; from '@/components/ui/VenomButton';
        </code>
        <code className="text-neutral-300 block mt-1">
          &lt;VenomButton label="let’s collaborate" cursor="glove" height=&#123;400&#125; /&gt;
        </code>
      </div>
    </div>
  );
}
