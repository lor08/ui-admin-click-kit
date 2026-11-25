<script setup lang="ts">
import UiText from '../../ui/UiText.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="space-y-2">
        <p>{{ t('ui_kit.samples.name') }}: Jane Doe <UiText>({{ t('ui_kit.samples.primary') }})</UiText></p>
        <p>{{ t('ui_kit.samples.last_sign_in') }}: <UiText tone="subtle">{{ t('ui_kit.samples.never') }}</UiText></p>
        <p>{{ t('ui_kit.samples.roles') }}: <UiText mono size="xs">projects.view</UiText></p>
        <UiText block>{{ t('ui_kit.samples.roles_hint') }}</UiText>
    </div>
</template>
