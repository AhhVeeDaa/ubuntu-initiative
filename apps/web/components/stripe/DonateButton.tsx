'use client';

import React, { useState } from 'react';

type DonateButtonProps = {
    priceId?: string;
    amount?: number;
    label?: string;
};

export const DonateButton = ({ priceId, amount, label }: DonateButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [showEmailInput, setShowEmailInput] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Determine what to send - priceId or custom amount
            const payload: Record<string, any> = {};

            if (priceId) {
                payload.priceId = priceId;
            } else if (customAmount) {
                const parsedAmount = parseFloat(customAmount);
                if (isNaN(parsedAmount) || parsedAmount < 1) {
                    throw new Error('Please enter a valid amount (minimum $1)');
                }
                payload.amount = parsedAmount;
                payload.label = label || 'Ubuntu Initiative Contribution';
            } else if (amount) {
                payload.amount = amount;
                payload.label = label;
            } else {
                throw new Error('Please enter a donation amount');
            }

            // Include email if provided (helps with test mode)
            if (email) {
                payload.email = email;
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Checkout failed. Please try again.');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received from server');
            }
        } catch (error: any) {
            console.error('Checkout failed:', error);
            setError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            {/* Custom Amount Input - shown when no priceId is provided */}
            {!priceId && !amount && (
                <div className="space-y-3">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] transition-all"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Optional email for better checkout experience */}
                    {showEmailInput && (
                        <input
                            type="email"
                            placeholder="Email (optional, helps prevent errors)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] transition-all"
                            disabled={isLoading}
                        />
                    )}

                    {!showEmailInput && (
                        <button
                            type="button"
                            onClick={() => setShowEmailInput(true)}
                            className="text-xs text-gray-400 hover:text-[hsl(var(--accent))] transition-colors"
                        >
                            + Add email for receipt
                        </button>
                    )}
                </div>
            )}

            {/* Email input for fixed price donations too */}
            {(priceId || amount) && (
                <div className="space-y-2">
                    {showEmailInput && (
                        <input
                            type="email"
                            placeholder="Email (optional, for receipt)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))] transition-all"
                            disabled={isLoading}
                        />
                    )}

                    {!showEmailInput && (
                        <button
                            type="button"
                            onClick={() => setShowEmailInput(true)}
                            className="text-xs text-gray-400 hover:text-[hsl(var(--accent))] transition-colors"
                        >
                            + Add email for receipt
                        </button>
                    )}
                </div>
            )}

            <button
                onClick={handleCheckout}
                disabled={isLoading || (!priceId && !amount && !customAmount)}
                className="block w-full py-3 px-6 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-center font-bold rounded-lg hover:bg-[hsl(var(--accent))]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </span>
                ) : (
                    priceId ? 'Contribute Now' : `Donate${customAmount ? ` $${customAmount}` : ''}`
                )}
            </button>

            {error && (
                <p className="text-sm text-red-400 text-center bg-red-500/10 py-2 px-3 rounded">
                    {error}
                </p>
            )}
        </div>
    );
};
