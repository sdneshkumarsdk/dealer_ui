<script setup>
import { computed } from 'vue'

const props = defineProps({
    loans: { type: Array, required: true }
})

const parseCurrency = (val) => {
    if (typeof val === 'number') return val
    if (!val) return 0
    return parseInt(val.toString().replace(/,/g, ''), 10) || 0
}

const activeCount = computed(() => props.loans.filter(l => l.status.toLowerCase() === 'active').length)
const overdueCount = computed(() => props.loans.filter(l => l.status.toLowerCase() === 'overdue').length)
const totalDisbursed = computed(() => props.loans.filter(l => l.status.toLowerCase() === 'active' || l.status.toLowerCase() === 'overdue')
    .reduce((sum, l) => sum + parseCurrency(l.loanAmt), 0)
)
const pendingSanctions = computed(() => props.loans.filter(l => l.status.toLowerCase().includes('pending') || l.status.toLowerCase().includes('docs')).length)
const avgAmt = computed(() => props.loans.length ? props.loans.reduce((sum, l) => sum + parseCurrency(l.loanAmt), 0) / props.loans.length : 0)
</script>

<template>
    <div class="page active" id="page-finance">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Active EMIs</div><div class="kv">{{ activeCount + overdueCount }}</div></div>
            <div class="kpi-box"><div class="kl">Overdue EMIs</div><div class="kv" style="color: #C0392B">{{ overdueCount }}</div></div>
            <div class="kpi-box"><div class="kl">Loans Disbursed</div><div class="kv">₹{{ (totalDisbursed / 100000).toFixed(1) }}L</div></div>
            <div class="kpi-box"><div class="kl">Pending Sanction</div><div class="kv" style="color: #9E6B00">{{ pendingSanctions }}</div></div>
            <div class="kpi-box"><div class="kl">Avg Loan Amt</div><div class="kv">₹{{ (avgAmt / 100000).toFixed(1) }}L</div></div>
        </div>
        
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Loan ID</th>
                        <th>Customer</th>
                        <th>Model</th>
                        <th>Bank / NBFC</th>
                        <th>Loan Amt ₹</th>
                        <th>EMI ₹/mo</th>
                        <th>Tenure</th>
                        <th>Disbursed</th>
                        <th>Next Due</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(l, idx) in loans" :key="idx">
                        <td style="font-weight: 600">{{ l.loanId }}</td>
                        <td style="font-weight: 500">{{ l.customer }}</td>
                        <td>{{ l.model }}</td>
                        <td>{{ l.bank }}</td>
                        <td>{{ l.loanAmt }}</td>
                        <td>{{ l.emi }}</td>
                        <td>{{ l.tenure }}</td>
                        <td>{{ l.disbursed }}</td>
                        <td>
                            <span v-if="l.status === 'Overdue'" style="color: #C0392B; font-weight: 700">{{ l.nextDue }}</span>
                            <span v-else>{{ l.nextDue }}</span>
                        </td>
                        <td>
                            <span :class="['pill', l.status === 'Active' ? 'p-active' :
                                    l.status === 'Overdue' ? 'p-overdue' : 'p-pending'
                            ]">
                                {{ l.status }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
