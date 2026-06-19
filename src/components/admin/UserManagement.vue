<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../../utils/api'
import { toast } from '../../utils/toast'

const users = ref([])
const loading = ref(false)
const showModal = ref(false)

// Form States
const name = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const role = ref('dealer')
const status = ref('active')
const showPassword = ref(false)
const modalError = ref('')
const modalLoading = ref(false)

const errors = ref({
    name: '',
    username: '',
    email: '',
    password: ''
})

// Edit Mode States
const isEditMode = ref(false)
const selectedUserId = ref(null)

// Delete Mode States
const showDeleteModal = ref(false)
const userToDelete = ref(null)

// Search & Pagination States
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const totalUsersCount = ref(0)
const stats = ref({ total: 0, dealers: 0, admins: 0, active: 0 })

const totalUsers = computed(() => stats.value.total)
const dealerCount = computed(() => stats.value.dealers)
const adminCount = computed(() => stats.value.admins)
const activeCount = computed(() => stats.value.active)

const totalPages = computed(() => Math.ceil(totalUsersCount.value / itemsPerPage) || 1)

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const pages = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i)
        }
    } else {
        // Always include first page
        pages.push(1)

        if (current > 4) {
            pages.push('...')
        }

        // Determine range around current page
        let start = Math.max(2, current - 2)
        let end = Math.min(total - 1, current + 2)

        // Adjust if close to boundaries
        if (current <= 4) {
            start = 2
            end = 5
        } else if (current >= total - 3) {
            start = total - 4
            end = total - 1
        }

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (current < total - 3) {
            pages.push('...')
        }

        // Always include last page
        pages.push(total)
    }
    return pages
})

const paginatedUsers = computed(() => users.value)

let debounceTimeout = null

watch(searchQuery, () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
        if (currentPage.value === 1) {
            fetchUsers()
        } else {
            currentPage.value = 1
        }
    }, 300)
})

watch(currentPage, () => {
    fetchUsers()
})

const fetchUsers = async () => {
    loading.value = true
    try {
        const response = await api.get('/auth/users', {
            params: {
                limit: itemsPerPage,
                page: currentPage.value,
                search: searchQuery.value
            }
        })
        users.value = response.data.rows
        totalUsersCount.value = response.data.count
        stats.value = response.data.stats || { total: 0, dealers: 0, admins: 0, active: 0 }
    } catch (error) {
        console.error('Failed to load users:', error)
        toast.error(error.response?.data?.error || error.message || 'Failed to load users.')
    } finally {
        loading.value = false
    }
}

const openModal = () => {
    isEditMode.value = false
    selectedUserId.value = null
    showModal.value = true
    name.value = ''
    username.value = ''
    email.value = ''
    password.value = ''
    role.value = 'dealer'
    status.value = 'active'
    showPassword.value = false
    modalError.value = ''
    errors.value = { name: '', username: '', email: '', password: '' }
}

const editUser = (u) => {
    isEditMode.value = true
    selectedUserId.value = u.id
    name.value = u.name || ''
    username.value = u.username || ''
    email.value = u.email || ''
    password.value = '' // password is optional on edit
    role.value = u.role || 'dealer'
    status.value = u.status || 'active'
    showPassword.value = false
    modalError.value = ''
    errors.value = { name: '', username: '', email: '', password: '' }
    showModal.value = true
}

const handleCreateUser = async () => {
    // Reset errors
    errors.value = { name: '', username: '', email: '', password: '' }
    modalError.value = ''

    const trimmedName = name.value ? name.value.trim() : ''
    const trimmedUsername = username.value ? username.value.trim() : ''
    const trimmedEmail = email.value ? email.value.trim() : ''
    const trimmedPassword = password.value ? password.value.trim() : ''

    let hasErrors = false

    if (!trimmedName) {
        errors.value.name = 'Full name is required.'
        hasErrors = true
    }
    if (!trimmedUsername) {
        errors.value.username = 'Username is required.'
        hasErrors = true
    }
    if (!trimmedEmail) {
        errors.value.email = 'Email address is required.'
        hasErrors = true
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmedEmail)) {
            errors.value.email = 'Please enter a valid email address.'
            hasErrors = true
        }
    }
    if (!isEditMode.value && !trimmedPassword) {
        errors.value.password = 'Password is required.'
        hasErrors = true
    }

    if (hasErrors) {
        return
    }

    modalLoading.value = true
    modalError.value = ''
    try {
        const payload = {
            name: trimmedName,
            username: trimmedUsername,
            email: trimmedEmail,
            role: role.value,
            status: status.value
        }
        if (trimmedPassword) {
            payload.password = trimmedPassword
        }

        if (isEditMode.value) {
            await api.put(`/auth/users/${selectedUserId.value}`, payload)
            toast.success('User updated successfully')
        } else {
            await api.post('/auth/register', payload)
            toast.success('User created successfully')
        }
        
        showModal.value = false
        await fetchUsers()
    } catch (error) {
        console.error('Failed to save user:', error)
        const errMsg = error.response?.data?.error || error.message || 'Operation failed.'
        modalError.value = errMsg
        toast.error(errMsg)
    } finally {
        modalLoading.value = false
    }
}

const openDeleteModal = (u) => {
    if (u.role === 'admin') return
    userToDelete.value = u
    showDeleteModal.value = true
}

const handleDeleteUser = async () => {
    if (!userToDelete.value) return
    const userId = userToDelete.value.id
    showDeleteModal.value = false
    userToDelete.value = null
    loading.value = true
    try {
        await api.delete(`/auth/users/${userId}`)
        toast.success('User deleted successfully')
        await fetchUsers()
    } catch (error) {
        console.error('Failed to delete user:', error)
        toast.error(error.response?.data?.error || error.message || 'Deletion failed.')
        await fetchUsers()
    }
}

onMounted(() => {
    fetchUsers()
})
</script>

<template>
    <div class="page active" id="page-admin-users">
        <!-- Page Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem">
            <div>
                <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0">Create and manage user accounts</h2>
            </div>
            <button class="add-btn" @click="openModal" style="white-space: nowrap">
                <i class="ti ti-plus"></i> Add user
            </button>
        </div>

        <!-- KPI Strip -->
        <div class="kpi-strip" style="margin-bottom: 1.5rem">
            <div class="kpi-box"><div class="kl">Total Users</div><div class="kv">{{ totalUsers }}</div></div>
            <div class="kpi-box"><div class="kl">Dealers</div><div class="kv">{{ dealerCount }}</div></div>
            <div class="kpi-box"><div class="kl">Admins</div><div class="kv">{{ adminCount }}</div></div>
            <div class="kpi-box"><div class="kl">Active</div><div class="kv" style="color: #00e676">{{ activeCount }}</div></div>
        </div>

        <!-- Controls: Search & Showing count -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px">
            <div style="position: relative; display: flex; align-items: center">
                <i class="ti ti-search" style="position: absolute; left: 12px; color: var(--text-muted); font-size: 14px; pointer-events: none"></i>
                <input
                    class="search-input"
                    type="text"
                    placeholder="Search name, email, username..."
                    v-model="searchQuery"
                    style="padding-left: 32px; width: 280px"
                />
            </div>
            <div style="font-size: 12.5px; color: var(--text-muted)">
                Showing {{ totalUsersCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalUsersCount) }} of {{ totalUsersCount }} users
            </div>
        </div>

        <!-- Table View -->
        <div class="table-wrap" style="overflow-x: auto">
            <table class="tbl">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted, #888)">
                            <div style="display: flex; align-items: center; justify-content: center; gap: 8px">
                                <i class="ti ti-loader animate-spin" style="font-size: 16px; color: var(--color-brand, #ff5a1f)"></i>
                                <span>Loading users list...</span>
                            </div>
                        </td>
                    </tr>
                    <template v-else>
                        <tr v-for="u in paginatedUsers" :key="u.id">
                            <td style="font-weight: 600">{{ u.name }}</td>
                            <td>{{ u.username }}</td>
                            <td>
                                <span class="tag" :style="{
                                    background: u.role === 'admin' ? '#FFF5F2' : '#F4F6F9',
                                    color: u.role === 'admin' ? '#C0430A' : '#666'
                                }">
                                    {{ u.role.charAt(0).toUpperCase() + u.role.slice(1) }}
                                </span>
                            </td>
                            <td>{{ u.email }}</td>
                            <td>
                                <span :class="['pill', u.status === 'active' ? 'p-active' : 'p-overdue']">
                                    {{ u.status ? u.status.charAt(0).toUpperCase() + u.status.slice(1) : 'Active' }}
                                </span>
                            </td>
                            <td style="white-space: nowrap">
                                <button class="outline-btn" @click="editUser(u)" style="padding: 4px 8px; font-size: 11.5px; margin-right: 6px; border-color: var(--color-info, #2979ff); color: var(--color-info, #2979ff)">
                                    <i class="ti ti-edit"></i> Edit
                                </button>
                                <button 
                                    class="outline-btn" 
                                    :disabled="u.role === 'admin'"
                                    @click="openDeleteModal(u)" 
                                    :style="{
                                        padding: '4px 8px',
                                        fontSize: '11.5px',
                                        borderColor: 'var(--color-danger, #ff1744)',
                                        color: 'var(--color-danger, #ff1744)',
                                        opacity: u.role === 'admin' ? 0.45 : 1,
                                        cursor: u.role === 'admin' ? 'not-allowed' : 'pointer'
                                    }"
                                    :title="u.role === 'admin' ? 'Admin accounts cannot be deleted' : 'Delete user account'"
                                >
                                    <i class="ti ti-trash"></i> Delete
                                </button>
                            </td>
                        </tr>
                        <tr v-if="totalUsersCount === 0">
                            <td colspan="6" style="text-align: center; padding: 20px; color: #888">
                                No users found.
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="!loading && totalPages > 1" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding: 0.5rem 0; flex-wrap: wrap; gap: 12px">
            <!-- Left Side: Page Numbers with Ellipsis -->
            <div style="display: flex; gap: 6px; align-items: center">
                <template v-for="(p, idx) in visiblePages" :key="idx">
                    <span 
                        v-if="p === '...'" 
                        style="color: var(--text-subtle, #64748b); padding: 6px 12px; font-size: 13px; font-weight: 600"
                    >
                        ...
                    </span>
                    <button 
                        v-else
                        class="page-btn" 
                        :class="{ active: currentPage === p }"
                        @click="currentPage = p"
                    >
                        {{ p }}
                    </button>
                </template>
            </div>

            <!-- Right Side: Navigation buttons ( < , Prev, current/total, Next , > ) -->
            <div style="display: flex; gap: 8px; align-items: center">
                <!-- First Page Button (<) -->
                <button 
                    class="page-btn" 
                    :disabled="currentPage === 1" 
                    @click="currentPage = 1"
                    title="First Page"
                    style="padding: 6px 10px; display: flex; align-items: center; justify-content: center"
                >
                    <i class="ti ti-chevron-left"></i>
                </button>

                <!-- Previous Page Button (Prev) -->
                <button 
                    class="page-btn" 
                    :disabled="currentPage === 1" 
                    @click="currentPage--"
                >
                    Prev
                </button>

                <!-- Current / Total Page Status -->
                <span class="page-info">
                    {{ currentPage }} / {{ totalPages }}
                </span>

                <!-- Next Page Button (Next) -->
                <button 
                    class="page-btn" 
                    :disabled="currentPage === totalPages" 
                    @click="currentPage++"
                >
                    Next
                </button>

                <!-- Last Page Button (>) -->
                <button 
                    class="page-btn" 
                    :disabled="currentPage === totalPages" 
                    @click="currentPage = totalPages"
                    title="Last Page"
                    style="padding: 6px 10px; display: flex; align-items: center; justify-content: center"
                >
                    <i class="ti ti-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- User Registration/Edit Modal Overlay -->
        <div v-if="showModal" class="modal-overlay">
            <div class="modal-card">
                <div class="modal-header">
                    <h3>{{ isEditMode ? 'Edit User Details' : 'Register New User' }}</h3>
                    <button class="close-btn" @click="showModal = false">&times;</button>
                </div>
                <form @submit.prevent="handleCreateUser" class="modal-form" novalidate>
                    <div class="form-grid-row">
                        <div class="form-row">
                            <label for="reg-name">FULL NAME *</label>
                            <input 
                                id="reg-name" 
                                type="text" 
                                v-model="name" 
                                placeholder="E.g., Amit Singh" 
                                :class="{ 'input-error': errors.name }"
                                @input="errors.name = ''"
                            />
                            <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                        </div>

                        <div class="form-row">
                            <label for="reg-username">USERNAME *</label>
                            <input 
                                id="reg-username" 
                                type="text" 
                                v-model="username" 
                                placeholder="E.g., amitsingh123" 
                                :class="{ 'input-error': errors.username }"
                                @input="errors.username = ''"
                            />
                            <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
                        </div>
                    </div>

                    <div class="form-grid-row">
                        <div class="form-row">
                            <label for="reg-email">EMAIL ADDRESS *</label>
                            <input 
                                id="reg-email" 
                                type="email" 
                                v-model="email" 
                                placeholder="E.g., amit@sonalika.com" 
                                :class="{ 'input-error': errors.email }"
                                @input="errors.email = ''"
                            />
                            <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
                        </div>

                        <div class="form-row">
                            <label for="reg-password">
                                PASSWORD 
                                <span v-if="!isEditMode">*</span>
                                <span v-else style="font-size: 10px; font-weight: normal; color: var(--text-muted)">(LEAVE BLANK TO KEEP UNCHANGED)</span>
                            </label>
                            <div style="position: relative; display: flex; align-items: center">
                                <input 
                                    id="reg-password" 
                                    :type="showPassword ? 'text' : 'password'" 
                                    v-model="password" 
                                    placeholder="••••••••" 
                                    :class="{ 'input-error': errors.password }"
                                    style="width: 100%; padding-right: 40px !important"
                                    @input="errors.password = ''"
                                />
                                <i 
                                    :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'" 
                                    style="position: absolute; right: 12px; cursor: pointer; color: var(--text-subtle, #94a3b8); font-size: 16px; z-index: 10"
                                    @click="showPassword = !showPassword"
                                ></i>
                            </div>
                            <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
                        </div>
                    </div>

                    <div class="form-grid-row">
                        <div class="form-row">
                            <label for="reg-role">ROLE *</label>
                            <select id="reg-role" v-model="role" :disabled="isEditMode">
                                <option value="dealer">Dealer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div class="form-row">
                            <label for="reg-status">STATUS *</label>
                            <select id="reg-status" v-model="status">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="cancel-btn" @click="showModal = false">Cancel</button>
                        <button type="submit" class="submit-btn" :disabled="modalLoading">
                            <span v-if="modalLoading">Saving...</span>
                            <span v-else>{{ isEditMode ? 'Save Changes' : 'Create User' }}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal Overlay -->
        <div v-if="showDeleteModal" class="modal-overlay">
            <div class="modal-card" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Delete User Account</h3>
                    <button class="close-btn" @click="showDeleteModal = false">&times;</button>
                </div>
                <div class="modal-form" style="padding: 1.5rem 1.5rem 1.25rem;">
                    <p style="font-size: 15px; font-weight: 500; color: var(--text-primary); margin: 0; line-height: 1.5; text-align: left;">
                        Are you sure you want to permanently delete user "{{ userToDelete?.name }}"?
                    </p>
                </div>
                <div class="modal-actions" style="padding: 1rem 1.5rem 1.25rem; border-top: 1px solid var(--border-color); margin-top: 0;">
                    <button type="button" class="cancel-btn" @click="showDeleteModal = false">Cancel</button>
                    <button 
                        type="button" 
                        @click="handleDeleteUser" 
                        class="submit-btn"
                        style="background: var(--color-danger, #ff1744);"
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-card {
    background: var(--modal-bg-gradient, var(--card-bg, #ffffff));
    color: var(--text-primary, #333333);
    width: 95%;
    max-width: 650px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid var(--border-color);
    overflow: hidden;
    animation: scaleUp 0.15s ease-out;
}

@keyframes scaleUp {
    from {
        transform: scale(0.96);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color, #eaeaea);
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-muted, #888);
    line-height: 1;
}

.modal-form {
    padding: 1.25rem 1.5rem;
    overflow-y: auto;
    flex: 1;
}

.form-grid-row {
    display: flex;
    gap: 1.5rem;
}

.form-grid-row .form-row {
    flex: 1;
}

.form-row {
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.form-row label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-muted, #555);
    text-align: left;
}

.form-row input,
.form-row select {
    padding: 0.65rem 0.85rem;
    border: 1px solid var(--border-color, #cccccc);
    border-radius: 6px;
    font-size: 0.95rem;
    outline: none;
    background: var(--input-bg, #fafafa);
    color: var(--text-primary, #333);
    transition: all 0.15s ease;
}

.form-row input:focus,
.form-row select:focus {
    border-color: var(--color-brand, #ff5a1f);
    background: var(--input-focus-bg);
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 1.75rem;
}

.cancel-btn {
    padding: 0.65rem 1.25rem;
    background: var(--chip-bg, #f4f4f4);
    color: var(--text-secondary, #555);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.cancel-btn:hover {
    background: var(--border-color);
}

.submit-btn {
    padding: 0.65rem 1.25rem;
    background: var(--color-brand, #ff5a1f);
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.input-error {
    border-color: #ff1744 !important;
}

.error-msg {
    color: #ff1744;
    font-size: 11px;
    margin-top: 2px;
    text-align: left;
}

/* Custom Pagination styles to override and style correctly */
.page-btn {
    background: var(--chip-bg, rgba(255, 255, 255, 0.03)) !important;
    border: 1px solid var(--border-color, rgba(255, 255, 255, 0.06)) !important;
    color: var(--text-secondary, #cbd5e1) !important;
    padding: 6px 12px;
    font-size: 12.5px;
    cursor: pointer;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.page-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.15) !important;
    color: #fff !important;
}

body.light .page-btn:hover:not(:disabled) {
    background: rgba(15, 23, 42, 0.05) !important;
    border-color: rgba(15, 23, 42, 0.15) !important;
    color: var(--text-primary, #0f172a) !important;
}

.page-btn.active {
    background: var(--color-brand, #ff5a1f) !important;
    color: #fff !important;
    border-color: var(--color-brand, #ff5a1f) !important;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(255, 90, 31, 0.25) !important;
}

.page-btn:disabled {
    cursor: not-allowed;
    opacity: 0.35;
}

.page-info {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text-secondary, #cbd5e1);
    margin: 0 6px;
    user-select: none;
}

@media (max-width: 576px) {
    .page-btn {
        padding: 5px 8px !important;
        font-size: 11px !important;
    }
    .page-info {
        font-size: 12px !important;
        margin: 0 4px !important;
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
    display: inline-block;
}
</style>
