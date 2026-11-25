import en from '../../lang/en/ui_kit.json';
import ru from '../../lang/ru/ui_kit.json';
import { useTransWith, type Translate, type Translations } from '../ui/kit';

/** The showcase's words by locale, under `ui_kit` as a Laravel host serves them from ui_kit.php. */
export const showcaseWords: Record<string, Translations> = { en: { ui_kit: en }, ru: { ui_kit: ru } };

/** The translator of the showcase: it speaks without any set-up, as the components do. */
export function useTrans(): Translate {
    return useTransWith(showcaseWords);
}
