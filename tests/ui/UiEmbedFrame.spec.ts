import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UiEmbedFrame from '../../src/ui/UiEmbedFrame.vue';

function scripts(src: string): HTMLScriptElement[] {
    return Array.from(document.head.querySelectorAll<HTMLScriptElement>('script')).filter((script) => script.src === src);
}

/** What the service's embed.js would set: mount() puts a frame in and hands back its unmount. */
function fakeEmbed() {
    const unmount = vi.fn();
    const mountFrame = vi.fn((element: HTMLElement, options: { url: string; title?: string }) => {
        const frame = document.createElement('iframe');
        frame.src = options.url;
        element.appendChild(frame);

        return { unmount };
    });
    window.TelephonyEmbed = { mount: mountFrame, unmount: vi.fn() };

    return { mountFrame, unmount };
}

afterEach(() => {
    delete window.TelephonyEmbed;
    document.head.querySelectorAll('script').forEach((script) => script.remove());
});

describe('UiEmbedFrame', () => {
    it('loads the script of the url\'s origin once for two frames and mounts each with the url it was given', async () => {
        const first = mount(UiEmbedFrame, { props: { url: 'https://one.example.com/embed/recording?lang=en#ticket-a', title: 'Sample page' } });
        const second = mount(UiEmbedFrame, { props: { url: 'https://one.example.com/embed/recording?lang=en#ticket-b', title: 'Sample page' } });

        expect(first.get('[data-test="embed-loading"]').text()).toBe('Loading the page…');
        expect(scripts('https://one.example.com/embed.js')).toHaveLength(1);

        const { mountFrame } = fakeEmbed();
        scripts('https://one.example.com/embed.js')[0]!.dispatchEvent(new Event('load'));
        await flushPromises();

        expect(mountFrame).toHaveBeenCalledTimes(2);
        expect(mountFrame.mock.calls.map(([, options]) => options)).toEqual([
            { url: 'https://one.example.com/embed/recording?lang=en#ticket-a', title: 'Sample page' },
            { url: 'https://one.example.com/embed/recording?lang=en#ticket-b', title: 'Sample page' },
        ]);
        expect(first.get('[data-test="embed-host"] iframe').attributes('src')).toBe('https://one.example.com/embed/recording?lang=en#ticket-a');
        expect(first.find('[data-test="embed-loading"]').exists()).toBe(false);
        expect(scripts('https://one.example.com/embed.js')).toHaveLength(1);
        second.unmount();
    });

    it('takes its frame away when it goes', async () => {
        const wrapper = mount(UiEmbedFrame, { props: { url: 'https://two.example.com/embed/recording#ticket', title: 'Sample page' } });
        const { unmount } = fakeEmbed();
        scripts('https://two.example.com/embed.js')[0]!.dispatchEvent(new Event('load'));
        await flushPromises();

        expect(unmount).not.toHaveBeenCalled();
        wrapper.unmount();
        expect(unmount).toHaveBeenCalledTimes(1);
    });

    it('says the page did not load when the script fails, and tries again for the next frame', async () => {
        const wrapper = mount(UiEmbedFrame, { props: { url: 'https://three.example.com/embed/recording#ticket', title: 'Sample page' } });
        scripts('https://three.example.com/embed.js')[0]!.dispatchEvent(new Event('error'));
        await flushPromises();

        expect(wrapper.get('[data-test="embed-failed"]').text()).toBe('The page did not load. Try again.');
        expect(wrapper.find('iframe').exists()).toBe(false);
        expect(scripts('https://three.example.com/embed.js')).toHaveLength(0);

        mount(UiEmbedFrame, { props: { url: 'https://three.example.com/embed/recording#another', title: 'Sample page' } });
        expect(scripts('https://three.example.com/embed.js')).toHaveLength(1);
    });

    it('loads nothing for an address that is not http(s)', async () => {
        const wrapper = mount(UiEmbedFrame, { props: { url: 'javascript:alert(1)', title: 'Sample page' } });
        await flushPromises();

        expect(wrapper.get('[data-test="embed-failed"]').text()).toBe('The page did not load. Try again.');
        expect(document.head.querySelectorAll('script')).toHaveLength(0);
    });
});
