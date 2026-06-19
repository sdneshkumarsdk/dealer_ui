<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    iconClass: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['close'])

const handleBgClick = (e) => {
    const target = e.target
    if (target.classList.contains('modal-bg')) {
        emit('close')
    }
}
</script>

<template>
    <div v-if="isOpen" class="modal-bg open" @click="handleBgClick">
        <div class="modal">
            <h3>
                <i v-if="iconClass" :class="iconClass"></i> {{ title }}
            </h3>
            <slot></slot>
        </div>
    </div>
</template>
