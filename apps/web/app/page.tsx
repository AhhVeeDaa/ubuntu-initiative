import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/ui/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />

        {/* Mission Section */}
        <section className="py-20 bg-[hsl(var(--secondary))]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">Why This Matters Now</h2>
              <p className="max-w-2xl mx-auto text-gray-400">
                The AI infrastructure being built today determines who controls intelligence for the next 50 years.
                Without sovereign compute, Africa's data flows out, gets processed abroad, and comes back as foreign products.
                We're building it differently. Transparently. From day one.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="prose prose-invert">
                <h3 className="text-2xl font-semibold text-[hsl(var(--accent))]">Why Inga Falls?</h3>
                <p className="text-gray-300">
                  The Inga Falls on the Congo River represents the world's largest untapped hydropower potential—
                  42,000 MW capacity, twice the size of Three Gorges Dam. This clean, renewable energy can power 
                  Africa's first sovereign AI supercomputer.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2 text-gray-300">
                  <li>100% clean, renewable power</li>
                  <li>Lowest cost electricity globally</li>
                  <li>African energy for African AI</li>
                  <li>60M+ people gaining electricity access</li>
                </ul>
              </div>

              <div className="relative h-64 md:h-80 rounded-xl overflow-hidden glass border border-white/10">
                {/* Placeholder for Inga Dam Graphic */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500 font-mono text-sm">[Inga System Visualization Loading...]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[hsl(var(--primary))]/10 to-[hsl(var(--accent))]/10 border-y border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Mission Control</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Access real-time monitoring of the Inga compute cluster, node status, and system metrics.
            </p>
            <a
              href={process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3001"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border-2 border-[hsl(var(--primary))] text-[hsl(var(--primary))] rounded-lg hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] transition-all font-bold text-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Open Dashboard
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
