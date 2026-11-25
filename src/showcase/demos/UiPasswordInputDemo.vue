<script setup lang="ts">
import UiPasswordInput from '../../ui/UiPasswordInput.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ current: '', fresh: 'Correct-horse' });
</script>

<template>
    <div class="grid max-w-md gap-4">
        <UiPasswordInput v-model="form.current" :label="t('ui_kit.samples.password')" autocomplete="current-password" />
        <UiPasswordInput v-model="form.fresh" :label="t('ui_kit.samples.new_password')" autocomplete="new-password" strength :min-length="12" />
    </div>
</template>
