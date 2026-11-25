<script setup lang="ts">
import UiCard from './UiCard.vue';

/** The frame of the pages a guest sees (sign in, a link that ran out): the product's name and one card in the middle. */
defineProps<{ brand: string; title: string; lead?: string | null }>();
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
        <div class="w-full max-w-md">
            <p class="mb-6 text-center text-sm font-semibold text-ink-muted" data-test="app-name">{{ brand }}</p>
            <UiCard :title="title" :lead="lead ?? null">
                <slot />
            </UiCard>
            <div v-if="$slots.footer" class="mt-4 flex justify-center"><slot name="footer" /></div>
        </div>
    </div>
</template>
