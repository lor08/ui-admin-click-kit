<script setup lang="ts">
import UiTabNav from '../../ui/UiTabNav.vue';
import { useTrans } from '../words';
import { FileText, LayoutDashboard, ListTodo } from 'lucide-vue-next';

const t = useTrans();
const items = [
    { key: 'overview', label: t('ui_kit.samples.tab_nav_overview'), href: '#UiTabNav', count: 2, icon: LayoutDashboard },
    { key: 'tasks', label: t('ui_kit.samples.tab_nav_tasks'), href: '#UiTabNav', count: 5, icon: ListTodo },
    { key: 'files', label: t('ui_kit.samples.tab_nav_files'), href: '#UiTabNav', count: 14, icon: FileText },
];
</script>

<template>
    <div class="max-w-56">
        <UiTabNav :items="items" current="overview" :label="t('ui_kit.samples.tab_nav_label')" />
    </div>
</template>
