<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiPageHeader from '../../ui/UiPageHeader.vue';
import { useTrans } from '../words';
import { Plus } from '@lucide/vue';

const t = useTrans();
</script>

<template>
    <UiPageHeader :title="t('ui_kit.samples.page_title')" :lead="t('ui_kit.samples.page_lead')" :breadcrumbs="[{ label: t('ui_kit.samples.crumb_people'), href: '/people' }, { label: t('ui_kit.samples.crumb_person'), href: '/people' }, { label: t('ui_kit.samples.crumb_merge') }]" class="mb-0">
        <template #actions>
            <UiButton variant="secondary">{{ t('ui_kit.samples.export') }}</UiButton>
            <UiButton><template #icon><Plus class="h-4 w-4" /></template>{{ t('ui_kit.samples.invite') }}</UiButton>
        </template>
    </UiPageHeader>
</template>
