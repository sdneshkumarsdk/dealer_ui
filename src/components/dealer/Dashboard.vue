<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
    newTractors: { type: Array, required: true },
    refurb: { type: Array, required: true },
    sales: { type: Array, required: true },
    exchange: { type: Array, required: true },
    transit: { type: Array, required: true },
    loans: { type: Array, required: true },
    serviceJobs: { type: Array, required: true },
    customers: { type: Array, required: true },
    theme: { type: String, required: true }
})

// Slideshow state
const slideIdx = ref(0)
const slides = [
    {
        title: "Sonalika DI 745 III",
        desc: "50 HP Powerhouse · Best seller this season",
        badge: "8 units in stock",
        img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80"
    },
    {
        title: "Harvest Season Ready",
        desc: "Exchange offer running · Get ₹2L off on trade-in",
        badge: "Limited period",
        img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80"
    },
    {
        title: "June Sales Target",
        desc: "12 of 20 units achieved this month",
        badge: "60% complete",
        img: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80"
    },
    {
        title: "Worldtrac 60 Arrived",
        desc: "2 new units just arrived from transit",
        badge: "Ready to sell",
        img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1200&q=80"
    },
    {
        title: "SBI Finance Offer",
        desc: "Zero processing fee · 7.5% rate this month",
        badge: "Special scheme",
        img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1200&q=80"
    }
]

let slideshowTimer = null

onMounted(() => {
    slideshowTimer = setInterval(() => {
        slideIdx.value = (slideIdx.value + 1) % slides.length
    }, 4000)
    
    initChart()
})

onUnmounted(() => {
    if (slideshowTimer) clearInterval(slideshowTimer)
    destroyChart()
})

const moveSlide = (dir) => {
    slideIdx.value = (slideIdx.value + dir + slides.length) % slides.length
}

// Chart Logic
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
    gradient.addColorStop(0, 'rgba(255, 90, 31, 0.35)')
    gradient.addColorStop(1, 'rgba(255, 90, 31, 0.01)')

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Units Sold',
                data: [8, 10, 7, 14, 11, props.sales.length || 12],
                borderColor: '#ff5a1f',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#ff5a1f',
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
                    beginAtZero: true,
                    ticks: { 
                        stepSize: 2,
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

watch(() => [props.sales.length, props.theme], () => {
    initChart()
})

// Metrics logic
const totalNewInStock = computed(() => props.newTractors.filter(t => t.status === 'In Stock').length)
const totalRefurbInStock = computed(() => props.refurb.filter(r => r.status === 'In Stock').length)
const totalInventory = computed(() => totalNewInStock.value + totalRefurbInStock.value)

const mtdSalesCount = computed(() => props.sales.length)

const parseCurrency = (val) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    return parseInt(val.toString().replace(/,/g, ''), 10) || 0
}

const newTractorSalesRev = computed(() => props.sales
    .filter(s => !s.model.toLowerCase().includes('refurb'))
    .reduce((sum, s) => sum + parseCurrency(s.salePrice), 0)
)

const refurbSalesRev = computed(() => props.sales
    .filter(s => s.model.toLowerCase().includes('refurb'))
    .reduce((sum, s) => sum + parseCurrency(s.salePrice), 0)
)

const exchangeSettledRev = computed(() => props.exchange
    .filter(e => e.status.toLowerCase() === 'settled')
    .reduce((sum, e) => sum + parseCurrency(e.tradeInVal), 0)
)

const serviceRev = computed(() => props.serviceJobs
    .filter(j => j.status.toLowerCase() === 'ready' || j.status.toLowerCase() === 'in progress')
    .length * 120000 || 480000
)

const totalRev = computed(() => newTractorSalesRev.value + refurbSalesRev.value + exchangeSettledRev.value + serviceRev.value)

const models = ['DI 745 III', 'DI 60 RX', 'Worldtrac 60', 'SOLIS 5015', 'DI 750 III']

const getModelStock = (modelName) => {
    return props.newTractors.filter(t => t.model === modelName && t.status === 'In Stock').length
}

const maxStockVal = computed(() => Math.max(...models.map(m => getModelStock(m)), 1))

const lowStockCount = computed(() => models.filter(m => getModelStock(m) <= 2).length)
const overdueEmiCount = computed(() => props.loans.filter(l => l.status.toLowerCase() === 'overdue').length)
const overdueTransitCount = computed(() => props.transit.filter(t => t.status.toLowerCase() === 'overdue').length)
</script>

<template>
    <div class="page active" id="page-dashboard">
        <div class="alert-banner">
            <i class="ti ti-alert-triangle" style="font-size: 16px"></i>
            {{ lowStockCount }} models running low on stock · {{ overdueEmiCount }} EMI overdue · Transit TRK-083 is delayed by {{ overdueTransitCount * 2 || 2 }} days
        </div>

        <!-- SLIDESHOW -->
        <div class="slideshow-container" id="slideshow">
            <div 
                v-for="(slide, idx) in slides" 
                :key="idx" 
                :class="['slide', idx === slideIdx ? 'active' : '']"
            >
                <div class="slide-bg" :style="{ backgroundImage: `url(${slide.img})` }"></div>
                <div class="slide-content">
                    <h2>{{ slide.title }}</h2>
                    <p>{{ slide.desc }}</p>
                    <div class="slide-badge">{{ slide.badge }}</div>
                </div>
            </div>
            
            <div class="slide-dots" id="slide-dots">
                <div
                    v-for="(_, idx) in slides"
                    :key="idx"
                    :class="['dot', idx === slideIdx ? 'active' : '']"
                    @click="slideIdx = idx"
                ></div>
            </div>
            
            <div class="slide-arrows">
                <button class="slide-arrow" @click="moveSlide(-1)">
                    <i class="ti ti-chevron-left"></i>
                </button>
                <button class="slide-arrow" @click="moveSlide(1)">
                    <i class="ti ti-chevron-right"></i>
                </button>
            </div>
        </div>

        <div class="sec-title">Inventory snapshot</div>
        <div class="metric-grid">
            <div class="metric-card c-blue">
                <div class="m-label">Total inventory</div>
                <div class="m-val">{{ totalInventory }}</div>
                <div class="m-sub">new + refurb</div>
            </div>
            <div class="metric-card c-green">
                <div class="m-label">New in stock</div>
                <div class="m-val">{{ totalNewInStock }}</div>
                <div class="m-sub">ready to sell</div>
            </div>
            <div class="metric-card c-orange">
                <div class="m-label">Sold this month</div>
                <div class="m-val">{{ mtdSalesCount }}</div>
                <div class="m-sub">₹{{ (totalRev / 10000000).toFixed(2) }} Cr revenue</div>
            </div>
            <div class="metric-card c-amber">
                <div class="m-label">On the way</div>
                <div class="m-val">{{ transit.filter(t => t.status === 'On route' || t.status === 'Overdue').length }}</div>
                <div class="m-sub">{{ transit.filter(t => t.status === 'Preparing' || t.status === 'Loading').length }} pending</div>
            </div>
            <div class="metric-card c-purple">
                <div class="m-label">Refurbished</div>
                <div class="m-val">{{ refurb.length }}</div>
                <div class="m-sub">
                    {{ refurb.filter(r => r.status === 'Sold').length }} sold · {{ totalRefurbInStock }} stock
                </div>
            </div>
            <div class="metric-card">
                <div class="m-label">Exchange offers</div>
                <div class="m-val">{{ exchange.length }}</div>
                <div class="m-sub">
                    {{ exchange.filter(e => e.status.toLowerCase().includes('valuation')).length }} under valuation
                </div>
            </div>
        </div>

        <div class="two-col">
            <div class="card-panel">
                <div class="cp-title">Model-wise stock</div>
                <div v-for="m in models" :key="m" class="mini-row">
                    <span class="mk">{{ m }}</span>
                    <span style="display: flex; align-items: center; gap: 8px; width: 60%">
                        <span style="font-weight: 700; font-size: 13px; min-width: 15px">{{ getModelStock(m) }}</span>
                        <div class="prog-wrap">
                            <div 
                                class="prog" 
                                :style="{ 
                                    width: `${Math.round((getModelStock(m) / maxStockVal) * 100) || 0}%`, 
                                    background: getModelStock(m) <= 2 ? '#C0392B' : getModelStock(m) >= 5 ? '#2D7A3A' : '#C0430A' 
                                }"
                            ></div>
                        </div>
                    </span>
                </div>
            </div>
            
            <div class="card-panel">
                <div class="cp-title">Monthly sales trend</div>
                <div class="chart-wrap" style="height: 185px">
                    <canvas ref="chartCanvas" role="img" aria-label="Monthly sales trend chart"></canvas>
                </div>
            </div>
        </div>

        <div class="two-col">
            <div class="card-panel">
                <div class="cp-title">Follow-ups due <span style="font-size: 10px; color: #AAA">next 48 hrs</span></div>
                <div class="mini-row">
                    <span class="mk"><i class="ti ti-alert-circle" style="color: #C0392B; font-size: 13px"></i> Harbhajan Singh</span>
                    <span style="font-size: 11px; color: #C0430A; font-weight: 600">EMI overdue</span>
                </div>
                <div class="mini-row">
                    <span class="mk"><i class="ti ti-file-description" style="color: #9E6B00; font-size: 13px"></i> Rajveer Kaur</span>
                    <span style="font-size: 11px; color: #9E6B00; font-weight: 600">Loan docs pending</span>
                </div>
                <div class="mini-row">
                    <span class="mk"><i class="ti ti-steering-wheel" style="color: #1A5FAB; font-size: 13px"></i> Sukhdev Rana</span>
                    <span style="font-size: 11px; color: #1A5FAB; font-weight: 600">Test drive tomorrow</span>
                </div>
                <div class="mini-row">
                    <span class="mk"><i class="ti ti-truck" style="color: #2D7A3A; font-size: 13px"></i> Gurmeet Dhaliwal</span>
                    <span style="font-size: 11px; color: #2D7A3A; font-weight: 600">Delivery scheduled</span>
                </div>
                <div class="mini-row">
                    <span class="mk"><i class="ti ti-phone" style="color: #5B3EBF; font-size: 13px"></i> Paramjit Sidhu</span>
                    <span style="font-size: 11px; color: #5B3EBF; font-weight: 600">Callback requested</span>
                </div>
            </div>
            
            <div class="card-panel">
                <div class="cp-title">Revenue this month</div>
                <div class="mini-row">
                    <span class="mk">New tractor sales</span>
                    <span class="mv">₹{{ newTractorSalesRev.toLocaleString('en-IN') }}</span>
                </div>
                <div class="mini-row">
                    <span class="mk">Refurb sales</span>
                    <span class="mv">₹{{ refurbSalesRev.toLocaleString('en-IN') }}</span>
                </div>
                <div class="mini-row">
                    <span class="mk">Exchange settled</span>
                    <span class="mv">₹{{ exchangeSettledRev.toLocaleString('en-IN') }}</span>
                </div>
                <div class="mini-row">
                    <span class="mk">Service & AMC</span>
                    <span class="mv">₹{{ serviceRev.toLocaleString('en-IN') }}</span>
                </div>
                <div class="mini-row" style="border-top: 1px solid #E5E7EB; margin-top: 4px">
                    <span class="mk" style="font-weight: 700">Total</span>
                    <span class="mv" style="color: #C0430A; font-size: 15px">
                        ₹{{ totalRev.toLocaleString('en-IN') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
