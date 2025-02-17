<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import annotationPlugin from 'chartjs-plugin-annotation';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    annotationPlugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
)

const props = defineProps<{
    data: {distData: number[], accData: number[][], mean: {frag: number, reset: number}, batch: number}
}>();

props;

const chartColor = '#a682e2';

</script>

<template>
    <div class="container">
        <Bar 
            :data="{
                labels: data.distData.map((_, i) => i * data.batch),
                datasets: [
                    {
                        data: data.distData.map(y => 100*y),
                        backgroundColor: chartColor,
                        barPercentage: 0.9,
                        categoryPercentage: 1.0,
                    },
                ]
            }" 
            :options="{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '조각 소모량(개)',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: '비율(%)',
                        },
                        ticks: {
                            autoSkip: true,  // 자동으로 레이블 간격을 조정
                            maxTicksLimit: 15, // x축에 표시할 최대 레이블 개수
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            title: (context: any) => {
                                return `${context[0].dataIndex * data.batch}~${(context[0].dataIndex + 1) * data.batch - 1} 개`;
                            },
                            label: (context: any) => {
                                return `${Math.round(data.distData[context.dataIndex] * 10000) / 100}%`
                            }
                        }
                    },
                    annotation: {
                        annotations: [
                            {
                                id: 'average-line',
                                type: 'line',
                                scaleID: 'x',  // x축 기준
                                value: data.mean.frag / data.batch - 0.5,
                                borderColor: 'red',
                                borderWidth: 1,
                                label: {
                                    display: true,
                                    content: ['[기대값]', `조각 ${Math.round(data.mean.frag)}개`, `초기화 ${Math.round(data.mean.reset)}회`],
                                    position: 'start',
                                }
                            }
                        ]
                    }
                },
            }"
        >
        </Bar>
    </div>
</template>

<style scoped>
.container {
    width: 100%;
    height: 400px;
}
</style>