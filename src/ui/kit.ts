import en from '../../lang/en/ui.json';
import ru from '../../lang/ru/ui.json';
import { h, type App, type Component, type FunctionalComponent } from 'vue';

/**
 * What the kit asks of the app it lives in, given once at start-up with
 * `app.use(uiKit, { ... })` (or `configureUiKit` outside an app, as the
 * specs do). Every field is optional: without one the kit speaks English
 * from its own words, draws plain anchors, navigates with the browser and
 * keeps the map off.
 *
 * The settings live in this module, not in provide/inject, because the
 * kit has plain functions that run outside a component (`useToast`'s
 * callers, `placeHints` and `placeAddress` in an event handler) where
 * `inject()` cannot reach, and each host mounts one app per page.
 */
export type Translations = { [key: string]: string | Translations };

export type Replacements = Record<string, string | number>;

/** `t('ui.close')`, `t('ui.sort.by', { column })`, `t('ui.chart.summary', { ... }, rows)`. */
export type Translate = (key: string, replace?: Replacements, count?: number | null) => string;

/**
 * The part of `@googlemaps/js-api-loader` the map components call: the
 * host passes the module itself (`import * as loader from '@googlemaps/js-api-loader'`),
 * so a host without maps never installs it.
 */
export interface MapsLoader {
    setOptions(options: { key: string; v: string; language: string }): void;
    importLibrary(name: 'maps' | 'places'): Promise<unknown>;
}

export interface UiKitOptions {
    /**
     * The translator, a composable as the host's own `useTrans` is: called
     * in a component's setup, it returns the function that looks a key up.
     * It must know the kit's keys (`ui.*`, and `ui_kit.*` for the showcase).
     */
    useTrans?: () => Translate;
    /** The language of the page (`en`, `ru`): numbers, the map, and the kit's own words when there is no `useTrans`. */
    locale?: () => string;
    /**
     * The component a kit link renders with: it gets `href` as a prop, the
     * classes and attributes, and the default slot. Inertia's `Link`;
     * `linkWithTo(RouterLink)` for vue-router; a plain anchor when absent.
     */
    link?: Component | string;
    /** Navigates to an address from code (a menu item with `href`): Inertia's `router.visit`, vue-router's `router.push`. */
    visit?: (href: string) => void;
    /**
     * The path of the current page, read when called (so a reactive source
     * reaches the next render): it marks the current sidebar item and
     * closes the phone drawer on navigation. `window.location.pathname`
     * when absent.
     */
    currentPath?: () => string;
    /** Google Maps: the browser key and the loader module. Without both the map components say the map is off. */
    maps?: { key?: string | null; loader?: MapsLoader | null };
    /** More words for the kit's own translator, merged over its `ui` group by locale: the showcase's `showcaseWords`. */
    words?: Record<string, Translations>[];
}

interface Settings {
    useTrans: (() => Translate) | null;
    locale: () => string;
    link: Component | string;
    visit: (href: string) => void;
    currentPath: () => string;
    mapsKey: string;
    mapsLoader: MapsLoader | null;
    dictionaries: Record<string, Translations>;
}

const builtIn: Record<string, Translations> = { en: { ui: en }, ru: { ui: ru } };

function settingsOf(options: UiKitOptions): Settings {
    const dictionaries: Record<string, Translations> = { ...builtIn };
    for (const extra of options.words ?? []) {
        for (const [locale, tree] of Object.entries(extra)) {
            dictionaries[locale] = { ...(dictionaries[locale] ?? {}), ...tree };
        }
    }

    return {
        useTrans: options.useTrans ?? null,
        locale: options.locale ?? (() => 'en'),
        link: options.link ?? 'a',
        visit: options.visit ?? ((href) => window.location.assign(href)),
        currentPath: options.currentPath ?? (() => window.location.pathname),
        mapsKey: (options.maps?.key ?? '').trim(),
        mapsLoader: options.maps?.loader ?? null,
        dictionaries,
    };
}

let settings: Settings = settingsOf({});

/** Replaces the whole set of adapters; `configureUiKit({})` brings back the defaults. */
export function configureUiKit(options: UiKitOptions): void {
    settings = settingsOf(options);
}

/** The Vue plugin: `app.use(uiKit, { useTrans, locale, link, visit, currentPath, maps })`. */
export const uiKit = {
    install(_app: App, options: UiKitOptions = {}): void {
        configureUiKit(options);
    },
};

/**
 * Looks a dotted key up in a tree of words. A missing key returns the key
 * itself, so a gap is visible on screen and in a test rather than blank.
 * A line with a count holds its plural forms split by `|`, in the order
 * of the locale's categories (one|other, or one|few|many for Russian).
 */
export function translate(translations: Translations, locale: string, key: string, replace: Replacements = {}, count: number | null = null): string {
    const value = key.split('.').reduce<string | Translations | undefined>((node, part) => (node === undefined || typeof node === 'string' ? undefined : node[part]), translations);

    if (typeof value !== 'string') {
        return key;
    }

    const line = count === null ? value : pluralForm(value, count, locale);

    // Longest names first, as Laravel does, so `:to` cannot eat the front of `:total`.
    return Object.entries(replace)
        .sort(([a], [b]) => b.length - a.length)
        .reduce((text, [name, replacement]) => text.replaceAll(`:${name}`, String(replacement)), line);
}

const CATEGORIES: Record<number, Intl.LDMLPluralRule[]> = {
    2: ['one', 'other'],
    3: ['one', 'few', 'many'],
};

export function pluralForm(value: string, count: number, locale: string): string {
    const forms = value.split('|');
    const order = CATEGORIES[forms.length];

    if (!order) {
        return forms[0] ?? value;
    }

    const index = order.indexOf(new Intl.PluralRules(locale).select(count));

    return (index === -1 ? forms[forms.length - 1] : forms[index]) ?? value;
}

/** The translator of a kit component: the host's when it gave one, else the kit's own words in the page's language. */
export function useTrans(): Translate {
    return useTransWith({});
}

/**
 * The same, with more words for the kit's own translator by locale (the
 * showcase brings its `ui_kit` group so), merged under the ones given at
 * start-up; the host's translator, when there is one, already has them.
 */
export function useTransWith(words: Record<string, Translations>): Translate {
    if (settings.useTrans !== null) {
        return settings.useTrans();
    }
    const current = settings;

    return (key, replace = {}, count = null) => {
        const locale = current.locale();
        const dictionary = { ...(words[locale] ?? words.en ?? {}), ...(current.dictionaries[locale] ?? current.dictionaries.en ?? {}) };

        return translate(dictionary, locale, key, replace, count);
    };
}

/** The language of the page, read when called so a switch reaches the next render. */
export function kitLocale(): string {
    return settings.locale();
}

export function kitLink(): Component | string {
    return settings.link;
}

export function kitVisit(href: string): void {
    settings.visit(href);
}

/** The current path without its query or hash. */
export function kitPath(): string {
    return settings.currentPath().split(/[?#]/)[0] ?? '';
}

export function kitMaps(): { key: string; loader: MapsLoader | null } {
    return { key: settings.mapsKey, loader: settings.mapsLoader };
}

/**
 * A link component for a router that takes `to` instead of `href`
 * (vue-router's `RouterLink`): `link: linkWithTo(RouterLink)`.
 */
export function linkWithTo(component: Component): Component {
    const adapted: FunctionalComponent<{ href: string }> = (props, { attrs, slots }) => h(component, { ...attrs, to: props.href }, slots);
    adapted.props = ['href'];

    return adapted;
}
