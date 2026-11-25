<script setup lang="ts">
import UiModal from './UiModal.vue';
import UiSkeleton from './UiSkeleton.vue';
import { mapsKey } from './map';
import { useTrans } from './kit';
import { computed, ref, watch } from 'vue';

/**
 * A picture of an address: Google Street View when there is a panorama,
 * else a static map with a pin. The
 * unit (apartment, suite) is said under it, Street View cannot show it.
 * Clicking the picture opens it larger. Without a Maps key (`maps.key`), or
 * when Google refuses the picture (the APIs are not on for the key), it
 * shows nothing: it is a help to the eye, never a gap in the form.
 */
const props = withDefaults(defineProps<{ address: string | null; unit?: string | null }>(), { unit: null });

const t = useTrans();
const key = mapsKey();
/** null while Google is asked whether a panorama exists. */
const panorama = ref<boolean | null>(null);
const failed = ref(false);
const enlarged = ref(false);
let asked = 0;

const location = computed(() => encodeURIComponent(props.address ?? ''));
const streetView = (width: number, height: number): string => `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${location.value}&fov=90&key=${key}`;
const staticMap = (width: number, height: number): string =>
    `https://maps.googleapis.com/maps/api/staticmap?center=${location.value}&zoom=15&size=${width}x${height}&markers=color:red%7C${location.value}&key=${key}&scale=2`;
const picture = (width: number, height: number): string => (panorama.value ? streetView(width, height) : staticMap(width, height));
const alt = computed(() => t(panorama.value ? 'ui.street_view.panorama' : 'ui.street_view.map'));
const shown = computed(() => key !== '' && (props.address ?? '') !== '' && !failed.value);

async function ask(): Promise<void> {
    const mine = ++asked;
    failed.value = false;
    enlarged.value = false;
    if (key === '' || (props.address ?? '') === '') {
        panorama.value = false;
        return;
    }
    panorama.value = null;
    let found = false;
    try {
        const answer = (await (await fetch(`https://maps.googleapis.com/maps/api/streetview/metadata?location=${location.value}&key=${key}`)).json()) as { status?: string };
        found = answer.status === 'OK';
    } catch {
        found = false;
    }
    if (mine === asked) {
        panorama.value = found;
    }
}

watch(() => props.address, () => void ask(), { immediate: true });
</script>

<template>
    <figure v-if="shown" class="space-y-1.5" data-test="street-view">
        <UiSkeleton v-if="panorama === null" shape="block" class="aspect-video" />
        <button
            v-else
            type="button"
            class="block w-full cursor-zoom-in overflow-hidden rounded-lg border border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
            :aria-label="t('ui.street_view.enlarge')"
            data-test="street-view-open"
            @click="enlarged = true"
        >
            <img :src="picture(640, 360)" :alt="alt" class="aspect-video w-full object-cover" loading="lazy" data-test="street-view-picture" @error="failed = true" />
        </button>
        <figcaption v-if="props.unit" class="text-xs text-ink-muted" data-test="street-view-unit">{{ t('ui.street_view.unit', { unit: props.unit }) }}</figcaption>
        <UiModal :open="enlarged" :title="props.address ?? ''" size="lg" @close="enlarged = false">
            <img v-if="enlarged" :src="picture(800, 400)" :alt="alt" class="w-full rounded-lg" />
        </UiModal>
    </figure>
</template>
