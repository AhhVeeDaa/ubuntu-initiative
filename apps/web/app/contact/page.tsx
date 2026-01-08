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
    message: string;
};

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<ContactRow>({
        name: '',
        email: '',
        organization: '',
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
            setFormData({ name: '', email: '', organization: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                            <p className="text-gray-400">
                                Interested in partnering with the Ubuntu Initiative?
                                Reach out to our team.
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
