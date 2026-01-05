'use client';

import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, AlertCircle, Loader2, Link as LinkIcon, Send } from 'lucide-react';

export default function MilestoneSubmissionPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'technical',
        completion_date: new Date().toISOString().split('T')[0],
        evidence_url: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/agents/milestones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trigger: 'manual_submission',
                    data: formData
                }),
            });

            const result = await res.json();

            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.errors?.[0] || 'Submission failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
                            Submit <span className="text-gradient">Milestone</span>
                        </h1>
                        <p className="text-gray-400">
                            Contribute to the Ubuntu Initiative by submitting evidence of milestone completion.
                            Submissions are validated by the <strong className="text-white">Milestone Ingestion Agent</strong>.
                        </p>
                    </div>

                    <div className="bg-[#0a0f1a] border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-3xl relative overflow-hidden">
                        {success ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-6 animate-glow-breath" style={{ color: '#10b981' }}>
                                    <CheckCircle2 className="h-10 w-10 text-green-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Submission Received</h2>
                                <p className="text-gray-400 mb-8">
                                    The Milestone Agent has queued your submission for validation. You can track progress on the dashboard.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white font-bold hover:bg-white/10 transition-colors"
                                >
                                    Submit Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Milestone Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Deployment of Phase 0 Smart Contracts"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:border-[hsl(var(--primary))]/50 focus:ring-0 transition-colors"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[hsl(var(--primary))]/50 focus:ring-0 transition-colors appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="technical">Technical</option>
                                            <option value="community">Community</option>
                                            <option value="policy">Policy</option>
                                            <option value="funding">Funding</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Completion Date</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[hsl(var(--primary))]/50 focus:ring-0 transition-colors"
                                            value={formData.completion_date}
                                            onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Evidence URL (GitHub/Paper)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
                                        <input
                                            required
                                            type="url"
                                            placeholder="https://github.com/..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-gray-600 focus:border-[hsl(var(--primary))]/50 focus:ring-0 transition-colors"
                                            value={formData.evidence_url}
                                            onChange={(e) => setFormData({ ...formData, evidence_url: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Provide a brief summary of what was achieved..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:border-[hsl(var(--primary))]/50 focus:ring-0 transition-colors resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full py-5 bg-gradient-to-r from-[hsl(var(--primary))] to-cyan-400 text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="h-6 w-6" />
                                            Submit to Agent Network
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
