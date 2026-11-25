<script setup lang="ts">
/**
 * A list of rows with a line between them: the ways to sign in, the
 * permissions of a group, the addresses of a person. The rows are
 * UiListItem; the list only draws the lines and the edges.
 */
withDefaults(defineProps<{ bordered?: boolean; dense?: boolean; divided?: boolean }>(), { bordered: false, dense: false, divided: false });
</script>

<template>
    <ul class="divide-y divide-line text-sm" :class="[bordered ? 'rounded-card border border-line bg-surface' : '', divided ? 'border-t border-line' : '', dense ? '[&>li]:py-1.5' : '[&>li]:py-3']" data-test="list">
        <slot />
    </ul>
</template>
