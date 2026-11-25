<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiCard from '../../ui/UiCard.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <UiCard :title="t('ui_kit.samples.card_title')" :lead="t('ui_kit.samples.card_lead')">
        <template #actions><UiButton size="sm" variant="secondary">{{ t('ui_kit.samples.edit') }}</UiButton></template>
        <p class="text-sm text-ink">{{ t('ui_kit.samples.card_body') }}</p>
        <template #footer><p class="text-xs text-ink-muted">{{ t('ui_kit.samples.card_footer') }}</p></template>
    </UiCard>
</template>
