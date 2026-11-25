import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiChipGroup from '../../src/ui/UiChipGroup.vue';

const options = [
    { value: '1', label: 'Washer' },
    { value: '2', label: 'Dryer' },
    { value: '3', label: 'TV', disabled: true },
];

describe('UiChipGroup', () => {
    it('marks the chosen chip, picks another and greys out a disabled one', async () => {
        const wrapper = mount(UiChipGroup, { props: { modelValue: '1', label: 'Priority', options } });

        expect(wrapper.get('legend').text()).toBe('Priority');
        const chips = wrapper.findAll('button');
        expect(chips.map((chip) => chip.attributes('aria-pressed'))).toEqual(['true', 'false', 'false']);
        expect(chips[2]?.attributes('disabled')).toBeDefined();

        await chips[1]?.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toEqual([['2']]);
    });

    it("clears the choice when the chosen chip is picked again, unless it is mandatory", async () => {
        const wrapper = mount(UiChipGroup, { props: { modelValue: '1', options } });
        await wrapper.findAll('button')[0]?.trigger('click');
        expect(wrapper.emitted('update:modelValue')).toEqual([[null]]);

        const mandatory = mount(UiChipGroup, { props: { modelValue: '1', options, mandatory: true } });
        await mandatory.findAll('button')[0]?.trigger('click');
        expect(mandatory.emitted('update:modelValue')).toBeUndefined();
    });

    it('shows one error for the whole row instead of the hint', () => {
        const wrapper = mount(UiChipGroup, { props: { modelValue: null, options, hint: 'Pick one.', error: 'The type is gone.' } });

        expect(wrapper.get('fieldset').attributes('aria-invalid')).toBe('true');
        expect(wrapper.text()).toContain('The type is gone.');
        expect(wrapper.text()).not.toContain('Pick one.');
    });
});
