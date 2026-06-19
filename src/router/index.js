import { createRouter, createWebHistory } from 'vue-router'

// Route definitions mapping components to paths
const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/layout/Login.vue'),
        meta: { guestOnly: true }
    },

    // Dealer routes
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../components/dealer/Dashboard.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/new-tractors',
        name: 'new-tractors',
        component: () => import('../components/dealer/NewTractors.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/refurbished',
        name: 'refurbished',
        component: () => import('../components/dealer/Refurbished.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/intransit',
        name: 'intransit',
        component: () => import('../components/dealer/InTransit.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/sales',
        name: 'sales',
        component: () => import('../components/dealer/SalesRecords.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/exchange',
        name: 'exchange',
        component: () => import('../components/dealer/ExchangeOffers.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/finance',
        name: 'finance',
        component: () => import('../components/dealer/LoanFinance.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/service',
        name: 'service',
        component: () => import('../components/dealer/ServiceAMC.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/customers',
        name: 'customers',
        component: () => import('../components/dealer/Customers.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/targets',
        name: 'targets',
        component: () => import('../components/dealer/MyTargets.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },
    {
        path: '/reports-dealer',
        name: 'reports-dealer',
        component: () => import('../components/dealer/ReportsDealer.vue'),
        meta: { requiresAuth: true, role: 'dealer' }
    },

    // Admin routes
    {
        path: '/admin-dashboard',
        name: 'admin-dashboard',
        component: () => import('../components/admin/AdminDashboard.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/all-dealers',
        name: 'all-dealers',
        component: () => import('../components/admin/AllDealers.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/dealer-perf',
        name: 'dealer-perf',
        component: () => import('../components/admin/DealerPerformance.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-inventory',
        name: 'admin-inventory',
        component: () => import('../components/admin/NetworkInventory.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-transit',
        name: 'admin-transit',
        component: () => import('../components/admin/AllTransitAdmin.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-sales',
        name: 'admin-sales',
        component: () => import('../components/admin/NetworkSales.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/targets-admin',
        name: 'targets-admin',
        component: () => import('../components/admin/TargetManagement.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-finance',
        name: 'admin-finance',
        component: () => import('../components/admin/LoanOverviewAdmin.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-complaints',
        name: 'admin-complaints',
        component: () => import('../components/admin/Complaints.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-schemes',
        name: 'admin-schemes',
        component: () => import('../components/admin/SchemesOffers.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-reports',
        name: 'admin-reports',
        component: () => import('../components/admin/AdminReports.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },
    {
        path: '/admin-users',
        name: 'admin-users',
        component: () => import('../components/admin/UserManagement.vue'),
        meta: { requiresAuth: true, role: 'admin' }
    },

    // Fallback / redirect
    {
        path: '/:pathMatch(.*)*',
        redirect: () => {
            const token = localStorage.getItem('token')
            const userRaw = localStorage.getItem('user')
            if (token && userRaw) {
                try {
                    const u = JSON.parse(userRaw)
                    return u.role === 'admin' ? '/admin-dashboard' : '/dashboard'
                } catch (e) {
                    return '/login'
                }
            }
            return '/login'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Route navigation guards
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const userRaw = localStorage.getItem('user')
    let user = null

    if (userRaw) {
        try {
            user = JSON.parse(userRaw)
        } catch (e) {
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        }
    }

    // Check authentication
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if (to.meta.guestOnly && token) {
        // If logged in and hitting login page, redirect to their home
        next(user?.role === 'admin' ? '/admin-dashboard' : '/dashboard')
    } else if (to.meta.requiresAuth && to.meta.role && user?.role !== to.meta.role) {
        // Role mismatch: redirect to their corresponding dashboard
        next(user?.role === 'admin' ? '/admin-dashboard' : '/dashboard')
    } else {
        next()
    }
})

export default router
