/** The coloured point of the softphone's status (Click's `.dot`): `ok` takes calls, `dnd` does not, `wait` is on its way, `err` failed, `off` is offline. */
export type DockDot = 'ok' | 'dnd' | 'wait' | 'err' | 'off';

export const DOCK_DOTS: Record<DockDot, string> = {
    ok: 'bg-dock-ok shadow-[0_0_6px_rgb(52_211_153/0.53)]',
    dnd: 'bg-dock-wait',
    wait: 'bg-dock-wait',
    err: 'bg-dock-err',
    off: 'bg-dock-off',
};
