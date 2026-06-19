<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    dealers: { type: Array, required: true },
    sales: { type: Array, required: true },
    theme: { type: String, required: true }
})

const chartCanvas = ref(null)
let chartInstance = null

const updatedDealers = computed(() => {
    return props.dealers.map(d => {
        if (d.id === 'Ludhiana-01') {
            return { ...d, salesMtd: props.sales.length, revenue: (props.sales.length * 8.6 * 100000) }
        }
        return d
    })
})

const initChart = () => {
    if (!chartCanvas.value) return
    destroyChart()

    const isDark = props.theme === 'dark'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
    const tickColor = isDark ? '#94a3b8' : '#64748b'

    const labels = updatedDealers.value.map(d => d.id)
    const targets = updatedDealers.value.map(d => d.target)
    const achieved = updatedDealers.value.map(d => d.salesMtd)

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Target',
                    data: targets,
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(100, 116, 139, 0.15)',
                    borderRadius: 3
                },
                {
                    label: 'Achieved',
                    data: achieved,
                    backgroundColor: achieved.map(val => val >= 25 ? '#00e676' : val < 10 ? '#ff1744' : '#ffd600'),
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

const destroyChart = () => {
    if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
    }
}

onMounted(() => {
    initChart()
})

onUnmounted(() => {
    destroyChart()
})

watch(() => [props.sales.length, props.theme], () => {
    initChart()
})
</script>

<template>
    <div class="page active" id="page-dealer-perf">
        <div class="card-panel" style="margin-bottom: 1rem">
            <div class="cp-title">Dealer-wise performance (MTD)</div>
            <div class="chart-wrap" style="height: 260px">
                <canvas ref="chartCanvas"></canvas>
            </div>
        </div>
        
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Dealer</th>
                        <th>Region</th>
                        <th>Target</th>
                        <th>Achieved</th>
                        <th>Achievement %</th>
                        <th>Revenue ₹</th>
                        <th>Refurb Sold</th>
                        <th>Exchange</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(d, idx) in updatedDealers" :key="idx">
                        <td style="font-weight: 600" :style="{ color: d.achievement < 40 ? '#ff1744' : 'var(--text-primary)' }">{{ d.id }}</td>
                        <td>{{ d.region }}</td>
                        <td>{{ d.target }}</td>
                        <td style="font-weight: 700">{{ d.salesMtd }}</td>
                        <td style="font-weight: 700" :style="{ color: d.achievement < 40 ? '#ff1744' : d.achievement >= 80 ? '#00e676' : '#ffd600' }">{{ d.achievement }}%</td>
                        <td>{{ d.id === 'Ludhiana-01' ? (sales.length * 860000).toLocaleString('en-IN') : d.revenue.toLocaleString('en-IN') }}</td>
                        <td>{{ d.refurbSold }}</td>
                        <td>{{ d.exchangeSettled }}</td>
                        <td style="color: #ffd600">{{ '⭐'.repeat(d.rating) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
