'use client';

import dynamic from 'next/dynamic';

// Use Next.js dynamic import with ssr: false to completely skip server-side rendering
// This prevents ANY module resolution during the build phase
const IngaChat = dynamic(
  () => import('./IngaChat').then(mod => ({ default: mod.IngaChat })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex items-center justify-center bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Inga Intelligence...</p>
        </div>
      </div>
    )
  }
);

export function IngaChatWrapper() {
  return <IngaChat />;
}
