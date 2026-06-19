<script setup>
import { computed } from 'vue'

const props = defineProps({
    schemes: { type: Array, required: true }
})

const activeCount = computed(() => props.schemes.filter(s => s.status === 'Active').length)
const pendingCount = computed(() => props.schemes.filter(s => s.status.includes('Pending') || s.status.includes('pending')).length)
</script>

<template>
    <div class="page active" id="page-admin-schemes">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem">
            <div class="kpi-strip" style="flex: 1; margin-bottom: 0">
                <div class="kpi-box"><div class="kl">Active Schemes</div><div class="kv" style="color: #2D7A3A">{{ activeCount }}</div></div>
                <div class="kpi-box"><div class="kl">Pending Approval</div><div class="kv" style="color: #9E6B00">{{ pendingCount }}</div></div>
                <div class="kpi-box"><div class="kl">Expired (MTD)</div><div class="kv" style="color: #888">3</div></div>
            </div>
            <button class="add-btn" style="margin-left: 10px; white-space: nowrap">
                <i class="ti ti-plus"></i> Create scheme
            </button>
        </div>
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Scheme ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Discount</th>
                        <th>Models</th>
                        <th>Valid From</th>
                        <th>Valid To</th>
                        <th>Region</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(s, idx) in schemes" :key="idx">
                        <td style="font-weight: 600">{{ s.schemeId }}</td>
                        <td style="font-weight: 600">{{ s.name }}</td>
                        <td>{{ s.type }}</td>
                        <td>{{ s.discount }}</td>
                        <td>{{ s.models }}</td>
                        <td>{{ s.validFrom }}</td>
                        <td>{{ s.validTo }}</td>
                        <td>{{ s.region }}</td>
                        <td>
                            <span :class="['pill', s.status === 'Active' ? 'p-active' : 'p-pending']">
                                {{ s.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
