<script setup lang="ts">
import { useTrans } from './words';

const t = useTrans();

// The semantic names of base.css, drawn with the class that uses each one.
const colors = [
    ['brand-600', 'bg-brand-600'],
    ['brand-50', 'bg-brand-50'],
    ['canvas', 'bg-canvas'],
    ['surface-muted', 'bg-surface-muted'],
    ['line', 'bg-line'],
    ['ink', 'bg-ink'],
    ['ink-muted', 'bg-ink-muted'],
    ['success', 'bg-success'],
    ['warning', 'bg-warning'],
    ['danger', 'bg-danger'],
    ['info', 'bg-info'],
    ['sidebar', 'bg-sidebar'],
] as const;
</script>

<template>
    <section id="tokens" class="scroll-mt-20 rounded-card border border-line bg-surface" data-test="kit-tokens">
        <header class="border-b border-line px-5 py-4">
            <h2 class="text-base font-semibold text-ink">{{ t('ui_kit.tokens.title') }}</h2>
            <p class="mt-1 text-sm text-ink-muted">{{ t('ui_kit.tokens.lead') }}</p>
        </header>
        <div class="grid gap-6 px-5 py-5 lg:grid-cols-[2fr_1fr_1fr]">
            <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('ui_kit.tokens.colors') }}</p>
                <ul class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                    <li v-for="[name, cls] in colors" :key="name" class="text-xs text-ink-muted">
                        <span class="block h-10 rounded-control border border-line" :class="cls" />
                        <span class="mt-1 block font-mono">{{ name }}</span>
                    </li>
                </ul>
            </div>
            <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('ui_kit.tokens.radii') }}</p>
                <div class="flex gap-4 text-xs text-ink-muted">
                    <div><span class="block h-12 w-16 rounded-control border border-line-strong bg-canvas" /><span class="mt-1 block font-mono">control</span></div>
                    <div><span class="block h-12 w-16 rounded-card border border-line-strong bg-canvas" /><span class="mt-1 block font-mono">card</span></div>
                    <div><span class="block h-12 w-12 rounded-full border border-line-strong bg-canvas" /><span class="mt-1 block font-mono">full</span></div>
                </div>
            </div>
            <div>
                <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('ui_kit.tokens.type') }}</p>
                <p class="text-2xl font-semibold tracking-tight text-ink">text-2xl</p>
                <p class="text-lg font-semibold text-ink">text-lg</p>
                <p class="text-base font-semibold text-ink">text-base</p>
                <p class="text-sm text-ink">text-sm</p>
                <p class="text-sm text-ink-muted">text-sm ink-muted</p>
                <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">text-xs uppercase</p>
            </div>
        </div>
    </section>
</template>
