<script setup lang="ts">
/**
 * Text with marks a server has already cleaned (a note for the team):
 * paragraphs, bold, italic, underline, colour. Never
 * give it HTML that did not pass the server's cleaning.
 */
const props = withDefaults(defineProps<{ html: string; empty?: string }>(), { empty: '' });
</script>

<template>
    <!-- eslint-disable-next-line vue/no-v-html -- cleaned by the server (Domain\DispatchMessage) -->
    <div v-if="props.html !== ''" class="text-sm leading-6 text-ink [&_p]:my-1 first:[&_p]:mt-0 last:[&_p]:mb-0" data-test="rich-text" v-html="props.html" />
    <p v-else class="text-sm text-ink-subtle">{{ props.empty }}</p>
</template>
