import { mdiPhoneHangup } from '@mdi/js';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiIcon from '../../src/ui/UiIcon.vue';
import { ICONS } from '../../src/ui/icons';

describe('UiIcon', () => {
    it('draws the path of the icon by Click’s name, hidden from a screen reader', () => {
        const wrapper = mount(UiIcon, { props: { name: 'phone-hangup' } });

        expect(wrapper.get('path').attributes('d')).toBe(mdiPhoneHangup);
        expect(wrapper.attributes('viewBox')).toBe('0 0 24 24');
        expect(wrapper.attributes('aria-hidden')).toBe('true');
        expect(wrapper.attributes('role')).toBeUndefined();
    });

    it('is an image with a name when it is labelled', () => {
        const wrapper = mount(UiIcon, { props: { name: 'phone', label: 'Call' } });

        expect(wrapper.attributes('role')).toBe('img');
        expect(wrapper.attributes('aria-label')).toBe('Call');
        expect(wrapper.attributes('aria-hidden')).toBeUndefined();
    });

    it('knows every name the softphone draws', () => {
        expect(Object.keys(ICONS)).toEqual([
            'account-group', 'account-plus', 'account-switch', 'alert-circle', 'check-circle', 'chevron-down', 'chevron-up', 'close', 'cog-outline', 'dialpad', 'headset', 'loading', 'logout',
            'message-text-outline', 'microphone', 'microphone-off', 'minus', 'note-edit-outline', 'pause', 'phone', 'phone-alert', 'phone-forward', 'phone-hangup', 'phone-incoming', 'phone-missed',
            'phone-outgoing', 'play', 'refresh', 'restore', 'swap-horizontal', 'volume-high',
        ]);
    });
});
