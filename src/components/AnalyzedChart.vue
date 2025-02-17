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

import { maxMainLevel } from '../utils/hexaTable';


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
    data: {
        //distData: number[], 
        accData: number[][], 
        mean: {frag: number, reset: number}, 
        batch: number
    }
}>();


const chartColor = [
  '#563292', '#6a46a6',
  '#7e5aba', '#926ece',
  '#a682e2', '#ba96f6',
  '#ceaaff', '#e2beff',
  '#f6d2ff', '#ffe6ff',
  '#fffaff'
]

</script>

<template>
    <div class="container">
        <Bar 
            :data="{
                labels: data.accData[0] ? data.accData[0].map((_, i) => i * data.batch) : [],
                datasets: data.accData.map((propsData, i) => [
                    {
                        label: `메인스탯 ${i + maxMainLevel - data.accData.length + 1} 달성`,
                        data: propsData.map(x => 100*x),
                        backgroundColor: chartColor[Math.floor((i + 1) * chartColor.length / (data.accData.length + 1))],
                        stack: 'stack1',
                        barPercentage: 0.9,
                        categoryPercentage: 1.0,
                    },
                ]).flat()
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
                            text: '확률(%)',
                        },
                        ticks: {
                            autoSkip: true,  // 자동으로 레이블 간격을 조정
                            maxTicksLimit: 15, // x축에 표시할 최대 레이블 개수
                        },
                    },
                },
                plugins: {
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            title: (context: any) => {
                                return `${context[0].dataIndex * data.batch}~${(context[0].dataIndex + 1) * data.batch - 1} 개`;
                            },
                            label: (context: any) => {
                                const tooltipText = `메인스탯 ${context.datasetIndex + maxMainLevel - data.accData.length + 1} 달성 ${Math.round(data.accData[context.datasetIndex][context.dataIndex] * 10000) / 100}%`
                                return tooltipText;
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