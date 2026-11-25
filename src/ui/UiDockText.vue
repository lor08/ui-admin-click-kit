<script setup lang="ts">
/**
 * A word on the dock or in its panel: `caller` is who the call is with,
 * `error` what failed, `timer` the length of the call, `empty` a list with
 * nothing in it yet, `meta` the small grey line beside a row, `fab` the
 * timer on the collapsed softphone's button.
 */
type Kind = 'caller' | 'error' | 'timer' | 'empty' | 'meta' | 'fab';

const props = withDefaults(defineProps<{ kind?: Kind }>(), { kind: 'caller' });

const kinds: Record<Kind, string> = {
    caller: 'min-w-[100px] truncate lg:min-w-[140px]',
    error: 'min-w-[100px] truncate text-dock-miss lg:min-w-[140px]',
    timer: 'font-semibold text-dock-timer tabular-nums',
    empty: 'block px-0.5 py-2.5 text-xs text-slate-400',
    meta: 'text-[11.5px] whitespace-nowrap text-slate-500',
    fab: 'text-[11px] font-bold text-dock-timer tabular-nums',
};
</script>

<template>
    <span :class="kinds[props.kind]"><slot /></span>
</template>
