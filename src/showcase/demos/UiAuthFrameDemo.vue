<script setup lang="ts">
import UiAuthFrame from '../../ui/UiAuthFrame.vue';
import UiButton from '../../ui/UiButton.vue';
import UiForm from '../../ui/UiForm.vue';
import UiInput from '../../ui/UiInput.vue';
import UiPasswordInput from '../../ui/UiPasswordInput.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ email: '', password: '' });
</script>

<template>
    <div class="h-96 overflow-auto">
        <UiAuthFrame brand="Acme Admin" :title="t('ui_kit.samples.login_title')" :lead="t('ui_kit.samples.login_lead')">
            <UiForm @submit="() => undefined">
                <UiInput id="demo-auth-email" v-model="form.email" type="email" :label="t('ui_kit.samples.email')" />
                <UiPasswordInput id="demo-auth-password" v-model="form.password" :label="t('ui_kit.samples.password')" />
                <template #actions><UiButton type="submit" block>{{ t('ui_kit.samples.login_title') }}</UiButton></template>
            </UiForm>
            <template #footer><UiButton variant="link" size="sm">{{ t('ui_kit.samples.login_help') }}</UiButton></template>
        </UiAuthFrame>
    </div>
</template>
