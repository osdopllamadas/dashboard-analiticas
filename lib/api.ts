import { Call } from "@/types";

export function computeStats(calls: Call[]) {
    const totalCalls = calls.length;
    const errorCalls = calls.filter(c => c.endReason === "error" || c.sipDetails?.terminationReason === "error").length;
    const successRate = totalCalls > 0 ? ((totalCalls - errorCalls) / totalCalls * 100).toFixed(1) + "%" : "0%";

    const totalDurationSecs = calls.reduce((acc, c) => {
        const dur = c.duration ? parseInt(c.duration.replace("s", "")) : 0;
        return acc + dur;
    }, 0);

    // Format duration nicely
    const avgDuration = totalCalls > 0 ? Math.round(totalDurationSecs / totalCalls) + "s" : "0s";

    // Cost calculation (mock logic if not provided)
    const totalCost = calls.reduce((acc, c) => acc + (c.cost || 0), 0).toFixed(2);

    return {
        totalCalls,
        errorCalls,
        successRate,
        avgDuration,
        totalCost,
        totalDurationSecs
    };
}
