<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    customers: { type: Array, required: true }
})

const emit = defineEmits(['update:customers'])

const search = ref('')

const hotLeads = computed(() => props.customers.filter(c => c.leadStatus.toLowerCase() === 'hot lead').length)
const warmLeads = computed(() => props.customers.filter(c => c.leadStatus.toLowerCase() === 'warm lead').length)
const activeCustomers = computed(() => props.customers.filter(c => c.leadStatus.toLowerCase() === 'customer').length)

const filteredCustomers = computed(() => {
    return props.customers.filter(c => {
        return !search.value ||
            c.name.toLowerCase().includes(search.value.toLowerCase()) ||
            c.phone.toLowerCase().includes(search.value.toLowerCase()) ||
            c.village.toLowerCase().includes(search.value.toLowerCase()) ||
            c.district.toLowerCase().includes(search.value.toLowerCase())
    })
})
</script>

<template>
    <div class="page active" id="page-customers">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Total Customers</div><div class="kv">{{ activeCustomers + 150 }}</div></div>
            <div class="kpi-box"><div class="kl">New (MTD)</div><div class="kv" style="color: #2D7A3A">12</div></div>
            <div class="kpi-box"><div class="kl">Repeat Buyers</div><div class="kv">31</div></div>
            <div class="kpi-box"><div class="kl">Hot Leads</div><div class="kv" style="color: #C0430A">{{ hotLeads }}</div></div>
            <div class="kpi-box"><div class="kl">Warm Leads</div><div class="kv" style="color: #9E6B00">{{ warmLeads }}</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem">
            <input
                class="search-input"
                type="text"
                placeholder="Search name / phone..."
                v-model="search"
            />
            <button class="add-btn"><i class="ti ti-plus"></i> Add Customer</button>
        </div>

        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Village / City</th>
                        <th>District</th>
                        <th>Land (acres)</th>
                        <th>Purchases</th>
                        <th>Crop Type</th>
                        <th>Last Contact</th>
                        <th>Lead Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(c, idx) in filteredCustomers" :key="idx">
                        <td style="font-weight: 600">{{ c.name }}</td>
                        <td>{{ c.phone }}</td>
                        <td>{{ c.village }}</td>
                        <td>{{ c.district }}</td>
                        <td>{{ c.landAcres }}</td>
                        <td>{{ c.purchases }}</td>
                        <td>{{ c.cropType }}</td>
                        <td>{{ c.lastContact }}</td>
                        <td>
                            <span :class="['pill', c.leadStatus === 'Customer' ? 'p-stock' :
                                    c.leadStatus === 'Hot lead' ? 'p-transit' : 'p-pending'
                            ]">
                                {{ c.leadStatus }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
