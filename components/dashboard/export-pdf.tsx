"use client";

import { useState } from "react";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2, Sparkles } from "lucide-react";

// Styles for PDF
const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#ffffff' },
    header: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
    subtitle: { fontSize: 10, color: '#64748b', marginTop: 5, textTransform: 'uppercase', letterSpacing: 1 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#2563eb' },
    text: { fontSize: 11, color: '#334155', lineHeight: 1.5, marginBottom: 8 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, backgroundColor: '#f8fafc', padding: 15, borderRadius: 5 },
    statBox: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    statLabel: { fontSize: 8, color: '#64748b' },
    footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94a3b8' }
});

// PDF Document Component
const AnalyticsReport = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Reporte de Inteligencia CRM</Text>
                <Text style={styles.subtitle}>Generado por IA Power Engine • {new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Métricas de Rendimiento General</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>1,284</Text>
                        <Text style={styles.statLabel}>Llamadas Totales</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>24.8%</Text>
                        <Text style={styles.statLabel}>Tasa Conversión</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>8.4/10</Text>
                        <Text style={styles.statLabel}>Rating IA</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Análisis de Desempeño por Agente</Text>
                <Text style={styles.text}>1. Juan Pérez: Lidera con un 32% de conversión. IA destaca su manejo de objeciones negativas.</Text>
                <Text style={styles.text}>2. María García: Rendimiento sólido con 28% de conversión. Área de mejora: tiempo promedio de respuesta.</Text>
                <Text style={styles.text}>3. Carlos López: Se mantiene estable en 26%. IA detecta alta satisfacción en sus clientes (4.5/5).</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Proyecciones y Recomendaciones IA</Text>
                <Text style={styles.text}>• Se proyecta un crecimiento del 24.5% para el próximo trimestre basado en la tendencia actual.</Text>
                <Text style={styles.text}>• Recomendación: Implementar capacitación intensiva en el módulo de ventas los días lunes.</Text>
                <Text style={styles.text}>• Alerta: Revisar carga de trabajo del departamento de Soporte para evitar agotamiento.</Text>
            </View>

            <Text style={styles.footer}>Documento confidencial para uso interno de la organización. Propiedad de CRM Call Center Enterprise.</Text>
        </Page>
    </Document>
);

export function ExportPDF() {
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="outline"
                className="bg-white dark:bg-slate-900 border-primary/20 text-primary hover:bg-primary/5 shadow-sm"
                disabled={isGenerating}
                onClick={() => {
                    setIsGenerating(true);
                    setTimeout(() => setIsGenerating(false), 2000);
                }}
            >
                <PDFDownloadLink
                    document={<AnalyticsReport data={{}} />}
                    fileName={`Reporte_IA_Analytics_${new Date().toISOString().split('T')[0]}.pdf`}
                >
                    {({ loading }) => (
                        <div className="flex items-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Preparando PDF...
                                </>
                            ) : (
                                <>
                                    <FileDown className="h-4 w-4" />
                                    Descargar Reporte PDF
                                </>
                            )}
                        </div>
                    )}
                </PDFDownloadLink>
            </Button>

            <Button className="bg-gradient-to-r from-primary to-indigo-600 border-none shadow-lg shadow-primary/20">
                <Sparkles className="mr-2 h-4 w-4" />
                Sugerencias IA Live
            </Button>
        </div>
    );
}
