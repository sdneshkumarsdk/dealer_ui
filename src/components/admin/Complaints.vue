<script setup>
import { computed } from 'vue'

const props = defineProps({
    complaints: { type: Array, required: true }
})

const openCount = computed(() => props.complaints.filter(c => c.status !== 'Resolved').length)
const escalatedCount = computed(() => props.complaints.filter(c => c.status === 'Escalated').length)
const resolvedCount = computed(() => props.complaints.filter(c => c.status === 'Resolved').length)
</script>

<template>
    <div class="page active" id="page-admin-complaints">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Open</div><div class="kv" style="color: #C0430A">{{ openCount }}</div></div>
            <div class="kpi-box"><div class="kl">Escalated</div><div class="kv" style="color: #C0392B">{{ escalatedCount }}</div></div>
            <div class="kpi-box"><div class="kl">Resolved (MTD)</div><div class="kv" style="color: #2D7A3A">{{ resolvedCount + 14 }}</div></div>
            <div class="kpi-box"><div class="kl">Avg resolution (days)</div><div class="kv">3.2</div></div>
        </div>
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Dealer</th>
                        <th>Customer</th>
                        <th>Model</th>
                        <th>Issue</th>
                        <th>Raised on</th>
                        <th>Priority</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(c, idx) in complaints" :key="idx">
                        <td style="font-weight: 600">{{ c.id }}</td>
                        <td>{{ c.dealer }}</td>
                        <td style="font-weight: 500">{{ c.customer }}</td>
                        <td>{{ c.model }}</td>
                        <td>{{ c.issue }}</td>
                        <td>{{ c.raisedOn }}</td>
                        <td>
                            <span :class="['pill', c.priority === 'High' ? 'p-overdue' : c.priority === 'Medium' ? 'p-pending' : 'p-transit']">
                                {{ c.priority }}
                            </span>
                        </td>
                        <td>
                            <span :class="['pill', c.status === 'Escalated' ? 'p-overdue' :
                                    c.status === 'Resolved' ? 'p-stock' :
                                        c.status === 'Open' ? 'p-pending' : 'p-transit'
                            ]">
                                {{ c.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
