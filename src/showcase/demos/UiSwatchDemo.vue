<script setup lang="ts">
import UiSwatch from '../../ui/UiSwatch.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="flex flex-wrap items-center gap-4">
        <UiSwatch color="#2196F3" />
        <UiSwatch color="#FF9800">{{ t('ui_kit.samples.map_area') }}</UiSwatch>
        <UiSwatch color="#4CAF50" size="md">{{ t('ui_kit.samples.swatch_added') }}</UiSwatch>
        <UiSwatch color="#f5f5f5" border="#F44336" size="md">{{ t('ui_kit.samples.swatch_removed') }}</UiSwatch>
    </div>
</template>
