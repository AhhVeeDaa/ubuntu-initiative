'use client';

import { useState, useEffect, useRef } from 'react';
import { IngaChat } from './IngaChat';
import { Sparkles, X, MessageSquare, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function IngaFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const pathname = usePathname();

    // Auto-open on specific pages if desired, or keep as user-initiated
    // useEffect(() => { ... }, []);

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">

            {/* Chat Window (Popover) */}
            <div
                className={`
                    pointer-events-auto
                    transition-all duration-500 ease-in-out origin-bottom-right
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0 shadow-2xl shadow-purple-900/50'
                        : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
                    }
                    mb-4 w-[90vw] md:w-[450px]
                `}
            >
                {/* Wrap IngaChat with a close handler customization if needed */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    {/* Render the shared IngaChat component */}
                    {/* We might need to adjust height for floating context */}
                    <div className="h-[600px] rounded-2xl overflow-hidden relative border border-[hsl(var(--primary))]/30">
                        <IngaChat />
                    </div>
                </div>
            </div>

            {/* Floating Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    pointer-events-auto
                    group relative flex items-center justify-center
                    h-14 w-14 rounded-full 
                    bg-gradient-to-br from-[hsl(var(--primary))] to-purple-600 
                    text-white shadow-lg shadow-purple-500/40
                    hover:scale-110 hover:shadow-purple-500/60 transition-all duration-300
                    ${isOpen ? 'rotate-90' : 'rotate-0'}
                `}
                aria-label="Ask Inga AI"
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <Sparkles className="h-6 w-6 animate-pulse" />
                )}

                {/* Tooltip / Label */}
                {!isOpen && (
                    <span className={`
                        absolute right-16 bg-white text-black text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap
                        transition-all duration-300 origin-right
                        ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                    `}>
                        Ask Inga
                    </span>
                )}
            </button>
        </div>
    );
}
