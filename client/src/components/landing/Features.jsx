import { Zap, ShieldAlert, FileJson, BrainCircuit } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time Monitoring",
    description:
      "Check your endpoints every minute from global locations to ensure 99.9% uptime.",
  },
  {
    icon: BrainCircuit,
    title: "AI-Powered Insights",
    description:
      "Gemini AI analyzes anomalies instantly to tell you WHY your API is slow or failing.",
  },
  {
    icon: FileJson,
    title: "Schema Drift Detection",
    description:
      "Get alerted immediately when an API response structure changes silently without warning.",
  },
  {
    icon: ShieldAlert,
    title: "Smart Altering",
    description:
      "Configurable alerts via Email/Webhook. Avoid alert fatigue with smart thresholds.",
  },
];

const Features = () => {
  return (
    <div className='py-24 bg-muted/30 border-y border-border'>
      <div className='container px-4 mx-auto'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl font-bold tracking-tight mb-4'>
            Everything you need to trust your APIs
          </h2>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Build with confidence knowing Endpoint is watching your back(end).
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((feature, idx) => (
            <div
              key={idx}
              className='p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors'
            >
              <div className='h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4'>
                <feature.icon className='h-6 w-6' />
              </div>
              <h3 className='font-semibold text-lg mb-2'>{feature.title}</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
