<script setup lang="ts">
import UiIconButton from '../../ui/UiIconButton.vue';
import UiTooltip from '../../ui/UiTooltip.vue';
import { useTrans } from '../words';
import { Copy } from '@lucide/vue';

const t = useTrans();
</script>

<template>
    <UiTooltip :text="t('ui_kit.samples.tooltip')"><UiIconButton :label="t('ui_kit.samples.copy')" variant="secondary"><Copy /></UiIconButton></UiTooltip>
</template>
