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

    // Navigation items with individual colors
    const navItems = [
        { href: '/', label: 'Home', color: 'illuminate-cyan' },
        { href: '/about', label: 'About', color: 'illuminate-purple' },
        { href: '/vision', label: 'Initiative', color: 'illuminate-emerald' },
        { href: '/agents', label: 'Ubuntu AI', color: 'illuminate-teal' },
        { href: '/support', label: 'Support Us', color: 'illuminate-amber' },
        { href: '/contact', label: 'Contact', color: 'illuminate-rose' },
    ];

    return (
        <nav className="fixed w-full z-50 glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <Cpu className="h-8 w-8 text-[hsl(var(--primary))] group-hover:animate-pulse" />
                            <span className="font-bold text-xl tracking-tight text-white">
                                UBUNTU<span className="text-[hsl(var(--primary))]">HUB</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-6">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-all ${item.color}`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 px-4 py-2 rounded-md text-sm font-bold transition-all illuminate-primary"
                            >
                                Admin Login
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
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-gray-300 block px-3 py-2 rounded-md text-base font-medium ${item.color}`}
                                onClick={toggleMenu}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="text-[hsl(var(--primary))] block px-3 py-2 rounded-md text-base font-medium illuminate-primary"
                            onClick={toggleMenu}
                        >
                            Admin Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
