<script setup lang="ts">
import UiBadge from '../../ui/UiBadge.vue';
import UiDescriptionList from '../../ui/UiDescriptionList.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <UiDescriptionList
        :items="[
            { key: 'name', label: t('ui_kit.samples.name'), value: 'Jane Doe' },
            { key: 'email', label: t('ui_kit.samples.email'), value: 'jane.doe@example.com' },
            { key: 'status', label: t('ui_kit.samples.status') },
            { key: 'last_sign_in', label: t('ui_kit.samples.last_sign_in'), value: null },
        ]"
        :placeholder="t('ui_kit.samples.never')"
    >
        <template #value-status><UiBadge tone="success" dot>{{ t('ui_kit.samples.status_active') }}</UiBadge></template>
    </UiDescriptionList>
</template>
