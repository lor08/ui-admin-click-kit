<script setup lang="ts">
import UiBadge from '../../ui/UiBadge.vue';
import type { Tone } from '../../ui/styles';
import { useTrans } from '../words';

const t = useTrans();
const statuses: Array<[string, Tone]> = [
    ['status_draft', 'neutral'],
    ['status_sent', 'info'],
    ['status_active', 'success'],
    ['status_past_due', 'warning'],
    ['status_canceled', 'danger'],
    ['status_new', 'brand'],
];
</script>

<template>
    <div class="space-y-3">
        <div class="flex flex-wrap gap-2"><UiBadge v-for="[key, tone] in statuses" :key="key" :tone="tone">{{ t(`ui_kit.samples.${key}`) }}</UiBadge></div>
        <div class="flex flex-wrap gap-2"><UiBadge v-for="[key, tone] in statuses" :key="key" :tone="tone" dot>{{ t(`ui_kit.samples.${key}`) }}</UiBadge></div>
        <div class="flex flex-wrap gap-2"><UiBadge v-for="[key, tone] in statuses" :key="key" :tone="tone" outline>{{ t(`ui_kit.samples.${key}`) }}</UiBadge></div>
        <div class="flex flex-wrap gap-2"><UiBadge v-for="[key, tone] in statuses" :key="key" :tone="tone" size="sm" dot>{{ t(`ui_kit.samples.${key}`) }}</UiBadge></div>
    </div>
</template>
