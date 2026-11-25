<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiForm from '../../ui/UiForm.vue';
import UiInput from '../../ui/UiInput.vue';
import UiSelect from '../../ui/UiSelect.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ email: '', team: '' });
const teams = [
    { value: '1', label: 'North' },
    { value: '2', label: 'South' },
];
</script>

<template>
    <UiForm :error="t('ui_kit.samples.form_error')" @submit="() => undefined">
        <UiInput v-model="form.email" :label="t('ui_kit.samples.email')" type="email" />
        <UiSelect v-model="form.team" :label="t('ui_kit.samples.team')" :options="teams" :placeholder="t('ui_kit.samples.any_team')" />
        <template #actions>
            <UiButton type="submit">{{ t('ui_kit.samples.save') }}</UiButton>
            <UiButton variant="secondary">{{ t('ui_kit.samples.cancel') }}</UiButton>
        </template>
    </UiForm>
</template>
