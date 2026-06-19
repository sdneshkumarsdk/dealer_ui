<script setup>
import { ref, computed } from 'vue'
import Modal from '../layout/Modal.vue'

const props = defineProps({
    newTractors: { type: Array, required: true }
})

const emit = defineEmits(['update:newTractors'])

const filter = ref('')
const search = ref('')
const modalOpen = ref(false)

// Form states
const formModel = ref('DI 745 III')
const formHp = ref('50')
const formChassis = ref('')
const formColour = ref('Red')
const formPurchase = ref('690000')
const formSale = ref('745000')
const formDate = ref('2025-06-16')
const formRemarks = ref('')

// Computations
const totalStock = computed(() => props.newTractors.filter(t => t.status === 'In Stock').length)
const totalSold = computed(() => props.newTractors.filter(t => t.status === 'Sold').length)
const totalTransit = computed(() => props.newTractors.filter(t => t.status === 'On the Way').length)
const totalBooked = computed(() => props.newTractors.filter(t => t.status === 'Booked').length)

const modelsList = ['DI 745 III', 'DI 60 RX', 'Worldtrac 60', 'SOLIS 5015', 'DI 750 III']
const lowStockAlerts = computed(() => modelsList.filter(
    m => props.newTractors.filter(t => t.model === m && t.status === 'In Stock').length <= 2
).length)

const handleAddTractor = () => {
    const newT = {
        chassis: formChassis.value || 'CH-' + Math.floor(1000 + Math.random() * 9000),
        model: formModel.value,
        hp: formHp.value,
        colour: formColour.value,
        stockDate: formDate.value ? new Date(formDate.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        purchasePrice: parseInt(formPurchase.value, 10).toLocaleString('en-IN') || '—',
        salePrice: parseInt(formSale.value, 10).toLocaleString('en-IN') || '—',
        status: 'In Stock',
        customer: '—'
    }
    
    emit('update:newTractors', [newT, ...props.newTractors])
    modalOpen.value = false
    
    // Reset form
    formChassis.value = ''
    formRemarks.value = ''
}

const filteredTractors = computed(() => {
    return props.newTractors.filter(t => {
        const matchesFilter = !filter.value || t.status.toLowerCase() === filter.value.toLowerCase()
        const matchesSearch = !search.value ||
            t.model.toLowerCase().includes(search.value.toLowerCase()) ||
            t.chassis.toLowerCase().includes(search.value.toLowerCase()) ||
            t.customer.toLowerCase().includes(search.value.toLowerCase())
        return matchesFilter && matchesSearch
    })
})
</script>

<template>
    <div class="page active" id="page-new-tractors">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">In Stock</div><div class="kv" style="color: #2D7A3A">{{ totalStock }}</div></div>
            <div class="kpi-box"><div class="kl">Sold (MTD)</div><div class="kv" style="color: #C0430A">{{ totalSold }}</div></div>
            <div class="kpi-box"><div class="kl">On the Way</div><div class="kv" style="color: #1A5FAB">{{ totalTransit }}</div></div>
            <div class="kpi-box"><div class="kl">Booked</div><div class="kv" style="color: #9E6B00">{{ totalBooked }}</div></div>
            <div class="kpi-box"><div class="kl">Low Stock Alert</div><div class="kv" style="color: #C0392B">{{ lowStockAlerts }}</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 8px">
            <div class="filter-row" style="margin-bottom: 0">
                <div :class="['chip', filter === '' ? 'active' : '']" @click="filter = ''">All</div>
                <div :class="['chip', filter === 'In Stock' ? 'active' : '']" @click="filter = 'In Stock'">In Stock</div>
                <div :class="['chip', filter === 'Sold' ? 'active' : '']" @click="filter = 'Sold'">Sold</div>
                <div :class="['chip', filter === 'Booked' ? 'active' : '']" @click="filter = 'Booked'">Booked</div>
                <div :class="['chip', filter === 'On the Way' ? 'active' : '']" @click="filter = 'On the Way'">On the Way</div>
                <input
                    class="search-input"
                    type="text"
                    placeholder="Search model / chassis..."
                    v-model="search"
                />
            </div>
            <button class="add-btn" @click="modalOpen = true">
                <i class="ti ti-plus"></i> Add Tractor
            </button>
        </div>

        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Chassis / Reg No.</th>
                        <th>Model</th>
                        <th>HP</th>
                        <th>Colour</th>
                        <th>Stock Date</th>
                        <th>Purchase ₹</th>
                        <th>Sale Price ₹</th>
                        <th>Status</th>
                        <th>Customer</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(t, idx) in filteredTractors" :key="idx">
                        <td>{{ t.chassis }}</td>
                        <td style="font-weight: 600">{{ t.model }}</td>
                        <td>{{ t.hp }}</td>
                        <td>{{ t.colour }}</td>
                        <td>{{ t.stockDate }}</td>
                        <td>{{ t.purchasePrice }}</td>
                        <td>{{ t.salePrice }}</td>
                        <td>
                            <span :class="['pill', t.status === 'In Stock' ? 'p-stock' :
                                    t.status === 'Sold' ? 'p-sold' :
                                        t.status === 'Booked' ? 'p-booked' : 'p-transit'
                            ]">
                                {{ t.status }}
                            </span>
                        </td>
                        <td>{{ t.customer }}</td>
                        <td>
                            <button class="outline-btn">
                                {{ t.status === 'Sold' ? 'View' : t.status === 'On the Way' ? 'Track' : 'Edit' }}
                            </button>
                        </td>
                    </tr>
                    <tr v-if="filteredTractors.length === 0">
                        <td colSpan="10" style="text-align: center; padding: 20px; color: #888">
                            No tractors found matching the criteria.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal :isOpen="modalOpen" @close="modalOpen = false" title="Add new tractor" iconClass="ti ti-tractor">
            <form @submit.prevent="handleAddTractor">
                <div class="form-grid">
                    <div class="form-row">
                        <label>Model</label>
                        <select v-model="formModel">
                            <option v-for="m in modelsList" :key="m" :value="m">{{ m }}</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>HP</label>
                        <input type="number" v-model="formHp" required />
                    </div>
                    <div class="form-row">
                        <label>Chassis / Reg No.</label>
                        <input type="text" placeholder="MH12-AB-1234" v-model="formChassis" required />
                    </div>
                    <div class="form-row">
                        <label>Colour</label>
                        <input type="text" placeholder="Red" v-model="formColour" required />
                    </div>
                    <div class="form-row">
                        <label>Purchase price (₹)</label>
                        <input type="number" placeholder="690000" v-model="formPurchase" required />
                    </div>
                    <div class="form-row">
                        <label>Sale price (₹)</label>
                        <input type="number" placeholder="745000" v-model="formSale" required />
                    </div>
                </div>
                <div class="form-row">
                    <label>Stock date</label>
                    <input type="date" v-model="formDate" required />
                </div>
                <div class="form-row">
                    <label>Remarks</label>
                    <textarea rows="2" placeholder="Optional remarks..." v-model="formRemarks"></textarea>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="modalOpen = false">Cancel</button>
                    <button type="submit" class="add-btn"><i class="ti ti-check"></i> Save Tractor</button>
                </div>
            </form>
        </Modal>
    </div>
</template>
