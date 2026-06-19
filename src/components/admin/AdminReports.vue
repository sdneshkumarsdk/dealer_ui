<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    theme: { type: String, required: true }
})

const regionCanvas = ref(null)
const topModelCanvas = ref(null)
const finCashCanvas = ref(null)

let regionChartInstance = null
let topModelChartInstance = null
let finCashChartInstance = null

const initCharts = () => {
    const isDark = props.theme === 'dark'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
    const tickColor = isDark ? '#94a3b8' : '#64748b'
    const colors = ['#ff5a1f', '#2979ff', '#00e676', '#ffd600', '#d500f9', '#ff1744']

    // 1. Region Doughnut Chart
    if (regionCanvas.value) {
        if (regionChartInstance) regionChartInstance.destroy()
        const ctx = regionCanvas.value.getContext('2d')
        if (ctx) {
            regionChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Punjab', 'Haryana', 'Himachal'],
                    datasets: [{
                        data: [142, 52, 24],
                        backgroundColor: ['#ff5a1f', '#2979ff', '#00e676'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 }, boxWidth: 10, padding: 6 }
                        }
                    }
                }
            })
        }
    }

    // 2. Top Model Bar Chart
    if (topModelCanvas.value) {
        if (topModelChartInstance) topModelChartInstance.destroy()
        const ctx = topModelCanvas.value.getContext('2d')
        if (ctx) {
            topModelChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['DI 745', 'DI 60 RX', 'Worldtrac', 'SOLIS', 'DI 750'],
                    datasets: [{
                        data: [64, 51, 38, 35, 30],
                        backgroundColor: colors.slice(0, 5),
                        borderRadius: 3
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
                            grid: { color: gridColor, drawBorder: false },
                            ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
                        }
                    }
                }
            })
        }
    }

    // 3. Finance vs Cash Pie Chart
    if (finCashCanvas.value) {
        if (finCashChartInstance) finCashChartInstance.destroy()
        const ctx = finCashCanvas.value.getContext('2d')
        if (ctx) {
            finCashChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Finance', 'Cash'],
                    datasets: [{
                        data: [168, 50],
                        backgroundColor: ['#2979ff', '#00e676'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 }, boxWidth: 10, padding: 6 }
                        }
                    }
                }
            })
        }
    }
}

const destroyCharts = () => {
    if (regionChartInstance) {
        regionChartInstance.destroy()
        regionChartInstance = null
    }
    if (topModelChartInstance) {
        topModelChartInstance.destroy()
        topModelChartInstance = null
    }
    if (finCashChartInstance) {
        finCashChartInstance.destroy()
        finCashChartInstance = null
    }
}

onMounted(() => {
    initCharts()
})

onUnmounted(() => {
    destroyCharts()
})

watch(() => props.theme, () => {
    initCharts()
})
</script>

<template>
    <div class="page active" id="page-admin-reports">
        <div class="three-col">
            <div class="card-panel">
                <div class="cp-title">Sales by region</div>
                <div class="chart-wrap" style="height: 160px">
                    <canvas ref="regionCanvas"></canvas>
                </div>
            </div>
            <div class="card-panel">
                <div class="cp-title">Top models (network)</div>
                <div class="chart-wrap" style="height: 160px">
                    <canvas ref="topModelCanvas"></canvas>
                </div>
            </div>
            <div class="card-panel">
                <div class="cp-title">Finance vs cash</div>
                <div class="chart-wrap" style="height: 160px">
                    <canvas ref="finCashCanvas"></canvas>
                </div>
            </div>
        </div>
    </div>
</template>
