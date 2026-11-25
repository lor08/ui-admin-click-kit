<script setup lang="ts">
import UiDialpad from '../../ui/UiDialpad.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const pressed = ref('');
</script>

<template>
    <div class="flex flex-wrap items-start gap-6">
        <div class="w-56"><UiDialpad letters @press="(digit) => (pressed += digit)" /></div>
        <div class="w-56"><UiDialpad @press="(digit) => (pressed += digit)" /></div>
        <p class="text-sm text-ink-muted">{{ t('ui_kit.samples.dock_pressed') }}: <code class="text-ink" data-test="pressed">{{ pressed }}</code></p>
    </div>
</template>
