<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    sales: { type: Array, required: true }
})

const chartCanvas = ref(null)
let chartInstance = null

const initChart = () => {
    if (!chartCanvas.value) return
    destroyChart()

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Units sold',
                data: [165, 180, 142, 210, 195, 218 + (props.sales.length - 5)],
                backgroundColor: '#1A5FAB',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
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

watch(() => props.sales.length, () => {
    initChart()
})
</script>

<template>
    <div class="page active" id="page-admin-sales">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Network Sales (MTD)</div><div class="kv" style="color: #C0430A">{{ 206 + sales.length }}</div></div>
            <div class="kpi-box"><div class="kl">Revenue (MTD)</div><div class="kv">₹18.4 Cr</div></div>
            <div class="kpi-box"><div class="kl">Finance Sales</div><div class="kv">168</div></div>
            <div class="kpi-box"><div class="kl">Cash Sales</div><div class="kv">50</div></div>
        </div>
        <div class="card-panel">
            <div class="cp-title">Network sales trend (6 months)</div>
            <div class="chart-wrap" style="height: 220px">
                <canvas ref="chartCanvas"></canvas>
            </div>
        </div>
    </div>
</template>
