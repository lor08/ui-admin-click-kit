<script setup lang="ts">
import UiHelpText from '../../ui/UiHelpText.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <UiHelpText>{{ t('ui_kit.samples.email_hint') }}</UiHelpText>
</template>
