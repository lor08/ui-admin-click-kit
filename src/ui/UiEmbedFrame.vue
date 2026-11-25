<script setup lang="ts">
import UiAlert from './UiAlert.vue';
import UiSpinner from './UiSpinner.vue';
import UiText from './UiText.vue';
import { loadEmbedScript, originOf, type EmbeddedFrame } from './embed';
import { useTrans } from './kit';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

/**
 * A page of another service inside ours: the frame is put in by that service's
 * own embed.js, loaded once from the origin of `url`, and grows to the
 * page's height. `url` is what our backend handed over, used as it came;
 * the atom builds no address but the script's. Loading and a failure
 * are said in words.
 */
const props = defineProps<{ url: string; title: string }>();

const t = useTrans();
const host = ref<HTMLElement | null>(null);
const state = ref<'loading' | 'ready' | 'failed'>('loading');
let frame: EmbeddedFrame | null = null;
let attempt = 0;

function unmount(): void {
    frame?.unmount();
    frame = null;
}

async function mount(): Promise<void> {
    const mine = ++attempt;
    unmount();
    state.value = 'loading';
    const origin = originOf(props.url);
    if (origin === null) {
        state.value = 'failed';
        return;
    }
    try {
        const api = await loadEmbedScript(origin);
        if (mine !== attempt || host.value === null) {
            return;
        }
        frame = api.mount(host.value, { url: props.url, title: props.title });
        state.value = 'ready';
    } catch {
        if (mine === attempt) {
            state.value = 'failed';
        }
    }
}

onMounted(() => void mount());
watch(() => props.url, () => void mount());
onBeforeUnmount(() => {
    attempt++;
    unmount();
});
</script>

<template>
    <div class="grid gap-2" data-test="embed-frame">
        <div v-if="state === 'loading'" class="flex items-center gap-2" data-test="embed-loading">
            <UiSpinner size="sm" :label="t('ui.embed_frame.loading')" />
            <UiText size="sm">{{ t('ui.embed_frame.loading') }}</UiText>
        </div>
        <UiAlert v-if="state === 'failed'" variant="danger" data-test="embed-failed">{{ t('ui.embed_frame.failed') }}</UiAlert>
        <div v-show="state === 'ready'" ref="host" class="overflow-hidden rounded-lg border border-line" data-test="embed-host" />
    </div>
</template>
