<script setup lang="ts">
import UiTabPanel from '../../ui/UiTabPanel.vue';
import UiTabs from '../../ui/UiTabs.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const tab = ref('contacts');
const tabs = [
    { value: 'contacts', label: t('ui_kit.samples.tab_contacts'), count: 3 },
    { value: 'addresses', label: t('ui_kit.samples.tab_addresses'), count: 2 },
    { value: 'history', label: t('ui_kit.samples.tab_history'), disabled: true },
];
</script>

<template>
    <UiTabs v-model="tab" :tabs="tabs">
        <UiTabPanel value="contacts"><p class="text-sm text-ink">{{ t('ui_kit.samples.tab_contacts_body') }}</p></UiTabPanel>
        <UiTabPanel value="addresses"><p class="text-sm text-ink">{{ t('ui_kit.samples.tab_addresses_body') }}</p></UiTabPanel>
        <UiTabPanel value="history"><p class="text-sm text-ink">{{ t('ui_kit.samples.tab_history_body') }}</p></UiTabPanel>
    </UiTabs>
</template>
