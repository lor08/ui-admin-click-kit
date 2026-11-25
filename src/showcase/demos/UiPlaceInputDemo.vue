<script setup lang="ts">
import UiDescriptionList from '../../ui/UiDescriptionList.vue';
import UiPlaceInput from '../../ui/UiPlaceInput.vue';
import type { PlaceAddress } from '../../ui/map';
import { useTrans } from '../words';
import { computed, ref } from 'vue';

const t = useTrans();
const search = ref('');
const picked = ref<PlaceAddress>({ line1: '', line2: '', city: '', state: '', zip: '' });
const rows = computed(() => (['line1', 'city', 'state', 'zip'] as const).map((key) => ({ key, label: key, value: picked.value[key] })));
</script>

<template>
    <div class="grid max-w-xl gap-4">
        <UiPlaceInput id="demo-place" v-model="search" :label="t('ui_kit.samples.place_address')" :hint="t('ui_kit.samples.place_address_hint')" @place="picked = $event" />
        <UiDescriptionList :items="rows" />
    </div>
</template>
