import { computed, type ComputedRef } from 'vue';

/**
 * A field component has two elements that could take the caller's
 * attributes: the wrapper, which `class` and `style` dress, and the
 * control, which everything else (aria-*, data-*, autofocus of a form)
 * belongs to. Vue puts them all on the root; this puts each where it goes.
 */
export function splitAttrs(attrs: Record<string, unknown>): { root: ComputedRef<Record<string, unknown>>; control: ComputedRef<Record<string, unknown>> } {
    return {
        root: computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => name === 'class' || name === 'style'))),
        control: computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'class' && name !== 'style'))),
    };
}
