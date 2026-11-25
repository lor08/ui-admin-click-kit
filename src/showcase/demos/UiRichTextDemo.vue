<script setup lang="ts">
import UiRichText from '../../ui/UiRichText.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="grid max-w-xl gap-4">
        <UiRichText :html="t('ui_kit.samples.rich_message_sample')" />
        <UiRichText html="" :empty="t('ui_kit.samples.rich_nothing')" />
    </div>
</template>
