"use client";

import { UltravoxCall, getCallDuration, parseDurationSeconds, getEndReason, getCallerPhone } from "@/types";
import { X, Phone, Clock, DollarSign, Info } from "lucide-react";

interface CallDetailModalProps {
    call: UltravoxCall | null;
    onClose: () => void;
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function DetailRow({ label, value }: { label: string; value?: string | number | null }) {
    if (value === undefined || value === null || value === "") return null;
    return (
        <div className="flex justify-between items-start py-2.5 border-b border-border/50 last:border-0">
            <span className="text-sm text-muted-foreground shrink-0 mr-4">{label}</span>
            <span className="text-sm text-foreground font-medium text-right break-all">{String(value)}</span>
        </div>
    );
}

function StatusBadge({ reason }: { reason?: string }) {
    const isSuccess = reason === "hangup" || reason === "user-hangup" || reason === "agent-hangup";
    const isError = reason === "error" || reason === "failed";

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${isSuccess
                ? "bg-green-500/20 text-green-400"
                : isError
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
        >
            {reason || "Unknown"}
        </span>
    );
}

export function CallDetailModal({ call, onClose }: CallDetailModalProps) {
    if (!call) return null;

    const duration = getCallDuration(call);
    const billedDuration = parseDurationSeconds(call.sipDetails?.billedDuration);
    const reason = getEndReason(call);
    const phone = getCallerPhone(call);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-slide-up"
                style={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <Phone className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Call Details</h2>
                            <p className="text-xs text-muted-foreground font-mono">{call.callId}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 p-6 border-b border-border">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-muted-foreground">Duration</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">{formatDuration(duration)}</p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-muted-foreground">Cost</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">
                            ${call.cost?.toFixed(4) || "0.0000"}
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                            <Info className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-muted-foreground">Status</span>
                        </div>
                        <StatusBadge reason={reason} />
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-1">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Call Information</h3>
                    <DetailRow label="Teléfono" value={phone || undefined} />
                    <DetailRow label="Creado" value={new Date(call.created).toLocaleString("es")} />
                    <DetailRow label="Finalizado" value={call.ended ? new Date(call.ended).toLocaleString("es") : undefined} />
                    <DetailRow label="Duración" value={duration > 0 ? formatDuration(duration) : undefined} />
                    <DetailRow label="Duración facturada" value={billedDuration > 0 ? formatDuration(billedDuration) : undefined} />
                    <DetailRow label="Razón de fin" value={reason || undefined} />
                    <DetailRow label="Modelo" value={call.model} />
                    <DetailRow label="Voz" value={call.voice} />
                    <DetailRow label="Idioma" value={call.languageHint} />
                    <DetailRow label="Primer hablante" value={call.firstSpeaker} />
                    <DetailRow label="Grabación" value={call.recordingEnabled ? "Habilitada" : undefined} />

                    {call.sipDetails && (
                        <>
                            <h3 className="text-sm font-semibold text-foreground mt-5 mb-3 pt-3 border-t border-border">
                                SIP Details
                            </h3>
                            <DetailRow label="From" value={call.sipDetails.from} />
                            <DetailRow label="To" value={call.sipDetails.to} />
                            <DetailRow label="Termination" value={call.sipDetails.terminationReason} />
                        </>
                    )}

                    {(call.shortSummary || call.summary) && (
                        <>
                            <h3 className="text-sm font-semibold text-foreground mt-5 mb-3 pt-3 border-t border-border">
                                Summary
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {call.summary || call.shortSummary}
                            </p>
                        </>
                    )}

                    {call.systemPrompt && (
                        <>
                            <h3 className="text-sm font-semibold text-foreground mt-5 mb-3 pt-3 border-t border-border">
                                System Prompt
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-mono bg-secondary rounded-lg p-3 max-h-32 overflow-y-auto">
                                {call.systemPrompt}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
