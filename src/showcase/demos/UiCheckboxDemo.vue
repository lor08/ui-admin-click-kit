<script setup lang="ts">
import UiCheckbox from '../../ui/UiCheckbox.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ primary: true, terms: false });
</script>

<template>
    <div class="space-y-3">
        <UiCheckbox v-model="form.primary" :label="t('ui_kit.samples.primary')" :description="t('ui_kit.samples.primary_hint')" />
        <UiCheckbox v-model="form.terms" :label="t('ui_kit.samples.terms')" :error="form.terms ? null : t('ui_kit.samples.terms_error')" />
        <UiCheckbox :model-value="true" :label="t('ui_kit.samples.disabled')" disabled />
    </div>
</template>
