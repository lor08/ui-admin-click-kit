<script setup lang="ts">
import UiIconButton from '../ui/UiIconButton.vue';
import { writeClipboard } from '../ui/clipboard';
import { useToast } from '../ui/toast';
import { useTrans } from './words';
import { Check, Copy } from '@lucide/vue';
import { ref } from 'vue';

/** The usage snippet of a component with the button that copies it. */
const props = defineProps<{ code: string }>();

const t = useTrans();
const toast = useToast();
const copied = ref(false);

async function copy(): Promise<void> {
    if (await writeClipboard(props.code)) {
        copied.value = true;
        toast.success(t('ui_kit.example.copied'));
        setTimeout(() => (copied.value = false), 1500);
    } else {
        toast.error(t('ui_kit.example.copy_failed'));
    }
}
</script>

<template>
    <div class="relative rounded-card bg-sidebar text-sidebar-ink">
        <UiIconButton :label="t('ui_kit.example.copy')" size="sm" class="absolute right-2 top-2 text-sidebar-muted hover:bg-sidebar-hover hover:text-white" data-test="copy" @click="copy">
            <Check v-if="copied" />
            <Copy v-else />
        </UiIconButton>
        <pre class="whitespace-pre-wrap break-words p-4 pr-12 text-xs leading-5"><code data-test="snippet">{{ props.code }}</code></pre>
    </div>
</template>
