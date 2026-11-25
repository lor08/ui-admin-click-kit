<script setup lang="ts">
import { sampleOwners, sampleTags, statusTones } from './samples';
import UiFilterBar from '../../ui/UiFilterBar.vue';
import UiMultiSelect from '../../ui/UiMultiSelect.vue';
import UiSelect from '../../ui/UiSelect.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const toast = useToast();
const filter = reactive<{ owners: string[]; tags: string[]; status: string }>({ owners: ['owner-1', 'owner-2', 'owner-4'], tags: [], status: '' });
const statusOptions = Object.keys(statusTones).map((status) => ({ value: status, label: t(`ui_kit.samples.status_${status}`) }));
</script>

<template>
    <UiFilterBar :columns="3" @apply="toast.info(t('ui_kit.samples.toast_neutral'))" @reset="Object.assign(filter, { owners: [], tags: [], status: '' })">
        <UiMultiSelect v-model="filter.owners" :label="t('ui_kit.samples.owner')" :options="sampleOwners" :placeholder="t('ui_kit.samples.any_owner')" />
        <UiMultiSelect v-model="filter.tags" :label="t('ui_kit.samples.tags')" :options="sampleTags" :placeholder="t('ui_kit.samples.all_tags')" searchable />
        <UiSelect v-model="filter.status" :label="t('ui_kit.samples.filter_status')" :options="statusOptions" :placeholder="t('ui_kit.samples.any')" />
    </UiFilterBar>
</template>
