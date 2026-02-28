"use client";

import { Card, Title, Text, BarChart, Subtitle, TabGroup, TabList, Tab, TabPanels, TabPanel, BadgeDelta, Flex } from "@tremor/react";
import { Users, TrendingUp, Award, Target } from "lucide-react";

const agentPerformance = [
    { name: "Juan Pérez", status: "Excelente", calls: 145, conversion: 32, satisfaction: 4.8 },
    { name: "María García", status: "Bueno", calls: 132, conversion: 28, satisfaction: 4.5 },
    { name: "Carlos López", status: "Excelente", calls: 128, conversion: 30, satisfaction: 4.2 },
    { name: "Ana Martínez", status: "Promedio", calls: 110, conversion: 22, satisfaction: 3.9 },
    { name: "Sonia Ruiz", status: "Bajo", calls: 95, conversion: 15, satisfaction: 3.5 },
];

export function AgentPerformance() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
                    <Flex alignItems="start">
                        <div>
                            <Text>Líder del Mes</Text>
                            <Title>Juan Pérez</Title>
                        </div>
                        <BadgeDelta deltaType="increase" />
                    </Flex>
                    <Flex className="mt-4">
                        <Text>Tasa: 32%</Text>
                        <Text>Score: 4.8/5</Text>
                    </Flex>
                </Card>

                {/* Aditional KPI Summaries here... */}
            </div>

            <Card>
                <Title>Comparativa de Rendimiento por Agente</Title>
                <Subtitle>Métricas clave: Conversión (%) vs Satisfacción del Cliente (1-5)</Subtitle>
                <BarChart
                    className="mt-6 h-80"
                    data={agentPerformance}
                    index="name"
                    categories={["conversion", "satisfaction"]}
                    colors={["blue", "amber"]}
                    valueFormatter={(number) => number.toString()}
                    yAxisWidth={48}
                />
            </Card>

            <Grid numItemsLg={3} className="gap-6 mt-6">
                {agentPerformance.slice(0, 3).map((agent, i) => (
                    <Card key={agent.name} decoration="left" decorationColor={i === 0 ? "emerald" : "blue"}>
                        <div className="flex items-center gap-3 mb-2">
                            <Award className={i === 0 ? "text-emerald-500" : "text-blue-500"} />
                            <Title>{agent.name}</Title>
                        </div>
                        <Text className="italic">"{agent.status}" según análisis de IA</Text>
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span>Eficiencia:</span>
                                <span className="font-bold">{90 - (i * 5)}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full">
                                <div
                                    className="bg-primary h-1 rounded-full"
                                    style={{ width: `${90 - (i * 5)}%` }}
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </Grid>
        </div>
    );
}
