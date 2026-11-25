<script setup lang="ts">
import UiButton from './UiButton.vue';
import UiInput from './UiInput.vue';
import { writeClipboard } from './clipboard';
import { useTrans } from './kit';
import { ref } from 'vue';

/**
 * A value to hand over, not to edit: a link to send by hand, a key, an id.
 * The field is read only and selects itself on focus; the button copies the
 * value and says so; where the browser refuses the clipboard the value is
 * selected for a manual copy.
 */
const props = withDefaults(defineProps<{ value: string; label?: string; id?: string; copyLabel?: string }>(), { label: undefined, id: undefined, copyLabel: undefined });

const emit = defineEmits<{ copied: [] }>();

const t = useTrans();
const copied = ref(false);
const root = ref<HTMLElement | null>(null);

function selectValue(): void {
    root.value?.querySelector('input')?.select();
}

async function copy(): Promise<void> {
    copied.value = await writeClipboard(props.value);
    if (copied.value) {
        emit('copied');
    } else {
        selectValue();
    }
}
</script>

<template>
    <div ref="root" data-test="copy-field">
        <div class="flex flex-wrap items-end gap-2">
            <UiInput :id="props.id" :model-value="props.value" :label="props.label" readonly class="min-w-0 grow" data-test="copy-value" @focus="selectValue" />
            <UiButton variant="secondary" data-test="copy" @click="copy">{{ props.copyLabel ?? t('ui.copy.copy') }}</UiButton>
        </div>
        <p v-if="copied" class="mt-1.5 text-sm text-success" role="status" data-test="copied">{{ t('ui.copy.copied') }}</p>
    </div>
</template>
