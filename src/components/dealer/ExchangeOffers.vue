<script setup>
import { ref, computed } from 'vue'
import Modal from '../layout/Modal.vue'

const props = defineProps({
    exchange: { type: Array, required: true }
})

const emit = defineEmits(['update:exchange'])

const modalOpen = ref(false)

// Form states
const formCust = ref('')
const formPhone = ref('')
const formOldTractor = ref('')
const formYear = ref('2015')
const formHours = ref('2500')
const formTradeIn = ref('200000')
const formNewModel = ref('DI 745 III')
const formTopUp = ref('545000')

const parseCurrency = (val) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    return parseInt(val.toString().replace(/,/g, ''), 10) || 0
}

// Compute metrics
const activeOffers = computed(() => props.exchange.filter(e => e.status !== 'Settled' && e.status !== 'Rejected').length)
const underValuation = computed(() => props.exchange.filter(e => e.status.toLowerCase().includes('valuation')).length)
const settledCount = computed(() => props.exchange.filter(e => e.status.toLowerCase() === 'settled').length)
const avgTradeVal = computed(() => props.exchange.length ? props.exchange.reduce((sum, e) => sum + parseCurrency(e.tradeInVal), 0) / props.exchange.length : 0)
const rejectedCount = computed(() => props.exchange.filter(e => e.status.toLowerCase() === 'rejected').length)

const handleAddExchange = () => {
    const newEx = {
        offerId: 'EXC-0' + Math.floor(40 + Math.random() * 50),
        customer: formCust.value || 'Anonymous',
        oldTractor: formOldTractor.value || 'Eicher 241',
        year: parseInt(formYear.value, 10),
        hoursUsed: parseInt(formHours.value, 10).toLocaleString(),
        tradeInVal: parseInt(formTradeIn.value, 10).toLocaleString('en-IN'),
        newModel: formNewModel.value,
        topUpAmt: parseInt(formTopUp.value, 10).toLocaleString('en-IN'),
        status: 'Under valuation'
    }

    emit('update:exchange', [newEx, ...props.exchange])
    modalOpen.value = false

    // Reset
    formCust.value = ''
    formPhone.value = ''
    formOldTractor.value = ''
}
</script>

<template>
    <div class="page active" id="page-exchange">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Active Offers</div><div class="kv" style="color: #5B3EBF">{{ activeOffers }}</div></div>
            <div class="kpi-box"><div class="kl">Under Valuation</div><div class="kv" style="color: #9E6B00">{{ underValuation }}</div></div>
            <div class="kpi-box"><div class="kl">Settled (MTD)</div><div class="kv" style="color: #2D7A3A">{{ settledCount }}</div></div>
            <div class="kpi-box"><div class="kl">Avg Trade-in Val</div><div class="kv">₹{{ (avgTradeVal / 100000).toFixed(1) }}L</div></div>
            <div class="kpi-box"><div class="kl">Rejected</div><div class="kv" style="color: #C0392B">{{ rejectedCount }}</div></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem">
            <p style="font-size: 12px; color: #888">
                Customer trades in old tractor · difference paid or financed for the new tractor
            </p>
            <button class="add-btn" @click="modalOpen = true">
                <i class="ti ti-plus"></i> New Exchange Offer
            </button>
        </div>

        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Offer ID</th>
                        <th>Customer</th>
                        <th>Old Tractor</th>
                        <th>Year</th>
                        <th>Hrs Used</th>
                        <th>Trade-in Val ₹</th>
                        <th>New Model</th>
                        <th>Top-up Amt ₹</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(e, idx) in exchange" :key="idx">
                        <td style="font-weight: 600">{{ e.offerId }}</td>
                        <td style="font-weight: 500">{{ e.customer }}</td>
                        <td>{{ e.oldTractor }}</td>
                        <td>{{ e.year }}</td>
                        <td>{{ e.hoursUsed }}</td>
                        <td>{{ e.tradeInVal }}</td>
                        <td style="font-weight: 600">{{ e.newModel }}</td>
                        <td>{{ e.topUpAmt }}</td>
                        <td>
                            <span :class="['pill', e.status === 'Settled' ? 'p-stock' :
                                    e.status === 'Rejected' ? 'p-overdue' :
                                        e.status === 'Offer made' ? 'p-pending' : 'p-exchange'
                            ]">
                                {{ e.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Modal :isOpen="modalOpen" @close="modalOpen = false" title="New exchange offer" iconClass="ti ti-arrows-exchange">
            <form @submit.prevent="handleAddExchange">
                <div class="form-grid">
                    <div class="form-row">
                        <label>Customer name</label>
                        <input type="text" placeholder="Rajveer Kaur" v-model="formCust" required />
                    </div>
                    <div class="form-row">
                        <label>Phone</label>
                        <input type="text" placeholder="98765-XXXXX" v-model="formPhone" required />
                    </div>
                    <div class="form-row">
                        <label>Old tractor brand / model</label>
                        <input type="text" placeholder="Eicher 241" v-model="formOldTractor" required />
                    </div>
                    <div class="form-row">
                        <label>Year</label>
                        <input type="number" placeholder="2014" v-model="formYear" required />
                    </div>
                    <div class="form-row">
                        <label>Hours used</label>
                        <input type="number" placeholder="3800" v-model="formHours" required />
                    </div>
                    <div class="form-row">
                        <label>Trade-in value (₹)</label>
                        <input type="number" placeholder="140000" v-model="formTradeIn" required />
                    </div>
                    <div class="form-row">
                        <label>New model wanted</label>
                        <select v-model="formNewModel">
                            <option value="DI 745 III">DI 745 III</option>
                            <option value="DI 60 RX">DI 60 RX</option>
                            <option value="Worldtrac 60">Worldtrac 60</option>
                            <option value="SOLIS 5015">SOLIS 5015</option>
                            <option value="DI 750 III">DI 750 III</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <label>Top-up amount (₹)</label>
                        <input type="number" placeholder="605000" v-model="formTopUp" required />
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="modalOpen = false">Cancel</button>
                    <button type="submit" class="add-btn"><i class="ti ti-check"></i> Save Offer</button>
                </div>
            </form>
        </Modal>
    </div>
</template>
