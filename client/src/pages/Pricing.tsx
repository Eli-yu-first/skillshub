import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { formatNumber } from '@/lib/data';
import { toast } from 'sonner';

const Tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for exploring skills and light usage.',
    features: [
      '1,000 Free Credits/month',
      'Access to public skills',
      'Basic community support',
      'Standard API rate limits',
    ],
    icon: <Zap className="w-6 h-6 text-blue-500" />,
    buttonText: 'Current Plan',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$15',
    period: '/mo',
    description: 'For professionals building out reliable AI workflows.',
    features: [
      '100,000 Credits/month included',
      'Priority access to premium skills',
      'Dedicated email support',
      'Higher rate limits & fast-lane inference',
      'Version history access',
    ],
    icon: <Sparkles className="w-6 h-6 text-purple-500" />,
    buttonText: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Unlimited scale for teams and organizations.',
    features: [
      'Custom Token Volumes',
      'Private Skill hosting',
      'SSO & Advanced Security',
      '24/7 Dedicated SLA support',
      'Custom Rate Limit configurations',
    ],
    icon: <Building2 className="w-6 h-6 text-emerald-500" />,
    buttonText: 'Contact Sales',
    popular: false,
  }
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { data: billing } = trpc.billing.info.useQuery(undefined, { enabled: isAuthenticated });
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] pb-24 overflow-hidden relative">
      {/* Background aesthetics */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 via-primary/5 to-transparent -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] -z-10 opacity-50" />
      <div className="absolute top-[10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] -z-10 opacity-50" />

      <div className="container px-4 pt-20 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-medium tracking-tight lg:text-6xl"
          >
            Simple pricing, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">infinite power.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground/80"
          >
            Pay only for what you use, or unlock massive savings with our Pro subscriptions. Accelerate your AI integration today.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mt-8 pt-4"
          >
            <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 rounded-full bg-muted/60 border border-border/80 transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <motion.div 
                className="absolute top-1 left-1 w-6 h-6 rounded-full bg-primary shadow-sm"
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annually <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-600 uppercase tracking-wider">Save 20%</span>
            </span>
          </motion.div>

          {/* Current Credits Badge */}
          {isAuthenticated && billing && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex mt-8"
            >
              <div className="px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Your Balance:</span>
                <span className="text-sm font-bold font-mono text-primary">{formatNumber(billing.user.credits)} Credits</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {Tiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl bg-card border ${tier.popular ? 'border-primary shadow-xl shadow-primary/5' : 'border-border/60 shadow-sm'} transition-all duration-300 hover:shadow-lg`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-3 rounded-full shadow-md">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                {tier.icon}
                <h3 className="text-2xl font-display font-medium mt-4">{tier.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{tier.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold">
                    {tier.price !== 'Custom' && isAnnual ? `$${Math.floor(parseInt(tier.price.replace('$', '')) * 0.8)}` : tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground text-sm font-medium">{tier.period}</span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button 
                variant={tier.popular ? 'default' : 'outline'} 
                className={`w-full h-12 rounded-xl text-sm font-semibold transition-all shadow-sm ${tier.popular ? 'hover:shadow-md hover:-translate-y-0.5' : ''}`}
                onClick={() => toast.info('Billing portal integration pending...')}
              >
                {tier.buttonText}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
