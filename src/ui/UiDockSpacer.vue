<script setup lang="ts">
/** Between the dock's groups: `sep` a thin line, `grow` the room that pushes what follows to the right. */
const props = withDefaults(defineProps<{ kind?: 'sep' | 'grow' }>(), { kind: 'sep' });
</script>

<template>
    <span :class="props.kind === 'grow' ? 'flex-1' : 'h-[22px] w-px bg-white/12'" aria-hidden="true" />
</template>
