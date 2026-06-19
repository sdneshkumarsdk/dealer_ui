<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    serviceJobs: { type: Array, required: true }
})

const activeTab = ref('jobs')

const openCount = computed(() => props.serviceJobs.filter(j => j.status.toLowerCase() === 'in progress' || j.status.toLowerCase() === 'waiting parts').length)
const completedCount = computed(() => props.serviceJobs.filter(j => j.status.toLowerCase() === 'ready').length)
const partsPendingCount = computed(() => props.serviceJobs.filter(j => j.status.toLowerCase().includes('parts')).length)
</script>

<template>
    <div class="page active" id="page-service">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Open Jobs</div><div class="kv" style="color: #1A5FAB">{{ openCount }}</div></div>
            <div class="kpi-box"><div class="kl">AMC Contracts</div><div class="kv">14</div></div>
            <div class="kpi-box"><div class="kl">Completed (MTD)</div><div class="kv" style="color: #2D7A3A">{{ completedCount + 19 }}</div></div>
            <div class="kpi-box"><div class="kl">Revenue (MTD)</div><div class="kv">₹4.8L</div></div>
            <div class="kpi-box"><div class="kl">Parts Pending</div><div class="kv" style="color: #9E6B00">{{ partsPendingCount }}</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem">
            <div class="tab-row" style="margin-bottom: 0; border-bottom: none">
                <button :class="['tab-btn', activeTab === 'jobs' ? 'active' : '']" @click="activeTab = 'jobs'">Service Jobs</button>
                <button :class="['tab-btn', activeTab === 'amc' ? 'active' : '']" @click="activeTab = 'amc'">AMC Contracts</button>
            </div>
            <button class="add-btn"><i class="ti ti-plus"></i> New Job Card</button>
        </div>

        <div v-if="activeTab === 'jobs'" class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Job ID</th>
                        <th>Customer</th>
                        <th>Model</th>
                        <th>Issue Description</th>
                        <th>Technician</th>
                        <th>Date In</th>
                        <th>Est. Completion</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(j, idx) in serviceJobs" :key="idx">
                        <td style="font-weight: 600">{{ j.jobId }}</td>
                        <td style="font-weight: 500">{{ j.customer }}</td>
                        <td>{{ j.model }}</td>
                        <td>{{ j.issue }}</td>
                        <td>{{ j.technician }}</td>
                        <td>{{ j.dateIn }}</td>
                        <td>{{ j.estCompletion }}</td>
                        <td>
                            <span :class="['pill', j.status === 'Ready' ? 'p-stock' :
                                    j.status === 'Waiting parts' ? 'p-pending' : 'p-transit'
                            ]">
                                {{ j.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div v-else class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>AMC ID</th>
                        <th>Customer</th>
                        <th>Model</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Plan Name</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>AMC-901</td>
                        <td>Gurmeet Rana</td>
                        <td>SOLIS 5015</td>
                        <td>01 Jan 2025</td>
                        <td>31 Dec 2025</td>
                        <td>Sonalika Gold AMC</td>
                        <td><span class="pill p-stock">Active</span></td>
                    </tr>
                    <tr>
                        <td>AMC-902</td>
                        <td>Harbhajan Singh</td>
                        <td>Worldtrac 60</td>
                        <td>15 Feb 2025</td>
                        <td>14 Feb 2026</td>
                        <td>Sonalika Silver AMC</td>
                        <td><span class="pill p-stock">Active</span></td>
                    </tr>
                    <tr>
                        <td>AMC-903</td>
                        <td>Sukhdev Kumar</td>
                        <td>Eicher 368</td>
                        <td>10 May 2024</td>
                        <td>09 May 2025</td>
                        <td>Standard AMC</td>
                        <td><span class="pill p-overdue">Expired</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
