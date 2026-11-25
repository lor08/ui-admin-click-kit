<script setup lang="ts">
import UiBadge from '../../ui/UiBadge.vue';
import UiDisclosure from '../../ui/UiDisclosure.vue';
import UiTable from '../../ui/UiTable.vue';
import { useTrans } from '../words';

const t = useTrans();

const columns = [
    { key: 'day', label: t('ui_kit.samples.done_day') },
    { key: 'jane', label: 'Jane Doe', align: 'right' as const },
    { key: 'john', label: 'John Roe', align: 'right' as const },
    { key: 'total', label: t('ui_kit.samples.done_total'), align: 'right' as const },
];

const rows = [
    { day: '11/10/2026', jane: 3, john: 1, total: 4 },
    { day: '11/09/2026', jane: 2, john: '', total: 2 },
];
</script>

<template>
    <div class="space-y-4">
        <UiDisclosure :title="t('ui_kit.samples.done_by_day')" :lead="t('ui_kit.samples.done_by_day_lead')">
            <template #meta><UiBadge tone="brand">6</UiBadge></template>
            <UiTable :columns="columns" :rows="rows" row-key="day" dense />
        </UiDisclosure>
        <UiDisclosure :title="t('ui_kit.samples.done_by_day')" default-open>
            <UiTable :columns="columns" :rows="rows" row-key="day" dense />
        </UiDisclosure>
    </div>
</template>
