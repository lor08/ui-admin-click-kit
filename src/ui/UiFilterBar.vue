<script setup lang="ts">
import UiButton from './UiButton.vue';
import { useTrans } from './kit';
import { computed } from 'vue';

/**
 * The row of filters over a list: the controls go in the default slot, the
 * buttons are the kit's. Submit applies, the second button resets; both
 * are the page's to handle, the bar only lays them out.
 */
const props = withDefaults(defineProps<{ processing?: boolean; resettable?: boolean; applyLabel?: string; resetLabel?: string; columns?: 2 | 3 | 4 | 5 | 6 }>(), {
    processing: false,
    resettable: true,
    applyLabel: undefined,
    resetLabel: undefined,
    columns: 4,
});

const emit = defineEmits<{ apply: []; reset: [] }>();

const t = useTrans();

const grid: Record<NonNullable<typeof props.columns>, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
    5: 'sm:grid-cols-2 lg:grid-cols-5',
    6: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
};

const classes = computed(() => ['grid gap-3', grid[props.columns]]);
</script>

<template>
    <form class="rounded-card border border-line bg-surface p-4" novalidate data-test="filter" @submit.prevent="emit('apply')">
        <div :class="classes"><slot /></div>
        <fieldset class="mt-3 flex flex-wrap items-center gap-2" :disabled="props.processing">
            <UiButton type="submit" size="sm" :loading="props.processing" data-test="apply">{{ props.applyLabel ?? t('ui.filters.apply') }}</UiButton>
            <UiButton v-if="props.resettable" variant="ghost" size="sm" data-test="reset" @click="emit('reset')">{{ props.resetLabel ?? t('ui.filters.reset') }}</UiButton>
            <slot name="actions" />
        </fieldset>
    </form>
</template>
