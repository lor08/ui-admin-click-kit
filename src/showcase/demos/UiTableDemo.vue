<script setup lang="ts">
import { sampleRows, statusTones, type SampleRow } from './samples';
import UiBadge from '../../ui/UiBadge.vue';
import UiCheckbox from '../../ui/UiCheckbox.vue';
import UiPagination from '../../ui/UiPagination.vue';
import UiTable, { type UiTableColumn, type UiTableSort } from '../../ui/UiTable.vue';
import type { Tone } from '../../ui/styles';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { computed, reactive, ref } from 'vue';

const t = useTrans();
const toast = useToast();

const columns: UiTableColumn[] = [
    { key: 'owner', label: t('ui_kit.samples.col_owner'), sortable: true },
    { key: 'plan', label: t('ui_kit.samples.col_plan') },
    { key: 'status', label: t('ui_kit.samples.col_status'), sortable: true },
    { key: 'price', label: t('ui_kit.samples.col_price'), sortable: true, align: 'right' },
    { key: 'since', label: t('ui_kit.samples.col_since'), sortable: true },
];

const toggles = reactive({ loading: false, empty: false, clickable: true, tinted: false, pulsing: false, sticky: false });
const tones: Record<string, Tone> = { active: 'success', past_due: 'warning', canceled: 'danger' };
const rowTone = (row: SampleRow): Tone | null => (toggles.tinted ? (tones[row.status] ?? null) : null);
// A past-due subscription stands in for a record waiting for someone now.
const pulseRow = (row: SampleRow): boolean => toggles.pulsing && row.status === 'past_due';
const sort = ref<UiTableSort>({ key: 'since', direction: 'desc' });
const page = ref(3);
const rows = computed(() => (toggles.empty ? [] : sampleRows));
</script>

<template>
    <div class="mb-3 flex flex-wrap gap-4">
        <UiCheckbox v-model="toggles.loading" :label="t('ui_kit.samples.toggle_loading')" />
        <UiCheckbox v-model="toggles.empty" :label="t('ui_kit.samples.toggle_empty')" />
        <UiCheckbox v-model="toggles.clickable" :label="t('ui_kit.samples.toggle_clickable')" />
        <UiCheckbox v-model="toggles.tinted" :label="t('ui_kit.samples.toggle_tinted')" />
        <UiCheckbox v-model="toggles.pulsing" :label="t('ui_kit.samples.toggle_pulsing')" />
        <UiCheckbox v-model="toggles.sticky" :label="t('ui_kit.samples.toggle_sticky')" />
    </div>
    <UiTable :columns="columns" :rows="rows" row-key="id" :loading="toggles.loading" :clickable="toggles.clickable" :row-tone="rowTone" :pulse-row="pulseRow" :sticky-first="toggles.sticky" :empty="t('ui_kit.samples.table_empty')" @row-click="(row) => toast.info(t('ui_kit.samples.row_clicked', { name: row.owner }))">
        <template #cell-status="{ row }"><UiBadge :tone="statusTones[row.status] ?? 'neutral'" dot>{{ t(`ui_kit.samples.status_${row.status}`) }}</UiBadge></template>
        <template #cell-price="{ row }">${{ row.price }}</template>
        <template #footer><UiPagination v-model:page="page" :last-page="12" :total="581" :per-page="50" /></template>
    </UiTable>
    <p class="mt-3 text-xs text-ink-muted">v-model:sort · {{ sort.key }} {{ sort.direction }}</p>
    <UiTable class="mt-2" :columns="columns.slice(0, 3)" :rows="sampleRows.slice(0, 2)" row-key="id" dense :sort="sort" @update:sort="sort = $event" />
</template>
