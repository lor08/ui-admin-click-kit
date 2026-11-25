<script setup lang="ts">
import UiIcon from './UiIcon.vue';

/**
 * How an action of the softphone goes, Click's `.transfer-status`: a
 * turning circle while it `waits`, a tick once it is `done`, a warning
 * when it `failed`; read out as it changes.
 */
type State = 'waits' | 'done' | 'failed';

const props = defineProps<{ state: State }>();

const states: Record<State, string> = { waits: 'text-slate-500', done: 'text-green-700', failed: 'text-red-700' };
</script>

<template>
    <p class="mt-2 mb-1 flex items-center gap-1.5 text-xs" :class="states[props.state]" role="status">
        <UiIcon v-if="props.state === 'waits'" name="loading" class="animate-spin" />
        <UiIcon v-else :name="props.state === 'done' ? 'check-circle' : 'alert-circle'" />
        <span><slot /></span>
    </p>
</template>
