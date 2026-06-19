<script setup>
import { computed } from 'vue'

const props = defineProps({
    dealers: { type: Array, required: true },
    sales: { type: Array, required: true }
})

const totalDealers = computed(() => props.dealers.length)
const activeCount = computed(() => props.dealers.filter(d => d.status.toLowerCase() === 'active').length)
const underperformingCount = computed(() => props.dealers.filter(d => d.status.toLowerCase().includes('below')).length)
const onTargetCount = computed(() => props.dealers.filter(d => d.status.toLowerCase() === 'active' && d.salesMtd >= 15 && d.salesMtd < 25).length)
const aboveTargetCount = computed(() => props.dealers.filter(d => d.salesMtd >= 25).length)

// Sync current dealer stats
const updatedDealers = computed(() => {
    return props.dealers.map(d => {
        if (d.id === 'Ludhiana-01') {
            const achievementPct = Math.round((props.sales.length / d.target) * 100)
            return {
                ...d,
                salesMtd: props.sales.length,
                achievement: achievementPct,
                status: achievementPct < 40 ? 'Below target' : 'Active'
            }
        }
        return d
    })
})
</script>

<template>
    <div class="page active" id="page-all-dealers">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Total Dealers</div><div class="kv">{{ totalDealers }}</div></div>
            <div class="kpi-box"><div class="kl">Active</div><div class="kv" style="color: #2D7A3A">{{ activeCount }}</div></div>
            <div class="kpi-box"><div class="kl">Underperforming</div><div class="kv" style="color: #C0392B">{{ underperformingCount }}</div></div>
            <div class="kpi-box"><div class="kl">On target</div><div class="kv" style="color: #9E6B00">{{ onTargetCount }}</div></div>
            <div class="kpi-box"><div class="kl">Above target</div><div class="kv" style="color: #2D7A3A">{{ aboveTargetCount }}</div></div>
        </div>

        <div class="dealer-grid">
            <div v-for="d in updatedDealers" :key="d.id" class="dealer-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px">
                    <div>
                        <div style="font-size: 14px; font-weight: 700; color: var(--text-primary)">{{ d.id }}</div>
                        <div style="font-size: 11px; color: var(--text-muted)">{{ d.repName }} · {{ d.region }}</div>
                    </div>
                    <span :class="['pill', d.status.toLowerCase().includes('below') ? 'p-overdue' : 'p-active']">{{ d.status }}</span>
                </div>
                <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 6px">
                    <i class="ti ti-package" style="font-size: 13px"></i> Stock: {{ d.stock }} &nbsp;·&nbsp; <i class="ti ti-receipt" style="font-size: 13px"></i> Sales: {{ d.salesMtd }} MTD
                </div>
                <div style="display: flex; align-items: center; gap: 6px">
                    <div class="prog-wrap">
                        <div 
                            class="prog" 
                            :style="{ 
                                width: `${d.achievement}%`, 
                                background: d.achievement >= 80 ? '#00e676' : d.achievement < 40 ? '#ff1744' : '#ffd600' 
                            }"
                        ></div>
                    </div>
                    <span style="font-size: 11px; font-weight: 700; min-width: 60px; text-align: right; color: var(--text-secondary)">{{ d.achievement }}% target</span>
                </div>
            </div>
        </div>
    </div>
</template>
