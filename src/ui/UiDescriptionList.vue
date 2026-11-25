<script setup lang="ts">
export interface UiDescription {
    key: string;
    label: string;
    /** The plain value; leave it out when a slot `value-<key>` draws it. */
    value?: string | number | null;
}

/**
 * The "Information" block of a card: a caption and a value per line. A slot per key draws a value
 * that is not plain text (a badge, a list, a link); an empty value prints
 * the placeholder.
 */
withDefaults(defineProps<{ items: UiDescription[]; placeholder?: string; dense?: boolean }>(), { placeholder: '—', dense: false });
</script>

<template>
    <dl class="divide-y divide-line text-sm" data-test="description-list">
        <div v-for="item in items" :key="item.key" class="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(8rem,1fr)_3fr]" :class="dense ? 'py-1.5' : 'py-2.5'" :data-test="`item-${item.key}`">
            <dt class="text-ink-muted">{{ item.label }}</dt>
            <dd class="min-w-0 text-ink">
                <slot :name="`value-${item.key}`" :item="item">
                    <span v-if="item.value === null || item.value === undefined || item.value === ''" class="text-ink-subtle">{{ placeholder }}</span>
                    <template v-else>{{ item.value }}</template>
                </slot>
            </dd>
        </div>
    </dl>
</template>
