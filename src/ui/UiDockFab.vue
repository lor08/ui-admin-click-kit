<script setup lang="ts">
import { DOCK_DOTS, type DockDot } from './dock';
import { anchorToPoint, clampPoint, HEADER_FALLBACK, isDragGesture, nudgeFabAnchor, pointToAnchor, type FabAnchor, type FabPoint, type FabViewport } from './dockFab';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * The collapsed softphone, Click's `.voice-dock-fab` (#4555): a round
 * button 52 pixels wide at the right edge, its content the call's timer or
 * an icon, the status point at its corner. A click expands the bar; it
 * moves by the pointer (5 pixels make a drag, Escape puts it back) and by
 * the arrow keys, and snaps to the right edge, anchored to the nearer
 * vertical edge: `move` hands the anchor. The kit's shell has no slot in
 * a header, so a header anchor stands at the top right corner.
 */
type FabTone = 'ok' | 'dnd' | 'wait' | 'call' | 'wrap' | 'err' | 'off';

const props = withDefaults(defineProps<{ anchor: FabAnchor | null; tone: FabTone; dot: DockDot; label: string; hint?: string | null }>(), { hint: null });

const emit = defineEmits<{ expand: []; move: [anchor: FabAnchor]; grab: [] }>();

interface Drag {
    pointerId: number;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
    moving: boolean;
}

const readViewport = (): FabViewport => ({
    width: document.documentElement.clientWidth || window.innerWidth,
    height: document.documentElement.clientHeight || window.innerHeight,
});

const viewport = ref<FabViewport>(readViewport());
const dragPoint = ref<FabPoint | null>(null);
let drag: Drag | null = null;
// The click comes after pointerup and must not expand the bar after a drag; after a touch it never comes.
let suppressClick = false;

const point = computed((): FabPoint | null => {
    if (dragPoint.value !== null) {
        return dragPoint.value;
    }
    const anchor = props.anchor;
    if (anchor === null) {
        return null;
    }

    return anchorToPoint(anchor.kind === 'header' ? HEADER_FALLBACK : anchor, viewport.value);
});

const position = computed(() => (point.value === null ? undefined : { left: `${point.value.x}px`, top: `${point.value.y}px`, right: 'auto', bottom: 'auto' }));

const backgrounds: Partial<Record<FabTone, string>> = { err: 'bg-dock-fab-err', call: 'bg-dock-fab-call', wrap: 'bg-dock-fab-wrap' };
const shadows: Partial<Record<FabTone, string>> = { ok: 'shadow-[0_4px_16px_rgb(52_211_153/0.35)]', dnd: 'shadow-[0_4px_16px_rgb(251_191_36/0.35)]' };

const classes = computed(() => [
    'fixed z-[9000] flex h-[52px] w-[52px] items-center justify-center rounded-full border-0 p-0 text-[22px] text-dock-ink touch-none select-none',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dock-active',
    point.value === null ? 'right-[88px] bottom-4' : '',
    backgrounds[props.tone] ?? 'bg-dock',
    dragPoint.value === null
        ? `cursor-grab transition-[left,top,transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${shadows[props.tone] ?? 'shadow-[0_4px_16px_rgb(15_23_42/0.35)]'}`
        : 'scale-[1.06] cursor-grabbing shadow-[0_10px_28px_rgb(15_23_42/0.45)]',
    props.tone === 'wait' || props.tone === 'call' ? 'animate-dock-pulse' : '',
    props.tone === 'off' ? 'opacity-85' : '',
]);

function onPointerDown(event: PointerEvent): void {
    if (event.pointerType === 'mouse' && event.button !== 0) {
        return;
    }
    suppressClick = false;
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    const rect = target.getBoundingClientRect();
    drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, baseX: rect.left, baseY: rect.top, moving: false };
    try {
        target.setPointerCapture(event.pointerId);
    } catch {
        // A pointer the browser does not know any more: the drag goes on without the capture.
    }
}

function onPointerMove(event: PointerEvent): void {
    if (drag === null || event.pointerId !== drag.pointerId) {
        return;
    }
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moving) {
        if (!isDragGesture(dx, dy)) {
            return;
        }
        drag.moving = true;
        emit('grab');
    }
    dragPoint.value = clampPoint({ x: drag.baseX + dx, y: drag.baseY + dy }, viewport.value);
}

function suppressNextClick(): void {
    suppressClick = true;
    setTimeout(() => (suppressClick = false), 0);
}

function endDrag(): void {
    dragPoint.value = null;
    drag = null;
}

function finishDrag(event: PointerEvent, cancelled: boolean): void {
    if (drag === null || event.pointerId !== drag.pointerId) {
        return;
    }
    const dropped = dragPoint.value;
    if (drag.moving && dropped !== null && !cancelled) {
        emit('move', pointToAnchor(dropped, viewport.value));
    }
    if (drag.moving) {
        suppressNextClick();
    }
    endDrag();
}

/** The browser took the capture away: no pointerup comes, the button must not hang in the air. */
function onLostCapture(): void {
    if (drag === null) {
        return;
    }
    if (drag.moving) {
        suppressNextClick();
    }
    endDrag();
}

/** Escape during a drag puts the button back; the click that comes with the pointerup later is swallowed. */
function onWindowKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape' || drag === null || !drag.moving) {
        return;
    }
    event.preventDefault();
    suppressClick = true;
    endDrag();
}

function onClick(): void {
    if (suppressClick) {
        suppressClick = false;

        return;
    }
    emit('expand');
}

function onKeydown(event: KeyboardEvent): void {
    const { key } = event;
    if ((key !== 'ArrowUp' && key !== 'ArrowDown') || drag !== null) {
        return;
    }
    event.preventDefault();
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    const rect = target.getBoundingClientRect();
    // From the CSS default the anchor is where the button stands now.
    const current = props.anchor ?? pointToAnchor({ x: rect.left, y: rect.top }, viewport.value);
    emit('move', nudgeFabAnchor(current, key, viewport.value, false));
    void nextTick(() => target.focus({ preventScroll: true }));
}

const onResize = (): void => {
    viewport.value = readViewport();
};

onMounted(() => {
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onWindowKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onWindowKeydown);
});
</script>

<template>
    <button
        type="button"
        :class="classes"
        :style="position"
        :title="props.label"
        :aria-label="props.label"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="(event: PointerEvent) => finishDrag(event, false)"
        @pointercancel="(event: PointerEvent) => finishDrag(event, true)"
        @lostpointercapture="onLostCapture"
        @keydown="onKeydown"
        @click="onClick"
    >
        <slot />
        <span class="absolute top-1 right-1 h-[10px] w-[10px] rounded-full border-2 border-dock" :class="DOCK_DOTS[props.dot]" aria-hidden="true" />
        <span
            v-if="props.hint"
            class="pointer-events-none absolute top-1/2 right-[calc(100%+10px)] -translate-y-1/2 rounded-[6px] bg-dock-hint px-2.5 py-1.5 text-xs leading-[1.2] whitespace-nowrap text-dock-ink shadow-[0_4px_14px_rgb(15_23_42/0.3)]"
            aria-hidden="true"
            data-test="fab-hint"
            >{{ props.hint }}</span
        >
    </button>
</template>
