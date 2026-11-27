/**
 * Where the softphone's collapsed button stands, after Click's
 * `voiceDockFab.ts` (#4555): anywhere on the screen, where it was dropped
 * (D-U1), kept not in pixels but as an anchor, the nearer vertical edge and
 * the offset from it with the nearer side and the inset from it, so it
 * keeps its corner when the window changes size and never leaves the
 * screen; or `header`, docked in the row of the header's icons where a
 * page has the slot for it. An anchor stored before the button moved
 * freely has no side: it stands at the right edge, where it stood. `null`
 * is the CSS default (right 88, bottom 16).
 */
export const FAB_SIZE = 52;
export const FAB_EDGE_MARGIN = 16;
export const FAB_DRAG_THRESHOLD_PX = 5;
export const FAB_KEYBOARD_STEP_PX = 10;

export type FabEdge = 'top' | 'bottom';
export type FabSide = 'left' | 'right';

export type FabEdgeAnchor = { kind: 'edge'; edge: FabEdge; offset: number; side: FabSide; inset: number };
export type FabHeaderAnchor = { kind: 'header' };
export type FabAnchor = FabEdgeAnchor | FabHeaderAnchor;

export type FabPoint = { x: number; y: number };
export type FabViewport = { width: number; height: number };
/** Where the button of an embedded page stands in its host's screen, and whether it is being dragged there. */
export type FabPlace = FabPoint & { dragging: boolean };

export const HEADER_ANCHOR: FabHeaderAnchor = { kind: 'header' };

/** Where the header anchor stands on a page without the header's slot: the top right corner. */
export const HEADER_FALLBACK: FabEdgeAnchor = { kind: 'edge', edge: 'top', offset: FAB_EDGE_MARGIN, side: 'right', inset: FAB_EDGE_MARGIN };

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));

const maxOffset = (viewport: FabViewport): number => viewport.height - FAB_SIZE - FAB_EDGE_MARGIN;

const maxInset = (viewport: FabViewport): number => viewport.width - FAB_SIZE - FAB_EDGE_MARGIN;

const isDistance = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/** A stored anchor; anything else is null, the CSS default. */
export function parseFabAnchor(raw: string | null): FabAnchor | null {
    if (raw === null) {
        return null;
    }
    try {
        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null || !('kind' in parsed)) {
            return null;
        }
        if (parsed.kind === 'header') {
            return HEADER_ANCHOR;
        }
        if (parsed.kind !== 'edge' || !('edge' in parsed) || (parsed.edge !== 'top' && parsed.edge !== 'bottom') || !('offset' in parsed) || !isDistance(parsed.offset)) {
            return null;
        }
        // An anchor from before the free drop has neither: the right edge.
        const side = 'side' in parsed ? parsed.side : 'right';
        const inset = 'inset' in parsed ? parsed.inset : FAB_EDGE_MARGIN;
        if ((side !== 'left' && side !== 'right') || !isDistance(inset)) {
            return null;
        }

        return { kind: 'edge', edge: parsed.edge, offset: Math.max(FAB_EDGE_MARGIN, parsed.offset), side, inset: Math.max(FAB_EDGE_MARGIN, inset) };
    } catch {
        return null;
    }
}

export const serializeFabAnchor = (anchor: FabAnchor): string => JSON.stringify(anchor);

export const clampPoint = (point: FabPoint, viewport: FabViewport): FabPoint => ({
    x: clamp(point.x, FAB_EDGE_MARGIN, maxInset(viewport)),
    y: clamp(point.y, FAB_EDGE_MARGIN, maxOffset(viewport)),
});

/** The CSS default (right 88, bottom 16) as a point, for a button that has no CSS to stand by: the one in a frame. */
export const defaultFabPoint = (viewport: FabViewport): FabPoint => clampPoint({ x: viewport.width - FAB_SIZE - 88, y: viewport.height - FAB_SIZE - FAB_EDGE_MARGIN }, viewport);

/** The top left corner of the button for an anchor at an edge, in this viewport, which it never leaves. */
export function anchorToPoint(anchor: FabEdgeAnchor, viewport: FabViewport): FabPoint {
    const offset = clamp(anchor.offset, FAB_EDGE_MARGIN, maxOffset(viewport));
    const inset = clamp(anchor.inset, FAB_EDGE_MARGIN, maxInset(viewport));

    return {
        x: anchor.side === 'left' ? inset : viewport.width - FAB_SIZE - inset,
        y: anchor.edge === 'top' ? offset : viewport.height - FAB_SIZE - offset,
    };
}

/** Where a button dropped anywhere stays: that point inside the viewport, anchored to the nearer vertical edge and the nearer side. */
export function pointToAnchor(point: FabPoint, viewport: FabViewport): FabEdgeAnchor {
    const { x, y } = clampPoint(point, viewport);
    const edge: FabEdge = y + FAB_SIZE / 2 < viewport.height / 2 ? 'top' : 'bottom';
    const side: FabSide = x + FAB_SIZE / 2 < viewport.width / 2 ? 'left' : 'right';

    return { kind: 'edge', edge, offset: edge === 'top' ? y : viewport.height - FAB_SIZE - y, side, inset: side === 'left' ? x : viewport.width - FAB_SIZE - x };
}

/** Whether the button stands in the left half of the viewport, where its hint goes to its right. */
export const fabOnLeft = (point: FabPoint, viewport: FabViewport): boolean => point.x + FAB_SIZE / 2 < viewport.width / 2;

export const isDragGesture = (dx: number, dy: number): boolean => Math.hypot(dx, dy) >= FAB_DRAG_THRESHOLD_PX;

export type FabArrow = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

export const isFabArrow = (key: string): key is FabArrow => key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight';

const ARROW_STEPS: Record<FabArrow, FabPoint> = {
    ArrowUp: { x: 0, y: -FAB_KEYBOARD_STEP_PX },
    ArrowDown: { x: 0, y: FAB_KEYBOARD_STEP_PX },
    ArrowLeft: { x: -FAB_KEYBOARD_STEP_PX, y: 0 },
    ArrowRight: { x: FAB_KEYBOARD_STEP_PX, y: 0 },
};

/**
 * The arrow keys: 10 pixels their way, inside the viewport; Up from the
 * topmost place docks the button in the header (where the page has the
 * slot), Down from the header brings it back to the top right corner.
 */
export function nudgeFabAnchor(anchor: FabAnchor, key: FabArrow, viewport: FabViewport, headerAvailable: boolean): FabAnchor {
    if (anchor.kind === 'header') {
        return key === 'ArrowDown' ? HEADER_FALLBACK : anchor;
    }
    const from = anchorToPoint(anchor, viewport);
    const step = ARROW_STEPS[key];
    const next = clampPoint({ x: from.x + step.x, y: from.y + step.y }, viewport);
    if (next.y === from.y && key === 'ArrowUp' && headerAvailable) {
        return HEADER_ANCHOR;
    }

    return pointToAnchor(next, viewport);
}
