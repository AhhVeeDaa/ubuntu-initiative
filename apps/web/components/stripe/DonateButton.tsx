'use client';

import React, { useState } from 'react';

type DonateButtonProps = {
    priceId: string;
};

export const DonateButton = ({ priceId }: DonateButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Checkout failed');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (error: any) {
            console.error('Checkout failed:', error);
            setError(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="block w-full py-3 px-6 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-center font-bold rounded-lg hover:bg-[hsl(var(--accent))]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                    </span>
                ) : 'Contribute Now'}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-400 text-center bg-red-500/10 py-2 rounded">
                    {error}
                </p>
            )}
        </div>
    );
};
