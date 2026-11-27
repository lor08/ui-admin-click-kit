<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

/**
 * The softphone's frame, Click's VoiceDockBar: a dark bar 44 pixels high
 * along the bottom of the page and, above its right end, the one panel
 * open at a time. `collapsed` hides both and shows the `fab` slot, the
 * floating button instead. The bar publishes the band it takes as
 * `--voice-dock-height` on the root element (0 while collapsed), which
 * the page reserves (a bar not laid out yet counts its 44), the `ticker`
 * slot above the bar included. `inline` keeps both in the flow of an embedded page,
 * whose frame is as high as its content, and publishes nothing: `band`
 * hands the same height to the page, which tells its host, the page the
 * frame stands in, what to keep free.
 */
const props = withDefaults(defineProps<{ inline?: boolean; collapsed?: boolean }>(), { inline: false, collapsed: false });

const emit = defineEmits<{ band: [height: number] }>();

const root = ref<HTMLElement | null>(null);
let observer: ResizeObserver | null = null;

function publishHeight(): void {
    const height = props.collapsed ? 0 : root.value?.offsetHeight || 44;
    if (!props.inline) {
        document.documentElement.style.setProperty('--voice-dock-height', `${height}px`);
    }
    emit('band', height);
}

watch(() => props.collapsed, publishHeight, { flush: 'post' });

onMounted(() => {
    publishHeight();
    if (root.value !== null && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(publishHeight);
        observer.observe(root.value);
    }
});

onBeforeUnmount(() => {
    observer?.disconnect();
    if (!props.inline) {
        document.documentElement.style.removeProperty('--voice-dock-height');
    }
});
</script>

<template>
    <div :class="props.inline ? 'flex flex-col items-end text-[13px]' : 'fixed inset-x-0 bottom-0 z-[9000] text-[13px]'">
        <div v-show="!props.collapsed" :class="props.inline ? 'w-full' : 'absolute right-4 bottom-full'"><slot name="panel" /></div>
        <div v-show="!props.collapsed" ref="root" class="w-full shadow-[0_-2px_10px_rgb(15_23_42/0.25)]">
            <slot name="ticker" />
            <div class="flex h-11 w-full items-center gap-2 bg-dock px-3 text-dock-ink" role="toolbar">
                <slot />
            </div>
        </div>
        <slot v-if="props.collapsed" name="fab" />
    </div>
</template>
