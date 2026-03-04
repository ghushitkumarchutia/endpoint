import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 99.9, suffix: "%", label: "Uptime Monitoring", decimals: 1 },
  {
    prefix: "<",
    value: 200,
    suffix: "ms",
    label: "Avg Response Time",
    decimals: 0,
  },
  { value: 10, suffix: "M+", label: "API Calls Tracked", decimals: 0 },
  { value: 24, suffix: "/7", label: "Real-time Alerts", decimals: 0 },
];

const useCountUp = (end, decimals, isVisible) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, decimals, isVisible]);

  return count;
};

const StatItem = ({ stat, isVisible, isLast }) => {
  const count = useCountUp(stat.value, stat.decimals, isVisible);

  return (
    <div
      className={`flex-1 text-center py-10 md:py-14 ${!isLast ? "border-r border-white/6" : ""}`}
    >
      <div className='mx-auto w-10 h-[2px] bg-linear-to-r from-teal-500/0 via-teal-400 to-teal-500/0 mb-8' />
      <div className='text-[36px] md:text-[56px] font-bricolage font-bold text-white tracking-tight leading-none mb-3'>
        {stat.prefix || ""}
        {stat.decimals > 0 ? count.toFixed(stat.decimals) : Math.round(count)}
        <span className='text-teal-400'>{stat.suffix}</span>
      </div>
      <p className='text-[13px] md:text-[15px] text-white/40 font-dmsans tracking-wide uppercase'>
        {stat.label}
      </p>
    </div>
  );
};

const Stats = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative bg-black border-t border-white/4 overflow-hidden md:pt-16'
    >
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-teal-500/3 blur-[100px] rounded-full' />
      </div>

      <div className='container mx-auto px-4 md:px-8 max-w-5xl relative z-10'>
        <div className='flex flex-col sm:flex-row'>
          {STATS.map((stat, i) => (
            <StatItem
              key={i}
              stat={stat}
              isVisible={isVisible}
              isLast={i === STATS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
