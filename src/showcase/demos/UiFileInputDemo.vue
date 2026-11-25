<script setup lang="ts">
import UiFileInput from '../../ui/UiFileInput.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const file = ref<File | null>(null);
</script>

<template>
    <UiFileInput v-model="file" accept=".xlsx,.csv" :label="t('ui_kit.samples.file')" :hint="t('ui_kit.samples.file_hint')" />
</template>
