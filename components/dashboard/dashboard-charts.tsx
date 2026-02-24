"use client";

import { Card, AreaChart, Title, Text, DonutChart, Flex, BadgeDelta, Grid } from "@tremor/react";

const chartdata = [
    { date: "Ene 24", "Llamadas": 2890, "Conversiones": 2338 },
    { date: "Feb 24", "Llamadas": 2756, "Conversiones": 2103 },
    { date: "Mar 24", "Llamadas": 3322, "Conversiones": 2194 },
    { date: "Abr 24", "Llamadas": 3470, "Conversiones": 2108 },
    { date: "May 24", "Llamadas": 3475, "Conversiones": 1812 },
    { date: "Jun 24", "Llamadas": 3129, "Conversiones": 1726 },
];

const sentimentData = [
    { name: "Positivo", value: 65, color: "emerald" },
    { name: "Neutral", value: 25, color: "amber" },
    { name: "Negativo", value: 10, color: "rose" },
];

const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
};

export function DashboardCharts() {
    return (
        <Grid numItemsLg={2} className="gap-6">
            <Card>
                <Title>Volumen de Llamadas vs Conversiones</Title>
                <Text>Visualización mensual del rendimiento operativo</Text>
                <AreaChart
                    className="mt-4 h-72"
                    data={chartdata}
                    index="date"
                    categories={["Llamadas", "Conversiones"]}
                    colors={["blue", "cyan"]}
                    valueFormatter={dataFormatter}
                />
            </Card>

            <Card>
                <Title>Análisis de Sentimiento IA</Title>
                <Text>Distribución emocional basada en transcripciones</Text>
                <Flex className="mt-4">
                    <DonutChart
                        className="h-72"
                        data={sentimentData}
                        category="value"
                        index="name"
                        colors={["emerald", "amber", "rose"]}
                        valueFormatter={dataFormatter}
                    />
                    <div className="space-y-3">
                        {sentimentData.map((item) => (
                            <div key={item.name} className="flex items-center space-x-2">
                                <span className={`h-3 w-3 rounded-full bg-${item.color}-500`} />
                                <Text>{item.name}: {item.value}%</Text>
                            </div>
                        ))}
                    </div>
                </Flex>
            </Card>
        </Grid>
    );
}
