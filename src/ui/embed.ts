/**
 * The script of a service that puts its pages into ours (its
 * `<origin>/embed.js`): loaded once per address by a classic script tag,
 * which sets `window.TelephonyEmbed`, the name that service's script
 * gives its API. A load that
 * failed is forgotten, so the next frame tries again.
 */
export interface EmbeddedFrame {
    unmount(): void;
}

export interface TelephonyEmbedApi {
    mount(element: HTMLElement, options: { url: string; title?: string }): EmbeddedFrame;
    unmount(element: HTMLElement): void;
}

declare global {
    interface Window {
        TelephonyEmbed?: TelephonyEmbedApi;
    }
}

const scripts = new Map<string, Promise<TelephonyEmbedApi>>();

/** The origin of an http(s) address, null for anything else. */
export function originOf(url: string): string | null {
    try {
        const parsed = new URL(url);

        return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? parsed.origin : null;
    } catch {
        return null;
    }
}

export function loadEmbedScript(origin: string): Promise<TelephonyEmbedApi> {
    const src = `${origin}/embed.js`;
    const known = scripts.get(src);
    if (known !== undefined) {
        return known;
    }

    const loading = new Promise<TelephonyEmbedApi>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.addEventListener('load', () => (window.TelephonyEmbed === undefined ? reject(new Error(`${src} set no TelephonyEmbed`)) : resolve(window.TelephonyEmbed)));
        script.addEventListener('error', () => {
            script.remove();
            reject(new Error(`${src} did not load`));
        });
        document.head.appendChild(script);
    });
    scripts.set(src, loading);
    loading.catch(() => scripts.delete(src));

    return loading;
}
