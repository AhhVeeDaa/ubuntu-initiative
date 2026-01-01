// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';

type BuyButtonProps = {
    buyButtonId: string;
    publishableKey: string;
};



export const BuyButton = ({ buyButtonId, publishableKey }: BuyButtonProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/buy-button.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isClient) return null;

    return (
        // @ts-ignore
        <stripe-buy-button
            buy-button-id={buyButtonId}
            publishable-key={publishableKey}
        ></stripe-buy-button>
    );
};
