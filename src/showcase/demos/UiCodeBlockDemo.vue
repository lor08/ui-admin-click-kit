<script setup lang="ts">
import { samplePayload } from './samples';
import UiCodeBlock from '../../ui/UiCodeBlock.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="grid gap-4">
        <UiCodeBlock :value="samplePayload" :label="t('ui_kit.samples.code_payload')" max-height="sm" />
        <UiCodeBlock :value="samplePayload" :label="t('ui_kit.samples.code_payload')" collapsible />
        <UiCodeBlock :value="t('ui_kit.samples.code_text')" :label="t('ui_kit.samples.code_note')" />
    </div>
</template>
