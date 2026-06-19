<script setup>
import { computed } from 'vue'

const props = defineProps({
    transit: { type: Array, required: true }
})

const totalOrders = computed(() => props.transit.length)
const onRouteCount = computed(() => props.transit.filter(t => t.status === 'On route').length)
const overdueCount = computed(() => props.transit.filter(t => t.status === 'Overdue').length)
const preparingCount = computed(() => props.transit.filter(t => t.status === 'Preparing' || t.status === 'Loading').length)
</script>

<template>
    <div class="page active" id="page-admin-transit">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Total Orders</div><div class="kv" style="color: #1A5FAB">{{ totalOrders }}</div></div>
            <div class="kpi-box"><div class="kl">On Route</div><div class="kv" style="color: #9E6B00">{{ onRouteCount }}</div></div>
            <div class="kpi-box"><div class="kl">Overdue</div><div class="kv" style="color: #C0392B">{{ overdueCount }}</div></div>
            <div class="kpi-box"><div class="kl">Preparing</div><div class="kv">{{ preparingCount }}</div></div>
        </div>
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Dealer</th>
                        <th>Model</th>
                        <th>Qty</th>
                        <th>Dispatched</th>
                        <th>ETA</th>
                        <th>Transporter</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(t, idx) in transit" :key="idx">
                        <td style="font-weight: 600">{{ t.orderId }}</td>
                        <td style="font-weight: 500">Ludhiana-01</td>
                        <td>{{ t.model }}</td>
                        <td>{{ t.qty }}</td>
                        <td>{{ t.dispatched }}</td>
                        <td>{{ t.eta }}</td>
                        <td>{{ t.transporter }}</td>
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
