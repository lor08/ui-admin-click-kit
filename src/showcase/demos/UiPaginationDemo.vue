<script setup lang="ts">
import UiPagination from '../../ui/UiPagination.vue';
import { ref } from 'vue';

const page = ref(3);
</script>

<template>
    <UiPagination v-model:page="page" :last-page="12" :total="581" :per-page="50" />
</template>
