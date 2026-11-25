<script setup lang="ts">
import UiStatCard from '../../ui/UiStatCard.vue';
import { useTrans } from '../words';
import { CalendarX, CreditCard, ListTodo } from 'lucide-vue-next';

const t = useTrans();
</script>

<template>
    <div class="grid gap-3 sm:grid-cols-2">
        <UiStatCard :label="t('ui_kit.samples.stat_tasks')" :value="42" :hint="t('ui_kit.samples.stat_hint')"><template #icon><ListTodo /></template></UiStatCard>
        <UiStatCard :label="t('ui_kit.samples.stat_overdue')" :value="3" tone="danger" href="/tasks?status=overdue"><template #icon><CalendarX /></template></UiStatCard>
        <UiStatCard :label="t('ui_kit.samples.stat_members')" :value="128" tone="success"><template #icon><CreditCard /></template></UiStatCard>
        <UiStatCard :label="t('ui_kit.samples.stat_revenue')" :value="null" loading />
    </div>
    <div class="mt-4 flex flex-wrap gap-2">
        <UiStatCard compact :label="t('ui_kit.samples.stat_tasks')" :value="42"><template #icon><ListTodo /></template></UiStatCard>
        <UiStatCard compact :label="t('ui_kit.samples.stat_overdue')" :value="3" tone="danger" href="/tasks"><template #icon><CalendarX /></template></UiStatCard>
        <UiStatCard compact :label="t('ui_kit.samples.stat_overdue')" :value="0" tone="success"><template #icon><CalendarX /></template></UiStatCard>
        <UiStatCard compact :label="t('ui_kit.samples.stat_members')" :value="128" tone="brand"><template #icon><CreditCard /></template></UiStatCard>
        <UiStatCard compact :label="t('ui_kit.samples.stat_members')" :value="null" loading />
    </div>
</template>
