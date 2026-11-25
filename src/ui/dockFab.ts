/**
 * Where the softphone's collapsed button stands, Click's `voiceDockFab.ts`
 * (#4555): at the right edge of the screen, kept not in pixels but as an
 * anchor, the nearer vertical edge and the offset from it, so it stays at
 * its edge when the window changes size; or `header`, docked in the row of
 * the header's icons where a page has the slot for it. `null` is the CSS
 * default (right 88, bottom 16).
 */
export const FAB_SIZE = 52;
export const FAB_EDGE_MARGIN = 16;
export const FAB_DRAG_THRESHOLD_PX = 5;
export const FAB_KEYBOARD_STEP_PX = 10;

export type FabEdge = 'top' | 'bottom';

export type FabEdgeAnchor = { kind: 'edge'; edge: FabEdge; offset: number };
export type FabHeaderAnchor = { kind: 'header' };
export type FabAnchor = FabEdgeAnchor | FabHeaderAnchor;

export type FabPoint = { x: number; y: number };
export type FabViewport = { width: number; height: number };

export const HEADER_ANCHOR: FabHeaderAnchor = { kind: 'header' };

/** Where the header anchor stands on a page without the header's slot: the top right corner. */
export const HEADER_FALLBACK: FabEdgeAnchor = { kind: 'edge', edge: 'top', offset: FAB_EDGE_MARGIN };

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), Math.max(min, max));

const maxOffset = (viewport: FabViewport): number => viewport.height - FAB_SIZE - FAB_EDGE_MARGIN;

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
        if (parsed.kind !== 'edge' || !('edge' in parsed) || (parsed.edge !== 'top' && parsed.edge !== 'bottom') || !('offset' in parsed) || typeof parsed.offset !== 'number' || !Number.isFinite(parsed.offset)) {
            return null;
        }

        return { kind: 'edge', edge: parsed.edge, offset: Math.max(FAB_EDGE_MARGIN, parsed.offset) };
    } catch {
        return null;
    }
}

export const serializeFabAnchor = (anchor: FabAnchor): string => JSON.stringify(anchor);

export const clampPoint = (point: FabPoint, viewport: FabViewport): FabPoint => ({
    x: clamp(point.x, FAB_EDGE_MARGIN, viewport.width - FAB_SIZE - FAB_EDGE_MARGIN),
    y: clamp(point.y, FAB_EDGE_MARGIN, maxOffset(viewport)),
});

/** The top left corner of the button for an anchor at an edge, in this viewport. */
export function anchorToPoint(anchor: FabEdgeAnchor, viewport: FabViewport): FabPoint {
    const offset = clamp(anchor.offset, FAB_EDGE_MARGIN, maxOffset(viewport));

    return {
        x: viewport.width - FAB_SIZE - FAB_EDGE_MARGIN,
        y: anchor.edge === 'top' ? offset : viewport.height - FAB_SIZE - offset,
    };
}

/** Where a button dropped anywhere snaps to: the right edge, anchored to the nearer vertical edge. */
export function pointToAnchor(point: FabPoint, viewport: FabViewport): FabEdgeAnchor {
    const { y } = clampPoint(point, viewport);
    const edge: FabEdge = y + FAB_SIZE / 2 < viewport.height / 2 ? 'top' : 'bottom';

    return { kind: 'edge', edge, offset: edge === 'top' ? y : viewport.height - FAB_SIZE - y };
}

export const isDragGesture = (dx: number, dy: number): boolean => Math.hypot(dx, dy) >= FAB_DRAG_THRESHOLD_PX;

/**
 * The arrow keys: 10 pixels along the right edge; Up from the topmost
 * place docks the button in the header (where the page has the slot),
 * Down from the header brings it back to the top right corner.
 */
export function nudgeFabAnchor(anchor: FabAnchor, key: 'ArrowUp' | 'ArrowDown', viewport: FabViewport, headerAvailable: boolean): FabAnchor {
    if (anchor.kind === 'header') {
        return key === 'ArrowDown' ? HEADER_FALLBACK : anchor;
    }
    const { x, y } = anchorToPoint(anchor, viewport);
    const nextY = clamp(y + (key === 'ArrowUp' ? -FAB_KEYBOARD_STEP_PX : FAB_KEYBOARD_STEP_PX), FAB_EDGE_MARGIN, maxOffset(viewport));
    if (nextY === y && key === 'ArrowUp' && headerAvailable) {
        return HEADER_ANCHOR;
    }

    return pointToAnchor({ x, y: nextY }, viewport);
}
