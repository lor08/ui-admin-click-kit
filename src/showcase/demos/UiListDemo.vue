<script setup lang="ts">
import UiBadge from '../../ui/UiBadge.vue';
import UiButton from '../../ui/UiButton.vue';
import UiList from '../../ui/UiList.vue';
import UiListItem from '../../ui/UiListItem.vue';
import { useTrans } from '../words';
import { KeyRound, Send } from '@lucide/vue';
import { ref } from 'vue';

const t = useTrans();
const picked = ref('1');
</script>

<template>
    <UiList bordered>
        <UiListItem title="Google" :description="t('ui_kit.samples.linked')">
            <template #leading><KeyRound /></template>
            <template #trailing>
                <UiBadge tone="success" dot>{{ t('ui_kit.samples.linked') }}</UiBadge>
                <UiButton size="sm" variant="secondary">{{ t('ui_kit.samples.unlink') }}</UiButton>
            </template>
        </UiListItem>
        <UiListItem title="Telegram" :description="t('ui_kit.samples.not_linked')">
            <template #leading><Send /></template>
            <template #trailing><UiButton size="sm" variant="secondary">{{ t('ui_kit.samples.link') }}</UiButton></template>
        </UiListItem>
        <UiListItem title="projects.view" :description="t('ui_kit.samples.role_viewer_hint')" mono />
    </UiList>
    <UiList dense class="mt-4">
        <UiListItem v-for="id in ['1', '2']" :key="id" :title="`${t('ui_kit.samples.map_area')} ${id}`" selectable :selected="picked === id" @select="picked = id">
            <template #trailing><UiButton v-if="picked === id" size="sm" variant="secondary">{{ t('ui_kit.samples.edit') }}</UiButton></template>
        </UiListItem>
    </UiList>
</template>
