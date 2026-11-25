import type { Tone } from '../../ui/styles';

/** Fixture rows of the demos: data, not screen words, so they stay in code. Every name, address and number is made up. */
export interface SampleRow {
    id: number;
    owner: string;
    plan: string;
    status: string;
    price: number;
    since: string;
}

export const sampleRows: SampleRow[] = [
    { id: 1, owner: 'Jane Doe', plan: 'Standard', status: 'active', price: 99, since: '2026-05-12' },
    { id: 2, owner: 'John Roe', plan: 'Premium', status: 'past_due', price: 149, since: '2026-03-02' },
    { id: 3, owner: 'Alex Poe', plan: 'Standard', status: 'sent', price: 99, since: '2026-11-01' },
    { id: 4, owner: 'Sam Lee', plan: 'Standard', status: 'canceled', price: 99, since: '2025-12-20' },
    { id: 5, owner: 'Kim Moe', plan: 'Premium', status: 'draft', price: 149, since: '2026-11-08' },
];

export const statusTones: Record<string, Tone> = { draft: 'neutral', sent: 'info', active: 'success', past_due: 'warning', canceled: 'danger' };

/** A month of tasks by day for the chart demo: a weekly rhythm, no randomness, so the demo reads the same on every load. */
export const sampleTaskDays = Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const weekend = day % 7 === 0 || day % 7 === 6;

    return {
        key: `2026-11-${String(day).padStart(2, '0')}`,
        label: String(day),
        hint: `2026-11-${String(day).padStart(2, '0')}`,
        values: { done: weekend ? 6 + (day % 3) : 24 + ((day * 7) % 11), overdue: weekend ? 2 : 3 + (day % 4), overdue_urgent: day % 5 === 0 ? 2 : 1 },
    };
});

/** Tasks by team for the chart demo; team names are data. */
export const sampleTaskTeams = [
    { key: 'north', label: 'Team North', values: { done: 412, overdue: 38, overdue_urgent: 12 } },
    { key: 'south', label: 'Team South', values: { done: 236, overdue: 21, overdue_urgent: 9 } },
    { key: 'east', label: 'Team East', values: { done: 88, overdue: 14, overdue_urgent: 3 } },
    { key: 'west', label: 'Team West', values: { done: 41, overdue: 2, overdue_urgent: 1 } },
];

/** An event as a webhook delivers it, for the code block demo: data, not words. */
export const samplePayload = {
    EventId: 'ev_5f2c1e7d9b8a4c3e2f1a0b9c8d7e6f5a',
    AccountId: 'acct_000000000000',
    Type: 'build.finished',
    Status: 'failed',
    Branch: 'main',
    Retried: null,
    Author: 'JANE DOE',
    Timestamp: '2026-11-10T14:02:11Z',
    Stage: 'upload',
    ExitCode: 124,
    Url: 'https://example.com/webhooks/builds?run=7f3c2a10-4b8e-4d1f-9a6c-2e5b7d9f0c13&job=1&attempt=2',
};

/** Owners and tags for the multi-select demo: names are data. */
export const sampleOwners = ['Jane Doe', 'John Roe', 'Alex Poe', 'Sam Lee'].map((name, index) => ({ value: `owner-${index + 1}`, label: name }));

export const sampleTags = Array.from({ length: 24 }, (_, index) => ({ value: `tag-${index + 1}`, label: `tag-${String(index + 1).padStart(2, '0')}`, disabled: index === 5 }));

/** A short silent WAV made in the browser, so the audio demo plays without a file or a network request. */
export function silentWav(seconds = 1): string {
    const rate = 8000;
    const samples = Math.round(rate * seconds);
    const bytes = new Uint8Array(44 + samples);
    const view = new DataView(bytes.buffer);
    const text = (at: number, value: string): void => [...value].forEach((char, index) => view.setUint8(at + index, char.charCodeAt(0)));
    text(0, 'RIFF');
    view.setUint32(4, 36 + samples, true);
    text(8, 'WAVEfmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, rate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true);
    text(36, 'data');
    view.setUint32(40, samples, true);
    bytes.fill(128, 44);

    return URL.createObjectURL(new Blob([bytes], { type: 'audio/wav' }));
}
