'use client';

import React, { useState } from 'react';

type DonateButtonProps = {
    priceId: string;
};

export const DonateButton = ({ priceId }: DonateButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="block w-full py-3 px-6 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] text-center font-bold rounded-lg hover:bg-[hsl(var(--accent))]/90 transition-all disabled:opacity-50"
        >
            {isLoading ? 'Processing...' : 'Contribute Now'}
        </button>
    );
};
