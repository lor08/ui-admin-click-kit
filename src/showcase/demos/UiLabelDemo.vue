<script setup lang="ts">
import UiLabel from '../../ui/UiLabel.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="space-y-2">
        <UiLabel>{{ t('ui_kit.samples.name') }}</UiLabel>
        <UiLabel required>{{ t('ui_kit.samples.email') }}</UiLabel>
        <UiLabel optional>{{ t('ui_kit.samples.notes') }}</UiLabel>
    </div>
</template>
