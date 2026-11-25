import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent } from 'vue';
import { configureUiKit, translate, useTrans } from '../src/ui/kit';

describe('translate', () => {
    it('picks the plural form of the locale and replaces the longest names first', () => {
        const words = { a: { n: ':count file|:count files', ru: ':count файл|:count файла|:count файлов', span: ':to of :total' } };

        expect(translate(words, 'en', 'a.n', { count: 1 }, 1)).toBe('1 file');
        expect(translate(words, 'en', 'a.n', { count: 2 }, 2)).toBe('2 files');
        expect(translate(words, 'ru', 'a.ru', { count: 3 }, 3)).toBe('3 файла');
        expect(translate(words, 'ru', 'a.ru', { count: 5 }, 5)).toBe('5 файлов');
        expect(translate(words, 'en', 'a.span', { to: 10, total: 99 })).toBe('10 of 99');
    });
});

describe('the translator of a kit component', () => {
    const translator = () => mount(defineComponent({ setup: () => ({ t: useTrans() }), render: () => null })).vm.t;

    it('speaks the kit words in English when nobody set it up, and in the locale it is given', () => {
        expect(translator()('ui.pagination.of', { from: 1, to: 50, total: 120 })).toBe('1–50 of 120');

        configureUiKit({ locale: () => 'ru' });
        expect(translator()('ui.pagination.of', { from: 1, to: 50, total: 120 })).toBe('1–50 из 120');
        expect(translator()('ui.nothing')).toBe('ui.nothing');
    });
});
