<script setup lang="ts">
import UiChip from '../../ui/UiChip.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const picked = ref('draft');
const statuses = ['draft', 'sent', 'active'];
</script>

<template>
    <div class="space-y-3">
        <div class="flex flex-wrap gap-1.5">
            <UiChip v-for="status in statuses" :key="status" :active="picked === status" @select="picked = status">{{ t(`ui_kit.samples.status_${status}`) }}</UiChip>
            <UiChip disabled>{{ t('ui_kit.samples.disabled') }}</UiChip>
        </div>
        <div class="flex flex-wrap gap-1.5">
            <UiChip href="/people">{{ t('ui_kit.samples.crumb_people') }}</UiChip>
            <UiChip href="#UiChip" mono>UiChip</UiChip>
        </div>
    </div>
</template>
