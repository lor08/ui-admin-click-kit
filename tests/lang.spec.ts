import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { lookup, parsePhpLang, type LangTree } from './support/php-lang';

const root = resolve(__dirname, '..');
const bin = resolve(root, 'bin/ui-kit-lang.mjs');
const json = (locale: string, group: string): LangTree => JSON.parse(readFileSync(resolve(root, `lang/${locale}/${group}.json`), 'utf8')) as LangTree;

function keys(tree: LangTree, prefix = ''): string[] {
    return Object.entries(tree).flatMap(([key, value]) => (typeof value === 'string' ? [`${prefix}${key}`] : keys(value, `${prefix}${key}.`)));
}

let dir = '';

afterEach(() => {
    if (dir !== '') {
        rmSync(dir, { recursive: true, force: true });
        dir = '';
    }
});

describe('the words of the kit', () => {
    it.each(['ui', 'ui_kit'])('has the same keys in English and Russian in %s', (group) => {
        expect(keys(json('ru', group)).sort()).toEqual(keys(json('en', group)).sort());
    });

    it('writes Laravel lang files that read back to the same words, and checks them after', () => {
        dir = mkdtempSync(join(tmpdir(), 'kit-lang-'));
        execFileSync('node', [bin, dir]);

        for (const locale of ['en', 'ru']) {
            for (const group of ['ui', 'ui_kit']) {
                const php = readFileSync(join(dir, locale, `${group}.php`), 'utf8');
                expect(php.startsWith('<?php\n\ndeclare(strict_types=1);\n')).toBe(true);
                expect(parsePhpLang(php)).toEqual(json(locale, group));
            }
        }
        expect(lookup(parsePhpLang(readFileSync(join(dir, 'ru', 'ui.php'), 'utf8')), 'pagination.of')).toBe(':from–:to из :total');
        expect(execFileSync('node', [bin, dir, '--check']).toString()).toContain('current');

        writeFileSync(join(dir, 'en', 'ui.php'), '<?php return [];');
        expect(() => execFileSync('node', [bin, dir, '--check'], { stdio: 'pipe' })).toThrow();
    });

    it('writes only the groups it is asked for', () => {
        dir = mkdtempSync(join(tmpdir(), 'kit-lang-'));
        execFileSync('node', [bin, dir, '--groups', 'ui']);

        expect(() => readFileSync(join(dir, 'en', 'ui_kit.php'))).toThrow();
        expect(parsePhpLang(readFileSync(join(dir, 'en', 'ui.php'), 'utf8'))).toEqual(json('en', 'ui'));
    });
});

describe('the lang reader of the specs', () => {
    it('reads nested arrays, escaped quotes and comments', () => {
        const tree = parsePhpLang(`<?php\n\ndeclare(strict_types=1);\n\n// a comment\nreturn [\n    'a' => 'it\\'s',\n    'b' => [\n        'c' => 'd', // trailing\n    ],\n];\n`);

        expect(tree).toEqual({ a: "it's", b: { c: 'd' } });
        expect(lookup(tree, 'b.c')).toBe('d');
        expect(lookup(tree, 'b.x')).toBeNull();
    });
});
