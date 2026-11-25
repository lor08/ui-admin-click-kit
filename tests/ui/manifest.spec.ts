import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { KitPage, showcaseWords } from '../../src/showcase';
import { demos } from '../../src/showcase/demos';
import { entriesOf, kitGroups, manifest, memberKey } from '../../src/showcase/manifest';
import { currentReadme, lookup, readmePath, type LangTree } from '../../scripts/ui-readme';

const root = resolve(__dirname, '../..');
const uiDir = resolve(root, 'src/ui');

/**
 * The catalogue cannot go stale: every component of the kit is in the
 * manifest and the manifest names only components that exist; every entry
 * has its words in both languages and its live demo; the README on disk is
 * what the generator writes.
 */
describe('the kit manifest', () => {
    const files = readdirSync(uiDir)
        .filter((file) => file.endsWith('.vue'))
        .map((file) => file.replace(/\.vue$/, ''))
        .sort();
    const names = manifest.map((entry) => entry.name).sort();

    it('lists every component of the folder and nothing else', () => {
        expect(names).toEqual(files);
        expect(new Set(names).size).toBe(names.length);
    });

    it('puts every entry in a known group and every part under an entry that exists', () => {
        for (const entry of manifest) {
            expect(kitGroups).toContain(entry.group);
            if (entry.partOf) {
                expect(names).toContain(entry.partOf);
            }
            expect(entry.snippet.length).toBeGreaterThan(0);
        }
    });

    it('has a live demo for every entry that is not a part of another', () => {
        const expected = manifest.filter((entry) => !entry.partOf).map((entry) => entry.name).sort();
        expect(Object.keys(demos).sort()).toEqual(expected);
    });

    it.each(['en', 'ru'])('has words for every entry, prop, slot and event in %s', (locale) => {
        const words = JSON.parse(readFileSync(resolve(root, `lang/${locale}/ui_kit.json`), 'utf8')) as LangTree;
        const missing: string[] = [];
        const need = (key: string): void => {
            if (lookup(words, key) === null) {
                missing.push(key);
            }
        };

        for (const group of kitGroups) {
            need(`groups.${group}.title`);
            need(`groups.${group}.lead`);
        }
        for (const entry of manifest) {
            need(`components.${entry.name}.purpose`);
            need(`components.${entry.name}.when`);
            entry.props.forEach((prop) => need(`components.${entry.name}.props.${memberKey(prop.name)}`));
            entry.slots.forEach((slot) => need(`components.${entry.name}.slots.${memberKey(slot)}`));
            entry.events.forEach((event) => need(`components.${entry.name}.events.${memberKey(event)}`));
        }

        expect(missing).toEqual([]);
    });

    it.each(kitGroups)('renders every entry of the %s group, without any set-up, with its words, its demo and links under the base it is given', async (group) => {
        const wrapper = mount(KitPage, { props: { group, groups: kitGroups, base: '/admin/kit' }, global: { stubs: { teleport: true } }, attachTo: document.body });
        await flushPromises();

        for (const entry of entriesOf(group)) {
            const section = wrapper.get(`[data-test="kit-${entry.name}"]`);
            expect(section.text()).toContain(lookup(showcaseWords.en as LangTree, `ui_kit.components.${entry.name}.purpose`));
        }
        // An unresolved key reads as itself; the snippets' own template keys (ui_kit.groups.${group}) do not match.
        expect(wrapper.text()).not.toMatch(/ui_kit\.[a-z_]+\.[a-z]/);
        expect(wrapper.get('[data-test="group-nav"]').findAll('a').map((link) => link.attributes('href'))).toEqual(kitGroups.map((other) => `/admin/kit/${other}`));
        wrapper.unmount();
    });

    it('matches the README the generator writes (run npm run ui:readme)', () => {
        expect(readFileSync(readmePath, 'utf8')).toBe(currentReadme());
    });
});
