import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import UiDialpad from '../../src/ui/UiDialpad.vue';
import UiDock from '../../src/ui/UiDock.vue';
import UiDockButton from '../../src/ui/UiDockButton.vue';
import UiDockChip from '../../src/ui/UiDockChip.vue';
import UiDockDialog from '../../src/ui/UiDockDialog.vue';
import UiDockFab from '../../src/ui/UiDockFab.vue';
import UiDockInput from '../../src/ui/UiDockInput.vue';
import UiDockPanel from '../../src/ui/UiDockPanel.vue';
import UiDockPerson from '../../src/ui/UiDockPerson.vue';
import UiDockRow from '../../src/ui/UiDockRow.vue';
import UiDockSelect from '../../src/ui/UiDockSelect.vue';
import UiDockStatus from '../../src/ui/UiDockStatus.vue';
import UiDockTabs from '../../src/ui/UiDockTabs.vue';
import UiDockTicker from '../../src/ui/UiDockTicker.vue';

const dockHeight = (): string => document.documentElement.style.getPropertyValue('--voice-dock-height');

afterEach(() => {
    document.documentElement.style.removeProperty('--voice-dock-height');
    document.body.innerHTML = '';
});

describe('UiDock', () => {
    it('publishes its band while open, none while collapsed, and takes it back when it goes', async () => {
        const wrapper = mount(UiDock, { props: { collapsed: false }, slots: { default: '<span data-test="bar">bar</span>', panel: '<p data-test="panel">panel</p>', fab: '<button data-test="fab">fab</button>' } });

        expect(dockHeight()).toBe('44px');
        expect(wrapper.get('[role="toolbar"]').text()).toBe('bar');
        expect(wrapper.find('[data-test="fab"]').exists()).toBe(false);

        await wrapper.setProps({ collapsed: true });
        await nextTick();
        expect(dockHeight()).toBe('0px');
        expect(wrapper.get('[data-test="fab"]').text()).toBe('fab');
        expect(wrapper.get('[role="toolbar"]').element.parentElement?.style.display).toBe('none');

        wrapper.unmount();
        expect(dockHeight()).toBe('');
    });

    it('stays in the flow of an embedded page and publishes nothing when inline', () => {
        const wrapper = mount(UiDock, { props: { inline: true }, slots: { default: 'bar' } });

        expect(dockHeight()).toBe('');
        expect(wrapper.classes()).not.toContain('fixed');
        wrapper.unmount();
        expect(dockHeight()).toBe('');
    });
});

describe('the dock’s controls', () => {
    it('UiDockButton is a named button, pressed when active, or a link with href', () => {
        const button = mount(UiDockButton, { props: { variant: 'red', label: 'Hang up', active: true }, slots: { default: 'x' } });
        expect(button.element.tagName).toBe('BUTTON');
        expect(button.attributes('type')).toBe('button');
        expect(button.attributes('aria-label')).toBe('Hang up');
        expect(button.attributes('title')).toBe('Hang up');
        expect(button.attributes('aria-pressed')).toBe('true');

        const link = mount(UiDockButton, { props: { variant: 'light', href: 'tel:+14155550170' }, slots: { default: 'From my phone' } });
        expect(link.element.tagName).toBe('A');
        expect(link.attributes('href')).toBe('tel:+14155550170');
        expect(link.text()).toBe('From my phone');
    });

    it('UiDockChip is a button with its point, or a span when it holds buttons', () => {
        const chip = mount(UiDockChip, { props: { dot: 'ok', label: 'Status' }, slots: { default: 'Available' } });
        expect(chip.element.tagName).toBe('BUTTON');
        expect(chip.attributes('title')).toBe('Status');
        expect(chip.find('[aria-hidden="true"]').classes()).toContain('bg-dock-ok');

        expect(mount(UiDockChip, { props: { inert: true, tone: 'line' } }).element.tagName).toBe('SPAN');
    });

    it('UiDockInput dials on Enter and says when it takes the focus', async () => {
        const wrapper = mount(UiDockInput, { props: { modelValue: '', placeholder: 'Number', label: 'Number to call' } });
        const input = wrapper.get('input');

        expect(input.attributes('type')).toBe('tel');
        expect(input.attributes('aria-label')).toBe('Number to call');
        await input.setValue('+14155550170');
        await input.trigger('focus');
        await input.trigger('keydown', { key: 'Enter' });
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['+14155550170']);
        expect(wrapper.emitted('focus')).toHaveLength(1);
        expect(wrapper.emitted('enter')).toHaveLength(1);
    });

    it('UiDialpad presses its twelve keys, with the letters when asked', async () => {
        const wrapper = mount(UiDialpad, { props: { letters: true } });

        expect(wrapper.findAll('button').map((key) => key.text())).toEqual(['1', '2ABC', '3DEF', '4GHI', '5JKL', '6MNO', '7PQRS', '8TUV', '9WXYZ', '*', '0+', '#']);
        await wrapper.get('[data-test="key-5"]').trigger('click');
        await wrapper.get('[data-test="key-#"]').trigger('click');
        expect(wrapper.emitted('press')).toEqual([['5'], ['#']]);
        expect(mount(UiDialpad).get('[data-test="key-2"]').text()).toBe('2');
    });

    it('UiDockSelect offers a disabled placeholder first and reports the choice', async () => {
        const wrapper = mount(UiDockSelect, { props: { modelValue: '', label: 'Microphone', placeholder: 'Choose…', options: [{ value: 'a', label: 'Built-in' }, { value: 'b', label: 'USB Headset' }] } });
        const options = wrapper.findAll('option');

        expect(wrapper.text()).toContain('Microphone');
        expect(options.map((option) => option.text())).toEqual(['Choose…', 'Built-in', 'USB Headset']);
        expect(options[0]?.attributes('disabled')).toBeDefined();
        await wrapper.get('select').setValue('b');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['b']);
    });
});

describe('the dock’s panel', () => {
    it('UiDockPanel names itself by its title and closes by its cross', async () => {
        const wrapper = mount(UiDockPanel, { props: { title: 'History', closeLabel: 'Close' }, slots: { default: '<p>rows</p>', actions: '<button data-test="settings">s</button>' } });

        expect(wrapper.attributes('aria-label')).toBe('History');
        expect(wrapper.find('[data-test="settings"]').exists()).toBe(true);
        await wrapper.get('button[aria-label="Close"]').trigger('click');
        expect(wrapper.emitted('close')).toHaveLength(1);
    });

    it('UiDockTabs marks the active tab, shows a badge above zero and switches', async () => {
        const wrapper = mount(UiDockTabs, { props: { modelValue: 'history', tabs: [{ value: 'history', label: 'History' }, { value: 'queues', label: 'Queues', badge: 2 }, { value: 'colleagues', label: 'Colleagues', badge: 0 }] } });

        expect(wrapper.get('[data-test="tab-history"]').attributes('aria-selected')).toBe('true');
        expect(wrapper.get('[data-test="tab-badge-queues"]').text()).toBe('2');
        expect(wrapper.find('[data-test="tab-badge-colleagues"]').exists()).toBe(false);
        await wrapper.get('[data-test="tab-queues"]').trigger('click');
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['queues']);
    });

    it('UiDockRow and UiDockPerson call by their button, which a colleague who cannot answer greys out', async () => {
        const row = mount(UiDockRow, { props: { icon: 'phone-missed', tone: 'missed', label: '+1 650 555 0122', meta: '10:42', actionLabel: 'Call back' } });
        expect(row.text()).toContain('+1 650 555 0122');
        expect(row.text()).toContain('10:42');
        await row.get('button[aria-label="Call back"]').trigger('click');
        expect(row.emitted('action')).toHaveLength(1);

        const away = mount(UiDockPerson, { props: { online: false, label: 'John Roe', meta: '102', actionLabel: 'Call', disabled: true } });
        expect(away.get('[data-test="presence"]').classes()).toContain('bg-dock-off');
        expect(away.get('[data-test="call-colleague"]').attributes('disabled')).toBeDefined();
    });

    it('UiDockStatus is read out as it changes', () => {
        const wrapper = mount(UiDockStatus, { props: { state: 'failed' }, slots: { default: 'The transfer failed.' } });

        expect(wrapper.attributes('role')).toBe('status');
        expect(wrapper.text()).toBe('The transfer failed.');
        expect(wrapper.classes()).toContain('text-red-700');
    });

    it('UiDockTicker shows who said the line and the live mark only while given', () => {
        const live = mount(UiDockTicker, { props: { who: 'Customer', text: 'Friday, please.', live: 'LIVE' } });
        expect(live.text()).toBe('Customer:Friday, please.LIVE');
        expect(mount(UiDockTicker, { props: { who: 'Agent', text: 'Sure.', live: null } }).text()).toBe('Agent:Sure.');
    });
});

describe('UiDockDialog', () => {
    it('starts on the control marked to autofocus and cancels on Escape and on the shade', async () => {
        const wrapper = mount(UiDockDialog, { props: { title: '+1 415 555 0170', hint: 'How to call?', label: 'Call method' }, slots: { default: '<button data-test="first">a</button><button data-autofocus data-test="here">b</button>' }, attachTo: document.body });

        expect(wrapper.get('[role="dialog"]').attributes('aria-label')).toBe('Call method');
        expect(document.activeElement).toBe(wrapper.get('[data-test="here"]').element);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await wrapper.trigger('click');
        await wrapper.get('[role="dialog"]').trigger('click');
        expect(wrapper.emitted('cancel')).toHaveLength(2);
        wrapper.unmount();
    });
});

describe('UiDockFab', () => {
    const fab = (anchor: { kind: 'edge'; edge: 'top' | 'bottom'; offset: number } | null = null) =>
        mount(UiDockFab, { props: { anchor, tone: 'call', dot: 'ok', label: 'Expand', hint: 'Collapsed here' }, slots: { default: '00:42' }, attachTo: document.body });

    it('expands on a click, stands at its anchor and shows its hint', async () => {
        const wrapper = fab({ kind: 'edge', edge: 'top', offset: 40 });

        expect(wrapper.attributes('aria-label')).toBe('Expand');
        expect(wrapper.attributes('style')).toContain('top: 40px');
        expect(wrapper.classes()).toContain('animate-dock-pulse');
        expect(wrapper.get('[data-test="fab-hint"]').text()).toBe('Collapsed here');
        await wrapper.trigger('click');
        expect(wrapper.emitted('expand')).toHaveLength(1);
        wrapper.unmount();
    });

    it('moves by the arrow keys without expanding', async () => {
        const wrapper = fab({ kind: 'edge', edge: 'top', offset: 100 });

        await wrapper.trigger('keydown', { key: 'ArrowUp' });
        expect(wrapper.emitted('move')?.[0]).toEqual([{ kind: 'edge', edge: 'top', offset: 90 }]);
        expect(wrapper.emitted('expand')).toBeUndefined();
        wrapper.unmount();
    });

    it('drags after five pixels, drops at the nearer edge and swallows the click that follows', async () => {
        const wrapper = fab();
        const at = (type: string, clientX: number, clientY: number): Event => Object.assign(new MouseEvent(type, { bubbles: true, clientX, clientY, button: 0 }), { pointerId: 1, pointerType: 'mouse' });

        wrapper.element.dispatchEvent(at('pointerdown', 0, 0));
        wrapper.element.dispatchEvent(at('pointermove', 2, 2));
        expect(wrapper.emitted('grab')).toBeUndefined();
        wrapper.element.dispatchEvent(at('pointermove', 100, 100));
        await nextTick();
        expect(wrapper.emitted('grab')).toHaveLength(1);
        wrapper.element.dispatchEvent(at('pointerup', 100, 100));
        await wrapper.trigger('click');

        expect(wrapper.emitted('move')?.[0]).toEqual([{ kind: 'edge', edge: 'top', offset: 100 }]);
        expect(wrapper.emitted('expand')).toBeUndefined();
        wrapper.unmount();
    });
});
