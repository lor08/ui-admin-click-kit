<script setup lang="ts">
import UiAudioPlayer from './UiAudioPlayer.vue';
import UiButton from './UiButton.vue';
import { useTrans } from './kit';
import { Download } from '@lucide/vue';
import { computed } from 'vue';

/**
 * A file a person sent (the picture of an MMS, an attachment): a picture
 * shown in the page and opened whole in a new tab, a video or a sound
 * played in place, anything else a link to download. An SVG is never
 * shown: it is a document with scripts, so it is downloaded like the rest.
 * The host serves the file from an address the page may load
 * (`img-src`, `media-src` of its Content-Security-Policy).
 */
const props = defineProps<{
    src: string;
    /** The MIME type of the file, as its sender named it. */
    contentType: string;
    /** What the file is: the picture's alternative text, the player's name and the download link's words. */
    label: string;
}>();

const t = useTrans();

const kind = computed((): 'image' | 'video' | 'audio' | 'file' => {
    const type = props.contentType.toLowerCase();
    if (type.startsWith('image/') && type !== 'image/svg+xml') {
        return 'image';
    }
    if (type.startsWith('video/')) {
        return 'video';
    }

    return type.startsWith('audio/') ? 'audio' : 'file';
});
</script>

<template>
    <a v-if="kind === 'image'" :href="props.src" target="_blank" rel="noopener" class="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600" data-test="media-image">
        <img :src="props.src" :alt="props.label" loading="lazy" class="block max-h-80 max-w-full rounded-lg border border-line object-contain" />
    </a>
    <video v-else-if="kind === 'video'" :src="props.src" :aria-label="props.label" controls preload="metadata" class="block max-h-80 w-full max-w-md rounded-lg border border-line" data-test="media-video" />
    <UiAudioPlayer v-else-if="kind === 'audio'" :src="props.src" :label="props.label" data-test="media-audio" />
    <UiButton v-else variant="secondary" size="sm" :href="props.src" download data-test="media-file">
        <Download class="h-4 w-4" aria-hidden="true" />{{ t('ui.media.download', { name: props.label }) }}
    </UiButton>
</template>
