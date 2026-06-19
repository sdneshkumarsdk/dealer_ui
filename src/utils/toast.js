import { ref } from 'vue'

export const toastState = ref({
    show: false,
    message: '',
    type: 'success', // 'success' or 'error'
})

let toastTimeout = null

export const toast = {
    show(message, type = 'success', duration = 3000) {
        toastState.value.message = message
        toastState.value.type = type
        toastState.value.show = true
        
        clearTimeout(toastTimeout)
        toastTimeout = setTimeout(() => {
            toastState.value.show = false
        }, duration)
    },
    success(message, duration = 3000) {
        this.show(message, 'success', duration)
    },
    error(message, duration = 3000) {
        this.show(message, 'error', duration)
    }
}
