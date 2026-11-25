<script setup lang="ts" generic="T extends object">
import UiSkeleton from './UiSkeleton.vue';
import type { Tone } from './styles';
import { useTrans } from './kit';
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical } from '@lucide/vue';
import { computed, nextTick, ref } from 'vue';

export interface UiTableColumn {
    key: string;
    label: string;
    sortable?: boolean;
    align?: 'left' | 'right' | 'center';
    class?: string;
    /** The column of row actions: as narrow as its content and pinned to the right edge while a wide table scrolls, so it stays in reach on a phone. */
    pinEnd?: boolean;
    /** The header is there for screen readers only (a column of buttons whose own labels say what they do). */
    hideLabel?: boolean;
}

export interface UiTableSort {
    key: string;
    direction: 'asc' | 'desc';
}

/**
 * The list of a screen: columns, rows, a slot per cell, an empty state and
 * sorting. With `sort` bound the parent orders the rows (the server, most
 * of the time); without it the table orders what it was given. A
 * `reorderable` table puts a handle before each row: dragged by the
 * pointer, or moved with the arrow keys while it has the focus, it asks the
 * parent to move the row (`reorder`), and the parent changes `rows`.
 */
const props = withDefaults(
    defineProps<{
        columns: UiTableColumn[];
        rows: T[];
        /** The field that identifies a row, for Vue's keys. */
        rowKey: string;
        empty?: string;
        sort?: UiTableSort | null;
        loading?: boolean;
        dense?: boolean;
        /** Rows react to hover and clicks; the parent gets `row-click`. */
        clickable?: boolean;
        /** Inside a UiCard with padding="none": no border of its own. */
        flush?: boolean;
        /** Rows the reader should pass over (blocked, archived) are drawn dimmed. */
        mutedRow?: (row: T) => boolean;
        /** A state the reader should spot down the list (a running job, a failed one) tints the row; the state is also written in a cell. */
        rowTone?: (row: T) => Tone | null;
        /** A row that waits for someone now (a request nobody has taken) blinks; reduced motion leaves it tinted. Write the state in a cell too. */
        pulseRow?: (row: T) => boolean;
        /** The first column stays in place while a wide table scrolls sideways, so every row keeps its name (a dashboard of days). For tables without row tints. */
        stickyFirst?: boolean;
        /** A handle before each row moves it, by drag and drop or the arrow keys; the parent gets `reorder` and orders `rows` itself. */
        reorderable?: boolean;
        /** The name of a row the handle's label says, for a screen reader ("Move Anna"); the row key without it. */
        rowLabel?: (row: T) => string;
    }>(),
    {
        empty: undefined,
        sort: undefined,
        loading: false,
        dense: false,
        clickable: false,
        flush: false,
        mutedRow: undefined,
        rowTone: undefined,
        pulseRow: undefined,
        stickyFirst: false,
        reorderable: false,
        rowLabel: undefined,
    },
);

const emit = defineEmits<{ 'update:sort': [sort: UiTableSort]; 'row-click': [row: T]; reorder: [from: number, to: number] }>();

const t = useTrans();

const localSort = ref<UiTableSort | null>(null);
const controlled = computed(() => props.sort !== undefined);
const activeSort = computed((): UiTableSort | null => (controlled.value ? props.sort ?? null : localSort.value));

function cell(row: T, key: string): string {
    const value = (row as Record<string, unknown>)[key];

    return value === null || value === undefined ? '' : String(value);
}

function keyOf(row: T): string {
    return String((row as Record<string, unknown>)[props.rowKey]);
}

function toggle(column: UiTableColumn): void {
    if (!column.sortable) {
        return;
    }
    const current = activeSort.value;
    const next: UiTableSort = {
        key: column.key,
        direction: current?.key === column.key && current.direction === 'asc' ? 'desc' : 'asc',
    };
    if (controlled.value) {
        emit('update:sort', next);
    } else {
        localSort.value = next;
    }
}

const visibleRows = computed((): T[] => {
    const sort = activeSort.value;
    if (controlled.value || sort === null) {
        return props.rows;
    }
    const sign = sort.direction === 'asc' ? 1 : -1;

    return [...props.rows].sort((a, b) => {
        const left = (a as Record<string, unknown>)[sort.key];
        const right = (b as Record<string, unknown>)[sort.key];
        if (typeof left === 'number' && typeof right === 'number') {
            return (left - right) * sign;
        }

        return String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true }) * sign;
    });
});

const aligns = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

function ariaSort(column: UiTableColumn): 'ascending' | 'descending' | 'none' | undefined {
    if (!column.sortable) {
        return undefined;
    }
    if (activeSort.value?.key !== column.key) {
        return 'none';
    }

    return activeSort.value.direction === 'asc' ? 'ascending' : 'descending';
}

const padding = computed(() => (props.dense ? 'px-3 py-1.5' : 'px-4 py-2.5'));

/** Every column of the table: the handle's first when the rows move. */
const span = computed(() => props.columns.length + (props.reorderable ? 1 : 0));

/** The row whose handle the pointer holds (only that row may be dragged), the row dragged and the row it is over. */
const armed = ref<string | null>(null);
const dragged = ref<number | null>(null);
const over = ref<number | null>(null);
const body = ref<HTMLElement | null>(null);

const indexOf = (row: T): number => props.rows.indexOf(row);

function dragStart(row: T, event: DragEvent): void {
    if (armed.value !== keyOf(row)) {
        event.preventDefault();

        return;
    }
    dragged.value = indexOf(row);
    if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        // Firefox starts a drag only with data set.
        event.dataTransfer.setData('text/plain', keyOf(row));
    }
}

function dragOver(row: T, event: DragEvent): void {
    if (dragged.value === null) {
        return;
    }
    event.preventDefault();
    over.value = indexOf(row);
}

function drop(row: T, event: DragEvent): void {
    event.preventDefault();
    const from = dragged.value;
    const to = indexOf(row);
    dragEnd();
    if (from !== null && from !== to) {
        emit('reorder', from, to);
    }
}

function dragEnd(): void {
    armed.value = null;
    dragged.value = null;
    over.value = null;
}

/** An arrow key on the handle moves the row one place; the focus stays on the handle of the row moved. */
async function moveByKey(row: T, delta: number): Promise<void> {
    const from = indexOf(row);
    const to = from + delta;
    if (to < 0 || to >= props.rows.length) {
        return;
    }
    const key = keyOf(row);
    emit('reorder', from, to);
    await nextTick();
    body.value?.querySelector<HTMLElement>(`[data-reorder-key="${CSS.escape(key)}"]`)?.focus();
}

const handleLabel = (row: T): string => t('ui.table.move', { row: props.rowLabel?.(row) ?? keyOf(row) });

/** The first column of a stickyFirst table: pinned to the left edge, on its own background so the scrolled cells pass under it. */
const pinned = (index: number, head: boolean): string => (props.stickyFirst && index === 0 ? `sticky left-0 z-10 ${head ? 'bg-canvas' : 'bg-surface'} shadow-[1px_0_0_var(--color-line)]` : '');

/** A pinEnd column: on the row's own background (it inherits the row's tint and hover), with a line on its left edge. */
const pinnedEnd = (column: UiTableColumn, head: boolean): string =>
    column.pinEnd ? `sticky right-0 z-10 w-px whitespace-nowrap ${head ? 'bg-canvas' : 'bg-inherit'} shadow-[-1px_0_0_var(--color-line)]` : '';

const tints: Record<Tone, string> = {
    neutral: 'bg-canvas hover:bg-surface-muted',
    brand: 'bg-brand-50 hover:bg-brand-100',
    success: 'bg-success-surface hover:bg-success/10',
    warning: 'bg-warning-surface hover:bg-warning/10',
    danger: 'bg-danger-surface hover:bg-danger/10',
    info: 'bg-info-surface hover:bg-info/10',
};

/** The tone paints the background; a muted row keeps it and only dims the text. */
function rowClasses(row: T): string[] {
    const tone = props.rowTone?.(row) ?? null;
    const muted = props.mutedRow?.(row) ?? false;
    const pulse = props.pulseRow?.(row) ?? false;
    const background = pulse ? 'bg-danger-surface motion-safe:animate-row-pulse' : tone ? tints[tone] : muted ? 'bg-surface-muted hover:bg-canvas' : 'bg-surface hover:bg-canvas';

    const index = props.reorderable ? props.rows.indexOf(row) : -1;
    const moving = dragged.value !== null && dragged.value === index ? 'opacity-50' : '';
    // The line shows where the row lands: above the row it is over when it goes up, below it when it goes down.
    const target =
        dragged.value !== null && over.value === index && dragged.value !== index
            ? dragged.value > index
                ? 'shadow-[inset_0_2px_0_var(--color-brand-600)]'
                : 'shadow-[inset_0_-2px_0_var(--color-brand-600)]'
            : '';

    return [background, props.clickable ? 'cursor-pointer' : '', muted ? 'text-ink-muted [&_td]:text-ink-muted' : '', moving, target];
}
</script>

<template>
    <div class="overflow-x-auto bg-surface" :class="props.flush ? '' : 'rounded-card border border-line'">
        <table class="min-w-full divide-y divide-line text-sm">
            <thead class="bg-canvas text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <tr>
                    <th v-if="props.reorderable" scope="col" class="w-px" :class="padding"><span class="sr-only">{{ t('ui.table.order') }}</span></th>
                    <th
                        v-for="(column, index) in props.columns"
                        :key="column.key"
                        scope="col"
                        :class="[padding, aligns[column.align ?? 'left'], column.class, pinned(index, true), pinnedEnd(column, true)]"
                        :aria-sort="ariaSort(column)"
                    >
                        <button
                            v-if="column.sortable"
                            type="button"
                            class="inline-flex items-center gap-1 rounded uppercase hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                            :class="activeSort?.key === column.key ? 'text-ink' : ''"
                            :aria-label="t('ui.sort.by', { column: column.label })"
                            data-test="sort"
                            @click="toggle(column)"
                        >
                            <slot :name="`header-${column.key}`" :column="column">{{ column.label }}</slot>
                            <ArrowUp v-if="activeSort?.key === column.key && activeSort.direction === 'asc'" class="h-3.5 w-3.5" aria-hidden="true" />
                            <ArrowDown v-else-if="activeSort?.key === column.key" class="h-3.5 w-3.5" aria-hidden="true" />
                            <ArrowUpDown v-else class="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
                        </button>
                        <span v-else-if="column.hideLabel" class="sr-only">{{ column.label }}</span>
                        <slot v-else :name="`header-${column.key}`" :column="column">{{ column.label }}</slot>
                    </th>
                </tr>
            </thead>
            <tbody ref="body" class="divide-y divide-line">
                <template v-if="props.loading">
                    <tr v-for="line in 3" :key="`loading-${line}`" data-test="loading">
                        <td v-if="props.reorderable" :class="padding" />
                        <td v-for="column in props.columns" :key="column.key" :class="padding"><UiSkeleton /></td>
                    </tr>
                </template>
                <tr v-else-if="visibleRows.length === 0">
                    <td :colspan="span" class="px-4 py-8 text-center text-ink-muted" data-test="empty">
                        <slot name="empty">{{ props.empty ?? t('ui.empty') }}</slot>
                    </td>
                </tr>
                <tr
                    v-for="row in visibleRows"
                    v-else
                    :key="keyOf(row)"
                    :class="rowClasses(row)"
                    :data-muted="props.mutedRow?.(row) ? 'true' : undefined"
                    :data-tone="props.rowTone?.(row) ?? undefined"
                    :data-pulse="props.pulseRow?.(row) ? 'true' : undefined"
                    :tabindex="props.clickable ? 0 : undefined"
                    :draggable="props.reorderable && armed === keyOf(row) ? 'true' : undefined"
                    :data-dragged="dragged !== null && dragged === indexOf(row) ? 'true' : undefined"
                    :data-drop="over !== null && over === indexOf(row) && dragged !== over ? 'true' : undefined"
                    @click="props.clickable && emit('row-click', row)"
                    @keydown.enter="props.clickable && emit('row-click', row)"
                    @dragstart="props.reorderable && dragStart(row, $event)"
                    @dragover="props.reorderable && dragOver(row, $event)"
                    @drop="props.reorderable && drop(row, $event)"
                    @dragend="props.reorderable && dragEnd()"
                >
                    <td v-if="props.reorderable" class="w-px align-top" :class="padding">
                        <button
                            type="button"
                            class="inline-flex h-6 w-6 cursor-grab items-center justify-center rounded text-ink-muted hover:bg-surface-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 active:cursor-grabbing"
                            :aria-label="handleLabel(row)"
                            :aria-keyshortcuts="'ArrowUp ArrowDown'"
                            :data-reorder-key="keyOf(row)"
                            data-test="reorder-handle"
                            @pointerdown="armed = keyOf(row)"
                            @pointerup="armed = null"
                            @click.stop
                            @keydown.up.prevent="moveByKey(row, -1)"
                            @keydown.down.prevent="moveByKey(row, 1)"
                        >
                            <GripVertical class="h-4 w-4" aria-hidden="true" />
                        </button>
                    </td>
                    <td v-for="(column, index) in props.columns" :key="column.key" class="align-top text-ink" :class="[padding, aligns[column.align ?? 'left'], column.class, pinned(index, false), pinnedEnd(column, false)]">
                        <slot :name="`cell-${column.key}`" :row="row">{{ cell(row, column.key) }}</slot>
                    </td>
                </tr>
            </tbody>
            <tfoot v-if="$slots.footer" class="border-t border-line bg-canvas">
                <tr>
                    <td :colspan="span" :class="padding"><slot name="footer" /></td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>
