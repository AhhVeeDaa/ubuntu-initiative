'use client';

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

// Typed shape for contacts table rows
type ContactRow = {
    name: string;
    email: string;
    organization?: string;
    organization_type?: string;
    deployment_timeline?: string;
    energy_availability?: string;
    licensing_interest?: string;
    message: string;
};

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<ContactRow>({
        name: '',
        email: '',
        organization: '',
        organization_type: '',
        deployment_timeline: '',
        energy_availability: '',
        licensing_interest: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await (supabase as any)
                .from('contacts')
                .insert([formData]);

            if (error) throw error;
            setSuccess(true);
            setFormData({ 
                name: '', 
                email: '', 
                organization: '', 
                organization_type: '',
                deployment_timeline: '',
                energy_availability: '',
                licensing_interest: '',
                message: '' 
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-white mb-4">Contact for Licensing</h1>
                            <p className="text-gray-400">
                                Interested in licensing Ubuntu's AI orchestration platform?
                                Reach out to discuss partnership opportunities.
                            </p>
                        </div>

                        {success ? (
                            <div className="glass-card p-8 text-center animate-fade-in">
                                <div className="flex justify-center mb-4">
                                    <CheckCircle className="h-16 w-16 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                                <p className="text-gray-400 mb-6">
                                    Thank you for contacting us. We will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setSuccess(false)}
                                    className="text-[hsl(var(--primary))] hover:text-white font-medium"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 glass-card p-8">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="organization" className="block text-sm font-medium text-gray-300">Organization (Optional)</label>
                                    <input
                                        type="text"
                                        name="organization"
                                        id="organization"
                                        value={formData.organization}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="organization_type" className="block text-sm font-medium text-gray-300">Organization Type</label>
                                        <select
                                            name="organization_type"
                                            id="organization_type"
                                            required
                                            value={formData.organization_type}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                        >
                                            <option value="">Select type</option>
                                            <option value="hyperscaler">Hyperscaler</option>
                                            <option value="sovereign">Sovereign</option>
                                            <option value="industrial_ai">Industrial AI</option>
                                            <option value="infrastructure_partner">Infrastructure Partner</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="deployment_timeline" className="block text-sm font-medium text-gray-300">Deployment Timeline</label>
                                        <select
                                            name="deployment_timeline"
                                            id="deployment_timeline"
                                            required
                                            value={formData.deployment_timeline}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                        >
                                            <option value="">Select timeline</option>
                                            <option value="q1_2026">Q1 2026</option>
                                            <option value="q2_q4_2026">Q2-Q4 2026</option>
                                            <option value="2027_plus">2027+</option>
                                            <option value="exploratory">Exploratory</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="energy_availability" className="block text-sm font-medium text-gray-300">Energy Availability</label>
                                        <select
                                            name="energy_availability"
                                            id="energy_availability"
                                            required
                                            value={formData.energy_availability}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                        >
                                            <option value="">Select availability</option>
                                            <option value="yes_specify_mw">Yes - Specify MW in message</option>
                                            <option value="no_seeking_partners">No - Seeking Partners</option>
                                            <option value="tbd">TBD</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="licensing_interest" className="block text-sm font-medium text-gray-300">Licensing Interest</label>
                                        <select
                                            name="licensing_interest"
                                            id="licensing_interest"
                                            required
                                            value={formData.licensing_interest}
                                            onChange={handleChange}
                                            className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                        >
                                            <option value="">Select interest</option>
                                            <option value="exclusive">Exclusive</option>
                                            <option value="non_exclusive">Non-Exclusive</option>
                                            <option value="joint_venture">Joint Venture</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-white/10 bg-black/20 text-white px-3 py-2 focus:border-[hsl(var(--primary))] focus:ring-1 focus:ring-[hsl(var(--primary))] focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-bold text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Sending...' : (
                                        <>
                                            Send Message
                                            <Send className="ml-2 h-4 w-4" />
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
