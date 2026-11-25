<script setup lang="ts">
import UiTimelineBar, { type UiTimelineSegment } from '../../ui/UiTimelineBar.vue';
import { useTrans } from '../words';

const t = useTrans();
const hour = 3600;

const segments: UiTimelineSegment[] = [
    { key: 'a', start: 0, end: 9 * hour, tone: 'neutral', label: `00:00–09:00 ${t('ui_kit.samples.timeline_offline')}` },
    { key: 'b', start: 9 * hour, end: 11 * hour, tone: 'success', label: `09:00–11:00 ${t('ui_kit.samples.timeline_available')}` },
    { key: 'c', start: 11 * hour, end: 11.5 * hour, tone: 'brand', label: `11:00–11:30 ${t('ui_kit.samples.timeline_talking')}` },
    { key: 'd', start: 11.5 * hour, end: 13 * hour, tone: 'success', label: `11:30–13:00 ${t('ui_kit.samples.timeline_available')}` },
    { key: 'e', start: 13 * hour, end: 14 * hour, tone: 'warning', label: `13:00–14:00 ${t('ui_kit.samples.timeline_break')}` },
    { key: 'f', start: 14 * hour, end: 15 * hour, tone: 'success', label: `14:00–15:00 ${t('ui_kit.samples.timeline_available')}` },
];

const ticks = [0, 6, 12, 18, 24].map((at) => ({ at: at * hour, label: `${String(at).padStart(2, '0')}:00` }));
</script>

<template>
    <UiTimelineBar :label="t('ui_kit.samples.timeline_label')" :span="24 * hour" :segments="segments" :ticks="ticks" />
</template>
