import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Search,
  Activity,
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const INITIAL_REQUESTS = [
  { id: 1, method: "GET", path: "/api/v1/users/me", status: 200, time: 12 },
  {
    id: 2,
    method: "POST",
    path: "/api/v1/checkout/intent",
    status: 201,
    time: 242,
  },
  {
    id: 3,
    method: "GET",
    path: "/api/v1/products?limit=50",
    status: 200,
    time: 84,
  },
  {
    id: 4,
    method: "PUT",
    path: "/api/v1/orders/12938/cancel",
    status: 500,
    time: 1402,
  },
  {
    id: 5,
    method: "GET",
    path: "/api/v1/users/preferences",
    status: 200,
    time: 18,
  },
  { id: 6, method: "GET", path: "/api/v1/health", status: 200, time: 4 },
  {
    id: 7,
    method: "POST",
    path: "/api/v1/payments/refund",
    status: 200,
    time: 312,
  },
];

const NEW_REQUESTS = [
  { method: "POST", path: "/api/v1/auth/login", status: 200, time: 156 },
  { method: "GET", path: "/api/v1/analytics/events", status: 200, time: 45 },
  {
    method: "DELETE",
    path: "/api/v1/sessions/current",
    status: 204,
    time: 12,
  },
  { method: "GET", path: "/api/v1/webhooks/stripe", status: 403, time: 8 },
  { method: "POST", path: "/api/v1/users/avatar", status: 200, time: 890 },
  { method: "GET", path: "/api/v1/costs/summary", status: 200, time: 34 },
  {
    method: "POST",
    path: "/api/v1/contracts/validate",
    status: 200,
    time: 67,
  },
];

const ServiceItem = ({ name, status, latency, interval, active }) => (
  <div
    className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${active ? "bg-white/8 border border-white/5" : "hover:bg-white/4 border border-transparent"}`}
  >
    <div className='flex items-center gap-2.5'>
      <Server
        className={`w-3.5 h-3.5 ${status === "healthy" ? "text-teal-500" : "text-red-500"}`}
      />
      <span
        className={`text-[13px] font-dmsans tracking-wide ${active ? "text-white" : "text-white/60"}`}
      >
        {name}
      </span>
    </div>
    <div className='flex flex-col items-end'>
      <span
        className={`text-[11px] font-mono ${status === "healthy" ? "text-teal-400/80" : "text-red-400/80"}`}
      >
        {latency}
      </span>
      <span className='text-[10px] text-white/30'>{interval}</span>
    </div>
  </div>
);

const HeroDashboard = () => {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [typingText, setTypingText] = useState("");
  const fullQuery = "Why is my payment API failing?";

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullQuery.length) {
        setTypingText(fullQuery.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    let idCounter = 8;
    const reqInterval = setInterval(() => {
      const randomReq =
        NEW_REQUESTS[Math.floor(Math.random() * NEW_REQUESTS.length)];
      setRequests((prev) => {
        const updated = [{ ...randomReq, id: idCounter++ }, ...prev];
        return updated.slice(0, 8);
      });
    }, 2800);
    return () => clearInterval(reqInterval);
  }, []);

  return (
    <div className='relative rounded-2xl border border-white/8 bg-[#09090b] shadow-[0_0_80px_rgba(255,255,255,0.03)] flex flex-col overflow-hidden text-left h-[420px] sm:h-[500px] md:h-[560px] font-mono group/dashboard ring-1 ring-white/5'>
      <div className='h-12 sm:h-14 border-b border-white/5 bg-[#030303]/80 backdrop-blur-md flex items-center px-3 sm:px-4 justify-between relative z-20 shrink-0'>
        <div className='flex items-center gap-1.5 sm:gap-2 w-16 sm:w-20'>
          <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]/20 flex items-center justify-center border border-[#ff5f56]/50'>
            <div className='w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ff5f56]' />
          </div>
          <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]/20 flex items-center justify-center border border-[#ffbd2e]/50'>
            <div className='w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#ffbd2e]' />
          </div>
          <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]/20 flex items-center justify-center border border-[#27c93f]/50'>
            <div className='w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#27c93f]' />
          </div>
        </div>

        <div className='flex-1 max-w-lg mx-2 sm:mx-4 relative overflow-hidden rounded-md cursor-text group/cmd'>
          <div className='absolute inset-0 bg-linear-to-r from-teal-500/0 via-teal-500/10 to-indigo-500/0 opacity-0 group-hover/cmd:opacity-100 transition-opacity duration-700' />
          <div className='h-8 sm:h-9 bg-white/2 border border-white/8 group-hover/cmd:border-white/20 transition-all duration-300 rounded-md flex items-center px-2.5 sm:px-3 text-[12px] sm:text-[13px]'>
            <Search className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 mr-1.5 sm:mr-2 shrink-0' />
            <span className='text-white/80 truncate'>{typingText}</span>
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className='w-1.5 h-[14px] sm:h-[15px] bg-white/60 ml-0.5 shrink-0'
            />
            <div className='ml-auto hidden sm:flex gap-1.5 shrink-0'>
              <span className='px-1.5 py-0.5 rounded border border-white/10 bg-white/2 text-white/40 text-[10px] font-sans'>
                ⌘
              </span>
              <span className='px-1.5 py-0.5 rounded border border-white/10 bg-white/2 text-white/40 text-[10px] font-sans'>
                K
              </span>
            </div>
          </div>
        </div>

        <div className='w-16 sm:w-20 flex justify-end shrink-0'>
          <div className='flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] sm:text-[11px] animate-pulse'>
            <Activity className='w-3 h-3 sm:w-3.5 sm:h-3.5' />
            <span className='hidden sm:inline'>Live</span>
          </div>
        </div>
      </div>

      <div className='flex flex-1 overflow-hidden bg-[#000000]'>
        <div className='w-56 md:w-64 border-r border-white/5 bg-[#050505] hidden md:flex flex-col py-4 px-2 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)] shrink-0'>
          <div className='px-3 text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-4'>
            Monitored Services
          </div>
          <div className='space-y-1'>
            <ServiceItem
              name='payment-gateway'
              status='degraded'
              latency='1,402ms'
              interval='5m interval'
            />
            <ServiceItem
              name='auth-service'
              status='healthy'
              latency='12ms'
              interval='1m interval'
              active
            />
            <ServiceItem
              name='user-profile'
              status='healthy'
              latency='24ms'
              interval='5m interval'
            />
            <ServiceItem
              name='search-index'
              status='healthy'
              latency='45ms'
              interval='15m interval'
            />
          </div>
        </div>

        <div className='flex-1 flex flex-col relative min-w-0'>
          <div className='absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[1.5rem_1.5rem]' />

          <div className='p-3 sm:p-4 md:p-6 relative z-10 flex flex-col h-full gap-3 sm:gap-4'>
            <div className='h-28 sm:h-36 md:h-40 border border-white/5 rounded-lg bg-[#0a0a0a]/80 backdrop-blur-sm p-3 sm:p-4 relative overflow-hidden group/graph cursor-crosshair shrink-0'>
              <div className='absolute inset-0 bg-teal-500/5 opacity-0 group-hover/graph:opacity-100 transition-opacity duration-300' />

              <div className='flex justify-between items-center mb-3 sm:mb-4 relative z-10'>
                <div className='flex items-center gap-1.5 sm:gap-2'>
                  <Clock className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40' />
                  <span className='text-[10px] sm:text-[12px] text-white/60 tracking-wider'>
                    GLOBAL LATENCY (P99)
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-1.5 w-1.5 rounded-full bg-red-500 animate-ping absolute right-[3.2rem] sm:right-14' />
                  <span className='text-[10px] sm:text-[13px] text-red-400 font-medium tracking-wide bg-red-500/10 px-1.5 sm:px-2 py-0.5 rounded border border-red-500/20'>
                    Spike Detected
                  </span>
                </div>
              </div>

              <div className='absolute bottom-0 left-0 right-0 h-16 sm:h-20 md:h-24'>
                <svg
                  className='w-full h-full'
                  preserveAspectRatio='none'
                  viewBox='0 0 100 100'
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    d='M0,80 C10,80 20,70 30,75 C40,80 50,20 60,30 C70,40 80,75 90,80 C95,82 98,80 100,80'
                    fill='none'
                    stroke='#10b981'
                    strokeWidth='2'
                    vectorEffect='non-scaling-stroke'
                  />
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    d='M40,80 C50,20 60,30 70,40'
                    fill='none'
                    stroke='#ef4444'
                    strokeWidth='2.5'
                    vectorEffect='non-scaling-stroke'
                  />
                  <path
                    d='M0,80 C10,80 20,70 30,75 C40,80 50,20 60,30 C70,40 80,75 90,80 C95,82 98,80 100,80 L100,100 L0,100 Z'
                    fill='url(#latency-glow)'
                    opacity='0.1'
                    vectorEffect='non-scaling-stroke'
                  />
                  <defs>
                    <linearGradient
                      id='latency-glow'
                      x1='0'
                      y1='0'
                      x2='0'
                      y2='1'
                    >
                      <stop offset='0%' stopColor='#10b981' />
                      <stop offset='100%' stopColor='transparent' />
                    </linearGradient>
                  </defs>
                </svg>

                <div className='absolute top-0 bottom-0 w-px bg-white/20 left-[55%] opacity-0 group-hover/graph:opacity-100 transition-opacity'>
                  <div className='absolute top-3 sm:top-4 -translate-x-1/2 px-2 py-1 bg-white border border-white/10 rounded shadow-xl text-black text-[9px] sm:text-[10px] font-bold whitespace-nowrap z-20'>
                    1,402ms @ 14:02:45
                  </div>
                  <div className='absolute top-[28%] -translate-x-1/2 w-2 h-2 rounded-full border-2 border-red-500 bg-[#0a0a0a]' />
                </div>
              </div>
            </div>

            <div className='flex-1 border border-white/5 rounded-lg bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col overflow-hidden min-h-0'>
              <div className='h-7 sm:h-8 border-b border-white/5 flex items-center px-3 sm:px-4 bg-white/2 shrink-0'>
                <span className='text-[9px] sm:text-[10px] text-white/40 font-semibold tracking-widest uppercase'>
                  Live Trace Stream
                </span>
              </div>
              <div className='flex-1 p-1.5 sm:p-2 overflow-hidden relative min-h-0'>
                <div className='absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-linear-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none' />

                <div className='flex flex-col gap-0.5 sm:gap-1 relative z-0'>
                  {requests.map((req) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='group flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:px-3 py-1 sm:py-1.5 rounded bg-white/2 border border-white/2 hover:bg-white/4 hover:border-white/8 transition-colors cursor-pointer'
                    >
                      <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.5 rounded shrink-0 ${req.method === "GET" ? "bg-blue-500/10 text-blue-400" : req.method === "POST" ? "bg-teal-500/10 text-teal-400" : req.method === "PUT" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}
                        >
                          {req.method}
                        </span>
                        <span className='text-[11px] sm:text-[12px] text-white/70 group-hover:text-white transition-colors truncate'>
                          {req.path}
                        </span>
                      </div>
                      <div className='flex items-center gap-3 sm:gap-4 mt-1 sm:mt-0 shrink-0'>
                        <div className='flex items-center gap-1 sm:gap-1.5'>
                          {req.status >= 400 ? (
                            <AlertCircle className='w-3 h-3 text-red-500' />
                          ) : (
                            <CheckCircle2 className='w-3 h-3 text-teal-500' />
                          )}
                          <span
                            className={`text-[11px] sm:text-[12px] ${req.status >= 400 ? "text-red-400" : "text-teal-400"}`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <span
                          className={`text-[11px] sm:text-[12px] w-10 sm:w-12 text-right ${req.time > 1000 ? "text-red-400" : req.time > 200 ? "text-amber-400" : "text-white/40"}`}
                        >
                          {req.time}ms
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDashboard;
