<script setup lang="ts">
/**
 * A bare icon button of the softphone's panel, Click's `.plain`: no
 * background or border, the colour of the text around it. `label` names
 * it and is its tooltip.
 */
const props = defineProps<{ label: string }>();
</script>

<template>
    <button type="button" class="cursor-pointer text-inherit" :aria-label="props.label" :title="props.label">
        <slot />
    </button>
</template>
