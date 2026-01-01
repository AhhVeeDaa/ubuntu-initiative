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
                                UBUNTU<span className="text-[hsl(var(--primary))]">INITIATIVE</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm max-w-md">
                            Building the technical infrastructure for Africa's first sovereign AI supercomputer,
                            powered by the Inga hydropower dam.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Project</h3>
                        <ul className="space-y-2">
                            <li><Link href="/vision" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Blueprint</Link></li>
                            <li><Link href="/support" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Support Us</Link></li>
                            <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Github</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Transparency</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-[hsl(var(--primary))] text-sm">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} Ubuntu Initiative. Open Source Infrastructure.
                    </p>
                    <p className="text-gray-600 text-xs mt-2 md:mt-0 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Systems Operational
                    </p>
                </div>
            </div>
        </footer>
    );
}
