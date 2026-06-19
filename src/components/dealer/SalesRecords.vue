<script setup>
import { ref, computed } from 'vue'
import Modal from '../layout/Modal.vue'

const props = defineProps({
    sales: { type: Array, required: true },
    newTractors: { type: Array, required: true }
})

const emit = defineEmits(['update:sales', 'update:newTractors'])

const search = ref('')
const modalOpen = ref(false)

// Form states
const formCust = ref('')
const formDate = ref('2025-06-16')
const formModel = ref('DI 745 III')
const formPrice = ref('745000')
const formDiscount = ref('0')
const formPayment = ref('Finance')
const formBank = ref('')
const formDelivery = ref('2025-06-16')

// Helper
const parseCurrency = (val) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    return parseInt(val.toString().replace(/,/g, ''), 10) || 0
}

// Computations
const totalSalesCount = computed(() => props.sales.length)
const totalRevenue = computed(() => props.sales.reduce((sum, s) => sum + parseCurrency(s.salePrice), 0))
const cashSales = computed(() => props.sales.filter(s => s.payment.toLowerCase() === 'cash').length)
const financeSales = computed(() => props.sales.filter(s => s.payment.toLowerCase() === 'finance').length)
const pendingDelivery = computed(() => props.sales.filter(s => s.delivery.toLowerCase() === 'pending' || s.delivery.toLowerCase() === 'scheduled').length)

const handleRecordSale = () => {
    const newSale = {
        invoiceNo: 'INV-2025-' + Math.floor(100 + Math.random() * 900),
        date: formDate.value ? new Date(formDate.value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—',
        customer: formCust.value || 'Anonymous',
        model: formModel.value,
        salePrice: parseInt(formPrice.value, 10).toLocaleString('en-IN'),
        discount: parseInt(formDiscount.value, 10).toLocaleString('en-IN'),
        payment: formPayment.value,
        bank: formPayment.value === 'Finance' ? formBank.value || 'SBI' : '—',
        delivery: 'Pending'
    }

    emit('update:sales', [newSale, ...props.sales])

    // Update tractor stock if matching model is In Stock
    const idx = props.newTractors.findIndex(t => t.model === formModel.value && t.status === 'In Stock')
    if (idx !== -1) {
        const updatedTractors = [...props.newTractors]
        updatedTractors[idx] = { ...updatedTractors[idx], status: 'Sold', customer: formCust.value }
        emit('update:newTractors', updatedTractors)
    }

    modalOpen.value = false
    formCust.value = ''
    formDiscount.value = '0'
    formBank.value = ''
}

const filteredSales = computed(() => {
    return props.sales.filter(s => {
        return !search.value ||
            s.customer.toLowerCase().includes(search.value.toLowerCase()) ||
            s.invoiceNo.toLowerCase().includes(search.value.toLowerCase()) ||
            s.model.toLowerCase().includes(search.value.toLowerCase())
    })
})

const handleModelChange = (e) => {
    const target = e.target
    const val = target.value
    formModel.value = val
    if (val.includes('745')) formPrice.value = '745000'
    else if (val.includes('60')) formPrice.value = '860000'
    else if (val.includes('5015')) formPrice.value = '680000'
    else if (val.includes('750')) formPrice.value = '820000'
}
</script>

<template>
    <div class="page active" id="page-sales">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Total Sales (MTD)</div><div class="kv" style="color: #C0430A">{{ totalSalesCount }}</div></div>
            <div class="kpi-box"><div class="kl">Revenue (MTD)</div><div class="kv">₹{{ (totalRevenue / 100000).toFixed(1) }}L</div></div>
            <div class="kpi-box"><div class="kl">Cash Sales</div><div class="kv">{{ cashSales }}</div></div>
            <div class="kpi-box"><div class="kl">Finance Sales</div><div class="kv">{{ financeSales }}</div></div>
            <div class="kpi-box"><div class="kl">Pending Delivery</div><div class="kv" style="color: #9E6B00">{{ pendingDelivery }}</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem">
            <input
                class="search-input"
                type="text"
                placeholder="Search customer / invoice..."
                v-model="search"
            />
            <button class="add-btn" @click="modalOpen = true">
                <i class="ti ti-plus"></i> Record Sale
            </button>
        </div>

        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Invoice No.</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Model</th>
                        <th>Sale Price ₹</th>
                        <th>Discount ₹</th>
                        <th>Payment</th>
                        <th>Bank / NBFC</th>
                        <th>Delivery</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(s, idx) in filteredSales" :key="idx">
                        <td style="font-weight: 600">{{ s.invoiceNo }}</td>
                        <td>{{ s.date }}</td>
                        <td style="font-weight: 500">{{ s.customer }}</td>
                        <td>{{ s.model }}</td>
                        <td>{{ s.salePrice }}</td>
                        <td>{{ s.discount }}</td>
                        <td>
                            <span :class="['pill', s.payment === 'Cash' ? 'p-stock' : 'p-transit']">
                                {{ s.payment }}
                            </span>
                        </td>
                        <td>{{ s.bank }}</td>
                        <td>
                            <span :class="['pill', s.delivery === 'Delivered' ? 'p-sold' :
                                    s.delivery === 'Scheduled' ? 'p-pending' : 'p-refurb'
                            ]">
                                {{ s.delivery }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal :isOpen="modalOpen" @close="modalOpen = false" title="Record sale" iconClass="ti ti-receipt">
            <form @submit.prevent="handleRecordSale">
                <div class="form-grid">
                    <div class="form-row">
                        <label>Customer name</label>
                        <input type="text" placeholder="Harbhajan Singh" v-model="formCust" required />
                    </div>
                    <div class="form-row">
                        <label>Invoice date</label>
                        <input type="date" v-model="formDate" required />
                    </div>
                    <div class="form-row">
                        <label>Model sold</label>
                        <select :value="formModel" @change="handleModelChange">
                            <option value="DI 745 III">DI 745 III</option>
                            <option value="DI 60 RX">DI 60 RX</option>
                            <option value="Worldtrac 60">Worldtrac 60</option>
                            <option value="SOLIS 5015">SOLIS 5015</option>
                            <option value="DI 750 III">DI 750 III</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Sale price (₹)</label>
                        <input type="number" v-model="formPrice" required />
                    </div>
                    <div class="form-row">
                        <label>Discount given (₹)</label>
                        <input type="number" placeholder="0" v-model="formDiscount" required />
                    </div>
                    <div class="form-row">
                        <label>Payment mode</label>
                        <select v-model="formPayment">
                            <option value="Finance">Finance</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="RTGS">RTGS</option>
                        </select>
                    </div>
                    <div v-if="formPayment === 'Finance'" class="form-row">
                        <label>Bank / NBFC</label>
                        <input type="text" placeholder="SBI, PNB, Mahindra Finance..." v-model="formBank" required />
                    </div>
                    <div class="form-row">
                        <label>Delivery date</label>
                        <input type="date" v-model="formDelivery" required />
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="modalOpen = false">Cancel</button>
                    <button type="submit" class="add-btn"><i class="ti ti-check"></i> Save Sale</button>
                </div>
            </form>
        </Modal>
    </div>
</template>
