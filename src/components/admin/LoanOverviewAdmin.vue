<script setup>
const props = defineProps({
    dealers: { type: Array, required: true },
    sales: { type: Array, required: true }
})
</script>

<template>
    <div class="page active" id="page-admin-finance">
        <div class="kpi-strip">
            <div class="kpi-box"><div class="kl">Total Active Loans</div><div class="kv">312</div></div>
            <div class="kpi-box"><div class="kl">Total Portfolio</div><div class="kv">₹16.2 Cr</div></div>
            <div class="kpi-box"><div class="kl">Overdue (network)</div><div class="kv" style="color: #C0392B">8</div></div>
            <div class="kpi-box"><div class="kl">Pending Sanctions</div><div class="kv" style="color: #9E6B00">22</div></div>
        </div>
        <div class="table-wrap">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Dealer</th>
                        <th>Active Loans</th>
                        <th>Portfolio ₹</th>
                        <th>Overdue</th>
                        <th>Pending Sanctions</th>
                        <th>Top Bank</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Ludhiana-01</td>
                        <td>{{ sales.filter(s => s.payment === 'Finance').length + 8 }}</td>
                        <td>63,00,000</td>
                        <td><span style="color: #C0392B; font-weight: 700">1</span></td>
                        <td>3</td>
                        <td>SBI</td>
                    </tr>
                    <tr>
                        <td>Amritsar-01</td>
                        <td>38</td>
                        <td>1,97,60,000</td>
                        <td>0</td>
                        <td>4</td>
                        <td>PNB</td>
                    </tr>
                    <tr>
                        <td>Patiala-01</td>
                        <td>31</td>
                        <td>1,61,20,000</td>
                        <td><span style="color: #C0392B; font-weight: 700">2</span></td>
                        <td>3</td>
                        <td>Mahindra Fin.</td>
                    </tr>
                    <tr>
                        <td>Ludhiana-02</td>
                        <td>9</td>
                        <td>46,80,000</td>
                        <td><span style="color: #C0392B; font-weight: 700">3</span></td>
                        <td>1</td>
                        <td>SBI</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
