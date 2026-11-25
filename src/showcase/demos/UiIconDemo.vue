<script setup lang="ts">
import UiIcon from '../../ui/UiIcon.vue';
import { ICONS, type IconName } from '../../ui/icons';

const names = Object.keys(ICONS) as IconName[];
</script>

<template>
    <ul class="grid grid-cols-2 gap-2 text-sm text-ink sm:grid-cols-3 lg:grid-cols-4">
        <li v-for="name in names" :key="name" class="flex items-center gap-2">
            <UiIcon :name="name" class="text-lg text-ink-muted" />
            <code class="text-xs">{{ name }}</code>
        </li>
    </ul>
</template>
