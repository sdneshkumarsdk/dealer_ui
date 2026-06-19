<script setup>
import { computed } from 'vue'

const props = defineProps({
    dealers: { type: Array, required: true },
    sales: { type: Array, required: true }
})

const localTarget = computed(() => props.dealers.reduce((sum, d) => sum + d.target, 0) || 155)
const localAchieved = computed(() => props.dealers.reduce((sum, d) => sum + (d.id === 'Ludhiana-01' ? props.sales.length : d.salesMtd), 0))
const achievementPct = computed(() => ((localAchieved.value / localTarget.value) * 100).toFixed(1))

const getPillClass = (pct) => {
    if (pct >= 90) return 'p-active'
    if (pct < 40) return 'p-overdue'
    return 'p-pending'
}

const getPillText = (pct) => {
    if (pct >= 90) return 'Near target'
    if (pct < 40) return 'At risk'
    return 'In progress'
}
</script>

<template>
    <div class="page active" id="page-targets-admin">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem">
            <div class="kpi-strip" style="flex: 1; margin-bottom: 0">
                <div class="kpi-box"><div class="kl">Network Target (Jun)</div><div class="kv">{{ localTarget }} units</div></div>
                <div class="kpi-box"><div class="kl">Achieved</div><div class="kv" style="color: #2D7A3A">{{ localAchieved }}</div></div>
                <div class="kpi-box"><div class="kl">Achievement</div><div class="kv" style="color: #9E6B00">{{ achievementPct }}%</div></div>
                <div class="kpi-box"><div class="kl">Days remaining</div><div class="kv">15</div></div>
            </div>
            <button class="add-btn" style="margin-left: 10px; white-space: nowrap">
                <i class="ti ti-edit"></i> Set targets
            </button>
        </div>
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Dealer</th>
                        <th>Region</th>
                        <th>Monthly Target</th>
                        <th>Achieved</th>
                        <th>Gap</th>
                        <th>Achievement %</th>
                        <th>Incentive Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(d, idx) in dealers" :key="idx">
                        <td style="font-weight: 600">{{ d.id }}</td>
                        <td>{{ d.region }}</td>
                        <td>{{ d.target }}</td>
                        <td style="font-weight: 700">{{ d.id === 'Ludhiana-01' ? sales.length : d.salesMtd }}</td>
                        <td>{{ Math.max(0, d.target - (d.id === 'Ludhiana-01' ? sales.length : d.salesMtd)) }}</td>
                        <td style="font-weight: 700" :style="{ color: (Math.round(((d.id === 'Ludhiana-01' ? sales.length : d.salesMtd) / d.target) * 100) < 40 ? '#C0392B' : Math.round(((d.id === 'Ludhiana-01' ? sales.length : d.salesMtd) / d.target) * 100) >= 90 ? '#2D7A3A' : '#9E6B00') }">
                            {{ Math.round(((d.id === 'Ludhiana-01' ? sales.length : d.salesMtd) / d.target) * 100) }}%
                        </td>
                        <td>
                            <span :class="['pill', getPillClass(Math.round(((d.id === 'Ludhiana-01' ? sales.length : d.salesMtd) / d.target) * 100))]">
                                {{ getPillText(Math.round(((d.id === 'Ludhiana-01' ? sales.length : d.salesMtd) / d.target) * 100)) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
