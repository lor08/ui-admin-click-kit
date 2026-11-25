# ui-admin-click-kit

A Vue 3 UI kit for admin screens: buttons, fields, tables, dialogs, the
sidebar frame and the rest, drawn with Tailwind 4 on a small set of design
tokens, built on reka-ui and lucide icons. It comes with its own words in
English and Russian and with a showcase: a catalogue of every component
with a live demo, the snippet to copy and its props, slots and events.

The package ships source, not a bundle. The host's Vite compiles the
`.vue` and `.ts` files and the host's Tailwind scans them for classes, so
the kit always builds with the host's own versions and settings.

The code is published for reference. All rights reserved.

## Install

From git, by tag:

```json
"dependencies": {
    "ui-admin-click-kit": "github:lor08/ui-admin-click-kit#v0.1.0"
}
```

The kit expects these in the host (peer dependencies):

| Package | Range | |
|---|---|---|
| `vue` | `^3.5.42` | |
| `reka-ui` | `^2.11.0` | |
| `lucide-vue-next` | `^1.0.0` | |
| `@googlemaps/js-api-loader` | `^2.1.3` | optional: only for `UiMap`, `UiPlaceInput` and the address helpers |

`@types/google.maps` comes with the kit, so a host type-checks the map
components without installing anything for them. The kit never imports
the Maps loader itself: a host that uses maps passes the loader module in
(see below), and a host that does not never needs it.

## What a host gives the kit

The kit knows nothing of the app around it. Whatever it needs from the
app it takes from adapters given once at start-up with the Vue plugin
`uiKit`. Every adapter is optional; with none, the kit speaks English from
its own words, draws plain `<a href>` links and navigates with the
browser.

| Option | What it is | Without it |
|---|---|---|
| `useTrans` | A composable that returns the translator `(key, replace?, count?) => string`; it must know the `ui.*` keys (and `ui_kit.*` for the showcase). | The kit's own words in the language of `locale` |
| `locale` | `() => string`, the language of the page (`en`, `ru`), read on every call so a switch reaches the next render. Numbers, the map and the kit's own words use it. | `'en'` |
| `link` | The component a kit link renders with. It gets `href` as a prop, the classes and attributes, and the default slot. | A plain anchor |
| `visit` | `(href) => void`, navigation from code (a menu item with `href`). | `window.location.assign` |
| `currentPath` | `() => string`, the path of the page: it marks the current sidebar item and closes the phone drawer on navigation. | `window.location.pathname` |
| `maps` | `{ key, loader }`: the browser key of Google Maps and the loader module. | The map components say the map is off |
| `words` | More words for the kit's own translator, by locale. | none |

The settings live in one module rather than in provide/inject because
some of the kit runs outside a component (the address helpers called from
an event handler) and each host mounts one app per page. `configureUiKit`
does the same as the plugin, for code that has no app, such as a test.

### A Laravel + Inertia host

The words come from the host's lang files through Inertia's shared props,
so the host passes its own `useTrans`:

```ts
import { Link, router, usePage } from '@inertiajs/vue3';
import * as mapsLoader from '@googlemaps/js-api-loader';
import { uiKit } from 'ui-admin-click-kit';
import { useTrans } from '@/lib/i18n';

createInertiaApp({
    setup({ el, App, props, plugin }) {
        const page = usePage();
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(uiKit, {
                useTrans,
                locale: () => page.props.locale,
                link: Link,
                visit: (href) => router.visit(href),
                currentPath: () => page.url,
                maps: { key: import.meta.env.VITE_GOOGLE_MAPS_KEY, loader: mapsLoader },
            })
            .mount(el);
    },
});
```

`useTrans` is any composable whose function looks a dotted key up in the
dictionary the page carries, with `:name` replacements and `|` plural
forms; the kit exports a `translate(translations, locale, key, replace,
count)` that does exactly that, if the host has none.

### A plain Vue host with vue-router

```ts
import { linkWithTo, uiKit } from 'ui-admin-click-kit';
import { RouterLink } from 'vue-router';

createApp(App)
    .use(router)
    .use(uiKit, {
        locale: () => locale.value,
        link: linkWithTo(RouterLink),
        visit: (href) => void router.push(href),
        currentPath: () => router.currentRoute.value.path,
    })
    .mount('#app');
```

`linkWithTo` turns a link that takes `to` into one that takes `href`. A
kit link is always a string path, so a named route is resolved first:
`router.resolve({ name: 'projects' }).path`, or simply the path. With no `useTrans` the kit speaks its own words in the language
`locale` returns; to use the app's own translator instead, give `useTrans`
and merge the kit's words into the app's dictionaries (see Words).

## Tailwind and the theme

In the host's main stylesheet, after Tailwind:

```css
@import 'tailwindcss';
@import 'ui-admin-click-kit/theme.css';
@source '../../node_modules/ui-admin-click-kit/src';
```

`theme.css` holds the tokens every component draws with (`brand-*`,
`canvas`, `surface`, `ink`, `line`, the tones, the sidebar, the radii and
the animations). The `@source` path is relative to the stylesheet; it lets
Tailwind find the classes the kit uses. A brand change is an edit of the
tokens in the host, after the import.

Nothing else is needed in Vite. In TypeScript the host needs
`"moduleResolution": "bundler"`, as any Vite app has; it also turns on
`resolveJsonModule`, which the words need. The host's `vue-tsc` type-checks the kit's source with
the host's settings; the kit passes under `strict` and
`noUncheckedIndexedAccess`.

## Using the components

```ts
import { UiButton, UiTable, useToast, type UiTableColumn } from 'ui-admin-click-kit';
import UiModal from 'ui-admin-click-kit/ui/UiModal.vue';
```

Both forms reach the same files. An app that already imports
`@/components/ui/UiButton.vue` everywhere can point that path at the kit
instead of rewriting its imports, with one alias in Vite (before the
general `@` alias) and one path in TypeScript:

```ts
// vite.config.ts
resolve: {
    alias: [
        { find: '@/components/ui', replacement: 'ui-admin-click-kit/ui' },
        { find: '@', replacement: '/resources/js' },
    ],
},
```

```json
// tsconfig.json, compilerOptions.paths
"@/components/ui/*": ["./node_modules/ui-admin-click-kit/src/ui/*"],
"@/*": ["./resources/js/*"]
```

`src/ui/README.md` lists every component with what it is for and when to
reach for it; it is written from the showcase's catalogue by
`npm run ui:readme`.

## Words

The kit's own words (close, loading, the pages of a list, the strength of
a password) are data in `lang/<locale>/ui.json`, the words of the
showcase in `lang/<locale>/ui_kit.json`, for `en` and `ru`. Components
look them up as `ui.<key>` and `ui_kit.<key>`.

- **A Laravel host** keeps serving them through its lang files. The
  package has a command that writes `lang/<locale>/ui.php` and
  `lang/<locale>/ui_kit.php` from the JSON:

  ```sh
  npx ui-kit-lang lang            # writes lang/en/ui.php, lang/ru/ui.php, ...
  npx ui-kit-lang lang --check    # exits 1 when a file differs, for CI
  npx ui-kit-lang lang --groups ui
  ```

  The files are ordinary PHP arrays, so the host's translator and its
  lang tests (a parity test of `ru` against `en`) read them as before. The
  files carry a header saying they are generated; commit them and run the
  command again after every bump of the kit.

- **A plain Vue host** either lets the kit speak its own words (give only
  `locale`), or merges them into its dictionaries and gives `useTrans`:

  ```ts
  import kitEn from 'ui-admin-click-kit/lang/en/ui.json';
  import kitRu from 'ui-admin-click-kit/lang/ru/ui.json';

  const dictionaries = { en: { ...en, ui: kitEn }, ru: { ...ru, ui: kitRu } };
  ```

## The showcase

`ui-admin-click-kit/showcase` is a separate entry: the catalogue
(`manifest`, `kitGroups`, `entriesOf`), the demos and `KitPage`, which
lays out one group of components with a live demo, the snippet and the
API of each. `KitTokens` and `KitComposition` show the tokens and a
composed list screen. The showcase speaks without any set-up, from its own
words, unless the host's `useTrans` serves the `ui_kit.*` keys.

A host serves one page per group:

```vue
<script setup lang="ts">
import { KitComposition, KitPage, KitTokens, kitGroups, type KitGroup } from 'ui-admin-click-kit/showcase';

defineProps<{ group: KitGroup }>();
</script>

<template>
    <KitPage :group="group" :groups="kitGroups" base="/ui-kit">
        <template v-if="group === 'layout'" #before><KitTokens /></template>
        <template v-if="group === 'layout'" #after><KitComposition /></template>
    </KitPage>
</template>
```

`base` is where the host serves the section (`<base>/<group>`); it is
`/ui-kit` by default. The map demo shows the map only when the host gave
`maps`.

## Checks

```sh
npm ci
npm run typecheck     # vue-tsc over the kit, the showcase, the specs and the scripts
npm test              # Vitest in jsdom: every component, the adapters, the catalogue, the words
npm run ui:readme     # rewrites src/ui/README.md from the catalogue
npm run ui:readme:check
```

The catalogue spec fails when a component has no entry, an entry has no
demo or no words in either language, or `src/ui/README.md` is stale. CI
(`.github/workflows/ci.yml`) runs all of them on Node 24.

A new component is a file in `src/ui`, an export in `src/ui/index.ts`, an
entry in `src/showcase/manifest.ts`, its words in `lang/*/ui_kit.json`
(and in `lang/*/ui.json` if it has words of its own), a demo in
`src/showcase/demos` registered in `demos.ts`, and a spec.

## Releasing

1. Change the kit, with its specs, words and catalogue; the checks pass.
2. Bump `version` in `package.json` and tag the commit `v<version>`; push
   the tag.
3. In each host, move the dependency to the new tag
   (`github:lor08/ui-admin-click-kit#v<version>`), run `npm install`, and
   in a Laravel host `npx ui-kit-lang lang` and commit the lang files.

A host never edits the kit's files in place: a fix goes into the kit and
reaches the hosts through a tag.
