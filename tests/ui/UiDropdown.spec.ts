import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UiDropdown from '../../src/ui/UiDropdown.vue';
import UiDropdownItem from '../../src/ui/UiDropdownItem.vue';
import UiDropdownSeparator from '../../src/ui/UiDropdownSeparator.vue';
import { configureUiKit } from '../../src/ui/kit';

const visit = vi.fn();

beforeEach(() => {
    visit.mockClear();
    configureUiKit({ visit });
});

describe('UiDropdown', () => {
    it('opens from the keyboard, lists links and actions, and visits or emits on pick', async () => {
        const picked = vi.fn();
        const wrapper = mount(
            {
                components: { UiDropdown, UiDropdownItem, UiDropdownSeparator },
                methods: { picked },
                template: `
                    <UiDropdown>
                        <template #trigger><button>Ann</button></template>
                        <UiDropdownItem href="/profile">Profile</UiDropdownItem>
                        <UiDropdownSeparator />
                        <UiDropdownItem tone="danger" @select="picked">Sign out</UiDropdownItem>
                    </UiDropdown>`,
            },
            { attachTo: document.body },
        );

        const trigger = wrapper.get('button');
        expect(trigger.attributes('aria-haspopup')).toBe('menu');
        expect(document.querySelector('[role="menu"]')).toBeNull();

        await trigger.trigger('keydown', { key: 'Enter' });
        await new Promise((resolve) => setTimeout(resolve, 0));

        const items = [...document.querySelectorAll('[role="menuitem"]')];
        expect(items.map((item) => item.textContent?.trim())).toEqual(['Profile', 'Sign out']);
        expect(document.querySelector('[role="separator"]')).not.toBeNull();

        (items[0] as HTMLElement).dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }));
        (items[0] as HTMLElement).click();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(visit).toHaveBeenCalledWith('/profile');

        await trigger.trigger('keydown', { key: 'Enter' });
        await new Promise((resolve) => setTimeout(resolve, 0));
        const danger = document.querySelectorAll('[role="menuitem"]')[1] as HTMLElement;
        expect(danger.className).toContain('text-danger');
        danger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }));
        danger.click();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(picked).toHaveBeenCalledTimes(1);

        wrapper.unmount();
    });

    it('opens a newTab item in a new tab instead of visiting it', async () => {
        const open = vi.spyOn(window, 'open').mockReturnValue(null);
        const wrapper = mount(
            {
                components: { UiDropdown, UiDropdownItem },
                template: `
                    <UiDropdown>
                        <template #trigger><button>Ann</button></template>
                        <UiDropdownItem href="/admin/elsewhere" new-tab>Admin</UiDropdownItem>
                    </UiDropdown>`,
            },
            { attachTo: document.body },
        );
        visit.mockClear();

        await wrapper.get('button').trigger('keydown', { key: 'Enter' });
        await new Promise((resolve) => setTimeout(resolve, 0));
        const item = document.querySelector('[role="menuitem"]') as HTMLElement;
        item.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerType: 'mouse' }));
        item.click();
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(open).toHaveBeenCalledWith('/admin/elsewhere', '_blank', 'noopener');
        expect(visit).not.toHaveBeenCalled();
        wrapper.unmount();
        open.mockRestore();
    });
});
