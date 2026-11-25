<script setup lang="ts">
import UiKbd from '../../ui/UiKbd.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <p class="text-sm text-ink-muted"><UiKbd>{{ t('ui_kit.samples.escape') }}</UiKbd> <UiKbd>⌘</UiKbd> <UiKbd>K</UiKbd></p>
</template>
