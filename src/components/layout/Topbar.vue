<script setup>
import { computed } from 'vue'
import sonalikaLogo from '../../assets/sonalika.png'

const props = defineProps({
    user: {
        type: Object,
        default: null
    },
    currentTab: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['themeToggle', 'logout', 'toggleSidebar'])

const pageTitles = {
    'dashboard': 'Dashboard',
    'new-tractors': 'New Tractors',
    'refurbished': 'Refurbished Tractors',
    'intransit': 'In-Transit Orders',
    'sales': 'Sales Records',
    'exchange': 'Exchange Offers',
    'finance': 'Loan & Finance',
    'service': 'Service & AMC',
    'customers': 'Customers',
    'targets': 'My Targets',
    'reports-dealer': 'Reports',
    'admin-dashboard': 'Dashboard',
    'all-dealers': 'All Dealers',
    'dealer-perf': 'Dealer Performance',
    'admin-inventory': 'Network Inventory',
    'admin-transit': 'All Transit Orders',
    'admin-sales': 'Network Sales',
    'targets-admin': 'Target Management',
    'admin-finance': 'Loan Overview',
    'admin-complaints': 'Complaints',
    'admin-schemes': 'Schemes & Offers',
    'admin-reports': 'Admin Reports',
    'admin-users': 'User Management'
}

const isAdmin = computed(() => props.user?.role === 'admin')
const pageTitle = computed(() => pageTitles[props.currentTab] || props.currentTab)
const mobilePageTitle = computed(() => props.currentTab === 'admin-dashboard' ? 'Dashboard' : pageTitle.value)
</script>

<template>
    <div class="topbar">
        <!-- Desktop Topbar Layout -->
        <div class="topbar-left desktop-only">
            <div class="topbar-title" id="page-title">{{ pageTitle }}</div>
        </div>
        <div class="topbar-right desktop-only">
            <button class="theme-toggle-btn" @click="emit('themeToggle')" :title="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`">
                <i :class="theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon'" style="font-size: 15px"></i>
            </button>
            <button v-if="user" class="logout-btn" @click="emit('logout')" id="logout-btn" title="Sign out of your account">
                <i class="ti ti-logout" style="font-size: 13px"></i>
                <span>Logout</span>
            </button>
        </div>

        <!-- Mobile Topbar Layout -->
        <div class="mobile-topbar-wrapper mobile-only">
            <div class="mobile-topbar-left">
                <img :src="sonalikaLogo" alt="Sonalika Icon" class="mobile-topbar-logo" />
                <span class="mobile-topbar-divider">|</span>
                <span class="mobile-topbar-title">{{ mobilePageTitle }}</span>
            </div>
            <div class="mobile-topbar-right">
                <button class="mobile-theme-toggle" @click="emit('themeToggle')" title="Toggle light/dark theme">
                    <i :class="theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon'"></i>
                </button>
                <button class="mobile-hamburger-btn" @click="emit('toggleSidebar')" title="Open menu">
                    <i class="ti ti-menu-2"></i>
                </button>
            </div>
        </div>
    </div>
</template>
