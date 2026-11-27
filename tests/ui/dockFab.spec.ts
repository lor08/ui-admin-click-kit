import { describe, expect, it } from 'vitest';
import { anchorToPoint, nudgeFabAnchor, parseFabAnchor, pointToAnchor, serializeFabAnchor } from '../../src/ui/dockFab';

const VIEWPORT = { width: 1024, height: 768 };

describe('the geometry of the collapsed softphone’s button', () => {
    it('reads only a well-formed anchor and keeps it 16 pixels from the edges', () => {
        expect(parseFabAnchor('{"kind":"edge","edge":"bottom","offset":4,"side":"left","inset":2}')).toEqual({ kind: 'edge', edge: 'bottom', offset: 16, side: 'left', inset: 16 });
        expect(parseFabAnchor('{"kind":"header"}')).toEqual({ kind: 'header' });
        expect(parseFabAnchor('{"kind":"edge","edge":"left","offset":40}')).toBeNull();
        expect(parseFabAnchor('{"kind":"edge","edge":"top"}')).toBeNull();
        expect(parseFabAnchor('{"kind":"edge","edge":"top","offset":40,"side":"middle","inset":40}')).toBeNull();
        expect(parseFabAnchor('{"kind":"edge","edge":"top","offset":40,"side":"left","inset":"40"}')).toBeNull();
        expect(parseFabAnchor('not json')).toBeNull();
        expect(parseFabAnchor(null)).toBeNull();
        expect(parseFabAnchor(serializeFabAnchor({ kind: 'edge', edge: 'top', offset: 40, side: 'left', inset: 300 }))).toEqual({ kind: 'edge', edge: 'top', offset: 40, side: 'left', inset: 300 });
    });

    it('reads an anchor stored before the free drop at the right edge, where it stood', () => {
        expect(parseFabAnchor('{"kind":"edge","edge":"top","offset":120}')).toEqual({ kind: 'edge', edge: 'top', offset: 120, side: 'right', inset: 16 });
        expect(anchorToPoint({ kind: 'edge', edge: 'top', offset: 120, side: 'right', inset: 16 }, VIEWPORT)).toEqual({ x: 956, y: 120 });
    });

    it('stands an anchor at its corner of the viewport and never outside it', () => {
        expect(anchorToPoint({ kind: 'edge', edge: 'top', offset: 40, side: 'right', inset: 16 }, VIEWPORT)).toEqual({ x: 956, y: 40 });
        expect(anchorToPoint({ kind: 'edge', edge: 'bottom', offset: 40, side: 'left', inset: 300 }, VIEWPORT)).toEqual({ x: 300, y: 676 });
        expect(anchorToPoint({ kind: 'edge', edge: 'top', offset: 5000, side: 'left', inset: 5000 }, VIEWPORT)).toEqual({ x: 956, y: 700 });
        expect(anchorToPoint({ kind: 'edge', edge: 'bottom', offset: 40, side: 'right', inset: 300 }, { width: 320, height: 200 })).toEqual({ x: 16, y: 108 });
    });

    it('keeps a dropped button where it was dropped, inside the viewport, and moves it by the arrows', () => {
        expect(pointToAnchor({ x: 300, y: 100 }, VIEWPORT)).toEqual({ kind: 'edge', edge: 'top', offset: 100, side: 'left', inset: 300 });
        expect(pointToAnchor({ x: 700, y: 600 }, VIEWPORT)).toEqual({ kind: 'edge', edge: 'bottom', offset: 116, side: 'right', inset: 272 });
        expect(pointToAnchor({ x: -50, y: 2000 }, VIEWPORT)).toEqual({ kind: 'edge', edge: 'bottom', offset: 16, side: 'left', inset: 16 });
        expect(anchorToPoint(pointToAnchor({ x: 700, y: 600 }, VIEWPORT), VIEWPORT)).toEqual({ x: 700, y: 600 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 100, side: 'left', inset: 300 }, 'ArrowUp', VIEWPORT, false)).toEqual({ kind: 'edge', edge: 'top', offset: 90, side: 'left', inset: 300 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 100, side: 'left', inset: 300 }, 'ArrowRight', VIEWPORT, false)).toEqual({ kind: 'edge', edge: 'top', offset: 100, side: 'left', inset: 310 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 100, side: 'left', inset: 16 }, 'ArrowLeft', VIEWPORT, false)).toEqual({ kind: 'edge', edge: 'top', offset: 100, side: 'left', inset: 16 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 16, side: 'right', inset: 16 }, 'ArrowUp', VIEWPORT, false)).toEqual({ kind: 'edge', edge: 'top', offset: 16, side: 'right', inset: 16 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 16, side: 'right', inset: 16 }, 'ArrowUp', VIEWPORT, true)).toEqual({ kind: 'header' });
        expect(nudgeFabAnchor({ kind: 'header' }, 'ArrowDown', VIEWPORT, true)).toEqual({ kind: 'edge', edge: 'top', offset: 16, side: 'right', inset: 16 });
    });
});
