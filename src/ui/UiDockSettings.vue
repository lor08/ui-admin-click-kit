<script setup lang="ts">
/**
 * The softphone's settings under the panel's title, Click's
 * `.audio-settings`: a bordered column of fields and buttons; the
 * `footer` slot sits under a dashed line, as Click's `.fab-reset`.
 */
const props = defineProps<{ label: string }>();
</script>

<template>
    <section class="mb-2.5 flex flex-col gap-2 rounded-[6px] border border-slate-200 p-2.5 text-xs text-slate-600" :aria-label="props.label">
        <slot />
        <div v-if="$slots.footer" class="border-t border-dashed border-slate-200 pt-2">
            <slot name="footer" />
        </div>
    </section>
</template>
