<script setup lang="ts">
/** Who is signed in, at the foot of the dark sidebar: the name and a caption under it (the role). */
defineProps<{ name: string; caption: string }>();
</script>

<template>
    <div class="px-3 py-2" data-test="identity">
        <p class="truncate text-sm font-medium text-white" data-test="identity-name">{{ name }}</p>
        <p class="truncate text-xs text-sidebar-muted" data-test="identity-caption">{{ caption }}</p>
    </div>
</template>
