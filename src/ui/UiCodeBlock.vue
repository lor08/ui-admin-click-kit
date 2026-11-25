<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { writeClipboard } from './clipboard';
import { useTrans } from './kit';
import { Check, ChevronRight, Copy } from '@lucide/vue';
import { computed, ref } from 'vue';

type Height = 'sm' | 'md' | 'lg';

/**
 * Preformatted text or data as the machine wrote it: a provider's payload,
 * the extra data of a session. A string is shown as is, anything else as
 * indented JSON. Long lines wrap, a tall block scrolls inside, the button
 * in the corner copies the whole of it.
 */
const props = withDefaults(defineProps<{ value: unknown; maxHeight?: Height; collapsible?: boolean; label?: string; open?: boolean }>(), {
    maxHeight: 'md',
    collapsible: false,
    label: undefined,
    open: false,
});

const t = useTrans();

const text = computed((): string => (typeof props.value === 'string' ? props.value : (JSON.stringify(props.value, null, 2) ?? '')));

const heights: Record<Height, string> = { sm: 'max-h-40', md: 'max-h-80', lg: 'max-h-[32rem]' };

const state = ref<'idle' | 'copied' | 'failed'>('idle');

async function copy(): Promise<void> {
    state.value = (await writeClipboard(text.value)) ? 'copied' : 'failed';
    // A refusal stays on screen until the next try: the reader has to copy by hand.
    if (state.value === 'copied') {
        setTimeout(() => (state.value = 'idle'), 2000);
    }
}

const announcement = computed(() => (state.value === 'copied' ? t('ui.copy.copied') : ''));
</script>

<template>
    <component :is="props.collapsible ? 'details' : 'div'" class="group min-w-0" :open="props.collapsible ? props.open : undefined" data-test="code">
        <summary
            v-if="props.collapsible"
            class="inline-flex cursor-pointer list-none items-center gap-1 rounded text-sm font-medium text-ink hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden"
            data-test="code-summary"
        >
            <ChevronRight class="h-4 w-4 text-ink-muted transition-transform group-open:rotate-90" aria-hidden="true" />
            {{ props.label ?? t('ui.code.label') }}
        </summary>
        <p v-else-if="props.label" class="mb-1.5 text-sm font-medium text-ink" data-test="code-label">{{ props.label }}</p>
        <div class="relative rounded-control border border-line bg-canvas" :class="props.collapsible ? 'mt-2' : ''">
            <UiIconButton :label="state === 'copied' ? t('ui.copy.copied') : t('ui.copy.copy')" size="sm" class="absolute right-1.5 top-1.5 bg-canvas" data-test="code-copy" @click="copy">
                <Check v-if="state === 'copied'" />
                <Copy v-else />
            </UiIconButton>
            <pre
                class="overflow-y-auto whitespace-pre-wrap p-3 pr-11 font-mono text-xs leading-5 text-ink [overflow-wrap:anywhere] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600"
                :class="heights[props.maxHeight]"
                tabindex="0"
                role="region"
                :aria-label="props.label ?? t('ui.code.label')"
                data-test="code-text"
            ><code>{{ text }}</code></pre>
            <span class="sr-only" aria-live="polite" data-test="code-status">{{ announcement }}</span>
            <p v-if="state === 'failed'" class="px-3 pb-2 text-xs text-danger" role="alert" data-test="copy-failed">{{ t('ui.copy.failed') }}</p>
        </div>
    </component>
</template>
