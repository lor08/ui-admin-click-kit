<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import { useTrans } from '../words';
import { Pencil, Plus, Trash2 } from 'lucide-vue-next';

const t = useTrans();
</script>

<template>
    <div class="space-y-4">
        <div class="flex flex-wrap items-center gap-2">
            <UiButton>{{ t('ui_kit.samples.save') }}</UiButton>
            <UiButton variant="secondary">{{ t('ui_kit.samples.cancel') }}</UiButton>
            <UiButton variant="danger">{{ t('ui_kit.samples.delete') }}</UiButton>
            <UiButton variant="ghost">{{ t('ui_kit.samples.more') }}</UiButton>
            <UiButton variant="link">{{ t('ui_kit.samples.open') }}</UiButton>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <UiButton size="sm">sm</UiButton>
            <UiButton size="md">md</UiButton>
            <UiButton size="lg">lg</UiButton>
            <UiButton loading>{{ t('ui_kit.samples.loading') }}</UiButton>
            <UiButton disabled>{{ t('ui_kit.samples.disabled') }}</UiButton>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <UiButton><template #icon><Plus class="h-4 w-4" /></template>{{ t('ui_kit.samples.new_project') }}</UiButton>
            <UiButton variant="secondary"><template #icon><Pencil class="h-4 w-4" /></template>{{ t('ui_kit.samples.edit') }}</UiButton>
            <UiButton variant="danger" size="sm"><template #icon><Trash2 class="h-4 w-4" /></template>{{ t('ui_kit.samples.delete') }}</UiButton>
            <UiButton href="/people" variant="secondary">href</UiButton>
        </div>
        <UiButton variant="secondary" block>{{ t('ui_kit.samples.block') }}</UiButton>
    </div>
</template>
