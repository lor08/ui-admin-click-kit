<script setup lang="ts">
import UiStreetView from '../../ui/UiStreetView.vue';
import { useTrans } from '../words';

const t = useTrans();
</script>

<template>
    <div class="max-w-sm">
        <UiStreetView :address="t('ui_kit.samples.street_view_address')" :unit="t('ui_kit.samples.street_view_unit')" />
    </div>
</template>
