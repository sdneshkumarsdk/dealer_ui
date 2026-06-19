<script setup>
import { ref, computed } from 'vue'
import Modal from '../layout/Modal.vue'

const props = defineProps({
    refurb: { type: Array, required: true }
})

const emit = defineEmits(['update:refurb'])

const filter = ref('')
const modalOpen = ref(false)

// Form states
const formBrandModel = ref('')
const formYear = ref('2018')
const formHours = ref('1200')
const formCondition = ref('Good')
const formSource = ref('Exchange')
const formRefurbCost = ref('45000')
const formPrice = ref('320000')
const formStatus = ref('In Stock')

// Computations
const totalStock = computed(() => props.refurb.filter(r => r.status === 'In Stock').length)
const totalSold = computed(() => props.refurb.filter(r => r.status === 'Sold').length)
const totalTransit = computed(() => props.refurb.filter(r => r.status === 'In Transit').length)

const handleAddRefurb = () => {
    const newRef = {
        id: 'RFB-' + Math.floor(100 + Math.random() * 900),
        brandModel: formBrandModel.value || 'Mahindra 475',
        year: parseInt(formYear.value, 10),
        hoursUsed: parseInt(formHours.value, 10).toLocaleString() + ' hrs',
        condition: formCondition.value,
        source: formSource.value,
        refurbCost: parseInt(formRefurbCost.value, 10).toLocaleString('en-IN'),
        askingPrice: parseInt(formPrice.value, 10).toLocaleString('en-IN'),
        status: formStatus.value
    }
    
    emit('update:refurb', [newRef, ...props.refurb])
    modalOpen.value = false
    
    // Reset
    formBrandModel.value = ''
}

const filteredRefurb = computed(() => {
    return props.refurb.filter(r => {
        return !filter.value || r.status.toLowerCase() === filter.value.toLowerCase()
    })
})
</script>

<template>
    <div class="page active" id="page-refurbished">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">In Stock</div><div class="kv" style="color: #7A1A9A">{{ totalStock }}</div></div>
            <div class="kpi-box"><div class="kl">Sold</div><div class="kv" style="color: #C0430A">{{ totalSold }}</div></div>
            <div class="kpi-box"><div class="kl">In Transit</div><div class="kv" style="color: #1A5FAB">{{ totalTransit }}</div></div>
            <div class="kpi-box"><div class="kl">Avg Purchase Val</div><div class="kv">₹2.1L</div></div>
            <div class="kpi-box"><div class="kl">Avg Resale Val</div><div class="kv">₹3.8L</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem">
            <div class="filter-row" style="margin-bottom: 0">
                <div :class="['chip', filter === '' ? 'active' : '']" @click="filter = ''">All</div>
                <div :class="['chip', filter === 'In Stock' ? 'active' : '']" @click="filter = 'In Stock'">In Stock</div>
                <div :class="['chip', filter === 'Sold' ? 'active' : '']" @click="filter = 'Sold'">Sold</div>
                <div :class="['chip', filter === 'In Transit' ? 'active' : '']" @click="filter = 'In Transit'">In Transit</div>
            </div>
            <button class="add-btn" @click="modalOpen = true">
                <i class="ti ti-plus"></i> Add Refurb
            </button>
        </div>

        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Brand / Model</th>
                        <th>Year</th>
                        <th>Hours Used</th>
                        <th>Condition</th>
                        <th>Source</th>
                        <th>Refurb Cost ₹</th>
                        <th>Asking Price ₹</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(r, idx) in filteredRefurb" :key="idx">
                        <td>{{ r.id }}</td>
                        <td style="font-weight: 600">{{ r.brandModel }}</td>
                        <td>{{ r.year }}</td>
                        <td>{{ r.hoursUsed }}</td>
                        <td>
                            <span class="pill" :style="{
                                background: r.condition === 'Excellent' ? '#E6F9F1' : r.condition === 'Good' ? '#E7F5EC' : '#FFFBE6',
                                color: r.condition === 'Excellent' ? '#0D6B40' : r.condition === 'Good' ? '#1E6B30' : '#7A5C00',
                                border: r.condition === 'Excellent' ? '1px solid #7DD8A8' : r.condition === 'Good' ? '1px solid #A0D9B0' : '1px solid #F0D870'
                            }">
                                {{ r.condition }}
                            </span>
                        </td>
                        <td>{{ r.source }}</td>
                        <td>{{ r.refurbCost }}</td>
                        <td>{{ r.askingPrice }}</td>
                        <td>
                            <span :class="['pill', r.status === 'In Stock' ? 'p-stock' :
                                    r.status === 'Sold' ? 'p-sold' : 'p-transit'
                            ]">
                                {{ r.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal :isOpen="modalOpen" @close="modalOpen = false" title="Add refurbished tractor" iconClass="ti ti-tools">
            <form @submit.prevent="handleAddRefurb">
                <div class="form-grid">
                    <div class="form-row">
                        <label>Brand / Model</label>
                        <input type="text" placeholder="Mahindra 475" v-model="formBrandModel" required />
                    </div>
                    <div class="form-row">
                        <label>Year of manufacture</label>
                        <input type="number" placeholder="2018" v-model="formYear" required />
                    </div>
                    <div class="form-row">
                        <label>Hours used</label>
                        <input type="number" placeholder="1200" v-model="formHours" required />
                    </div>
                    <div class="form-row">
                        <label>Condition</label>
                        <select v-model="formCondition">
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Source</label>
                        <select v-model="formSource">
                            <option value="Exchange">Exchange trade-in</option>
                            <option value="Direct buy">Direct purchase</option>
                            <option value="Auction">Auction</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Refurb cost (₹)</label>
                        <input type="number" placeholder="45000" v-model="formRefurbCost" required />
                    </div>
                    <div class="form-row">
                        <label>Asking price (₹)</label>
                        <input type="number" placeholder="320000" v-model="formPrice" required />
                    </div>
                    <div class="form-row">
                        <label>Status</label>
                        <select v-model="formStatus">
                            <option value="In Stock">In Stock</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Sold">Sold</option>
                        </select>
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="modalOpen = false">Cancel</button>
                    <button type="submit" class="add-btn"><i class="ti ti-check"></i> Save</button>
                </div>
            </form>
        </Modal>
    </div>
</template>
