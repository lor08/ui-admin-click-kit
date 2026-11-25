<script setup lang="ts">
import { kitVisit } from './kit';
import { DropdownMenuItem } from 'reka-ui';

/** One line of a UiDropdown: a link when given `href` (with `newTab`, to a new tab outside the app's router), an action otherwise (`select`). */
const props = withDefaults(defineProps<{ href?: string; newTab?: boolean; tone?: 'default' | 'danger'; disabled?: boolean }>(), {
    href: undefined,
    newTab: false,
    tone: 'default',
    disabled: false,
});

const emit = defineEmits<{ select: [] }>();

function onSelect(): void {
    if (props.href && props.newTab) {
        window.open(props.href, '_blank', 'noopener');
    } else if (props.href) {
        kitVisit(props.href);
    } else {
        emit('select');
    }
}
</script>

<template>
    <DropdownMenuItem
        :disabled="props.disabled"
        class="flex cursor-pointer select-none items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0"
        :class="props.tone === 'danger' ? 'text-danger data-[highlighted]:bg-danger-surface' : 'text-ink data-[highlighted]:bg-canvas [&>svg]:text-ink-muted'"
        role="menuitem"
        @select="onSelect"
    >
        <slot name="icon" />
        <slot />
    </DropdownMenuItem>
</template>
