import { useState, useRef } from "react";
import {
  Zap,
  ShieldAlert,
  FileJson,
  BrainCircuit,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const FeatureCard = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl sm:rounded-3xl border border-[#222] bg-[#111] overflow-hidden flex flex-col ${className}`}
    >
      <div
        className='pointer-events-none absolute -inset-px rounded-2xl sm:rounded-3xl opacity-0 transition-opacity duration-300 z-0'
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.04), transparent 40%)`,
        }}
      />
      <div className='relative z-10 flex flex-col h-full p-6 sm:p-8 w-full'>
        {children}
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div id='features' className='md:py-16 relative bg-black'>
      <div className='container px-4 md:px-8 mx-auto relative z-10 max-w-6xl'>
        <div className='mb-10 sm:mb-14 max-w-2xl'>
          <h2 className='text-3xl md:text-[44px] font-dmsans mb-4 text-white leading-[1.15]'>
            Everything you need,
            <br />
            built right in.
          </h2>
          <p className='text-[#B0B0B0] text-base sm:text-lg md:text-[20px] leading-relaxed font-bricolage-light tracking-tight'>
            Endpoint provides an incredibly deep suite of tools, seamlessly
            integrated to keep your infrastructure resilient and visible.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-12 md:grid-rows-[auto_auto_auto_auto] gap-4 sm:gap-5'>
          <FeatureCard className='md:col-span-7 md:row-span-2'>
            <div className='flex-1 flex items-center justify-center py-4 sm:py-6 relative'>
              <div className='w-full max-w-md h-[140px] sm:h-[170px] relative flex items-end justify-between px-2 gap-1 sm:gap-1.5 pb-2'>
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-[3px] ${i === 23 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10 relative" : "bg-[#333]"}`}
                    style={{
                      height: `${Math.max(10, Math.sin(i * 0.4) * 45 + 50)}%`,
                    }}
                  />
                ))}
                <div className='absolute top-2 right-8 sm:right-12 border border-[#333] rounded-md bg-[#1a1a1a] text-[#ccc] text-[10px] sm:text-[11px] font-mono px-2 py-1 z-20 hidden sm:block'>
                  99.99% Uptime SLA
                </div>
              </div>
              <div className='absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-[#111] to-transparent z-10' />
            </div>
            <div className='mt-auto'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#333] text-[#ddd]'>
                  <Zap className='w-4 h-4' strokeWidth={2} />
                </div>
                <h3 className='font-semibold text-lg sm:text-xl font-dmsans text-white tracking-tight'>
                  Real-time Monitoring
                </h3>
              </div>
              <p className='text-[#999] leading-relaxed font-bricolage-light text-[14px] sm:text-[15px] max-w-lg'>
                Ping endpoints every minute, ensuring flawless uptime and
                sub-second latency tracking with automated anomaly detection.
              </p>
            </div>
          </FeatureCard>

          <FeatureCard className='md:col-span-5'>
            <div className='flex-1 flex flex-col justify-center py-3 sm:py-4'>
              <div className='w-full rounded-xl border border-[#2A3560] bg-[#0C1020] p-4 sm:p-5 font-mono text-[11px] sm:text-[12px] leading-relaxed'>
                <span className='text-[#999]'>Evaluating stack trace...</span>
                <span className='text-white mt-1.5 block'>
                  Detected null pointer in userAuth.ts:45
                </span>
                <span className='text-indigo-400 mt-2 block'>
                  Action: Rollback deployment v2.4.1
                </span>
              </div>
            </div>
            <div className='mt-auto'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#333] text-[#ddd]'>
                  <BrainCircuit className='w-4 h-4' strokeWidth={2} />
                </div>
                <h3 className='font-semibold text-lg sm:text-xl font-dmsans text-white tracking-tight'>
                  AI Diagnostics
                </h3>
              </div>
              <p className='text-[#999] leading-relaxed font-bricolage-light text-[14px] sm:text-[15px]'>
                Gemini diagnoses the root cause of failures, translating stack
                traces into plain English.
              </p>
            </div>
          </FeatureCard>

          <FeatureCard className='md:col-span-5'>
            <div className='flex-1 flex items-center justify-center py-3 sm:py-4'>
              <div className='w-full flex font-mono text-[11px] sm:text-[12px] overflow-hidden rounded-xl border border-[#333]'>
                <div className='w-1/2 bg-[#1a1a1a] p-3 sm:p-4 text-red-400 border-r border-[#333]'>
                  - &quot;id&quot;:&nbsp;
                  <span className='text-red-400/80'>number</span>
                </div>
                <div className='w-1/2 bg-[#141414] p-3 sm:p-4 text-green-400'>
                  + &quot;id&quot;:&nbsp;
                  <span className='text-green-400/80'>string</span>
                </div>
              </div>
            </div>
            <div className='mt-auto'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#333] text-[#ddd]'>
                  <FileJson className='w-4 h-4' strokeWidth={2} />
                </div>
                <h3 className='font-semibold text-lg sm:text-xl font-dmsans text-white tracking-tight'>
                  Schema Drift
                </h3>
              </div>
              <p className='text-[#999] leading-relaxed font-bricolage-light text-[14px] sm:text-[15px]'>
                Catch silent contract changes before they break your app with
                automated diff tracking.
              </p>
            </div>
          </FeatureCard>

          <FeatureCard className='md:col-span-4'>
            <div className='flex-1 flex items-center justify-center py-3 sm:py-4'>
              <div className='w-full rounded-xl border border-[#333] bg-[#1a1a1a] p-4 sm:p-5 font-mono'>
                <div className='flex items-baseline justify-between mb-3'>
                  <span className='text-[#999] text-[10px] uppercase tracking-wider'>
                    Monthly Spend
                  </span>
                  <span className='text-white font-bold text-lg sm:text-xl font-dmsans'>
                    $47.32
                  </span>
                </div>
                <div className='h-1.5 w-full bg-[#252525] rounded-full overflow-hidden mb-2'>
                  <div className='h-full w-[62%] bg-amber-400 rounded-full' />
                </div>
                <div className='flex justify-between text-[10px] sm:text-[11px]'>
                  <span className='text-[#888]'>62% of $75 budget</span>
                  <span className='text-amber-400'>Alert at 80%</span>
                </div>
              </div>
            </div>
            <div className='mt-auto'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#333] text-[#ddd]'>
                  <DollarSign className='w-4 h-4' strokeWidth={2} />
                </div>
                <h3 className='font-semibold text-lg sm:text-xl font-dmsans text-white tracking-tight'>
                  Cost Tracking
                </h3>
              </div>
              <p className='text-[#999] leading-relaxed font-bricolage-light text-[14px] sm:text-[15px]'>
                Track spending per API call with budget alerts before surprise
                bills hit.
              </p>
            </div>
          </FeatureCard>

          <FeatureCard className='md:col-span-4'>
            <div className='flex-1 flex items-center justify-center py-3 sm:py-4'>
              <div className='w-full rounded-xl border border-[#333] bg-[#1a1a1a] p-4 sm:p-5 font-mono'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-2 h-2 rounded-full bg-amber-400 animate-pulse' />
                  <span className='text-amber-400 text-[10px] font-semibold uppercase tracking-wider'>
                    Predictive Alert
                  </span>
                </div>
                <div className='text-[12px] sm:text-[13px] text-white mb-2'>
                  Payment API — Failure likely
                </div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-[10px] sm:text-[11px] text-[#888]'>
                    Probability
                  </span>
                  <span className='text-[14px] sm:text-[15px] font-bold text-amber-400 font-dmsans'>
                    73%
                  </span>
                </div>
                <div className='h-1.5 w-full bg-[#252525] rounded-full overflow-hidden'>
                  <div className='h-full w-[73%] bg-linear-to-r from-amber-500 to-red-500 rounded-full' />
                </div>
              </div>
            </div>
            <div className='mt-auto'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#333] text-[#ddd]'>
                  <TrendingUp className='w-4 h-4' strokeWidth={2} />
                </div>
                <h3 className='font-semibold text-lg sm:text-xl font-dmsans text-white tracking-tight'>
                  Predictive Alerts
                </h3>
              </div>
              <p className='text-[#999] leading-relaxed font-bricolage-light text-[14px] sm:text-[15px]'>
                Forecast failures before they happen with pattern detection and
                AI-powered trend analysis.
              </p>
            </div>
          </FeatureCard>

          <FeatureCard className='md:col-span-4'>
            <div className='flex-1 flex flex-col justify-center py-3 sm:py-4 gap-2.5'>
              <div className='flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-[#1a1a1a] border border-[#333]'>
                <div className='w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]' />
                <div className='flex flex-col min-w-0'>
                  <span className='text-[12px] sm:text-[13px] font-medium font-dmsans text-white truncate'>
                    Payment Gateway Down
                  </span>
                  <span className='text-[10px] sm:text-[11px] font-dmsans text-[#888] truncate'>
                    Email Alert • Escalating
                  </span>
                </div>
              </div>
              <div className='flex items-center gap-3 p-3 sm:p-3.5 rounded-xl bg-[#161616] border border-[#2a2a2a] opacity-80'>
                <div className='w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.3)]' />
                <div className='flex flex-col min-w-0'>
                  <span className='text-[12px] sm:text-[13px] font-medium font-dmsans text-white truncate'>
                    Latency Spike (US-East)
                  </span>
                  <span className='text-[10px] sm:text-[11px] font-dmsans text-[#888] truncate'>
                    In-App • Suppressed
                  </span>
                </div>
              </div>
            </div>
            <div className='mt-auto'>
              <div className='flex items-center gap-3 mb-2'>
                <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#333] text-[#ddd]'>
                  <ShieldAlert className='w-4 h-4' strokeWidth={2} />
                </div>
                <h3 className='font-semibold text-lg sm:text-xl font-dmsans text-white tracking-tight'>
                  Smart Alerting
                </h3>
              </div>
              <p className='text-[#999] leading-relaxed font-bricolage-light text-[14px] sm:text-[15px]'>
                Intelligently route critical alerts via email and in-app
                notifications. Cluster related incidents to reduce noise.
              </p>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
};

export default Features;
