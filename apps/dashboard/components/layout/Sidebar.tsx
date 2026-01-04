'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, Activity, FileText, Cpu, Mail, Terminal, Home, Bot, Clock, Shield } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Compute Nodes', href: '/nodes', icon: Server },
    { name: 'Energy Grid', href: '/energy', icon: Activity },
    { name: 'Agents', href: '/agents', icon: Bot },
    { name: 'Policy Agent', href: '/agents/policy', icon: Shield },
    { name: 'Approval Queue', href: '/approval', icon: Clock },
    { name: 'Inquiries', href: '/contacts', icon: Mail },
    { name: 'Remote Execute', href: '/terminal', icon: Terminal },
    { name: 'System Logs', href: '/logs', icon: FileText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
            <div className="flex-1 flex flex-col min-h-0 bg-[hsl(var(--card))] border-r border-white/10">
                <div className="flex items-center h-16 flex-shrink-0 px-4 bg-black/20">
                    <Cpu className="h-8 w-8 text-[hsl(var(--primary))]" />
                    <span className="ml-2 text-lg font-bold text-white tracking-wider">UBUNTU<span className="text-[hsl(var(--primary))]">OS</span></span>
                </div>
                <div className="px-3 py-3 border-b border-white/10">
                    <a
                        href={process.env.NEXT_PUBLIC_SITE_URL || "https://ubuntu-initiative-web.vercel.app"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center px-3 py-2 text-sm font-medium rounded-md bg-[hsl(var(--primary))]/20 hover:bg-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] transition-all border border-[hsl(var(--primary))]/30"
                    >
                        <Home className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                        Back to Website
                        <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <nav className="flex-1 px-3 py-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        isActive
                                            ? 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white',
                                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                                    )}
                                >
                                    <item.icon
                                        className={clsx(
                                            isActive ? 'text-[hsl(var(--primary))]' : 'text-gray-500 group-hover:text-gray-300',
                                            'mr-3 flex-shrink-0 h-5 w-5'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="flex-shrink-0 flex border-t border-white/10 p-4">
                    <div className="flex items-center">
                        <div>
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">System Online</p>
                            <p className="text-xs text-gray-500">v0.1.0-alpha</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
