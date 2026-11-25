<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiEmptyState from '../../ui/UiEmptyState.vue';
import { useTrans } from '../words';
import { Inbox } from '@lucide/vue';

const t = useTrans();
</script>

<template>
    <UiEmptyState :title="t('ui_kit.samples.empty_title')" :description="t('ui_kit.samples.empty_description')">
        <template #icon><Inbox /></template>
        <template #action><UiButton variant="secondary">{{ t('ui_kit.samples.empty_action') }}</UiButton></template>
    </UiEmptyState>
    <UiEmptyState :title="t('ui_kit.samples.empty_title')" size="sm" class="mt-2 rounded-card border border-dashed border-line" />
</template>
