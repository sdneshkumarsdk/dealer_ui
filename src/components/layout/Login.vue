<script setup>
import { ref } from 'vue'
import sonalikaLogo from '../../assets/sonalika.png'

const props = defineProps({
    theme: {
        type: String,
        required: true
    },
    onLogin: {
        type: Function,
        required: true
    }
})

const emit = defineEmits(['themeToggle'])

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)

const handleSubmit = async () => {
    if (!username.value || !password.value) {
        error.value = 'Please enter both username/email and password.'
        return
    }
    
    loading.value = true
    error.value = ''
    try {
        await props.onLogin(username.value, password.value)
    } catch (err) {
        error.value = err.message || 'Failed to authenticate. Check server connection.'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="login-wrapper">
        <!-- Theme Toggle Button -->
        <div class="theme-toggle-container">
            <button 
                class="theme-toggle-btn" 
                @click="emit('themeToggle')" 
                :title="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
                type="button"
            >
                <i :class="theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon'" style="font-size: 15px"></i>
            </button>
        </div>

        <div class="login-split-container">
            <!-- Left Side: Brand Visual Panel -->
            <div class="login-visual-panel">
                <div class="visual-overlay"></div>
                <div class="visual-content">
                    <h1 class="brand-logo-text-large">SONALIKA</h1>
                    <div class="tractor-image-container">
                        <img :src="sonalikaLogo" alt="Sonalika Tractor" class="visual-tractor-img" />
                    </div>
                    <div class="visual-tagline">
                        Empowering Farmers. <br />
                        <span>Driving Progress.</span>
                    </div>
                    <p class="visual-desc">
                        Welcome to the Sonalika Dealer & HQ Portal. Manage inventory, track live shipments, approve financing, and review regional performance metrics.
                    </p>
                </div>
            </div>

            <!-- Form Panel -->
            <div class="login-form-panel">
                <div class="form-container">
                    <h2 class="form-title">Sign In</h2>
                    <p class="form-subtitle">Enter your credentials to access your dashboard.</p>

                    <form @submit.prevent="handleSubmit" class="login-form">
                        <div v-if="error" class="login-error">
                            <i class="ti ti-alert-triangle" style="font-size: 15px"></i>
                            <span>{{ error }}</span>
                        </div>

                        <div class="form-row">
                            <label for="login-username">Username or Email</label>
                            <div class="input-with-icon">
                                <i class="ti ti-user"></i>
                                <input
                                    id="login-username"
                                    type="text"
                                    v-model="username"
                                    @input="error = ''"
                                    placeholder="admin or dealer"
                                    required
                                />
                            </div>
                        </div>

                        <div class="form-row" style="margin-bottom: 1.75rem">
                            <label for="login-password">Password</label>
                            <div class="input-with-icon">
                                <i class="ti ti-lock"></i>
                                <input
                                    id="login-password"
                                    :type="showPassword ? 'text' : 'password'"
                                    v-model="password"
                                    @input="error = ''"
                                    placeholder="••••••••"
                                    required
                                    style="padding-right: 36px !important;"
                                />
                                <i
                                    :class="showPassword ? 'ti ti-eye-off' : 'ti ti-eye'"
                                    style="position: absolute; right: 12px; left: auto; cursor: pointer; pointer-events: auto; z-index: 10;"
                                    @click="showPassword = !showPassword"
                                ></i>
                            </div>
                        </div>

                        <button type="submit" class="login-btn" :disabled="loading">
                            <span v-if="loading">Signing In...</span>
                            <span v-else>Access Dashboard <i class="ti ti-arrow-right" style="margin-left: 6px"></i></span>
                        </button>
                    </form>

                    <div class="demo-credentials-card">
                        <div class="demo-title">
                            <i class="ti ti-info-circle"></i> Demo Access Accounts:
                        </div>
                        <div class="demo-row">
                            <span class="demo-badge admin">Admin</span>
                            <span>User: <strong>admin</strong> | Pass: <strong>admin123</strong></span>
                        </div>
                        <div class="demo-row" style="margin-top: 6px; opacity: 0.85;">
                            <span class="demo-badge dealer" style="background: var(--bg-modifier-accent, #666); color: white;">Dealers</span>
                            <span>Create via Admin User Management</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
