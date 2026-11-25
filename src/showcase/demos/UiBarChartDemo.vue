<script setup lang="ts">
import { sampleTaskDays, sampleTaskTeams } from './samples';
import UiBarChart from '../../ui/UiBarChart.vue';
import UiCheckbox from '../../ui/UiCheckbox.vue';
import type { UiBarChartSeries } from '../../ui/chart';
import { useTrans } from '../words';
import { computed, ref } from 'vue';

const t = useTrans();
const empty = ref(false);

const series: UiBarChartSeries[] = [
    { key: 'done', label: t('ui_kit.samples.chart_done'), tone: 'success' },
    { key: 'overdue', label: t('ui_kit.samples.chart_overdue'), tone: 'warning' },
    { key: 'overdue_urgent', label: t('ui_kit.samples.chart_overdue_urgent'), tone: 'danger' },
];

const days = computed(() => (empty.value ? [] : sampleTaskDays));
const teams = computed(() => (empty.value ? [] : sampleTaskTeams));
</script>

<template>
    <div class="mb-3"><UiCheckbox v-model="empty" :label="t('ui_kit.samples.toggle_empty')" /></div>
    <div class="grid gap-8">
        <UiBarChart :label="t('ui_kit.samples.chart_by_day')" :series="series" :rows="days" :empty="t('ui_kit.samples.chart_empty')" />
        <UiBarChart orientation="horizontal" :label="t('ui_kit.samples.chart_by_team')" :series="series" :rows="teams" :empty="t('ui_kit.samples.chart_empty')" />
    </div>
</template>
