import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What types of APIs can I monitor?",
    a: "Endpoint supports any HTTP-based API — REST, GraphQL, or webhooks. Simply provide the URL, method, headers, and we handle the rest. You can monitor public and authenticated endpoints alike.",
  },
  {
    q: "How does AI-powered diagnostics work?",
    a: "When a failure is detected, Gemini AI analyzes the response payload, status codes, and historical patterns to diagnose the root cause. It translates technical stack traces into plain English so you can act immediately.",
  },
  {
    q: "Is Endpoint free to use?",
    a: "Yes — Endpoint is completely free during our general availability period. All features, including AI diagnostics, schema drift detection, and cost tracking, are available at no cost.",
  },
  {
    q: "How often are endpoints checked?",
    a: "Automated health checks run every 60 seconds by default. You can configure custom check frequencies per endpoint based on how critical the API is to your infrastructure.",
  },
  {
    q: "Can I set custom alert thresholds?",
    a: "Absolutely. You can define thresholds for response time, error rates, cost limits, and SLA targets. When a threshold is breached, you receive instant alerts with AI-generated context.",
  },
];

const FAQItem = ({ faq, isOpen, onToggle }) => (
  <div className='border-b border-white/6 last:border-b-0'>
    <button
      onClick={onToggle}
      className='w-full flex items-center justify-between py-5 md:py-6 text-left cursor-pointer group'
    >
      <span className='text-[15px] md:text-[17px] font-dmsans text-[#ccc] group-hover:text-white transition-colors pr-4'>
        {faq.q}
      </span>
      <ChevronDown
        className={`w-4 h-4 text-white/30 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
    <div
      className='grid transition-[grid-template-rows] duration-300 ease-out'
      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
    >
      <div className='overflow-hidden'>
        <p className='text-[14px] md:text-[15px] text-[#888] font-dmsans-light leading-relaxed pb-5 md:pb-6 pr-8'>
          {faq.a}
        </p>
      </div>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id='faq'
      className='relative bg-black border-t border-white/4 py-20 md:py-28'
    >
      <div className='container mx-auto px-4 md:px-8 max-w-5xl'>
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-20'>
          <div className='lg:w-[340px] shrink-0'>
            <h2 className='text-[28px] md:text-[40px] font-bricolage font-bold text-white leading-tight mb-4'>
              Frequently asked <span className='text-teal-400'>questions</span>
            </h2>
            <p className='text-[15px] text-white/40 font-dmsans-light leading-relaxed'>
              Everything you need to know about monitoring your APIs with
              Endpoint. Can&apos;t find what you&apos;re looking for? Reach out
              to our team.
            </p>
          </div>

          <div className='flex-1 min-w-0'>
            {FAQS.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
