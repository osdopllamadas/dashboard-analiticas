"use client";

import { Card, Title, Text, AreaChart, Metric, Flex, BadgeDelta, Grid, Subtitle } from "@tremor/react";
import { TrendingUp, Zap, Target, AlertCircle } from "lucide-react";

const projectionData = [
    { month: "May", Actual: 1800, Proyectado: 1800 },
    { month: "Jun", Actual: 2100, Proyectado: 2100 },
    { month: "Jul", Actual: 1900, Proyectado: 1900 },
    { month: "Ago", Actual: null, Proyectado: 2300 },
    { month: "Sep", Actual: null, Proyectado: 2600 },
    { month: "Oct", Actual: null, Proyectado: 2850 },
];

export function PredictiveAnalytics() {
    return (
        <div className="space-y-6">
            <Grid numItemsLg={3} className="gap-6">
                <Card className="bg-slate-900 border-none shadow-xl">
                    <Flex alignItems="start">
                        <div>
                            <Text className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Crecimiento Proyectado Q4</Text>
                            <Metric className="text-white">+24.5%</Metric>
                        </div>
                        <BadgeDelta deltaType="moderateIncrease" />
                    </Flex>
                    <AreaChart
                        className="mt-4 h-28"
                        data={projectionData.slice(2)}
                        index="month"
                        categories={["Proyectado"]}
                        colors={["emerald"]}
                        showXAxis={false}
                        showYAxis={false}
                        showLegend={false}
                        showGridLines={false}
                    />
                </Card>

                <Card decoration="top" decorationColor="primary">
                    <Title className="flex gap-2 items-center">
                        <Zap className="h-4 w-4 text-primary fill-primary" />
                        IA Insight: Oportunidad
                    </Title>
                    <Text className="mt-2 text-sm leading-relaxed">
                        Se detecta una correlación del <span className="font-bold text-slate-900 dark:text-white">92%</span> entre el tiempo de respuesta y el cierre de ventas. Reducir 15 seg. el IVR podría aumentar ingresos en <span className="text-emerald-600 font-bold">$12k/mes</span>.
                    </Text>
                </Card>

                <Card decoration="top" decorationColor="rose">
                    <Title className="flex gap-2 items-center">
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                        Riesgo de Churn de Agentes
                    </Title>
                    <Text className="mt-2 text-sm leading-relaxed">
                        La carga de llamadas ha subido un <span className="font-bold text-rose-500">18%</span> sin aumento de staff. Probabilidad de rotación alta en el departamento de Soporte Técnico.
                    </Text>
                </Card>
            </Grid>

            <Card>
                <Title>Proyección de Ventas vs Realidad (Power BI Engine)</Title>
                <Subtitle>Modelo ARIMA basado en 12 meses de datos históricos con confianza del 95%.</Subtitle>
                <AreaChart
                    className="mt-8 h-80"
                    data={projectionData}
                    index="month"
                    categories={["Actual", "Proyectado"]}
                    colors={["blue", "slate"]}
                    valueFormatter={(number: number) => `$${Intl.NumberFormat("us").format(number).toString()}`}
                    connectNulls={true}
                />
            </Card>
        </div>
    );
}
