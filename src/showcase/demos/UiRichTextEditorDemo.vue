<script setup lang="ts">
import UiRichTextEditor from '../../ui/UiRichTextEditor.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const message = ref(t('ui_kit.samples.rich_message_sample'));
const labels = { bold: t('ui_kit.samples.rich_bold'), italic: t('ui_kit.samples.rich_italic'), underline: t('ui_kit.samples.rich_underline'), color: t('ui_kit.samples.rich_color'), background: t('ui_kit.samples.rich_background'), clear: t('ui_kit.samples.rich_clear') };
</script>

<template>
    <div class="max-w-xl">
        <UiRichTextEditor id="demo-rich" v-model="message" :label="t('ui_kit.samples.rich_message')" :labels="labels" />
    </div>
</template>
