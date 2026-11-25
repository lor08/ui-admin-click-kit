<script setup lang="ts">
import UiMap from '../../ui/UiMap.vue';
import type { MapFeature, MapFeatureStyle, MapInfo } from '../../ui/map';
import { useTrans } from '../words';
import { computed, ref } from 'vue';

const t = useTrans();

/** Four squares on the map; a click puts one in the sample area or takes it out. */
const features: MapFeature[] = [
    ['A1', -122.43, 37.77],
    ['A2', -122.41, 37.77],
    ['B1', -122.43, 37.75],
    ['B2', -122.41, 37.75],
].map(([id, lng, lat]) => ({
    id: String(id),
    geometry: {
        type: 'Polygon',
        coordinates: [[[Number(lng), Number(lat)], [Number(lng) + 0.02, Number(lat)], [Number(lng) + 0.02, Number(lat) + 0.02], [Number(lng), Number(lat) + 0.02], [Number(lng), Number(lat)]]],
    },
}));

const inArea = ref(new Set<string>(['A2']));
const hovered = ref<string | null>(null);

const featureStyle = computed(() => {
    const area = inArea.value;

    return (id: string): MapFeatureStyle =>
        area.has(id)
            ? { fillColor: '#2196F3', fillOpacity: 0.5, strokeColor: '#2196F3', strokeWeight: 2.5, strokeOpacity: 1 }
            : { fillColor: '#9e9e9e', fillOpacity: 0.1, strokeColor: '#757575', strokeWeight: 1, strokeOpacity: 0.5 };
});

const info = computed<MapInfo | null>(() =>
    hovered.value === null ? null : { title: hovered.value, text: inArea.value.has(hovered.value) ? t('ui_kit.samples.map_area') : t('ui_kit.samples.map_none') },
);

function toggle(id: string): void {
    const next = new Set(inArea.value);
    if (!next.delete(id)) {
        next.add(id);
    }
    inArea.value = next;
}
</script>

<template>
    <UiMap
        class="h-80"
        :features="features"
        :feature-style="featureStyle"
        :center="{ lat: 37.77, lng: -122.41 }"
        :zoom="12"
        :info="info"
        @feature-click="toggle"
        @feature-hover="hovered = $event"
    />
</template>
