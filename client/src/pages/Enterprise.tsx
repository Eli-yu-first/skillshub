/**
 * Enterprise Page - Bauhaus Industrial Design
 * Modeled after HuggingFace /enterprise page
 * Dark hero + feature grid + comparison table
 */
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Shield, Server, ClipboardList, Users, Headphones, Plug,
  Globe, BarChart3, ArrowRight, Check, Building2
} from 'lucide-react';
import { enterpriseFeatures } from '@/lib/data';

const ENTERPRISE_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663384874443/VRQPmB2sPmnMVF5FBa57oy/enterprise-visual-Jiv6goXyjHEKsCcHkujDym.webp';

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-5 h-5" />,
  server: <Server className="w-5 h-5" />,
  clipboard: <ClipboardList className="w-5 h-5" />,
  users: <Users className="w-5 h-5" />,
  headphones: <Headphones className="w-5 h-5" />,
  plug: <Plug className="w-5 h-5" />,
  globe: <Globe className="w-5 h-5" />,
  chart: <BarChart3 className="w-5 h-5" />,
};

const trustedBy = [
  'TechCorp', 'DataFlow Inc', 'AutoScale', 'CloudNine', 'DevForge', 'AI Systems',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const comparisonRows = [
  { feature: 'Public Skills', free: true, pro: true, enterprise: true },
  { feature: 'Private Skills', free: false, pro: true, enterprise: true },
  { feature: 'Playground Hours', free: '2 hrs/day', pro: '8 hrs/day', enterprise: 'Unlimited' },
  { feature: 'Context Storage', free: '5 GB', pro: '50 GB', enterprise: 'Custom' },
  { feature: 'SSO / SAML', free: false, pro: false, enterprise: true },
  { feature: 'Audit Logs', free: false, pro: false, enterprise: true },
  { feature: 'Priority Support', free: false, pro: false, enterprise: true },
  { feature: 'Custom Deployment', free: false, pro: false, enterprise: true },
];

export default function Enterprise() {
  const handleCta = () => {
    toast('Feature coming soon', { description: 'Enterprise contact form will be available soon.' });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-indigo py-20 lg:py-28">
        <img src={ENTERPRISE_IMG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo/80 via-indigo/90 to-indigo" />
        {/* Geometric decorations */}
        <div className="absolute top-16 right-20 w-32 h-32 border border-coral/10 rounded-full hidden lg:block" />
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-teal/5 rotate-45 hidden lg:block" />
        <div className="absolute top-1/3 left-[8%] w-px h-24 bg-gradient-to-b from-transparent via-coral/15 to-transparent hidden lg:block" />

        <div className="container relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/5">
              <Building2 className="w-4 h-4 text-coral" />
              <span className="text-sm text-white/75 font-medium">Enterprise Solutions</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-6 max-w-3xl mx-auto leading-tight">
              The most advanced platform for
              <br />
              <span className="text-coral">enterprise AI skills</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/55 text-lg max-w-xl mx-auto mb-8">
              Give your team enterprise-grade security, access controls, and dedicated support to build and deploy AI skills at scale.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-8 h-12 shadow-lg shadow-coral/25" onClick={handleCta}>
                Contact Sales
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 font-display font-semibold px-8 h-12">
                  View Documentation
                </Button>
              </Link>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-white/35 text-sm mt-4">Starting at $20/user/month</motion.p>
          </motion.div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-b border-border">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-6">Trusted by leading organizations</p>
          <div className="flex flex-wrap justify-center gap-8">
            {trustedBy.map((name) => (
              <div key={name} className="flex items-center gap-2 text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-display font-bold text-xs text-foreground/40">
                  {name.charAt(0)}
                </div>
                <span className="font-display font-semibold text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-3">Enterprise-Grade Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need to manage AI skills at scale.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {enterpriseFeatures.map((feat) => (
              <motion.div
                key={feat.title}
                variants={fadeInUp}
                className="p-5 rounded-xl border border-border bg-card hover:shadow-lg hover:border-coral/15 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-coral/8 text-coral flex items-center justify-center mb-4 group-hover:bg-coral group-hover:text-white transition-all duration-200">
                  {iconMap[feat.icon]}
                </div>
                <h3 className="font-display font-semibold text-sm mb-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-10">Plan Comparison</h2>
          <div className="max-w-3xl mx-auto rounded-xl border border-border overflow-hidden bg-card shadow-sm">
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-border bg-muted/40">
              <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Feature</span>
              <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider text-center">Free</span>
              <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider text-center">Pro</span>
              <span className="text-xs font-display font-semibold text-coral uppercase tracking-wider text-center">Enterprise</span>
            </div>
            {comparisonRows.map((row) => (
              <div key={row.feature} className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/15 transition-colors">
                <span className="text-sm font-medium">{row.feature}</span>
                {[row.free, row.pro, row.enterprise].map((val, i) => (
                  <div key={i} className="flex justify-center">
                    {typeof val === 'boolean' ? (
                      val ? <Check className="w-4 h-4 text-teal" /> : <span className="text-muted-foreground/25">—</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo relative overflow-hidden">
        <div className="absolute top-8 left-12 w-24 h-24 border border-coral/8 rounded-full" />
        <div className="absolute bottom-8 right-12 w-16 h-16 border border-teal/8 rounded-full" />
        <div className="container text-center relative z-10">
          <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to get started?</h2>
          <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
            Talk to our sales team to find the right plan for your organization.
          </p>
          <Button size="lg" className="bg-coral hover:bg-coral-dark text-white font-display font-semibold px-8 h-12 shadow-lg shadow-coral/25" onClick={handleCta}>
            Contact Sales
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
}
