<script setup>
import { computed } from 'vue'

const props = defineProps({
    sales: { type: Array, required: true }
})

const targetUnits = 20
const achievedUnits = computed(() => props.sales.length || 12)
const remainingUnits = computed(() => Math.max(0, targetUnits - achievedUnits.value))
const percentage = computed(() => Math.round((achievedUnits.value / targetUnits) * 100))

// Model-wise targets
const modelTargets = computed(() => [
    { model: 'DI 745 III', target: 8, sold: props.sales.filter(s => s.model === 'DI 745 III').length || 6 },
    { model: 'DI 60 RX', target: 5, sold: props.sales.filter(s => s.model === 'DI 60 RX').length || 3 },
    { model: 'Worldtrac 60', target: 4, sold: props.sales.filter(s => s.model === 'Worldtrac 60').length || 2 },
    { model: 'SOLIS 5015', target: 3, sold: props.sales.filter(s => s.model === 'SOLIS 5015').length || 1 }
])

const getBarColor = (pct) => {
    if (pct >= 70) return '#2D7A3A' // Green
    if (pct >= 50) return '#9E6B00' // Amber
    return '#C0392B' // Red
}
</script>

<template>
    <div class="page active" id="page-targets">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Monthly Target</div><div class="kv">{{ targetUnits }} units</div></div>
            <div class="kpi-box"><div class="kl">Achieved</div><div class="kv" style="color: #2D7A3A">{{ achievedUnits }} ({{ percentage }}%)</div></div>
            <div class="kpi-box"><div class="kl">Remaining</div><div class="kv" style="color: #C0430A">{{ remainingUnits }}</div></div>
            <div class="kpi-box"><div class="kl">Days Left</div><div class="kv" style="color: #9E6B00">15</div></div>
        </div>

        <div class="two-col">
            <div class="card-panel">
                <div class="cp-title">Target progress by model</div>
                <div v-for="m in modelTargets" :key="m.model" class="mini-row">
                    <span class="mk" style="width: 120px">{{ m.model }}</span>
                    <span style="display: flex; align-items: center; gap: 8px; flex: 1">
                        <span style="font-size: 11px; color: #888; min-width: 25px">{{ m.sold }}/{{ m.target }}</span>
                        <div class="prog-wrap">
                            <div class="prog" :style="{ width: `${Math.round((m.sold / m.target) * 100)}%`, background: getBarColor(Math.round((m.sold / m.target) * 100)) }"></div>
                        </div>
                        <span style="font-size: 11px; font-weight: 700; min-width: 30px">{{ Math.round((m.sold / m.target) * 100) }}%</span>
                    </span>
                </div>
            </div>
            
            <div class="card-panel">
                <div class="cp-title">Incentive tracker</div>
                <div class="mini-row"><span class="mk">Units sold</span><span class="mv">{{ achievedUnits }}</span></div>
                <div class="mini-row"><span class="mk">Incentive earned</span><span class="mv" style="color: #2D7A3A">₹{{ (achievedUnits * 3000).toLocaleString('en-IN') }}</span></div>
                <div class="mini-row"><span class="mk">On target achievement bonus</span><span class="mv">₹80,000</span></div>
                <div class="mini-row"><span class="mk">Super Bonus (20+ units)</span><span class="mv" :style="{ color: achievedUnits >= 20 ? '#2D7A3A' : '#AAA' }">₹50,000 {{ achievedUnits >= 20 ? 'Unlocked!' : '(locked)' }}</span></div>
                <div style="margin-top: 10px; background: #F4F6F9; border-radius: 8px; padding: 10px; font-size: 12px; color: #666">
                    <i class="ti ti-info-circle" style="color: #1A5FAB"></i>
                    {{ achievedUnits >= 20 ? 'Congratulations! You have unlocked the month-end bonus of ₹50,000!' : `Sell ${remainingUnits} more units to unlock the month-end super bonus of ₹50,000.` }}
                </div>
            </div>
        </div>
    </div>
</template>
