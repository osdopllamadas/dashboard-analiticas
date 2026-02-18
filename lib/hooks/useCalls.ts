import { useState, useEffect, useCallback, useRef } from 'react';
import { UltravoxCall } from '@/types';
import { fetchAllCalls, forceRefreshCalls } from '../api';

interface UseCallsReturn {
    calls: UltravoxCall[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    secondsUntilRefresh: number;
    refresh: () => void;
}

const REFRESH_INTERVAL = 180; // seconds

export function useCalls(): UseCallsReturn {
    const [calls, setCalls] = useState<UltravoxCall[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(REFRESH_INTERVAL);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownRef = useRef<NodeJS.Timeout | null>(null);

    const resetCountdown = useCallback(() => {
        setSecondsUntilRefresh(REFRESH_INTERVAL);
    }, []);

    const loadData = useCallback(async (force = false) => {
        try {
            setLoading(true);
            setError(null);
            const data = force ? await forceRefreshCalls() : await fetchAllCalls();
            setCalls(data);
            setLastUpdated(new Date());
            resetCountdown();
        } catch (err) {
            setError('Error al cargar datos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [resetCountdown]);

    // Initial load + auto-refresh every 3 minutes
    useEffect(() => {
        loadData(false);

        refreshTimerRef.current = setInterval(() => {
            loadData(false); // uses server cache, very fast
        }, REFRESH_INTERVAL * 1000);

        return () => {
            if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
        };
    }, [loadData]);

    // Countdown timer
    useEffect(() => {
        countdownRef.current = setInterval(() => {
            setSecondsUntilRefresh((s) => (s <= 1 ? REFRESH_INTERVAL : s - 1));
        }, 1000);
        return () => {
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    const refresh = useCallback(() => {
        // Force bypass server cache and re-fetch from Ultravox
        loadData(true);
        // Reset the auto-refresh timer
        if (refreshTimerRef.current) {
            clearInterval(refreshTimerRef.current);
            refreshTimerRef.current = setInterval(() => {
                loadData(false);
            }, REFRESH_INTERVAL * 1000);
        }
    }, [loadData]);

    return { calls, loading, error, lastUpdated, secondsUntilRefresh, refresh };
}
