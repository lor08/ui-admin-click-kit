<script setup lang="ts">
import UiCheckboxGroup from '../../ui/UiCheckboxGroup.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const roles = ref(['editor']);
</script>

<template>
    <UiCheckboxGroup
        v-model="roles"
        :label="t('ui_kit.samples.roles')"
        :hint="t('ui_kit.samples.roles_hint')"
        :columns="2"
        :options="[
            { value: 'admin', label: t('ui_kit.samples.role_admin') },
            { value: 'editor', label: t('ui_kit.samples.role_editor') },
            { value: 'sales_qa', label: t('ui_kit.samples.role_viewer'), description: t('ui_kit.samples.role_viewer_hint') },
        ]"
    />
</template>
