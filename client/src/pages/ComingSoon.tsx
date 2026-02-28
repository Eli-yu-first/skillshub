/**
 * Coming Soon placeholder page
 */
import Layout from '@/components/Layout';

export default function ComingSoon() {
  return (
    <Layout>
      <div className="container py-20 text-center">
        <div className="w-16 h-16 bg-coral/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🚧</span>
        </div>
        <h1 className="font-display font-bold text-3xl mb-3">Coming Soon</h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          This feature is currently under development. Stay tuned for updates!
        </p>
      </div>
    </Layout>
  );
}
