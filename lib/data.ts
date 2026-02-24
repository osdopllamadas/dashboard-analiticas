import { Call } from "@/types";

export const mockCalls: Call[] = [
    {
        id: "1",
        agent_name: "Juan Pérez",
        customer_phone: "+54 11 1234-5678",
        duration: "5m 45s",
        duration_seconds: 345,
        status: "completed",
        sentiment: "positive",
        created_at: new Date().toISOString(),
        recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        dynamic_vars: { purchase_amount: 1500, city: "Buenos Aires", interest: "Product A" },
        endReason: "completed",
        cost: 0.45
    },
    {
        id: "2",
        agent_name: "María García",
        customer_phone: "+34 600 000 000",
        duration: "2m 0s",
        duration_seconds: 120,
        status: "completed",
        sentiment: "neutral",
        created_at: new Date(Date.now() - 3600000).toISOString(),
        recording_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        dynamic_vars: { city: "Madrid", reason: "Information request" },
        endReason: "completed",
        cost: 0.15
    },
    {
        id: "3",
        agent_name: "Carlos López",
        customer_phone: "+52 55 5555 5555",
        duration: "8m 40s",
        duration_seconds: 520,
        status: "missed",
        sentiment: "negative",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        recording_url: "",
        dynamic_vars: { city: "Mexico City", complaint: "Delay in delivery" },
        endReason: "user-hangup",
        cost: 0.0
    },
    {
        id: "4",
        agent_name: "Ana Martinez",
        customer_phone: "+1 555 0123",
        duration: "1m 15s",
        duration_seconds: 75,
        status: "failed",
        sentiment: "negative",
        created_at: new Date(Date.now() - 120000000).toISOString(),
        dynamic_vars: { error_code: "SIP_503" },
        endReason: "error",
        cost: 0.05
    }
];
