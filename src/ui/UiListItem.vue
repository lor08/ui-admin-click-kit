<script setup lang="ts">
/**
 * One row of a UiList: a title with a line under it, something before it
 * and the action after it. `selectable` makes the title a button that
 * emits `select`, `selected` marks the picked row (the area an editor
 * shows); the trailing actions stay buttons of
 * their own.
 */
const props = withDefaults(defineProps<{ title?: string | null; description?: string | null; mono?: boolean; selectable?: boolean; selected?: boolean }>(), {
    title: null,
    description: null,
    mono: false,
    selectable: false,
    selected: false,
});

const emit = defineEmits<{ select: [] }>();
</script>

<template>
    <li
        class="flex items-center gap-x-3 gap-y-1"
        :class="props.selectable ? ['rounded-control px-2', props.selected ? 'bg-brand-50' : 'hover:bg-canvas'] : 'flex-wrap px-0 [ul.border_&]:px-4'"
        :data-selected="props.selectable ? String(props.selected) : undefined"
        data-test="list-item"
    >
        <span v-if="$slots.leading" class="flex shrink-0 items-center text-ink-muted [&>svg]:h-4 [&>svg]:w-4"><slot name="leading" /></span>
        <component
            :is="props.selectable ? 'button' : 'span'"
            :type="props.selectable ? 'button' : undefined"
            :aria-pressed="props.selectable ? props.selected : undefined"
            class="min-w-0 grow"
            :class="props.selectable ? 'cursor-pointer rounded-control text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600' : ''"
            @click="props.selectable && emit('select')"
        >
            <slot>
                <span class="block font-medium text-ink" :class="[props.mono ? 'font-mono text-xs' : '', props.selectable ? 'truncate' : '']">{{ props.title }}</span>
            </slot>
            <span v-if="props.description" class="block text-xs text-ink-muted">{{ props.description }}</span>
        </component>
        <span v-if="$slots.trailing" class="flex shrink-0 flex-wrap items-center gap-2"><slot name="trailing" /></span>
    </li>
</template>
