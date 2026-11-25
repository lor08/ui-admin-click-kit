<script setup lang="ts">
import UiCombobox from '../../ui/UiCombobox.vue';
import UiText from '../../ui/UiText.vue';
import { useTrans } from '../words';
import { computed, ref } from 'vue';

const t = useTrans();
const q = ref('');
const picked = ref('');
const people = [
    { key: 'jane', name: 'Jane Doe', phone: '+1 555 0167' },
    { key: 'john', name: 'John Roe', phone: '+1 555 0199' },
];
const options = computed(() => {
    const text = q.value.trim().toLowerCase();
    if (text.length < 3) {
        return [];
    }
    const found = people.filter((person) => person.name.toLowerCase().includes(text) || person.phone.includes(text));
    return [{ key: 'create', name: t('ui_kit.samples.combobox_create', { q: q.value.trim() }), phone: '' }, ...found];
});
const message = computed(() => (q.value.trim().length < 3 ? t('ui_kit.samples.combobox_short') : null));
</script>

<template>
    <div class="max-w-md space-y-2">
        <UiCombobox v-model="q" :options="options" :label="t('ui_kit.samples.combobox_label')" :placeholder="t('ui_kit.samples.combobox_placeholder')" :message="message" :prefer="(option) => option.key !== 'create'" @select="(option) => (picked = option.name)">
            <template #option="{ option }">
                <span class="grow">{{ option.name }}</span>
                <UiText tone="subtle" size="xs">{{ option.phone }}</UiText>
            </template>
        </UiCombobox>
        <UiText v-if="picked" tone="subtle" size="sm">{{ picked }}</UiText>
    </div>
</template>
