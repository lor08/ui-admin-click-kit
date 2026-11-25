<script setup lang="ts">
import { sampleRows, statusTones } from './demos/samples';
import UiBadge from '../ui/UiBadge.vue';
import UiButton from '../ui/UiButton.vue';
import UiCard from '../ui/UiCard.vue';
import UiFilterBar from '../ui/UiFilterBar.vue';
import UiInput from '../ui/UiInput.vue';
import UiPageHeader from '../ui/UiPageHeader.vue';
import UiPagination from '../ui/UiPagination.vue';
import UiSelect from '../ui/UiSelect.vue';
import UiTable, { type UiTableColumn } from '../ui/UiTable.vue';
import { useTrans } from './words';
import { Plus } from 'lucide-vue-next';
import { reactive, ref } from 'vue';

/** A list screen composed from the kit: the pattern a new list screen copies. */
const t = useTrans();

const columns: UiTableColumn[] = [
    { key: 'owner', label: t('ui_kit.samples.col_owner'), sortable: true },
    { key: 'plan', label: t('ui_kit.samples.col_plan') },
    { key: 'status', label: t('ui_kit.samples.col_status') },
    { key: 'price', label: t('ui_kit.samples.col_price'), align: 'right' },
    { key: 'since', label: t('ui_kit.samples.col_since'), sortable: true },
];

const filter = reactive({ q: '', status: '' });
const page = ref(1);
const statusOptions = Object.keys(statusTones).map((status) => ({ value: status, label: t(`ui_kit.samples.status_${status}`) }));
</script>

<template>
    <section id="composition" class="scroll-mt-20" data-test="kit-composition">
        <h2 class="text-base font-semibold text-ink">{{ t('ui_kit.composition.title') }}</h2>
        <p class="mt-1 text-sm text-ink-muted">{{ t('ui_kit.composition.lead') }}</p>
        <div class="mt-4 min-w-0 rounded-card border border-dashed border-line-strong bg-canvas p-4 sm:p-6">
            <UiPageHeader :title="t('ui_kit.samples.list_title')" :lead="t('ui_kit.samples.list_lead')">
                <template #actions>
                    <UiButton variant="secondary">{{ t('ui_kit.samples.export') }}</UiButton>
                    <UiButton><template #icon><Plus class="h-4 w-4" /></template>{{ t('ui_kit.samples.list_create') }}</UiButton>
                </template>
            </UiPageHeader>
            <UiFilterBar :columns="4" class="mb-4" @reset="Object.assign(filter, { q: '', status: '' })">
                <UiInput v-model="filter.q" type="search" :label="t('ui_kit.samples.col_owner')" :placeholder="t('ui_kit.samples.search_placeholder')" />
                <UiSelect v-model="filter.status" :label="t('ui_kit.samples.filter_status')" :options="statusOptions" :placeholder="t('ui_kit.samples.any')" />
            </UiFilterBar>
            <UiCard padding="none">
                <UiTable :columns="columns" :rows="sampleRows" row-key="id" flush clickable>
                    <template #cell-status="{ row }"><UiBadge :tone="statusTones[row.status] ?? 'neutral'" dot>{{ t(`ui_kit.samples.status_${row.status}`) }}</UiBadge></template>
                    <template #cell-price="{ row }">${{ row.price }}</template>
                </UiTable>
                <template #footer><UiPagination v-model:page="page" :last-page="4" :total="181" :per-page="50" /></template>
            </UiCard>
        </div>
    </section>
</template>
