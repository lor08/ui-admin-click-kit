<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui';

/**
 * A menu under a trigger: arrow keys move, Enter picks, Escape closes.
 * The trigger goes in the `trigger` slot (one element), the items
 * (UiDropdownItem, UiDropdownSeparator) in the default slot.
 */
withDefaults(defineProps<{ align?: 'start' | 'end'; side?: 'top' | 'bottom' | 'left' | 'right' }>(), { align: 'end', side: 'bottom' });
</script>

<template>
    <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
            <slot name="trigger" />
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent
                :align="align"
                :side="side"
                :side-offset="6"
                class="z-50 min-w-44 rounded-card border border-line bg-surface p-1 shadow-lg focus:outline-none"
                data-test="menu"
            >
                <slot />
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>
