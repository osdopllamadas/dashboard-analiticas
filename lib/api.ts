import { UltravoxCall, parseDurationSeconds, getCallDuration, getEndReason } from "@/types";

// Ultravox pricing: $0.05 per minute, billed in 6-second increments ($0.005 per 6s)
const COST_PER_INCREMENT = 0.005;
const INCREMENT_SECONDS = 6;

interface AllCallsResponse {
    results: UltravoxCall[];
    count: number;
    cached: boolean;
    stale?: boolean;
    cachedAt: string;
}

export async function fetchAllCalls(): Promise<UltravoxCall[]> {
    const response = await fetch("/api/calls", { cache: "no-store" });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    const data: AllCallsResponse = await response.json();
    return data.results || [];
}

export async function forceRefreshCalls(): Promise<UltravoxCall[]> {
    const response = await fetch("/api/calls?refresh=1", { cache: "no-store" });
    if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
    const data: AllCallsResponse = await response.json();
    return data.results || [];
}

/** Get billed duration in seconds — checks top-level billedDuration first, then sipDetails */
export function getBilledSeconds(call: UltravoxCall): number {
    return (
        parseDurationSeconds(call.billedDuration) ||
        parseDurationSeconds(call.sipDetails?.billedDuration) ||
        0
    );
}

/** Estimate cost: $0.005 per 6-second increment (rounded up) */
export function getCallCost(call: UltravoxCall): number {
    const billedSec = getBilledSeconds(call);
    if (billedSec > 0) {
        const increments = Math.ceil(billedSec / INCREMENT_SECONDS);
        return increments * COST_PER_INCREMENT;
    }
    return 0;
}

export function computeStats(calls: UltravoxCall[]) {
    const totalCalls = calls.length;

    const effectiveCalls = calls.filter((c) => {
        const dur = getCallDuration(c);
        const reason = getEndReason(c).toLowerCase();
        return dur > 0 && reason !== "error" && reason !== "failed";
    }).length;

    const errorCalls = calls.filter((c) => {
        const reason = getEndReason(c).toLowerCase();
        return reason === "error" || reason === "failed";
    }).length;

    const totalDurationSeconds = calls.reduce((acc, c) => acc + getCallDuration(c), 0);
    const totalBilledSeconds = calls.reduce((acc, c) => acc + getBilledSeconds(c), 0);
    const totalCost = calls.reduce((acc, c) => acc + getCallCost(c), 0);

    const avgDuration = totalCalls > 0 ? Math.round(totalDurationSeconds / totalCalls) : 0;
    const successRate = totalCalls > 0 ? Math.round((effectiveCalls / totalCalls) * 100) : 0;

    return {
        totalCalls,
        effectiveCalls,
        errorCalls,
        totalDurationSeconds,
        totalBilledSeconds,
        totalCost,
        avgDuration,
        successRate,
    };
}
