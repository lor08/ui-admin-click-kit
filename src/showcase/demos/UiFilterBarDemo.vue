<script setup lang="ts">
import { statusTones } from './samples';
import UiFilterBar from '../../ui/UiFilterBar.vue';
import UiInput from '../../ui/UiInput.vue';
import UiSelect from '../../ui/UiSelect.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const toast = useToast();
const filter = reactive({ status: '', from: '', until: '' });
const statusOptions = Object.keys(statusTones).map((status) => ({ value: status, label: t(`ui_kit.samples.status_${status}`) }));
</script>

<template>
    <UiFilterBar :columns="4" @apply="toast.info(t('ui_kit.samples.toast_neutral'))" @reset="Object.assign(filter, { status: '', from: '', until: '' })">
        <UiSelect v-model="filter.status" :label="t('ui_kit.samples.filter_status')" :options="statusOptions" :placeholder="t('ui_kit.samples.any')" />
        <UiInput v-model="filter.from" type="date" :label="t('ui_kit.samples.filter_from')" />
        <UiInput v-model="filter.until" type="date" :label="t('ui_kit.samples.filter_until')" />
    </UiFilterBar>
</template>
