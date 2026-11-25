<script setup lang="ts">
import UiSearchInput from '../../ui/UiSearchInput.vue';
import { useTrans } from '../words';
import { ref } from 'vue';

const t = useTrans();
const q = ref('');
const searching = ref(false);

function search(): void {
    searching.value = true;
    setTimeout(() => (searching.value = false), 600);
}
</script>

<template>
    <UiSearchInput v-model="q" :placeholder="t('ui_kit.samples.search_placeholder')" :loading="searching" @search="search" />
</template>
