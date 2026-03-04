const STEPS = [
  {
    num: "01",
    title: "Register",
    desc: "Add your API endpoint — URL, method, headers, and check frequency. Set budget limits and SLA targets.",
  },
  {
    num: "02",
    title: "Monitor",
    desc: "Automated checks run every minute. We track response time, detect schema drift, and flag anomalies.",
  },
  {
    num: "03",
    title: "Resolve",
    desc: "Gemini AI diagnoses root causes, predicts failures, and provides actionable insights in seconds.",
  },
];

const HowItWorks = () => {
  return (
    <div id='how-it-works' className='relative bg-black pt-16 md:pt-16 pb-20'>
      <div className='container mx-auto px-4 md:px-8 max-w-6xl relative z-10'>
        <div className='flex flex-col lg:flex-row gap-12 lg:gap-20 items-start'>
          <div className='flex-1 max-w-[480px] shrink-0'>
            <h2 className='text-3xl md:text-[44px] font-dmsans font-medium tracking-tight mb-4 text-white leading-[1.1]'>
              Setup in seconds.
              <br />
              Observe forever.
            </h2>
            <p className='text-[#999] sm:text-lg md:text-[20px] leading-[1.7] font-bricolage-light mb-12 sm:mb-16'>
              Endpoint takes the guesswork out of API monitoring. A single pane
              of glass for every external dependency your application relies on.
            </p>

            <div className='flex flex-col gap-10 sm:gap-12'>
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className='flex gap-3 sm:gap-4 items-baseline'
                >
                  <span className='font-mono text-[18px] font-bold text-teal-500 tracking-wider shrink-0 w-7'>
                    {step.num}
                  </span>
                  <div className='flex flex-col'>
                    <h3 className='text-white text-[18px] sm:text-[20px] font-dmsans font-semibold tracking-tight mb-2 leading-none'>
                      {step.title}
                    </h3>
                    <p className='text-[#888] font-bricolage-light leading-relaxed text-[14px] sm:text-[15px] m-0 max-w-[320px]'>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='flex-1 w-full max-w-[560px] lg:sticky lg:top-32 mt-1.5'>
            <div className='relative rounded-2xl border border-[#222] bg-[#111] shadow-2xl overflow-hidden'>
              <div className='bg-[#161616] border-b border-[#222] h-12 sm:h-14 flex items-center px-5 sm:px-6 justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='h-2.5 w-2.5 rounded-full bg-teal-500' />
                  <span className='font-mono text-[11px] sm:text-[12px] text-[#bbb] tracking-wider'>
                    api.stripe.com/v1/charges
                  </span>
                </div>
                <div className='font-mono text-[10px] sm:text-[11px] text-teal-400 bg-teal-500/15 px-2 sm:px-2.5 py-1 rounded font-bold tracking-widest leading-none border border-teal-500/20'>
                  200 OK
                </div>
              </div>

              <div className='px-5 sm:px-7 py-6 sm:py-8 bg-[#111] overflow-x-auto'>
                <pre className='font-mono text-[12px] sm:text-[13px] leading-[1.9] m-0 whitespace-pre'>
                  <span className='text-[#666]'>{"{"}</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "status"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#98c379]'>{'"healthy"'}</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "uptime"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#d19a66]'>99.99</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "latency"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#d19a66]'>45</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "anomalies"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#d19a66]'>0</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "schema_drift"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#d19a66]'>false</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "cost_per_call"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#d19a66]'>0.004</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "sla_compliant"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#d19a66]'>true</span>
                  <span className='text-[#666]'>,</span>
                  {"\n"}
                  <span className='text-[#e5c07b]'>{'  "last_check"'}</span>
                  <span className='text-[#888]'>: </span>
                  <span className='text-[#98c379]'>
                    {'"2026-02-24T17:15:00Z"'}
                  </span>
                  {"\n"}
                  <span className='text-[#666]'>{"}"}</span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
