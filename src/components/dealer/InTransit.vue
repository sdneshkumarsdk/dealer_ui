<script setup>
import { computed } from 'vue'

const props = defineProps({
    transit: { type: Array, required: true }
})

const newOrders = computed(() => props.transit.filter(t => t.type === 'New').length)
const refurbOrders = computed(() => props.transit.filter(t => t.type === 'Refurb').length)
const overdueCount = computed(() => props.transit.filter(t => t.status === 'Overdue').length)
const totalUnits = computed(() => props.transit.reduce((sum, t) => sum + t.qty, 0))
</script>

<template>
    <div class="page active" id="page-intransit">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">New Orders</div><div class="kv" style="color: #1A5FAB">{{ newOrders }}</div></div>
            <div class="kpi-box"><div class="kl">Refurb Orders</div><div class="kv" style="color: #7A1A9A">{{ refurbOrders }}</div></div>
            <div class="kpi-box"><div class="kl">Avg ETA (days)</div><div class="kv">8</div></div>
            <div class="kpi-box"><div class="kl">Overdue</div><div class="kv" style="color: #C0392B">{{ overdueCount }}</div></div>
            <div class="kpi-box"><div class="kl">Total Units</div><div class="kv">{{ totalUnits }}</div></div>
        </div>
        
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Model</th>
                        <th>Qty</th>
                        <th>Type</th>
                        <th>Dispatched</th>
                        <th>ETA</th>
                        <th>Transporter</th>
                        <th>Vehicle No.</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(t, idx) in transit" :key="idx">
                        <td style="font-weight: 600">{{ t.orderId }}</td>
                        <td>{{ t.model }}</td>
                        <td>{{ t.qty }}</td>
                        <td>
                            <span class="tag" :style="{
                                background: t.type === 'Refurb' ? '#F3EEFF' : '#F4F6F9',
                                color: t.type === 'Refurb' ? '#5B3EBF' : '#666'
                            }">
                                {{ t.type }}
                            </span>
                        </td>
                        <td>{{ t.dispatched }}</td>
                        <td>{{ t.eta }}</td>
                        <td>{{ t.transporter }}</td>
                        <td>{{ t.vehicleNo }}</td>
                        <td>
                            <span :class="['pill', t.status === 'On route' ? 'p-transit' :
                                    t.status === 'Overdue' ? 'p-overdue' : 'p-pending'
                            ]">
                                {{ t.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
