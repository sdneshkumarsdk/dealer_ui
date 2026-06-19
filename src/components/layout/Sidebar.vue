<script setup>
import { computed } from 'vue'
import sonalikaLogo from '../../assets/sonalika.png'

const props = defineProps({
    user: {
        type: Object,
        required: true
    },
    currentTab: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['tabChange', 'close', 'logout'])

const handleTabChange = (tabId) => {
    emit('tabChange', tabId)
    emit('close')
}

const isDealer = computed(() => props.user?.role === 'dealer')

const initials = computed(() => {
    const name = props.user?.username || ''
    if (!name) return 'U'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

const dealerNav = [
    { label: 'Overview', type: 'section' },
    { id: 'dashboard', name: 'Dashboard', icon: 'ti ti-layout-dashboard' },
    { label: 'Inventory', type: 'section' },
    { id: 'new-tractors', name: 'New Tractors', icon: 'ti ti-tractor' },
    { id: 'refurbished', name: 'Refurbished', icon: 'ti ti-tools' },
    { id: 'intransit', name: 'In-Transit', icon: 'ti ti-truck-delivery' },
    { label: 'Sales & Finance', type: 'section' },
    { id: 'sales', name: 'Sales Records', icon: 'ti ti-receipt' },
    { id: 'exchange', name: 'Exchange Offers', icon: 'ti ti-arrows-exchange' },
    { id: 'finance', name: 'Loan & Finance', icon: 'ti ti-credit-card' },
    { label: 'Operations', type: 'section' },
    { id: 'service', name: 'Service & AMC', icon: 'ti ti-settings-2' },
    { id: 'customers', name: 'Customers', icon: 'ti ti-users' },
    { id: 'targets', name: 'My Targets', icon: 'ti ti-target' },
    { id: 'reports-dealer', name: 'Reports', icon: 'ti ti-chart-bar' },
]

const adminNav = [
    { label: 'Overview', type: 'section' },
    { id: 'admin-dashboard', name: 'Admin Dashboard', icon: 'ti ti-layout-dashboard' },
    { label: 'Network', type: 'section' },
    { id: 'all-dealers', name: 'All Dealers', icon: 'ti ti-building-store' },
    { id: 'dealer-perf', name: 'Dealer Performance', icon: 'ti ti-chart-arrows' },
    { label: 'Inventory', type: 'section' },
    { id: 'admin-inventory', name: 'Network Inventory', icon: 'ti ti-packages' },
    { id: 'admin-transit', name: 'All Transit Orders', icon: 'ti ti-truck-delivery' },
    { label: 'Finance & Sales', type: 'section' },
    { id: 'admin-sales', name: 'Network Sales', icon: 'ti ti-cash' },
    { id: 'targets-admin', name: 'Target Management', icon: 'ti ti-target' },
    { id: 'admin-finance', name: 'Loan Overview', icon: 'ti ti-credit-card' },
    { label: 'Operations', type: 'section' },
    { id: 'admin-complaints', name: 'Complaints', icon: 'ti ti-message-exclamation' },
    { id: 'admin-schemes', name: 'Schemes & Offers', icon: 'ti ti-ticket' },
    { id: 'admin-reports', name: 'Reports', icon: 'ti ti-chart-pie' },
    { id: 'admin-users', name: 'User Management', icon: 'ti ti-user-cog' },
]

const currentNav = computed(() => isDealer.value ? dealerNav : adminNav)
</script>

<template>
    <div :class="['sidebar', isOpen ? 'sidebar-open' : '']" id="sidebar">
        <!-- Desktop Sidebar Header -->
        <div class="logo-area desktop-only">
            <div class="logo-brand">
                <img :src="sonalikaLogo" alt="Sonalika Logo" class="sidebar-logo" />
                <span>SONALIKA</span>
            </div>
        </div>

        <!-- Mobile Sidebar Header -->
        <div class="sidebar-user-header mobile-only">
            <div class="suh-left">
                <div class="suh-avatar">
                    {{ initials }}
                </div>
                <div class="suh-info">
                    <div class="suh-name">{{ user?.username }}</div>
                    <div class="suh-role">{{ isDealer ? 'Dealer' : 'Admin' }}</div>
                </div>
            </div>
            <button class="suh-close-btn mobile-only" @click="emit('close')" title="Close menu">
                <i class="ti ti-x"></i>
            </button>
        </div>

        <div class="sidebar-menu-wrapper">
            <template v-for="(item, index) in currentNav" :key="item.type === 'section' ? `lbl-${index}` : item.id">
                <span v-if="item.type === 'section'" class="nav-label">
                    {{ item.label }}
                </span>
                <div
                    v-else
                    :class="['nav-item', currentTab === item.id ? 'active' : '']"
                    @click="handleTabChange(item.id)"
                >
                    <i :class="item.icon"></i> {{ item.name }}
                </div>
            </template>
        </div>

        <!-- Mobile-only Logout Button at Bottom of Sidebar -->
        <div class="sidebar-footer mobile-only">
            <button class="logout-btn sidebar-logout-btn" @click="emit('logout')" title="Sign out of your account">
                <i class="ti ti-logout" style="font-size: 13px"></i>
                <span>Logout</span>
            </button>
        </div>
    </div>
</template>
