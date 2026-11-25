<script setup lang="ts">
import UiButton from '../../ui/UiButton.vue';
import UiDropdown from '../../ui/UiDropdown.vue';
import UiDropdownItem from '../../ui/UiDropdownItem.vue';
import UiDropdownSeparator from '../../ui/UiDropdownSeparator.vue';
import { useToast } from '../../ui/toast';
import { useTrans } from '../words';
import { ChevronDown, Key, LogOut, User } from '@lucide/vue';

const t = useTrans();
const toast = useToast();
</script>

<template>
    <UiDropdown align="start">
        <template #trigger>
            <UiButton variant="secondary">{{ t('ui_kit.samples.more') }}<template #trailing><ChevronDown class="h-4 w-4" /></template></UiButton>
        </template>
        <UiDropdownItem href="/profile"><template #icon><User /></template>{{ t('ui_kit.samples.menu_profile') }}</UiDropdownItem>
        <UiDropdownItem disabled><template #icon><Key /></template>{{ t('ui_kit.samples.menu_tokens') }}</UiDropdownItem>
        <UiDropdownSeparator />
        <UiDropdownItem tone="danger" @select="toast.info(t('ui_kit.samples.menu_sign_out'))"><template #icon><LogOut /></template>{{ t('ui_kit.samples.menu_sign_out') }}</UiDropdownItem>
    </UiDropdown>
</template>
