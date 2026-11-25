<script setup lang="ts">
import UiSpinner from './UiSpinner.vue';
import { kitLocale, useTrans } from './kit';
import { MapPinOff } from 'lucide-vue-next';
import { onBeforeUnmount, onMounted, ref, toRaw, watch } from 'vue';
import { configureMaps, mapsKey, mapsLoader, type MapBounds, type MapFeature, type MapFeatureStyle, type MapGeometry, type MapInfo, type MapPoint, type MapViewport } from './map';

/**
 * A Google Maps canvas with GeoJSON polygons on it. The parent owns what
 * is drawn and how: `features` are the polygons to keep on the map (the
 * map adds, drops and swaps them by id and by geometry), `featureStyle`
 * paints each one, and a new function repaints them all. Clicks and the
 * pointer come back by feature id; `viewport` reports the bounds after
 * every pan and zoom so the parent can cull what is off screen. Without
 * a Maps key and loader (`maps`) the map says so instead of loading.
 */
const props = withDefaults(
    defineProps<{
        features?: MapFeature[];
        featureStyle?: (id: string) => MapFeatureStyle;
        center?: MapPoint;
        zoom?: number;
        loading?: boolean;
        loadingLabel?: string;
        info?: MapInfo | null;
        label?: string;
    }>(),
    {
        features: () => [],
        featureStyle: () => ({}),
        center: () => ({ lat: 39.5, lng: -98.35 }),
        zoom: 4,
        loading: false,
        loadingLabel: undefined,
        info: null,
        label: undefined,
    },
);

const emit = defineEmits<{
    ready: [];
    viewport: [viewport: MapViewport];
    'feature-click': [id: string];
    'feature-hover': [id: string | null];
}>();

const t = useTrans();

const key = mapsKey();
const loader = mapsLoader();
const language = kitLocale();
const status = ref<'no-key' | 'loading' | 'ready' | 'failed'>(key === '' || loader === null ? 'no-key' : 'loading');
const canvas = ref<HTMLElement | null>(null);

let map: google.maps.Map | null = null;
const listeners: google.maps.MapsEventListener[] = [];
const rendered = new Map<string, { feature: google.maps.Data.Feature; geometry: MapGeometry }>();

function featureId(feature: google.maps.Data.Feature): string {
    return String(feature.getId() ?? '');
}

function syncFeatures(): void {
    if (map === null) {
        return;
    }

    const wanted = new Map<string, MapGeometry>(props.features.map((feature) => [feature.id, toRaw(feature.geometry)]));

    for (const [id, entry] of rendered) {
        if (wanted.get(id) !== entry.geometry) {
            map.data.remove(entry.feature);
            rendered.delete(id);
        }
    }

    for (const [id, geometry] of wanted) {
        if (rendered.has(id)) {
            continue;
        }
        const [added] = map.data.addGeoJson({ type: 'Feature', id, geometry, properties: {} });
        if (added) {
            rendered.set(id, { feature: added, geometry });
        }
    }
}

function applyStyle(): void {
    const style = props.featureStyle;
    map?.data.setStyle((feature) => style(featureId(feature)));
}

function reportViewport(): void {
    const bounds = map?.getBounds();
    if (!map || !bounds) {
        return;
    }
    emit('viewport', { bounds: bounds.toJSON(), zoom: map.getZoom() ?? props.zoom });
}

onMounted(async () => {
    if (status.value !== 'loading' || loader === null) {
        return;
    }

    try {
        configureMaps(loader, key, language);
        const { Map: GoogleMap } = (await loader.importLibrary('maps')) as google.maps.MapsLibrary;
        if (canvas.value === null) {
            return;
        }

        const created = new GoogleMap(canvas.value, { center: props.center, zoom: props.zoom });
        listeners.push(
            created.data.addListener('click', (event: google.maps.Data.MouseEvent) => emit('feature-click', featureId(event.feature))),
            created.data.addListener('mouseover', (event: google.maps.Data.MouseEvent) => emit('feature-hover', featureId(event.feature))),
            created.data.addListener('mouseout', () => emit('feature-hover', null)),
            created.addListener('idle', reportViewport),
        );
        map = created;
        syncFeatures();
        applyStyle();
        status.value = 'ready';
        emit('ready');
    } catch {
        status.value = 'failed';
    }
});

onBeforeUnmount(() => {
    listeners.forEach((listener) => listener.remove());
    rendered.clear();
    map = null;
});

watch(() => props.features, syncFeatures);
watch(() => props.featureStyle, applyStyle);

defineExpose({
    fitBounds(bounds: MapBounds): void {
        map?.fitBounds(bounds);
    },
});
</script>

<template>
    <div class="relative min-h-64 overflow-hidden rounded-card border border-line bg-canvas" :data-status="status" data-test="map">
        <div ref="canvas" class="absolute inset-0" role="region" :aria-label="props.label ?? t('ui.map.label')" />

        <div v-if="status === 'no-key' || status === 'failed'" class="absolute inset-0 flex flex-col items-center justify-center gap-1 p-6 text-center" data-test="map-placeholder">
            <MapPinOff class="h-6 w-6 text-ink-subtle" aria-hidden="true" />
            <p class="mt-2 text-sm font-medium text-ink">{{ status === 'no-key' ? t('ui.map.no_key') : t('ui.map.failed') }}</p>
            <p class="max-w-sm text-sm text-ink-muted">{{ status === 'no-key' ? t('ui.map.no_key_hint') : t('ui.map.failed_hint') }}</p>
        </div>

        <div v-else-if="props.loading || status === 'loading'" class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-surface/75 text-sm text-ink-muted" data-test="map-loading">
            <UiSpinner size="lg" :label="props.loading ? (props.loadingLabel ?? t('ui.loading')) : t('ui.map.loading')" />
            <span>{{ props.loading ? (props.loadingLabel ?? t('ui.loading')) : t('ui.map.loading') }}</span>
        </div>

        <div v-if="props.info && status === 'ready'" class="pointer-events-none absolute top-2 left-2 z-[5] flex max-w-48 flex-col rounded-control bg-ink/85 px-2 py-1 text-xs text-white" data-test="map-info">
            <span class="text-[13px] font-semibold">{{ props.info.title }}</span>
            <span v-if="props.info.text" class="truncate opacity-85">{{ props.info.text }}</span>
        </div>
    </div>
</template>
