/**
 * Reads a Laravel lang file (lang/<locale>/<group>.php) into a nested
 * object. The files are `return [ 'key' => 'value' | [...] , ... ];`
 * with single-quoted strings and `//` comments, nothing else; anything
 * beyond that stops the reader with an error, so a surprise is noticed
 * instead of misread. Used by the specs to read back what bin/ui-kit-lang.mjs
 * writes, where no PHP runs.
 */
export type LangTree = { [key: string]: string | LangTree };

export function parsePhpLang(source: string): LangTree {
    const start = source.indexOf('return');
    if (start === -1) {
        throw new Error('No `return` in the lang file.');
    }
    const reader = new Reader(source.slice(start + 'return'.length));
    reader.skip();
    const tree = reader.array();
    reader.skip();
    reader.expect(';');

    return tree;
}

class Reader {
    private at = 0;
    private readonly text: string;

    public constructor(text: string) {
        this.text = text;
    }

    public array(): LangTree {
        this.expect('[');
        const tree: LangTree = {};
        for (;;) {
            this.skip();
            if (this.peek() === ']') {
                this.at++;

                return tree;
            }
            const key = this.string();
            this.skip();
            this.expect('=>');
            this.skip();
            tree[key] = this.peek() === '[' ? this.array() : this.string();
            this.skip();
            if (this.peek() === ',') {
                this.at++;
            }
        }
    }

    public skip(): void {
        for (;;) {
            const rest = this.text.slice(this.at);
            const space = /^\s+/.exec(rest);
            if (space) {
                this.at += space[0].length;
                continue;
            }
            if (rest.startsWith('//')) {
                const end = this.text.indexOf('\n', this.at);
                this.at = end === -1 ? this.text.length : end;
                continue;
            }

            return;
        }
    }

    public expect(token: string): void {
        if (!this.text.startsWith(token, this.at)) {
            throw new Error(`Expected ${token} at ${this.at}: ${this.text.slice(this.at, this.at + 30)}`);
        }
        this.at += token.length;
    }

    public peek(): string {
        return this.text.charAt(this.at);
    }

    private string(): string {
        this.expect("'");
        let value = '';
        while (this.at < this.text.length) {
            const char = this.text.charAt(this.at++);
            if (char === '\\') {
                value += this.text.charAt(this.at++);
            } else if (char === "'") {
                return value;
            } else {
                value += char;
            }
        }
        throw new Error('Unterminated string.');
    }
}

/** A dotted key in the tree, or null when any part is missing. */
export function lookup(tree: LangTree, key: string): string | null {
    let node: string | LangTree | undefined = tree;
    for (const part of key.split('.')) {
        if (node === undefined || typeof node === 'string') {
            return null;
        }
        node = node[part];
    }

    return typeof node === 'string' ? node : null;
}
