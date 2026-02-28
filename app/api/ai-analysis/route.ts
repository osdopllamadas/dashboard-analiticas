import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { stats, apiKey } = await req.json();

        if (!apiKey) {
            return NextResponse.json({ error: "API Key is required" }, { status: 400 });
        }

        const prompt = `
        You are an expert Data Analyst for a Call Center.
        Analyze the following call center performance stats for the last 30 days and provide a strategic summary.
        
        Data:
        - Total Calls: ${stats.totalCalls}
        - Success Rate: ${stats.successRate}
        - Avg Duration: ${stats.avgDuration}
        - Total Cost: $${stats.totalCost}
        - Error Rate: ${stats.errorRate}
        - Top Hangup Reasons: ${JSON.stringify(stats.topHangupReasons)}

        Please provide:
        1. A brief executive summary (2-3 sentences).
        2. Three key positive trends.
        3. Three areas for improvement (focus on cost and errors).
        4. A specific recommendation to improve the Success Rate.

        Format the output in clean Markdown. Use bolding for numbers and key terms.
        `;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful and professional business intelligence analyst." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.error?.message || "OpenAI API Error" }, { status: response.status });
        }

        const data = await response.json();
        const analysis = data.choices[0]?.message?.content || "No analysis generated.";

        return NextResponse.json({ analysis });

    } catch (error: any) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
