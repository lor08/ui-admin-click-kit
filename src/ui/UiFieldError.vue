<script setup lang="ts">
/** The validation message of one control; renders nothing without one. */
withDefaults(defineProps<{ id?: string; message?: string | null }>(), { id: undefined, message: null });
</script>

<template>
    <p v-if="message" :id="id" class="text-sm text-danger" role="alert" data-test="error">{{ message }}</p>
</template>
