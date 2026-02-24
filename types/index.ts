export type CallStatus = "completed" | "in-progress" | "failed" | "missed";
export type Sentiment = "positive" | "neutral" | "negative";

export interface Call {
    id: string;
    agent_name?: string;
    customer_phone?: string;
    duration: string; // Display string "12s"
    duration_seconds: number; // Numeric for calcs
    status: CallStatus | string;
    sentiment?: Sentiment;
    created_at: string; // ISO date
    recording_url?: string;
    cost?: number;
    endReason?: string;
    sipDetails?: {
        terminationReason?: string;
    };
    dynamic_vars?: Record<string, any>;
    messages?: Array<{
        role: "user" | "assistant" | "system";
        content: string;
    }>;
}

export type ModuleId = "dashboard" | "calls" | "analytics" | "realtime" | "minutes" | "ai";
