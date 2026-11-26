import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UiMediaFile from '../../src/ui/UiMediaFile.vue';

const src = '/files/7';

describe('UiMediaFile', () => {
    it('shows a picture in the page and opens it whole in a new tab', () => {
        const wrapper = mount(UiMediaFile, { props: { src, contentType: 'image/jpeg', label: 'Photo 1' } });

        const link = wrapper.get('[data-test="media-image"]');
        expect(link.attributes('href')).toBe(src);
        expect(link.attributes('target')).toBe('_blank');
        expect(link.attributes('rel')).toBe('noopener');
        expect(link.get('img').attributes('src')).toBe(src);
        expect(link.get('img').attributes('alt')).toBe('Photo 1');
    });

    it('plays a video and a sound in place', () => {
        const video = mount(UiMediaFile, { props: { src, contentType: 'video/mp4', label: 'Clip' } });
        expect(video.get('video').attributes('src')).toBe(src);
        expect(video.get('video').attributes('aria-label')).toBe('Clip');
        expect(video.find('img').exists()).toBe(false);

        const sound = mount(UiMediaFile, { props: { src, contentType: 'Audio/AMR', label: 'Voice note' } });
        expect(sound.get('audio').attributes('src')).toBe(src);
        expect(sound.get('audio').attributes('aria-label')).toBe('Voice note');
    });

    it('downloads anything else, an SVG included, by the kit words', () => {
        for (const contentType of ['image/svg+xml', 'application/pdf', 'text/vcard']) {
            const wrapper = mount(UiMediaFile, { props: { src, contentType, label: 'file 2' } });

            expect(wrapper.find('img').exists()).toBe(false);
            const link = wrapper.get('a');
            expect(link.attributes('href')).toBe(src);
            expect(link.attributes('download')).toBe('');
            expect(link.text()).toBe('Download file 2');
        }
    });
});
