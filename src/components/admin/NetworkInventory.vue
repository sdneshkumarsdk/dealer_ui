<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    sales: { type: Array, required: true },
    theme: { type: String, required: true }
})

const chartCanvas = ref(null)
let chartInstance = null

const initChart = () => {
    if (!chartCanvas.value) return
    destroyChart()

    const isDark = props.theme === 'dark'
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)'
    const tickColor = isDark ? '#94a3b8' : '#64748b'

    const ctx = chartCanvas.value.getContext('2d')
    if (!ctx) return

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['DI 745 III', 'DI 60 RX', 'Worldtrac 60', 'SOLIS 5015', 'DI 750 III'],
            datasets: [
                {
                    label: 'Punjab',
                    data: [210, 165, 140, 120, 110],
                    backgroundColor: '#ff5a1f',
                    borderRadius: 3
                },
                {
                    label: 'Haryana',
                    data: [72, 58, 42, 38, 35],
                    backgroundColor: '#2979ff',
                    borderRadius: 3
                },
                {
                    label: 'Himachal',
                    data: [30, 25, 16, 17, 18],
                    backgroundColor: '#00e676',
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
                    stacked: true,
                    grid: { color: gridColor, drawBorder: false },
                    ticks: { color: tickColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
                },
                y: {
                    stacked: true,
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

watch(() => [props.sales, props.theme], () => {
    initChart()
}, { deep: true })
</script>

<template>
    <div class="page active" id="page-admin-inventory">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Network Stock</div><div class="kv" style="color: #1A5FAB">1,142</div></div>
            <div class="kpi-box"><div class="kl">New Tractors</div><div class="kv" style="color: #2D7A3A">896</div></div>
            <div class="kpi-box"><div class="kl">Refurbished</div><div class="kv" style="color: #5B3EBF">246</div></div>
            <div class="kpi-box"><div class="kl">In Transit (total)</div><div class="kv" style="color: #9E6B00">63</div></div>
        </div>

        <div class="card-panel" style="margin-bottom: 1rem">
            <div class="cp-title">Model-wise stock across network</div>
            <div class="chart-wrap" style="height: 220px">
                <canvas ref="chartCanvas"></canvas>
            </div>
        </div>

        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Model</th>
                        <th>HP</th>
                        <th>Total Stock</th>
                        <th>Punjab</th>
                        <th>Haryana</th>
                        <th>Himachal</th>
                        <th>In Transit</th>
                        <th>Sold MTD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>DI 745 III</td><td>50</td><td>312</td><td>210</td><td>72</td><td>30</td><td>18</td><td>64</td></tr>
                    <tr><td>DI 60 RX</td><td>60</td><td>248</td><td>165</td><td>58</td><td>25</td><td>12</td><td>51</td></tr>
                    <tr><td>Worldtrac 60</td><td>60</td><td>198</td><td>140</td><td>42</td><td>16</td><td>10</td><td>38</td></tr>
                    <tr><td>SOLIS 5015</td><td>50</td><td>175</td><td>120</td><td>38</td><td>17</td><td>9</td><td>35</td></tr>
                    <tr><td>DI 750 III</td><td>55</td><td>163</td><td>110</td><td>35</td><td>18</td><td>14</td><td>30</td></tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
