import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/ui/HeroSection';
import { IngaChatWrapper } from '@/components/ai/IngaChatWrapper';
import { ImpactDonation } from '@/components/stripe/ImpactDonation';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />

        {/* Campaign / Funding Section - High Visibility */}
        <div id="contribute" className="border-b border-white/10 bg-black/40">
          <ImpactDonation />
        </div>

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
                {/* DRC Map and Inga Dam Images */}
                <div className="grid grid-cols-2 gap-2 h-full p-2">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src="/drc-map.png"
                      alt="DRC map showing Inga Dam site location on Congo River"
                      className="w-full h-full object-contain bg-white"
                    />
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src="/inga-dam.jpg"
                      alt="Aerial view of Inga hydropower station on the Congo River"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Human Impact Section */}
        <section className="py-20 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--secondary))]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-96 rounded-xl overflow-hidden group">
                <img
                  src="/drc-children.jpg"
                  alt="Children in DRC who will benefit from the Ubuntu Initiative's electricity access"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white text-sm font-medium">DRC Communities | Future Beneficiaries</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Powering <span className="text-gradient">60 Million Lives</span>
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                  The Ubuntu Initiative isn't just about computing power—it's about transforming communities.
                  The Inga hydropower development will bring reliable electricity to over 60 million people
                  across the Democratic Republic of Congo and neighboring nations.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-6">
                    <div className="text-4xl font-bold text-[hsl(var(--primary))] mb-2">60M+</div>
                    <div className="text-gray-400 text-sm">People Gaining Access</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="text-4xl font-bold text-[hsl(var(--accent))] mb-2">100%</div>
                    <div className="text-gray-400 text-sm">Clean Energy</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="text-4xl font-bold text-purple-400 mb-2">42 GW</div>
                    <div className="text-gray-400 text-sm">Total Capacity</div>
                  </div>
                  <div className="glass-card p-6">
                    <div className="text-4xl font-bold text-green-400 mb-2">Zero</div>
                    <div className="text-gray-400 text-sm">Carbon Emissions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Control CTA */}
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

        {/* AI Assistant Section */}
        <section className="py-24 bg-black/40 relative overflow-hidden">
          {/* Decorative background element for the AI section */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[hsl(var(--primary))]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ask Inga Intelligence</h2>
              <p className="text-gray-400">Our sovereign AI agent is ready to answer your questions about the initiative.</p>
            </div>

            <div className="mx-auto">
              <IngaChatWrapper />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
