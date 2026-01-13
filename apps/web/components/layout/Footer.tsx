import Link from 'next/link';
import { Cpu } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[hsl(var(--background))] border-t border-white/10 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <Cpu className="h-6 w-6 text-[hsl(var(--primary))]" />
                            <span className="font-bold text-lg text-white">
                                UBUNTU<span className="text-[hsl(var(--primary))]">HUB</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-md mb-3">
                            Sovereign AI orchestration and governance platform.{' '}
                            <Link href="/vision" className="text-[hsl(var(--primary))] hover:underline">
                                Learn about the Initiative
                            </Link>
                        </p>
                        <p className="text-gray-500 text-xs">
                            Platform Status: Operational | Available for Licensing
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li><Link href="/ai-orchestration" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">AI Orchestration</Link></li>
                            <li><Link href="/governance-framework" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Governance Framework</Link></li>
                            <li><Link href="/transparency" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Transparency</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm font-semibold">Contact for Licensing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Institution</h3>
                        <ul className="space-y-2">
                            <li><Link href="/about" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">About</Link></li>
                            <li><Link href="/vision" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Initiative</Link></li>
                            <li><Link href="/philosophy" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Philosophy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-xs">
                            © {new Date().getFullYear()} Ubuntu. Sovereign AI orchestration platform.{' '}
                            <Link href="/contact" className="text-[hsl(var(--primary))] hover:underline">
                                Contact for Licensing
                            </Link>
                        </p>
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600 text-xs flex items-center">
                                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                Platform Operational
                            </p>
                            <p className="text-gray-600 text-xs hidden md:block">•</p>
                            <p className="text-gray-600 text-xs">Licensing Active</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}