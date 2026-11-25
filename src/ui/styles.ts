/** The classes every text-like control shares, so inputs, selects and textareas line up. */
export const controlBase = [
    'w-full rounded-control border bg-surface text-ink placeholder:text-ink-subtle transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-0',
    'disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted',
].join(' ');

export type ControlSize = 'sm' | 'md' | 'lg';

export const controlSizes: Record<ControlSize, string> = {
    sm: 'h-8 px-2.5 text-xs',
    md: 'h-9 px-3 text-sm',
    lg: 'h-10 px-3.5 text-sm',
};

export function controlState(invalid: boolean): string {
    return invalid
        ? 'border-danger focus-visible:outline-danger'
        : 'border-line hover:border-line-strong focus-visible:outline-brand-600';
}

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
