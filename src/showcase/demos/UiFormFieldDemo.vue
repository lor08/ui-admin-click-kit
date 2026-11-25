<script setup lang="ts">
import UiFormField from '../../ui/UiFormField.vue';
import UiInput from '../../ui/UiInput.vue';
import { useTrans } from '../words';
import { reactive } from 'vue';

const t = useTrans();
const form = reactive({ street: '', city: '' });
</script>

<template>
    <UiFormField :label="t('ui_kit.samples.address')" :hint="t('ui_kit.samples.notes_hint')" required>
        <div class="grid grid-cols-3 gap-2">
            <UiInput v-model="form.street" class="col-span-2" :placeholder="t('ui_kit.samples.street')" />
            <UiInput v-model="form.city" :placeholder="t('ui_kit.samples.city')" />
        </div>
    </UiFormField>
</template>
