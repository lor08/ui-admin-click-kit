<script setup lang="ts">
import UiIconButton from '../../ui/UiIconButton.vue';
import { useTrans } from '../words';
import { Copy, Pencil, Pin, Plus, Trash2 } from '@lucide/vue';
import { ref } from 'vue';

const t = useTrans();
const pinned = ref(false);
</script>

<template>
    <div class="flex flex-wrap items-center gap-2">
        <UiIconButton :label="t('ui_kit.samples.edit')"><Pencil /></UiIconButton>
        <UiIconButton :label="t('ui_kit.samples.copy')" variant="secondary"><Copy /></UiIconButton>
        <UiIconButton :label="t('ui_kit.samples.new_project')" variant="primary"><Plus /></UiIconButton>
        <UiIconButton :label="t('ui_kit.samples.delete')" variant="danger"><Trash2 /></UiIconButton>
        <UiIconButton :label="t('ui_kit.samples.edit')" size="sm" variant="secondary"><Pencil /></UiIconButton>
        <UiIconButton :label="t('ui_kit.samples.pin')" :pressed="pinned" @click="pinned = !pinned"><Pin /></UiIconButton>
        <UiIconButton :label="t('ui_kit.samples.delete')" disabled><Trash2 /></UiIconButton>
    </div>
</template>
