<script setup lang="ts">
import UiInput from '../../ui/UiInput.vue';
import { useTrans } from '../words';
import { Phone } from 'lucide-vue-next';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ email: '', bad: 'jane@', phone: '', sm: '', md: '', lg: '' });
</script>

<template>
    <div class="space-y-4">
        <UiInput v-model="form.email" :label="t('ui_kit.samples.email')" :hint="t('ui_kit.samples.email_hint')" type="email" required />
        <UiInput v-model="form.bad" :label="t('ui_kit.samples.email')" :error="t('ui_kit.samples.email_error')" type="email" />
        <UiInput v-model="form.phone" :label="t('ui_kit.samples.phone')" :placeholder="t('ui_kit.samples.phone_placeholder')" inputmode="tel" optional>
            <template #leading><Phone /></template>
        </UiInput>
        <div class="flex items-end gap-2">
            <UiInput v-model="form.sm" size="sm" placeholder="sm" />
            <UiInput v-model="form.md" size="md" placeholder="md" />
            <UiInput v-model="form.lg" size="lg" placeholder="lg" />
        </div>
        <UiInput :model-value="t('ui_kit.samples.disabled')" :label="t('ui_kit.samples.name')" disabled />
    </div>
</template>
