<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { useTrans } from './kit';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { computed } from 'vue';

/**
 * Pages of a list: the current one, its neighbours, the first and the
 * last, with gaps for the rest. The parent fetches the page it is asked
 * for; the counts in the corner are optional.
 */
const props = withDefaults(defineProps<{ page: number; lastPage: number; total?: number | null; perPage?: number | null }>(), { total: null, perPage: null });

const emit = defineEmits<{ 'update:page': [page: number] }>();

const t = useTrans();

type Slot = number | 'gap';

const slots = computed((): Slot[] => {
    const last = Math.max(1, props.lastPage);
    const current = Math.min(Math.max(1, props.page), last);
    const wanted = new Set<number>([1, last, current - 1, current, current + 1]);
    const pages = [...wanted].filter((page) => page >= 1 && page <= last).sort((a, b) => a - b);
    const result: Slot[] = [];

    pages.forEach((page, index) => {
        const previous = pages[index - 1];
        if (previous !== undefined && page - previous > 1) {
            result.push(page - previous === 2 ? previous + 1 : 'gap');
        }
        result.push(page);
    });

    return result;
});

const summary = computed(() => {
    if (props.total === null || props.perPage === null) {
        return null;
    }
    const from = props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1;
    const to = Math.min(props.page * props.perPage, props.total);

    return t('ui.pagination.of', { from, to, total: props.total });
});

function go(page: number): void {
    if (page >= 1 && page <= props.lastPage && page !== props.page) {
        emit('update:page', page);
    }
}
</script>

<template>
    <nav class="flex flex-wrap items-center justify-between gap-3" :aria-label="t('ui.pagination.label')">
        <p v-if="summary" class="text-sm text-ink-muted" data-test="summary">{{ summary }}</p>
        <span v-else />
        <ul class="flex flex-wrap items-center gap-1">
            <li>
                <UiIconButton :label="t('ui.pagination.previous')" size="sm" variant="secondary" :disabled="props.page <= 1" data-test="previous" @click="go(props.page - 1)">
                    <ChevronLeft />
                </UiIconButton>
            </li>
            <li v-for="(slot, index) in slots" :key="`${slot}-${index}`">
                <span v-if="slot === 'gap'" class="px-1 text-ink-subtle" aria-hidden="true">…</span>
                <button
                    v-else
                    type="button"
                    class="h-8 min-w-8 rounded-control px-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                    :class="slot === props.page ? 'bg-brand-600 text-white' : 'text-ink hover:bg-canvas'"
                    :aria-current="slot === props.page ? 'page' : undefined"
                    :aria-label="t('ui.pagination.page', { page: slot })"
                    @click="go(slot)"
                >
                    {{ slot }}
                </button>
            </li>
            <li>
                <UiIconButton :label="t('ui.pagination.next')" size="sm" variant="secondary" :disabled="props.page >= props.lastPage" data-test="next" @click="go(props.page + 1)">
                    <ChevronRight />
                </UiIconButton>
            </li>
        </ul>
    </nav>
</template>
