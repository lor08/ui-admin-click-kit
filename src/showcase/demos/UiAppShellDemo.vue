<script setup lang="ts">
import UiAppShell from '../../ui/UiAppShell.vue';
import UiCard from '../../ui/UiCard.vue';
import UiNavItem from '../../ui/UiNavItem.vue';
import UiSidebarIdentity from '../../ui/UiSidebarIdentity.vue';
import UiSidebarSelect from '../../ui/UiSidebarSelect.vue';
import { useToast } from '../../ui/toast';
import { kitPath } from '../../ui/kit';
import { useTrans } from '../words';
import { FileText, LayoutDashboard, ListTodo, LogOut } from 'lucide-vue-next';
import { ref } from 'vue';

const t = useTrans();
const toast = useToast();
const here = kitPath();
const language = ref('en');
const languages = [
    { value: 'en', label: 'English' },
    { value: 'ru', label: 'Русский' },
];
</script>

<template>
    <!-- The transform makes this box the containing block of the shell's fixed sidebar, so the frame stays inside the demo. -->
    <div class="h-96 overflow-hidden [transform:translateZ(0)]">
        <UiAppShell brand="Acme Admin">
            <template #nav>
                <UiNavItem :label="t('ui_kit.samples.tab_nav_overview')" :icon="LayoutDashboard" :href="here" :active-prefix="here" />
                <UiNavItem :label="t('ui_kit.samples.tab_nav_tasks')" :icon="ListTodo" @click="toast.info(t('ui_kit.samples.tab_nav_tasks'))" />
                <UiNavItem :label="t('ui_kit.samples.tab_nav_files')" :icon="FileText" @click="toast.info(t('ui_kit.samples.tab_nav_files'))" />
            </template>
            <template #footer="{ closeMenu }">
                <UiSidebarIdentity name="Jane Doe" :caption="t('ui_kit.samples.role_admin')" />
                <UiSidebarSelect v-model="language" :options="languages" :label="t('ui_kit.samples.language')" />
                <UiNavItem :label="t('ui_kit.samples.menu_sign_out')" :icon="LogOut" @click="closeMenu(); toast.info(t('ui_kit.samples.menu_sign_out'))" />
            </template>
            <UiCard :title="t('ui_kit.samples.card_title')">{{ t('ui_kit.samples.card_body') }}</UiCard>
        </UiAppShell>
    </div>
</template>
