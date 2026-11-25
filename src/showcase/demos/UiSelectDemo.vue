<script setup lang="ts">
import UiSelect from '../../ui/UiSelect.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ team: '', bad: '', small: '' });
const teams = [
    { value: '1', label: 'North' },
    { value: '2', label: 'South' },
    { value: '3', label: 'East', disabled: true },
];
</script>

<template>
    <div class="space-y-4">
        <UiSelect v-model="form.team" :label="t('ui_kit.samples.team')" :options="teams" :placeholder="t('ui_kit.samples.any_team')" />
        <UiSelect v-model="form.bad" :label="t('ui_kit.samples.team')" :options="teams" :placeholder="t('ui_kit.samples.any_team')" :error="t('ui_kit.samples.team_error')" />
        <UiSelect v-model="form.small" :options="teams" size="sm" :placeholder="t('ui_kit.samples.any_team')" />
    </div>
</template>
