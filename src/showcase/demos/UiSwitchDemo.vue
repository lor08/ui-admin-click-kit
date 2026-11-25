<script setup lang="ts">
import UiSwitch from '../../ui/UiSwitch.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ renew: true, notify: false });
</script>

<template>
    <div class="space-y-3">
        <UiSwitch v-model="form.renew" :label="t('ui_kit.samples.auto_renew')" :description="t('ui_kit.samples.auto_renew_hint')" />
        <UiSwitch v-model="form.notify" :label="t('ui_kit.samples.notifications')" />
        <UiSwitch :model-value="false" :label="t('ui_kit.samples.disabled')" disabled />
    </div>
</template>
