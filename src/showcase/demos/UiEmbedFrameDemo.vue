<script setup lang="ts">
import UiEmbedFrame from '../../ui/UiEmbedFrame.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <!-- No backend handed this demo an address, so it shows the failure: it never loads a page it was not given. -->
    <UiEmbedFrame url="" :title="t('ui_kit.samples.embed_title')" />
</template>
