export interface UltravoxCall {
    [x: string]: any;
    callId: string;
    created: string;
    ended?: string;
    endReason?: string;           // top-level per API docs e.g. "unjoined"
    billedDuration?: string;      // top-level string e.g. "102s"
    billedSideInputTokens?: number;
    billedSideOutputTokens?: number;
    billingStatus?: string;       // e.g. "BILLING_STATUS_PENDING"
    // NOTE: 'duration' is NOT in the API — compute from created/ended
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    voice?: string;
    transcriptOptional?: boolean;
    shortSummary?: string;
    summary?: string;
    joinUrl?: string;
    agentId?: string;
    agent?: { agentId: string; name: string };
    sipDetails?: {
        billedDuration?: string;    // also in sipDetails e.g. "102s"
        terminationReason?: string | null;
        from?: string;
        to?: string;
        callId?: string;
    };
    metadata?: Record<string, string>;
    requestContext?: Record<string, unknown>;
    medium?: {
        serverWebSocket?: {
            inputSampleRate?: number;
            outputSampleRate?: number;
        };
        twilio?: {
            from?: string;
            to?: string;
        };
    };
    maxDuration?: string;
    recordingEnabled?: boolean;
    firstSpeaker?: string;
    languageHint?: string;
    initialOutputMedium?: string;
}

export interface UltravoxResponse {
    next: string | null;
    previous: string | null;
    count?: number;
    results: UltravoxCall[];
}

export interface DashboardStats {
    totalCalls: number;
    effectiveCalls: number;
    errorCalls: number;
    avgDuration: number;
    totalDurationSeconds: number;
    totalBilledSeconds: number;
    totalCost: number;
    successRate: number;
}

export type DatePreset = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all';

export interface FilterState {
    startDate: string;
    endDate: string;
    minDuration: string;
    endReason: string;
    searchTerm: string;
    phoneNumber: string;
    preset: DatePreset | '';
}

export type ModuleId = "dashboard" | "calls" | "analytics" | "realtime" | "minutes" | "ai";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Parse "102s" → 102, "1m30s" → 90, or plain number string → number */
export function parseDurationSeconds(val?: string | null): number {
    if (!val) return 0;
    // Already a plain number
    if (/^\d+$/.test(val)) return parseInt(val, 10);
    // "Xs" format
    const sMatch = val.match(/^(\d+(?:\.\d+)?)s$/);
    if (sMatch) return Math.round(parseFloat(sMatch[1]));
    // "Xm Ys" or "XmYs" format
    const msMatch = val.match(/(?:(\d+)m)?(?:(\d+(?:\.\d+)?)s)?/);
    if (msMatch) {
        const m = parseInt(msMatch[1] || "0", 10);
        const s = parseFloat(msMatch[2] || "0");
        return m * 60 + Math.round(s);
    }
    return 0;
}

/** Compute call duration in seconds from created/ended timestamps */
export function getCallDuration(call: UltravoxCall): number {
    if (!call.ended || !call.created) return 0;
    const diff = new Date(call.ended).getTime() - new Date(call.created).getTime();
    return Math.max(0, Math.round(diff / 1000));
}

/** Get phone number from metadata or medium */
export function getCallerPhone(call: UltravoxCall): string {
    return (
        call.metadata?.["ultravox.sip.caller_id"] ||
        call.metadata?.["ultravox.sip.from_display_name"] ||
        call.medium?.twilio?.from ||
        call.sipDetails?.from ||
        ""
    );
}

/** Get end reason — checks top-level endReason first, then sipDetails.terminationReason */
export function getEndReason(call: UltravoxCall): string {
    return call.endReason || call.sipDetails?.terminationReason || "";
}
