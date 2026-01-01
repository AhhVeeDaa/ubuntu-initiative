import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProgressTracker } from '@/components/progress/ProgressTracker';
import { ActivityFeed } from '@/components/progress/ActivityFeed';

export default function ProgressPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Header */}
        <section className="pt-32 pb-12 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--secondary))]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
              Phase 0 Progress
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl">
              Track every milestone of the Ubuntu Initiative in real-time. 
              From legal formation to partnership development, everything is transparent.
            </p>
          </div>
        </section>

        {/* Progress Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Progress Tracker */}
              <div className="lg:col-span-2">
                <ProgressTracker />
              </div>

              {/* Activity Feed Sidebar */}
              <div>
                <ActivityFeed />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
