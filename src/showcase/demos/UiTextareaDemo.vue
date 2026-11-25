<script setup lang="ts">
import UiTextarea from '../../ui/UiTextarea.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const notes = ref('');
</script>

<template>
    <UiTextarea v-model="notes" :label="t('ui_kit.samples.notes')" :hint="t('ui_kit.samples.notes_hint')" :rows="3" />
</template>
