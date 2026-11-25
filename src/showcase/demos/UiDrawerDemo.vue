<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiDescriptionList from '../../ui/UiDescriptionList.vue';
import UiDrawer from '../../ui/UiDrawer.vue';
import UiIconButton from '../../ui/UiIconButton.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { ExternalLink } from '@lucide/vue';
import { ref } from 'vue';

const t = useTrans();
const toast = useToast();
const open = ref(false);
const size = ref<'md' | 'lg'>('md');

function show(width: 'md' | 'lg'): void {
    size.value = width;
    open.value = true;
}
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <UiButton variant="secondary" @click="show('md')">{{ t('ui_kit.samples.drawer_md') }}</UiButton>
        <UiButton variant="secondary" @click="show('lg')">{{ t('ui_kit.samples.drawer_lg') }}</UiButton>
    </div>
    <UiDrawer v-model:open="open" :title="t('ui_kit.samples.drawer_title')" description="Update the onboarding guide" :size="size">
        <template #actions>
            <UiIconButton :label="t('ui_kit.samples.drawer_open_full')" size="sm" @click="toast.info(t('ui_kit.samples.drawer_open_full'))"><ExternalLink /></UiIconButton>
        </template>
        <UiDescriptionList
            :items="[
                { key: 'from', label: t('ui_kit.samples.drawer_from'), value: '2026-11-03' },
                { key: 'to', label: t('ui_kit.samples.drawer_to'), value: '2026-11-14' },
                { key: 'duration', label: t('ui_kit.samples.drawer_duration'), value: '3h 40m' },
                { key: 'owner', label: t('ui_kit.samples.col_owner'), value: 'Jane Doe' },
            ]"
            dense
        />
        <template #footer>
            <UiButton variant="secondary" @click="open = false">{{ t('ui_kit.samples.cancel') }}</UiButton>
        </template>
    </UiDrawer>
</template>
