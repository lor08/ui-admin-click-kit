<script setup lang="ts">
import UiBreadcrumbs from '../../ui/UiBreadcrumbs.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <UiBreadcrumbs :items="[{ label: t('ui_kit.samples.crumb_people'), href: '/people' }, { label: t('ui_kit.samples.crumb_person'), href: '/people' }, { label: t('ui_kit.samples.crumb_merge') }]" />
</template>
