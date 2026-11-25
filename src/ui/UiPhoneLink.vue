<script setup lang="ts">
/**
 * A phone number one can call, Click's `.phone-link`: a `tel:` link with a
 * dashed underline instead of the usual one. The parent decides on `click`
 * whether the browser follows the link. The click and the Enter stay on the
 * link, so a table row that opens on them does not open with it. It is a
 * plain anchor, not the host's link component: a `tel:` address is no page
 * of the app's router.
 */
const props = withDefaults(defineProps<{ href: string; title?: string }>(), { title: undefined });

const emit = defineEmits<{ click: [event: MouseEvent] }>();
</script>

<template>
    <a :href="props.href" :title="props.title" class="border-b border-dashed border-current whitespace-nowrap no-underline" data-test="phone-link" @click.stop="emit('click', $event)" @keydown.enter.stop><slot /></a>
</template>
