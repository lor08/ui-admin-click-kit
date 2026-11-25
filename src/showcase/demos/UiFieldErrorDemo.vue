<script setup lang="ts">
import UiFieldError from '../../ui/UiFieldError.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <UiFieldError :message="t('ui_kit.samples.email_error')" />
</template>
