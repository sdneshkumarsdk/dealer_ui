<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    sales: { type: Array, required: true },
    theme: { type: String, required: true }
})

const modelChartCanvas = ref(null)
const revChartCanvas = ref(null)
const sixMonthChartCanvas = ref(null)

let modelChartInstance = null
let revChartInstance = null
let sixMonthChartInstance = null

const initCharts = () => {
    const isDark = props.theme === 'dark'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
    const tickColor = isDark ? '#94a3b8' : '#64748b'
    const colors = ['#ff5a1f', '#2979ff', '#00e676', '#ffd600', '#d500f9', '#ff1744']

    // 1. Model Chart
    if (modelChartCanvas.value) {
        if (modelChartInstance) modelChartInstance.destroy()
        const ctx = modelChartCanvas.value.getContext('2d')
        if (ctx) {
            modelChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['DI 745', 'DI 60 RX', 'Worldtrac', 'SOLIS', 'DI 750'],
                    datasets: [{
                        data: [
                            props.sales.filter(s => s.model.includes('745')).length || 4,
                            props.sales.filter(s => s.model.includes('60')).length || 3,
                            props.sales.filter(s => s.model.includes('Worldtrac')).length || 2,
                            props.sales.filter(s => s.model.includes('SOLIS')).length || 2,
                            props.sales.filter(s => s.model.includes('750')).length || 1
                        ],
                        backgroundColor: colors,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: {
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: { stepSize: 1, color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } },
                            grid: { color: gridColor, drawBorder: false }
                        }
                    }
                }
            })
        }
    }

    // 2. Revenue Chart
    if (revChartCanvas.value) {
        if (revChartInstance) revChartInstance.destroy()
        const ctx = revChartCanvas.value.getContext('2d')
        if (ctx) {
            revChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['New sales', 'Refurb', 'Exchange', 'Service'],
                    datasets: [{
                        data: [78, 13, 8, 5],
                        backgroundColor: colors.slice(0, 4),
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: tickColor,
                                font: { family: 'Plus Jakarta Sans', size: 10 },
                                padding: 8,
                                boxWidth: 10
                            }
                        }
                    }
                }
            })
        }
    }

    // 3. Six Month Comparison Chart
    if (sixMonthChartCanvas.value) {
        if (sixMonthChartInstance) sixMonthChartInstance.destroy()
        const ctx = sixMonthChartCanvas.value.getContext('2d')
        if (ctx) {
            sixMonthChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        {
                            label: 'New',
                            data: [8, 10, 7, 14, 11, props.sales.length || 12],
                            backgroundColor: '#ff5a1f',
                            borderRadius: 3
                        },
                        {
                            label: 'Refurb',
                            data: [2, 3, 1, 4, 3, 4],
                            backgroundColor: '#d500f9',
                            borderRadius: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 11 }, boxWidth: 10 } }
                    },
                    scales: {
                        x: {
                            stacked: false,
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
                        }
                    }
                }
            })
        }
    }
}

const destroyCharts = () => {
    if (modelChartInstance) {
        modelChartInstance.destroy()
        modelChartInstance = null
    }
    if (revChartInstance) {
        revChartInstance.destroy()
        revChartInstance = null
    }
    if (sixMonthChartInstance) {
        sixMonthChartInstance.destroy()
        sixMonthChartInstance = null
    }
}

onMounted(() => {
    initCharts()
})

onUnmounted(() => {
    destroyCharts()
})

watch(() => [props.sales, props.theme], () => {
    initCharts()
}, { deep: true })
</script>

<template>
    <div class="page active" id="page-reports-dealer">
        <div class="two-col">
            <div class="card-panel">
                <div class="cp-title">Sales by model (this month)</div>
                <div class="chart-wrap" style="height: 180px">
                    <canvas ref="modelChartCanvas"></canvas>
                </div>
            </div>
            <div class="card-panel">
                <div class="cp-title">Revenue split</div>
                <div class="chart-wrap" style="height: 180px">
                    <canvas ref="revChartCanvas"></canvas>
                </div>
            </div>
        </div>
        <div class="card-panel" style="margin-bottom: 1.25rem">
            <div class="cp-title">6-month comparison</div>
            <div class="chart-wrap" style="height: 200px">
                <canvas ref="sixMonthChartCanvas"></canvas>
            </div>
        </div>
    </div>
</template>
