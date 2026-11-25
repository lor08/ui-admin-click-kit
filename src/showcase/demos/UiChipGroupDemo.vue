<script setup lang="ts">
import UiChipGroup from '../../ui/UiChipGroup.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const type = ref<string | null>('low');
const types = [
    { value: 'low', label: t('ui_kit.samples.chip_low') },
    { value: 'normal', label: t('ui_kit.samples.chip_normal') },
    { value: 'high', label: t('ui_kit.samples.chip_high') },
    { value: 'frozen', label: t('ui_kit.samples.chip_frozen'), disabled: true },
];
</script>

<template>
    <div class="space-y-6">
        <UiChipGroup v-model="type" :label="t('ui_kit.samples.chip_priority')" :hint="t('ui_kit.samples.chip_type_hint')" :options="types" />
        <UiChipGroup v-model="type" :options="types" :error="t('ui_kit.samples.team_error')" />
    </div>
</template>
