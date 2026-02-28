import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.VAPI_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: "VAPI_API_KEY no configurada" }, { status: 500 });
    }

    try {
        // Fetch calls from Vapi - last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const params = new URLSearchParams({
            limit: "1000",
            createdAtGt: startDate.toISOString(),
            createdAtLt: endDate.toISOString(),
        });

        const response = await fetch(`https://api.vapi.ai/call?${params}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            next: { revalidate: 300 }, // Cache 5 min
        });

        if (!response.ok) {
            throw new Error(`Error Vapi API: ${response.status}`);
        }

        const calls = await response.json();
        const callList = Array.isArray(calls) ? calls : (calls.results || []);

        // Aggregate by day
        const dayMap: Record<string, { totalMinutes: number; billedMinutes: number; totalCalls: number }> = {};

        callList.forEach((call: any) => {
            const date = call.createdAt?.split("T")[0];
            if (!date) return;

            if (!dayMap[date]) {
                dayMap[date] = { totalMinutes: 0, billedMinutes: 0, totalCalls: 0 };
            }

            const durationSecs = call.endedAt && call.startedAt
                ? (new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000
                : 0;

            const totalMin = Math.round(durationSecs / 60 * 10) / 10;
            const billedMin = call.billingData?.minutes || totalMin;

            dayMap[date].totalMinutes += totalMin;
            dayMap[date].billedMinutes += billedMin;
            dayMap[date].totalCalls += 1;
        });

        // Sort by date
        const days = Object.entries(dayMap)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, data]) => ({ date, ...data }));

        // End reasons
        const reasonMap: Record<string, number> = {};
        callList.forEach((call: any) => {
            const reason = call.endedReason || call.hangupReason || "unknown";
            reasonMap[reason] = (reasonMap[reason] || 0) + 1;
        });

        const total = callList.length || 1;
        const endReasons = Object.entries(reasonMap)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([reason, count]) => ({
                reason,
                count,
                pct: Math.round((count / total) * 100),
            }));

        // Totals
        const totalMin = Math.round(days.reduce((s, d) => s + d.totalMinutes, 0));
        const billedMin = Math.round(days.reduce((s, d) => s + d.billedMinutes, 0));
        const cost = callList.reduce((s: number, c: any) => s + (c.cost || 0), 0);

        return NextResponse.json({
            days,
            endReasons,
            totals: {
                totalMin,
                billedMin,
                cost: parseFloat(cost.toFixed(2)),
                calls: callList.length,
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
