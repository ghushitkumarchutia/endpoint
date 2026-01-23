const steps = [
  {
    num: "01",
    title: "Add your Endpoint",
    desc: "Enter your API URL, method, and expected baseline.",
  },
  {
    num: "02",
    title: "We Watch It",
    desc: "Our engine checks uptime, latency, and schema validity 24/7.",
  },
  {
    num: "03",
    title: "Get Notified",
    desc: "Receive instant alerts with AI analysis when things break.",
  },
];

const HowItWorks = () => {
  return (
    <div className='py-24'>
      <div className='container px-4 mx-auto'>
        <div className='flex flex-col lg:flex-row items-center gap-16'>
          <div className='lg:w-1/2'>
            <h2 className='text-3xl font-bold tracking-tight mb-6'>
              Setup in seconds. <br />
              Save hours of debugging.
            </h2>
            <p className='text-muted-foreground mb-8 text-lg'>
              Stop guessing if your APIs are working. Endpoint gives you a
              single pane of glass for all your external dependencies.
            </p>

            <div className='space-y-8'>
              {steps.map((step) => (
                <div key={step.num} className='flex gap-4'>
                  <div className='text-4xl font-bold text-primary/20'>
                    {step.num}
                  </div>
                  <div>
                    <h4 className='font-semibold text-lg'>{step.title}</h4>
                    <p className='text-muted-foreground'>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='lg:w-1/2 relative'>
            <div className='absolute inset-0 bg-primary/20 blur-[100px] rounded-full' />
            <div className='relative bg-card border border-border rounded-xl p-8 shadow-2xl'>
              <pre className='font-mono text-sm text-green-400'>
                {`{
  "status": "healthy",
  "uptime": "99.9%",
  "latency": "45ms",
  "anomalies": 0,
  "last_check": "Just now"
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
