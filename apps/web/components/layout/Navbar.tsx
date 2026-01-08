'use client';

import Link from 'next/link';
import { Menu, X, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CompactLanguageSwitcher } from '@/components/language-switcher';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <nav className="fixed w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <Cpu className="h-8 w-8 text-[hsl(var(--primary))]" />
                            <span className="font-bold text-xl tracking-tight text-white">
                                UBUNTU<span className="text-[hsl(var(--primary))]">INITIATIVE</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Home
                            </Link>
                            <Link href="/vision" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Blueprint
                            </Link>
                            <Link href="/philosophy" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Philosophy
                            </Link>
                            <Link href="/blueprint" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Architecture
                            </Link>
                            <Link href="/agents" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Agents
                            </Link>
                            <Link href="/contact" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Contact
                            </Link>
                            <a
                                href="https://ubuntu-initiative-dashboard.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Dashboard
                            </a>
                            <Link href="/support" className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                                Support Us
                            </Link>
                            <div className="ml-2">
                                <CompactLanguageSwitcher />
                            </div>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-2">
                        <CompactLanguageSwitcher />
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden glass border-t-0">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link
                            href="/"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Home
                        </Link>
                        <Link
                            href="/vision"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Blueprint
                        </Link>
                        <Link
                            href="/philosophy"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Philosophy
                        </Link>
                        <Link
                            href="/blueprint"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Architecture
                        </Link>
                        <Link
                            href="/agents"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Agents
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Contact
                        </Link>
                        <a
                            href="https://ubuntu-initiative-dashboard.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Dashboard
                        </a>
                        <Link
                            href="/support"
                            className="text-[hsl(var(--primary))] block px-3 py-2 rounded-md text-base font-medium"
                            onClick={toggleMenu}
                        >
                            Support Us
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
