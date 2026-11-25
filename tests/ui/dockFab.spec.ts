import { describe, expect, it } from 'vitest';
import { anchorToPoint, nudgeFabAnchor, parseFabAnchor, pointToAnchor, serializeFabAnchor } from '../../src/ui/dockFab';

const VIEWPORT = { width: 1024, height: 768 };

describe('the geometry of the collapsed softphone’s button', () => {
    it('reads only a well-formed anchor and keeps it 16 pixels from the edge', () => {
        expect(parseFabAnchor('{"kind":"edge","edge":"bottom","offset":4}')).toEqual({ kind: 'edge', edge: 'bottom', offset: 16 });
        expect(parseFabAnchor('{"kind":"header"}')).toEqual({ kind: 'header' });
        expect(parseFabAnchor('{"kind":"edge","edge":"left","offset":40}')).toBeNull();
        expect(parseFabAnchor('{"kind":"edge","edge":"top"}')).toBeNull();
        expect(parseFabAnchor('not json')).toBeNull();
        expect(parseFabAnchor(null)).toBeNull();
        expect(parseFabAnchor(serializeFabAnchor({ kind: 'edge', edge: 'top', offset: 40 }))).toEqual({ kind: 'edge', edge: 'top', offset: 40 });
    });

    it('stands an anchor at the right edge of the viewport', () => {
        expect(anchorToPoint({ kind: 'edge', edge: 'top', offset: 40 }, VIEWPORT)).toEqual({ x: 956, y: 40 });
        expect(anchorToPoint({ kind: 'edge', edge: 'bottom', offset: 40 }, VIEWPORT)).toEqual({ x: 956, y: 676 });
        expect(anchorToPoint({ kind: 'edge', edge: 'top', offset: 5000 }, VIEWPORT)).toEqual({ x: 956, y: 700 });
    });

    it('snaps a dropped button to the nearer vertical edge and moves it by the arrows', () => {
        expect(pointToAnchor({ x: 300, y: 100 }, VIEWPORT)).toEqual({ kind: 'edge', edge: 'top', offset: 100 });
        expect(pointToAnchor({ x: 300, y: 600 }, VIEWPORT)).toEqual({ kind: 'edge', edge: 'bottom', offset: 116 });
        expect(pointToAnchor({ x: 300, y: 2000 }, VIEWPORT)).toEqual({ kind: 'edge', edge: 'bottom', offset: 16 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 100 }, 'ArrowUp', VIEWPORT, false)).toEqual({ kind: 'edge', edge: 'top', offset: 90 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 16 }, 'ArrowUp', VIEWPORT, false)).toEqual({ kind: 'edge', edge: 'top', offset: 16 });
        expect(nudgeFabAnchor({ kind: 'edge', edge: 'top', offset: 16 }, 'ArrowUp', VIEWPORT, true)).toEqual({ kind: 'header' });
        expect(nudgeFabAnchor({ kind: 'header' }, 'ArrowDown', VIEWPORT, true)).toEqual({ kind: 'edge', edge: 'top', offset: 16 });
    });
});
