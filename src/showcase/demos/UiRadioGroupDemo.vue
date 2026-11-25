<script setup lang="ts">
import UiRadioGroup from '../../ui/UiRadioGroup.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const channel = ref('email');
const channels = [
    { value: 'email', label: t('ui_kit.samples.by_email'), description: t('ui_kit.samples.by_email_hint') },
    { value: 'sms', label: t('ui_kit.samples.by_sms') },
    { value: 'hand', label: t('ui_kit.samples.by_hand'), disabled: true },
];
// A tree of reasons: headings in bold, the leaves chosen.
const reason = ref('');
const tree = [
    { value: 'closed', label: 'Closed', depth: 0, group: true },
    { value: 'postponed', label: '#POSTPONED', depth: 1, group: true },
    { value: 'later', label: 'Next quarter', depth: 2 },
    { value: 'budget', label: 'No budget', depth: 2 },
    { value: 'rejected', label: '#REJECTED', depth: 1, group: true },
    { value: 'duplicate', label: 'duplicate', depth: 2 },
];
</script>

<template>
    <div class="space-y-6">
        <UiRadioGroup v-model="channel" :label="t('ui_kit.samples.send_by')" :options="channels" />
        <UiRadioGroup v-model="channel" :options="channels" inline :error="t('ui_kit.samples.team_error')" />
        <UiRadioGroup v-model="reason" :label="t('ui_kit.samples.lost_tree')" :options="tree" />
    </div>
</template>
