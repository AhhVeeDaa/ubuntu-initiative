// @ts-nocheck
'use client';

import React, { useEffect, useState } from 'react';

type PricingTableProps = {
    pricingTableId: string;
    publishableKey: string;
};



export const PricingTable = ({ pricingTableId, publishableKey }: PricingTableProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/pricing-table.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    if (!isClient) return null;

    return (
        // @ts-ignore
        <stripe-pricing-table
            pricing-table-id={pricingTableId}
            publishable-key={publishableKey}
        ></stripe-pricing-table>
    );
};
