/**
 * Pricing Page - Bauhaus Industrial Design
 * Modeled after HuggingFace /pricing page
 * Clean pricing cards with feature comparison and enhanced visuals
 */
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { pricingPlans } from '@/lib/data';
import { toast } from 'sonner';
import { useState } from 'react';

const computePricing = [
  { name: 'CPU Basic', specs: '2 vCPU · 4 GB RAM', price: '$0.06/hr', tier: 'basic' },
  { name: 'GPU T4 Small', specs: '4 vCPU · 16 GB RAM · T4', price: '$0.60/hr', tier: 'gpu' },
  { name: 'GPU T4 Medium', specs: '8 vCPU · 32 GB RAM · T4', price: '$1.20/hr', tier: 'gpu' },
  { name: 'GPU A10G Large', specs: '12 vCPU · 48 GB RAM · A10G', price: '$2.50/hr', tier: 'pro' },
  { name: 'GPU A100 Large', specs: '12 vCPU · 142 GB RAM · A100', price: '$4.13/hr', tier: 'pro' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const faqs = [
  { q: 'Can I use SkillsHub for free?', a: 'Yes! The free tier includes unlimited public skills, basic playground access, and community support. Perfect for individuals and open source projects.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and wire transfers for enterprise customers.' },
  { q: 'Can I switch plans at any time?', a: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the difference.' },
  { q: 'Do you offer discounts for education or non-profits?', a: 'Yes, we offer significant discounts for educational institutions, non-profit organizations, and open source projects. Contact our sales team for details.' },
];

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Layout>
      <div className="bg-background">
        {/* Header */}
        <div className="container py-16 lg:py-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.h1 variants={fadeInUp} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">
              Simple, transparent pricing
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </motion.p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="container pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {pricingPlans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                className={`relative rounded-xl border p-6 transition-all duration-200 hover:shadow-lg ${
                  plan.highlighted
                    ? 'border-coral shadow-lg shadow-coral/8 bg-card hover:shadow-xl hover:shadow-coral/12'
                    : 'border-border bg-card hover:border-border/80'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-display font-semibold px-4 py-1 rounded-full shadow-sm shadow-coral/20">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="font-display font-bold text-4xl">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <Button
                  className={`w-full font-display font-semibold mb-6 h-10 ${
                    plan.highlighted
                      ? 'bg-coral hover:bg-coral-dark text-white shadow-sm shadow-coral/15'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                  onClick={() => toast('Feature coming soon', { description: 'Payment integration will be available soon.' })}
                >
                  {plan.cta}
                </Button>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlighted ? 'text-coral' : 'text-teal'}`} />
                      <span className="text-foreground/75">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Compute Pricing */}
        <div className="bg-muted/30 py-16">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center mb-10"
            >
              <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Compute Pricing</h2>
              <p className="text-muted-foreground">Pay-as-you-go pricing for Playground runtimes and Inference endpoints.</p>
            </motion.div>
            <div className="max-w-2xl mx-auto">
              <div className="rounded-xl border border-border overflow-hidden bg-card shadow-sm">
                <div className="grid grid-cols-3 gap-4 p-4 border-b border-border bg-muted/40">
                  <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Instance</span>
                  <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Specs</span>
                  <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider text-right">Price</span>
                </div>
                {computePricing.map((item) => (
                  <div key={item.name} className="grid grid-cols-3 gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap className={`w-3.5 h-3.5 ${item.tier === 'pro' ? 'text-coral' : item.tier === 'gpu' ? 'text-teal' : 'text-muted-foreground'}`} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.specs}</span>
                    <span className="text-sm font-mono font-medium text-right">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="container py-16">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-10">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                className="rounded-xl border border-border bg-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <h3 className="font-display font-semibold text-sm">{faq.q}</h3>
                  <span className={`text-muted-foreground transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 -mt-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-indigo">
          <div className="container text-center">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">Need a custom plan?</h2>
            <p className="text-white/55 text-base mb-6">Contact our sales team for enterprise pricing and custom solutions.</p>
            <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-8 h-11 shadow-lg shadow-coral/25"
              onClick={() => toast('Feature coming soon', { description: 'Sales contact form will be available soon.' })}
            >
              Contact Sales <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
