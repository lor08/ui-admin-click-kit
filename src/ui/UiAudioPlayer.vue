<script setup lang="ts">
import { ref } from 'vue';

/**
 * The browser's own player of a sound file: play, pause, the time line
 * and the volume, under a label a screen reader says. The page gives the
 * file's address when it has one (a link asked at the moment of
 * listening); the player loads nothing before the person presses play.
 * `play` tells the page a play started, so it can renew a link that ran
 * out while the page stayed open; `element` lets it start, seek and stop.
 */
const props = defineProps<{ src: string; label: string }>();

const emit = defineEmits<{ error: []; play: [] }>();

const element = ref<HTMLAudioElement | null>(null);

defineExpose({ element });
</script>

<template>
    <audio ref="element" class="block h-10 w-full max-w-md" controls preload="none" :src="props.src" :aria-label="props.label" data-test="audio" @error="emit('error')" @play="emit('play')" />
</template>
