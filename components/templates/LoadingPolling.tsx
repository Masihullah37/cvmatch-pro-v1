'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoadingPolling() {
    const router = useRouter();

    useEffect(() => {
        // Check every 3 seconds
        const interval = setInterval(() => {
            router.refresh();
        }, 3000);

        return () => clearInterval(interval);
    }, [router]);

    return null; // This component doesn't draw anything, it just manages the timer
}