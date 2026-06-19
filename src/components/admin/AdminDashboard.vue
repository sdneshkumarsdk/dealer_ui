<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    dealers: { type: Array, required: true },
    complaints: { type: Array, required: true },
    transitOrders: { type: Array, required: true },
    schemes: { type: Array, required: true },
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
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 180)
    gradient.addColorStop(0, 'rgba(41, 121, 255, 0.35)')
    gradient.addColorStop(1, 'rgba(41, 121, 255, 0.01)')

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Network Units',
                data: [165, 180, 142, 210, 195, 218 + (props.sales.length - 5)],
                borderColor: '#2979ff',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#2979ff',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointRadius: 4.5,
                pointHoverRadius: 6.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    },
                    ticks: {
                        color: tickColor,
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 11
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: tickColor,
                        font: {
                            family: 'Plus Jakarta Sans',
                            size: 11
                        }
                    },
                    grid: {
                        color: gridColor,
                        drawBorder: false
                    }
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

// Calculations
const totalDealersCount = computed(() => props.dealers.length)
const activeDealersCount = computed(() => props.dealers.filter(d => d.status.toLowerCase() === 'active').length)
const underperformingCount = computed(() => props.dealers.filter(d => d.status.toLowerCase().includes('below')).length)

const totalTransitCount = computed(() => props.transitOrders.length)
const overdueTransitCount = computed(() => props.transitOrders.filter(o => o.status.toLowerCase() === 'overdue').length)

const openComplaintsCount = computed(() => props.complaints.filter(c => c.status.toLowerCase() === 'open' || c.status.toLowerCase() === 'escalated' || c.status.toLowerCase() === 'in progress').length)
const escalatedComplaintsCount = computed(() => props.complaints.filter(c => c.status.toLowerCase() === 'escalated').length)

// Sorted dealers
const updatedDealers = computed(() => {
    return props.dealers.map(d => {
        if (d.id === 'Ludhiana-01') {
            return { ...d, salesMtd: props.sales.length, revenue: `₹${(props.sales.length * 8.6).toFixed(1)}L` }
        }
        return d
    })
})

const sortedDealers = computed(() => {
    return [...updatedDealers.value].sort((a, b) => b.salesMtd - a.salesMtd)
})

const medalIcons = ['🥇', '🥈', '🥉', '4.', '5.']
</script>

<template>
    <div class="page active" id="page-admin-dashboard">
        <div class="alert-banner">
            <i class="ti ti-alert-triangle" style="font-size: 16px"></i>
            Dealer Ludhiana-02 below 30% target · {{ overdueTransitCount }} transit orders overdue network-wide · {{ schemes.filter(s => s.status.toLowerCase().includes('pending')).length }} new scheme approval pending
        </div>

        <div class="sec-title">Network overview</div>
        <div class="metric-grid">
            <div class="metric-card c-blue">
                <div class="m-label">Total dealers</div>
                <div class="m-val">{{ totalDealersCount }}</div>
                <div class="m-sub">{{ activeDealersCount }} Active · {{ underperformingCount }} Below Target</div>
            </div>
            <div class="metric-card c-green">
                <div class="m-label">Network inventory</div>
                <div class="m-val">1,142</div>
                <div class="m-sub">all dealers combined</div>
            </div>
            <div class="metric-card c-orange">
                <div class="m-label">Network sales (MTD)</div>
                <div class="m-val">{{ 206 + sales.length }}</div>
                <div class="m-sub">₹18.4 Cr revenue</div>
            </div>
            <div class="metric-card c-amber">
                <div class="m-label">Transit orders</div>
                <div class="m-val">{{ totalTransitCount }}</div>
                <div class="m-sub" :style="{ color: overdueTransitCount > 0 ? '#C0392B' : '#888' }">
                    {{ overdueTransitCount }} overdue
                </div>
            </div>
            <div class="metric-card c-purple">
                <div class="m-label">Active EMIs</div>
                <div class="m-val">312</div>
                <div class="m-sub">8 overdue</div>
            </div>
            <div class="metric-card c-red">
                <div class="m-label">Complaints open</div>
                <div class="m-val">{{ openComplaintsCount }}</div>
                <div class="m-sub">{{ escalatedComplaintsCount }} escalated</div>
            </div>
        </div>

        <div class="two-col">
            <div class="card-panel">
                <div class="cp-title">Top dealers this month</div>
                <div v-for="(d, index) in sortedDealers.slice(0, 5)" :key="d.id" class="mini-row">
                    <span style="font-size: 13px">
                        {{ medalIcons[index] }} {{ d.id }} ({{ d.repName }})
                    </span>
                    <span class="mv" :style="{ color: index === 0 ? '#2D7A3A' : index === 1 ? '#1A5FAB' : index === 2 ? '#9E6B00' : 'var(--text-primary)' }">
                        {{ d.salesMtd }} units · {{ d.id === 'Ludhiana-01' ? `₹${(sales.length * 0.086).toFixed(1)} Cr` : d.revenue || '₹1.5 Cr' }}
                    </span>
                </div>
            </div>
            
            <div class="card-panel">
                <div class="cp-title">Network sales trend</div>
                <div class="chart-wrap" style="height: 185px">
                    <canvas ref="chartCanvas" role="img" aria-label="Network sales trend"></canvas>
                </div>
            </div>
        </div>

        <div class="two-col">
            <div class="card-panel">
                <div class="cp-title">Target achievement by region</div>
                <div class="mini-row">
                    <span class="mk" style="width: 80px">Punjab</span>
                    <span style="display: flex; align-items: center; gap: 8px; flex: 1">
                        <div class="prog-wrap">
                            <div class="prog" style="width: 72%; background: #2D7A3A"></div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; color: #2D7A3A; min-width: 30px">72%</span>
                    </span>
                </div>
                <div class="mini-row">
                    <span class="mk" style="width: 80px">Haryana</span>
                    <span style="display: flex; align-items: center; gap: 8px; flex: 1">
                        <div class="prog-wrap">
                            <div class="prog" style="width: 58%; background: #9E6B00"></div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; color: #9E6B00; min-width: 30px">58%</span>
                    </span>
                </div>
                <div class="mini-row">
                    <span class="mk" style="width: 80px">Himachal</span>
                    <span style="display: flex; align-items: center; gap: 8px; flex: 1">
                        <div class="prog-wrap">
                            <div class="prog" style="width: 41%; background: #C0392B"></div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; color: #C0392B; min-width: 30px">41%</span>
                    </span>
                </div>
            </div>
            
            <div class="card-panel">
                <div class="cp-title">Revenue breakdown (network)</div>
                <div class="mini-row">
                    <span class="mk">New tractor sales</span>
                    <span class="mv">₹14,80,00,000</span>
                </div>
                <div class="mini-row">
                    <span class="mk">Refurb sales</span>
                    <span class="mv">₹2,10,00,000</span>
                </div>
                <div class="mini-row">
                    <span class="mk">Exchange settled</span>
                    <span class="mv">₹98,00,000</span>
                </div>
                <div class="mini-row">
                    <span class="mk">Service & AMC</span>
                    <span class="mv">₹52,00,000</span>
                </div>
                <div class="mini-row" style="border-top: 1px solid #E5E7EB; padding-top: 4px">
                    <span class="mk" style="font-weight: 700">Total</span>
                    <span class="mv" style="color: #C0430A; font-size: 15px">₹18,40,00,000</span>
                </div>
            </div>
        </div>
    </div>
</template>
