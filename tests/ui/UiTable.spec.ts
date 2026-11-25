import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import UiTable from '../../src/ui/UiTable.vue';

const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'calls', label: 'Calls', sortable: true, align: 'right' as const },
];

const rows = [
    { id: 1, name: 'Bob', email: 'bob@x.y', calls: 10 },
    { id: 2, name: 'Alex', email: 'alex@x.y', calls: 2 },
];

describe('UiTable', () => {
    it('renders the headers, the rows and a slot per cell', () => {
        const wrapper = mount(UiTable, {
            props: { columns, rows: [rows[0]!], rowKey: 'id', empty: 'Nothing' },
            slots: { 'cell-name': '<template #cell-name="{ row }"><b>{{ row.name }}</b></template>' },
        });

        expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Name', 'Email', 'Calls']);
        expect(wrapper.get('tbody b').text()).toBe('Bob');
        expect(wrapper.findAll('tbody td')[1]?.text()).toBe('bob@x.y');
        expect(wrapper.findAll('th')[2]?.classes()).toContain('text-right');
    });

    it('dims the rows the parent marks as muted', () => {
        const wrapper = mount(UiTable, { props: { columns, rows, rowKey: 'id', mutedRow: (row: object) => (row as { name: string }).name === 'Alex' } });
        const trs = wrapper.findAll('tbody tr');

        expect(trs[0]?.attributes('data-muted')).toBeUndefined();
        expect(trs[1]?.attributes('data-muted')).toBe('true');
        expect(trs[1]?.classes()).toContain('bg-surface-muted');
    });

    it('tints the rows the parent gives a tone, and a muted row keeps the tint with dimmed text', () => {
        const calls = [
            { id: 1, name: 'Live', state: 'active', muted: false },
            { id: 2, name: 'Missed first', state: 'missed_first', muted: false },
            { id: 3, name: 'Missed', state: 'missed', muted: true },
            { id: 4, name: 'Done', state: 'completed', muted: true },
        ];
        const tones: Record<string, 'success' | 'danger' | 'warning'> = { active: 'success', missed_first: 'danger', missed: 'warning' };
        const wrapper = mount(UiTable, {
            props: {
                columns: [{ key: 'name', label: 'Name' }],
                rows: calls,
                rowKey: 'id',
                rowTone: (row: object) => tones[(row as { state: string }).state] ?? null,
                mutedRow: (row: object) => (row as { muted: boolean }).muted,
            },
        });
        const trs = wrapper.findAll('tbody tr');

        expect(trs.map((tr) => tr.attributes('data-tone'))).toEqual(['success', 'danger', 'warning', undefined]);
        expect(trs[0]?.classes()).toContain('bg-success-surface');
        expect(trs[1]?.classes()).toContain('bg-danger-surface');
        expect(trs[2]?.classes()).toEqual(expect.arrayContaining(['bg-warning-surface', 'text-ink-muted']));
        expect(trs[2]?.classes()).not.toContain('bg-surface-muted');
        expect(trs[3]?.classes()).toContain('bg-surface-muted');
        expect(trs[0]?.classes()).not.toContain('text-ink-muted');
    });

    it('makes a row that waits for someone blink, above its tone, and only while motion is welcome', () => {
        const rows = [
            { id: 1, name: 'Missed, nobody took it', pulse: true },
            { id: 2, name: 'Closed', pulse: false },
        ];
        const wrapper = mount(UiTable, {
            props: { columns: [{ key: 'name', label: 'Name' }], rows, rowKey: 'id', rowTone: () => 'warning' as const, pulseRow: (row: object) => (row as { pulse: boolean }).pulse },
        });
        const trs = wrapper.findAll('tbody tr');

        expect(trs.map((tr) => tr.attributes('data-pulse'))).toEqual(['true', undefined]);
        expect(trs[0]?.classes()).toEqual(expect.arrayContaining(['bg-danger-surface', 'motion-safe:animate-row-pulse']));
        expect(trs[0]?.classes()).not.toContain('bg-warning-surface');
        expect(trs[1]?.classes()).toContain('bg-warning-surface');
        expect(trs[1]?.classes()).not.toContain('motion-safe:animate-row-pulse');
    });

    it('pins the first column of a wide table so each row keeps its name', () => {
        const wrapper = mount(UiTable, { props: { columns: [{ key: 'metric', label: 'Metric' }, { key: 'd1', label: '1' }], rows: [{ id: 1, metric: 'Errors', d1: 2 }], rowKey: 'id', stickyFirst: true } });
        const plain = mount(UiTable, { props: { columns: [{ key: 'metric', label: 'Metric' }], rows: [{ id: 1, metric: 'Errors' }], rowKey: 'id' } });

        expect(wrapper.get('thead th').classes()).toEqual(expect.arrayContaining(['sticky', 'left-0', 'bg-canvas']));
        expect(wrapper.findAll('tbody td')[0]?.classes()).toEqual(expect.arrayContaining(['sticky', 'left-0', 'bg-surface']));
        expect(wrapper.findAll('tbody td')[1]?.classes()).not.toContain('sticky');
        expect(plain.get('tbody td').classes()).not.toContain('sticky');
    });

    it('pins a narrow column of row actions to the right edge and can keep its header for screen readers only', () => {
        const wrapper = mount(UiTable, {
            props: { columns: [{ key: 'name', label: 'Name' }, { key: 'actions', label: 'Actions', pinEnd: true, hideLabel: true }], rows: [{ id: 1, name: 'Alex', actions: '' }], rowKey: 'id' },
            slots: { 'cell-actions': '<button>Edit</button>' },
        });
        const [nameHead, actionsHead] = wrapper.findAll('thead th');
        const [nameCell, actionsCell] = wrapper.findAll('tbody td');

        expect(actionsHead?.classes()).toEqual(expect.arrayContaining(['sticky', 'right-0', 'w-px', 'bg-canvas']));
        expect(actionsHead?.get('.sr-only').text()).toBe('Actions');
        expect(actionsCell?.classes()).toEqual(expect.arrayContaining(['sticky', 'right-0', 'bg-inherit']));
        expect(wrapper.get('tbody tr').classes()).toContain('bg-surface');
        expect(nameHead?.classes()).not.toContain('sticky');
        expect(nameHead?.find('.sr-only').exists()).toBe(false);
        expect(nameCell?.classes()).not.toContain('sticky');
    });

    it('says when there is nothing to show, in the page words or the kit default', () => {
        const wrapper = mount(UiTable, { props: { columns, rows: [], rowKey: 'id', empty: 'No users yet.' } });

        expect(wrapper.get('[data-test="empty"]').text()).toBe('No users yet.');
        expect(wrapper.get('[data-test="empty"]').attributes('colspan')).toBe('3');
        expect(mount(UiTable, { props: { columns, rows: [], rowKey: 'id' } }).get('[data-test="empty"]').text()).toBe('Nothing here yet.');
    });

    it('sorts what it was given when nobody binds the sort', async () => {
        const wrapper = mount(UiTable, { props: { columns, rows, rowKey: 'id' } });
        const names = () => wrapper.findAll('tbody tr').map((tr) => tr.findAll('td')[0]?.text());

        expect(names()).toEqual(['Bob', 'Alex']);
        expect(wrapper.findAll('th')[0]?.attributes('aria-sort')).toBe('none');
        expect(wrapper.findAll('th')[1]?.attributes('aria-sort')).toBeUndefined();

        await wrapper.findAll('[data-test="sort"]')[0]?.trigger('click');
        expect(names()).toEqual(['Alex', 'Bob']);
        expect(wrapper.findAll('th')[0]?.attributes('aria-sort')).toBe('ascending');

        await wrapper.findAll('[data-test="sort"]')[0]?.trigger('click');
        expect(names()).toEqual(['Bob', 'Alex']);
        expect(wrapper.findAll('th')[0]?.attributes('aria-sort')).toBe('descending');

        await wrapper.findAll('[data-test="sort"]')[1]?.trigger('click');
        expect(names()).toEqual(['Alex', 'Bob']);
    });

    it('leaves the order to the parent when the sort is bound and only reports the wish', async () => {
        const wrapper = mount(UiTable, { props: { columns, rows, rowKey: 'id', sort: { key: 'calls', direction: 'asc' } } });

        expect(wrapper.findAll('tbody tr').map((tr) => tr.findAll('td')[0]?.text())).toEqual(['Bob', 'Alex']);
        expect(wrapper.findAll('th')[2]?.attributes('aria-sort')).toBe('ascending');

        await wrapper.findAll('[data-test="sort"]')[1]?.trigger('click');

        expect(wrapper.emitted('update:sort')).toEqual([[{ key: 'calls', direction: 'desc' }]]);
        expect(wrapper.findAll('tbody tr').map((tr) => tr.findAll('td')[0]?.text())).toEqual(['Bob', 'Alex']);
    });

    it('shows skeleton rows while loading and emits the row a reader clicks', async () => {
        const loading = mount(UiTable, { props: { columns, rows, rowKey: 'id', loading: true } });
        expect(loading.findAll('[data-test="loading"]')).toHaveLength(3);
        expect(loading.text()).not.toContain('Bob');

        const clickable = mount(UiTable, { props: { columns, rows, rowKey: 'id', clickable: true } });
        await clickable.findAll('tbody tr')[1]?.trigger('click');
        await clickable.findAll('tbody tr')[0]?.trigger('keydown.enter');

        expect(clickable.emitted('row-click')).toEqual([[rows[1]], [rows[0]]]);
        expect(clickable.findAll('tbody tr')[0]?.attributes('tabindex')).toBe('0');
    });

    it('moves a row by its handle: a drag that starts on the handle, or the arrow keys with the focus kept on the row moved', async () => {
        const three = [...rows, { id: 3, name: 'Cleo', email: 'cleo@x.y', calls: 5 }];
        const wrapper = mount(UiTable, {
            props: {
                columns: [{ key: 'name', label: 'Name' }],
                rows: three,
                rowKey: 'id',
                reorderable: true,
                rowLabel: (row: object) => (row as { name: string }).name,
                onReorder: (from: number, to: number) => {
                    const next = [...(wrapper.props('rows') as typeof three)];
                    const [moved] = next.splice(from, 1);
                    next.splice(to, 0, moved!);
                    void wrapper.setProps({ rows: next });
                },
            },
            attachTo: document.body,
        });
        const names = (): string[] => wrapper.findAll('tbody tr').map((tr) => tr.findAll('td')[1]?.text() ?? '');
        const handles = () => wrapper.findAll('[data-test="reorder-handle"]');

        expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Order', 'Name']);
        expect(handles().map((handle) => handle.attributes('aria-label'))).toEqual([
            'Move Bob: drag, or press the up and down arrows',
            'Move Alex: drag, or press the up and down arrows',
            'Move Cleo: drag, or press the up and down arrows',
        ]);
        const trs = wrapper.findAll('tbody tr');
        expect(trs.map((tr) => tr.attributes('draggable'))).toEqual([undefined, undefined, undefined]);

        // A drag that does not start on the handle is refused.
        await trs[0]?.trigger('dragstart');
        await trs[2]?.trigger('dragover');
        await trs[2]?.trigger('drop');
        expect(wrapper.emitted('reorder')).toBeUndefined();

        await handles()[0]?.trigger('pointerdown');
        expect(wrapper.findAll('tbody tr')[0]?.attributes('draggable')).toBe('true');
        await wrapper.findAll('tbody tr')[0]?.trigger('dragstart');
        await wrapper.findAll('tbody tr')[2]?.trigger('dragover');
        expect(wrapper.findAll('tbody tr').map((tr) => [tr.attributes('data-dragged'), tr.attributes('data-drop')])).toEqual([
            ['true', undefined],
            [undefined, undefined],
            [undefined, 'true'],
        ]);
        await wrapper.findAll('tbody tr')[2]?.trigger('drop');
        expect(wrapper.emitted('reorder')).toEqual([[0, 2]]);
        expect(names()).toEqual(['Alex', 'Cleo', 'Bob']);
        expect(wrapper.findAll('tbody tr').map((tr) => tr.attributes('draggable') ?? tr.attributes('data-dragged') ?? '-')).toEqual(['-', '-', '-']);

        await handles()[2]?.trigger('keydown', { key: 'ArrowUp' });
        await flushPromises();
        expect(names()).toEqual(['Alex', 'Bob', 'Cleo']);
        expect(document.activeElement?.getAttribute('aria-label')).toBe('Move Bob: drag, or press the up and down arrows');
        // The first row goes no higher, the last no lower.
        await handles()[0]?.trigger('keydown', { key: 'ArrowUp' });
        await handles()[2]?.trigger('keydown', { key: 'ArrowDown' });
        expect(wrapper.emitted('reorder')).toEqual([[0, 2], [2, 1]]);
        wrapper.unmount();
    });
});
