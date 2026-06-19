<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from './utils/api'
import { toastState } from './utils/toast'
import Sidebar from './components/layout/Sidebar.vue'
import Topbar from './components/layout/Topbar.vue'

const getUserFromStorage = () => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
}

const user = ref(getUserFromStorage())

const getCurrentMode = () => {
    const saved = localStorage.getItem('user')
    if (saved) {
        try {
            const u = JSON.parse(saved)
            return u.role
        } catch (e) {
            return 'dealer'
        }
    }
    return 'dealer'
}

const currentMode = ref(getCurrentMode())

// Use route and router for routing-based navigation
const route = useRoute()
const router = useRouter()

// Derived current tab for Sidebar/Topbar alignment
const currentTab = computed(() => {
    return route.name || (user.value?.role === 'admin' ? 'admin-dashboard' : 'dashboard')
})

const getTheme = () => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    return systemPrefersDark ? 'dark' : 'light'
}

const theme = ref(getTheme())

watch(theme, (newVal) => {
    localStorage.setItem('theme', newVal)
    document.body.className = newVal
}, { immediate: true })

const isSidebarOpen = ref(false)

watch(isSidebarOpen, (isOpen) => {
    if (isOpen) {
        document.body.classList.add('sidebar-open-scroll-lock')
    } else {
        document.body.classList.remove('sidebar-open-scroll-lock')
    }
})

const handleThemeToggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const handleLogin = async (username, password) => {
    try {
        const response = await api.post('/auth/login', {
            username,
            password
        });

        const data = response.data;

        // Store user and token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        user.value = data.user;
        currentMode.value = data.user.role;
        
        // Redirect to dashboard on successful login
        router.push(data.user.role === 'admin' ? '/admin-dashboard' : '/dashboard')
        return true;
    } catch (error) {
        console.error('API login error:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Login failed';
        throw new Error(errorMessage);
    }
}

const handleLogout = () => {
    isSidebarOpen.value = false;
    user.value = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('currentTab');
    currentMode.value = 'dealer';
    router.push('/login')
}

// Sidebar route changes
const handleTabChange = (tabId) => {
    router.push({ name: tabId })
}

// Unified Database State
const newTractors = ref([
    { chassis: 'MH12-AB-1234', model: 'DI 745 III', hp: '50', colour: 'Red', stockDate: '01 Jun 2025', purchasePrice: '6,90,000', salePrice: '7,45,000', status: 'In Stock', customer: '—' },
    { chassis: 'MH12-CD-5678', model: 'DI 60 RX', hp: '60', colour: 'Red', stockDate: '05 Jun 2025', purchasePrice: '7,90,000', salePrice: '8,60,000', status: 'In Stock', customer: '—' },
    { chassis: 'PB08-EF-9012', model: 'Worldtrac 60', hp: '60', colour: 'Green', stockDate: '10 May 2025', purchasePrice: '8,40,000', salePrice: '9,10,000', status: 'Sold', customer: 'Harbhajan Singh' },
    { chassis: 'PB08-GH-3456', model: 'DI 750 III', hp: '55', colour: 'Red', stockDate: '12 May 2025', purchasePrice: '7,50,000', salePrice: '8,20,000', status: 'Booked', customer: 'Rajveer Kaur' },
    { chassis: 'HR14-IJ-7890', model: 'SOLIS 5015', hp: '50', colour: 'Orange', stockDate: '18 May 2025', purchasePrice: '6,20,000', salePrice: '6,80,000', status: 'In Stock', customer: '—' },
    { chassis: '—', model: 'DI 745 III', hp: '50', colour: 'Red', stockDate: '—', purchasePrice: '—', salePrice: '7,45,000', status: 'On the Way', customer: '—' }
])

const refurb = ref([
    { id: 'RFB-001', brandModel: 'Mahindra 475', year: 2018, hoursUsed: '1,200 hrs', condition: 'Good', source: 'Exchange', refurbCost: '45,000', askingPrice: '3,20,000', status: 'In Stock' },
    { id: 'RFB-002', brandModel: 'Eicher 368', year: 2016, hoursUsed: '2,400 hrs', condition: 'Fair', source: 'Direct buy', refurbCost: '80,000', askingPrice: '2,60,000', status: 'Sold' },
    { id: 'RFB-003', brandModel: 'John Deere 5050D', year: 2019, hoursUsed: '800 hrs', condition: 'Excellent', source: 'Auction', refurbCost: '30,000', askingPrice: '5,10,000', status: 'In Transit' },
    { id: 'RFB-004', brandModel: 'Sonalika DI 35', year: 2017, hoursUsed: '1,700 hrs', condition: 'Good', source: 'Exchange', refurbCost: '55,000', askingPrice: '2,90,000', status: 'In Stock' },
    { id: 'RFB-005', brandModel: 'New Holland 3230', year: 2015, hoursUsed: '3,100 hrs', condition: 'Fair', source: 'Direct buy', refurbCost: '95,000', askingPrice: '2,20,000', status: 'In Transit' }
])

const transit = ref([
    { orderId: 'TRK-081', model: 'DI 745 III', qty: 3, type: 'New', dispatched: '08 Jun 2025', eta: '16 Jun 2025', transporter: 'Shiv Cargo', vehicleNo: 'PB04-T-4455', status: 'On route' },
    { orderId: 'TRK-082', model: 'SOLIS 5015', qty: 2, type: 'New', dispatched: '10 Jun 2025', eta: '18 Jun 2025', transporter: 'Balaji Transport', vehicleNo: 'HR14-B-7712', status: 'On route' },
    { orderId: 'TRK-083', model: 'John Deere 5050D', qty: 1, type: 'Refurb', dispatched: '05 Jun 2025', eta: '12 Jun 2025', transporter: 'Singh Carriers', vehicleNo: 'MH12-C-9934', status: 'Overdue' },
    { orderId: 'TRK-084', model: 'Worldtrac 60', qty: 2, type: 'New', dispatched: '11 Jun 2025', eta: '19 Jun 2025', transporter: 'Shiv Cargo', vehicleNo: 'PB04-T-4455', status: 'Loading' },
    { orderId: 'TRK-085', model: 'DI 60 RX', qty: 4, type: 'New', dispatched: '13 Jun 2025', eta: '21 Jun 2025', transporter: 'Balaji Transport', vehicleNo: 'HR14-D-2233', status: 'Preparing' }
])

const sales = ref([
    { invoiceNo: 'INV-2025-061', date: '01 Jun', customer: 'Harbhajan Singh', model: 'Worldtrac 60', salePrice: '9,10,000', discount: '15,000', payment: 'Finance', bank: 'SBI', delivery: 'Delivered' },
    { invoiceNo: 'INV-2025-062', date: '03 Jun', customer: 'Tejpal Dhaliwal', model: 'DI 745 III', salePrice: '7,45,000', discount: '0', payment: 'Cash', bank: '—', delivery: 'Delivered' },
    { invoiceNo: 'INV-2025-063', date: '07 Jun', customer: 'Gurmeet Rana', model: 'SOLIS 5015', salePrice: '6,80,000', discount: '10,000', payment: 'Finance', bank: 'PNB', delivery: 'Scheduled' },
    { invoiceNo: 'INV-2025-064', date: '10 Jun', customer: 'Sukhdev Kumar', model: 'Eicher 368 (Refurb)', salePrice: '2,60,000', discount: '5,000', payment: 'Cash', bank: '—', delivery: 'Delivered' },
    { invoiceNo: 'INV-2025-065', date: '12 Jun', customer: 'Balwinder Gill', model: 'DI 60 RX', salePrice: '8,60,000', discount: '20,000', payment: 'Finance', bank: 'Mahindra Fin.', delivery: 'Pending' }
])

const exchange = ref([
    { offerId: 'EXC-041', customer: 'Rajveer Kaur', oldTractor: 'Eicher 241', year: 2014, hoursUsed: '3,800', tradeInVal: '1,40,000', newModel: 'DI 745 III', topUpAmt: '6,05,000', status: 'Under valuation' },
    { offerId: 'EXC-042', customer: 'Balwinder Gill', oldTractor: 'Mahindra 265', year: 2016, hoursUsed: '2,200', tradeInVal: '2,10,000', newModel: 'SOLIS 5015', topUpAmt: '4,70,000', status: 'Offer made' },
    { offerId: 'EXC-043', customer: 'Amarjit Sohal', oldTractor: 'Sonalika DI 35', year: 2015, hoursUsed: '2,700', tradeInVal: '1,90,000', newModel: 'DI 60 RX', topUpAmt: '6,70,000', status: 'Settled' },
    { offerId: 'EXC-044', customer: 'Paramjit Sidhu', oldTractor: 'John Deere 5036', year: 2017, hoursUsed: '1,500', tradeInVal: '3,40,000', newModel: 'Worldtrac 60', topUpAmt: '5,70,000', status: 'Under valuation' },
    { offerId: 'EXC-045', customer: 'Gurjeet Brar', oldTractor: 'Farmtrac 60', year: 2013, hoursUsed: '4,200', tradeInVal: '1,10,000', newModel: 'DI 745 III', topUpAmt: '6,35,000', status: 'Rejected' }
])

const loans = ref([
    { loanId: 'LN-801', customer: 'Harbhajan Singh', model: 'Worldtrac 60', bank: 'SBI', loanAmt: '7,28,000', emi: '16,500', tenure: '60 mo', disbursed: '01 Jun', nextDue: '15 Jun ⚠', status: 'Overdue' },
    { loanId: 'LN-802', customer: 'Gurmeet Rana', model: 'SOLIS 5015', bank: 'PNB', loanAmt: '5,44,000', emi: '12,800', tenure: '60 mo', disbursed: '07 Jun', nextDue: '01 Jul', status: 'Active' },
    { loanId: 'LN-803', customer: 'Rajveer Kaur', model: 'DI 745 III', bank: 'Mahindra Fin.', loanAmt: '8,48,000', emi: '19,200', tenure: '54 mo', disbursed: '—', nextDue: '—', status: 'Pending sanction' },
    { loanId: 'LN-804', customer: 'Balwinder Gill', model: 'DI 60 RX', bank: 'HDFC', loanAmt: '6,88,000', emi: '15,600', tenure: '54 mo', disbursed: '—', nextDue: '—', status: 'Docs pending' }
])

const serviceJobs = ref([
    { jobId: 'JOB-101', customer: 'Harbhajan Singh', model: 'Worldtrac 60', issue: 'Engine oil change + filter', technician: 'Mandeep Kumar', dateIn: '13 Jun', estCompletion: '14 Jun', status: 'In progress' },
    { jobId: 'JOB-102', customer: 'Tejpal Dhaliwal', model: 'DI 745 III', issue: 'Clutch adjustment', technician: 'Ranjit Singh', dateIn: '12 Jun', estCompletion: '12 Jun', status: 'Ready' },
    { jobId: 'JOB-103', customer: 'Gurmeet Rana', model: 'SOLIS 5015', issue: 'PTO shaft not engaging', technician: 'Mandeep Kumar', dateIn: '14 Jun', estCompletion: '18 Jun', status: 'Waiting parts' },
    { jobId: 'JOB-104', customer: 'Amarjit Sohal', model: 'DI 60 RX', issue: 'Annual servicing (AMC)', technician: 'Hardeep Singh', dateIn: '14 Jun', estCompletion: '15 Jun', status: 'In progress' }
])

const customers = ref([
    { name: 'Harbhajan Singh', phone: '98765-XXXXX', village: 'Sidhwan Bet', district: 'Ludhiana', landAcres: 18, purchases: 1, cropType: 'Wheat, Rice', lastContact: '13 Jun', leadStatus: 'Customer' },
    { name: 'Rajveer Kaur', phone: '87654-XXXXX', village: 'Nabha', district: 'Patiala', landAcres: 12, purchases: 0, cropType: 'Cotton', lastContact: '10 Jun', leadStatus: 'Hot lead' },
    { name: 'Gurmeet Dhaliwal', phone: '76543-XXXXX', village: 'Majitha', district: 'Amritsar', landAcres: 25, purchases: 2, cropType: 'Wheat, Maize', lastContact: '09 Jun', leadStatus: 'Customer' },
    { name: 'Paramjit Sidhu', phone: '65432-XXXXX', village: 'Bhadaur', district: 'Barnala', landAcres: 8, purchases: 0, cropType: 'Sunflower', lastContact: '07 Jun', leadStatus: 'Warm lead' },
    { name: 'Sukhdev Kumar', phone: '54321-XXXXX', village: 'Raikot', district: 'Ludhiana', landAcres: 30, purchases: 1, cropType: 'Wheat, Mustard', lastContact: '05 Jun', leadStatus: 'Customer' }
])

// Admin Specific state
const dealers = ref([
    { id: 'Ludhiana-01', repName: 'Gurpreet Singh', region: 'Punjab', stock: 47, salesMtd: 12, target: 20, achievement: 60, revenue: 10390000, refurbSold: 4, exchangeSettled: 3, rating: 4, status: 'Active' },
    { id: 'Amritsar-01', repName: 'Sukhchain Grewal', region: 'Punjab', stock: 62, salesMtd: 28, target: 30, achievement: 93, revenue: 24000000, refurbSold: 7, exchangeSettled: 5, rating: 5, status: 'Active' },
    { id: 'Patiala-01', repName: 'Mandeep Arora', region: 'Punjab', stock: 55, salesMtd: 24, target: 30, achievement: 80, revenue: 21000000, refurbSold: 5, exchangeSettled: 4, rating: 4, status: 'Active' },
    { id: 'Ludhiana-02', repName: 'Avtar Singh', region: 'Punjab', stock: 38, salesMtd: 6, target: 20, achievement: 30, revenue: 5200000, refurbSold: 1, exchangeSettled: 0, rating: 2, status: 'Below target' },
    { id: 'Barnala-01', repName: 'Kulwinder Dhaliwal', region: 'Punjab', stock: 44, salesMtd: 19, target: 30, achievement: 63, revenue: 16000000, refurbSold: 3, exchangeSettled: 2, rating: 3, status: 'Active' },
    { id: 'Rohtak-01', repName: 'Ramesh Yadav', region: 'Haryana', stock: 29, salesMtd: 14, target: 25, achievement: 56, revenue: 11200000, refurbSold: 2, exchangeSettled: 1, rating: 3, status: 'Active' }
])

const complaints = ref([
    { id: 'CMP-201', dealer: 'Ludhiana-02', customer: 'Gurjeet Mann', model: 'DI 745 III', issue: 'Engine overheating', raisedOn: '10 Jun', priority: 'High', status: 'Escalated' },
    { id: 'CMP-202', dealer: 'Patiala-01', customer: 'Satnam Gill', model: 'Worldtrac 60', issue: 'PTO not working', raisedOn: '11 Jun', priority: 'High', status: 'Escalated' },
    { id: 'CMP-203', dealer: 'Ludhiana-01', customer: 'Baljit Rana', model: 'SOLIS 5015', issue: 'Hydraulics weak', raisedOn: '12 Jun', priority: 'Medium', status: 'In progress' },
    { id: 'CMP-204', dealer: 'Amritsar-01', customer: 'Harinder Singh', model: 'DI 60 RX', issue: 'Clutch slipping', raisedOn: '13 Jun', priority: 'Medium', status: 'In progress' },
    { id: 'CMP-205', dealer: 'Barnala-01', customer: 'Paramjit Khaira', model: 'DI 750 III', issue: 'Delivery delayed 1 week', raisedOn: '13 Jun', priority: 'Low', status: 'Open' }
])

const schemes = ref([
    { schemeId: 'SCH-501', name: 'Kharif Bonanza 2025', type: 'Discount', discount: '₹20,000', models: 'DI 745 III, SOLIS', validFrom: '01 Jun', validTo: '30 Jun', region: 'All', status: 'Active' },
    { schemeId: 'SCH-502', name: 'Exchange Utsav', type: 'Exchange', discount: '₹15,000 extra', models: 'All models', validFrom: '01 Jun', validTo: '30 Jun', region: 'Punjab', status: 'Active' },
    { schemeId: 'SCH-503', name: 'SBI Zero Processing', type: 'Finance', discount: '0% fee', models: 'Worldtrac 60', validFrom: '10 Jun', validTo: '30 Jun', region: 'All', status: 'Active' },
    { schemeId: 'SCH-504', name: 'Monsoon Special', type: 'Discount', discount: '₹25,000', models: 'DI 60 RX', validFrom: '01 Jul', validTo: '31 Jul', region: 'All', status: 'Pending approval' }
])

const getRouteProps = (routeName) => {
    if (routeName === 'login') {
        return {
            theme: theme.value,
            onLogin: handleLogin
        }
    }
    if (routeName === 'dashboard') {
        return {
            newTractors: newTractors.value,
            refurb: refurb.value,
            sales: sales.value,
            exchange: exchange.value,
            transit: transit.value,
            loans: loans.value,
            serviceJobs: serviceJobs.value,
            customers: customers.value,
            theme: theme.value
        }
    }
    if (routeName === 'new-tractors') {
        return {
            newTractors: newTractors.value,
            'onUpdate:newTractors': (val) => newTractors.value = val
        }
    }
    if (routeName === 'refurbished') {
        return {
            refurb: refurb.value,
            'onUpdate:refurb': (val) => refurb.value = val
        }
    }
    if (routeName === 'intransit') {
        return { transit: transit.value }
    }
    if (routeName === 'sales') {
        return {
            sales: sales.value,
            'onUpdate:sales': (val) => sales.value = val,
            newTractors: newTractors.value,
            'onUpdate:newTractors': (val) => newTractors.value = val
        }
    }
    if (routeName === 'exchange') {
        return {
            exchange: exchange.value,
            'onUpdate:exchange': (val) => exchange.value = val
        }
    }
    if (routeName === 'finance') {
        return { loans: loans.value }
    }
    if (routeName === 'service') {
        return { serviceJobs: serviceJobs.value }
    }
    if (routeName === 'customers') {
        return {
            customers: customers.value,
            'onUpdate:customers': (val) => customers.value = val
        }
    }
    if (routeName === 'targets') {
        return { sales: sales.value }
    }
    if (routeName === 'reports-dealer') {
        return { sales: sales.value, theme: theme.value }
    }
    if (routeName === 'admin-dashboard') {
        return {
            dealers: dealers.value,
            complaints: complaints.value,
            transitOrders: transit.value,
            schemes: schemes.value,
            sales: sales.value,
            theme: theme.value
        }
    }
    if (routeName === 'all-dealers') {
        return { dealers: dealers.value, sales: sales.value }
    }
    if (routeName === 'dealer-perf') {
        return { dealers: dealers.value, sales: sales.value, theme: theme.value }
    }
    if (routeName === 'admin-inventory') {
        return { sales: sales.value, theme: theme.value }
    }
    if (routeName === 'admin-transit') {
        return { transit: transit.value }
    }
    if (routeName === 'admin-sales') {
        return { sales: sales.value }
    }
    if (routeName === 'targets-admin') {
        return { dealers: dealers.value, sales: sales.value }
    }
    if (routeName === 'admin-finance') {
        return { dealers: dealers.value, sales: sales.value }
    }
    if (routeName === 'admin-complaints') {
        return { complaints: complaints.value }
    }
    if (routeName === 'admin-schemes') {
        return { schemes: schemes.value }
    }
    if (routeName === 'admin-reports') {
        return { theme: theme.value }
    }
    return {}
}
</script>

<template>
    <!-- Standalone Login view handled by Vue Router -->
    <div v-if="route.meta.requiresAuth" class="app">
        <Sidebar 
            :user="user" 
            :currentTab="currentTab" 
            :isOpen="isSidebarOpen"
            @tabChange="handleTabChange" 
            @close="isSidebarOpen = false"
            @logout="handleLogout"
        />
        <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
        <div class="main">
            <Topbar 
                :user="user" 
                :currentTab="currentTab" 
                :theme="theme" 
                @themeToggle="handleThemeToggle" 
                @logout="handleLogout" 
                @toggleSidebar="isSidebarOpen = !isSidebarOpen"
            />
            <div class="content">
                <!-- Dynamic component injected by Vue Router -->
                <router-view v-slot="{ Component, route: currentRoute }">
                    <component :is="Component" v-bind="getRouteProps(currentRoute.name)" />
                </router-view>
            </div>
        </div>
    </div>
    
    <div v-else>
        <!-- Dynamic guest components (Login) injected by Router -->
        <router-view 
            v-bind="getRouteProps(route.name)"
            @themeToggle="handleThemeToggle"
        />
    </div>

    <!-- Global Toast Notification -->
    <div v-if="toastState.show" :class="['toast-notification', `toast-${toastState.type}`]">
        {{ toastState.message }}
    </div>
</template>
