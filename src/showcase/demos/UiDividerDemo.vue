<script setup lang="ts">
import UiDivider from '../../ui/UiDivider.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="space-y-4">
        <UiDivider />
        <UiDivider>{{ t('ui_kit.samples.or') }}</UiDivider>
        <div class="flex h-6 items-center gap-3 text-sm text-ink-muted"><span>A</span><UiDivider vertical /><span>B</span></div>
    </div>
</template>
