<script setup lang="ts">
import UiFormField from './UiFormField.vue';
import UiIconButton from './UiIconButton.vue';
import { Baseline, Bold, Highlighter, Italic, RemoveFormatting, Underline } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { controlBase, controlState } from './styles';

/**
 * Rich text with a few marks: bold, italic, underline, a
 * colour for the text and one for its background, and a way to drop them.
 * The value is HTML; the server cleans it to the same tags, so the
 * editor only has to produce them.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        placeholder?: string;
        /** The words of the toolbar, from the page's dictionary. */
        labels: { bold: string; italic: string; underline: string; color: string; background: string; clear: string };
    }>(),
    { label: undefined, hint: null, error: null, id: undefined, placeholder: undefined },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

/** The colours of a warning: red, orange, green, blue; yellow and pink behind it. */
const TEXT_COLOURS = ['#e60000', '#ff9900', '#008a00', '#0066cc'];
const BACKGROUNDS = ['#ffff00', '#ffc2c2'];

const area = ref<HTMLDivElement | null>(null);
const palette = ref<'color' | 'background' | null>(null);

onMounted(() => {
    if (area.value !== null) {
        area.value.innerHTML = props.modelValue;
    }
});

// A value replaced from outside (a reset of the form) is drawn again; the editor's own input is not.
watch(
    () => props.modelValue,
    (value) => {
        if (area.value !== null && area.value.innerHTML !== value) {
            area.value.innerHTML = value;
        }
    },
);

function changed(): void {
    emit('update:modelValue', area.value?.innerHTML ?? '');
}

/** Colours as `<span style>`, everything else as tags: the server keeps `<b>`, `<i>`, `<u>` and a span's colour, not a span's weight. */
const COLOURING = ['foreColor', 'hiliteColor'];

function apply(command: string, value?: string): void {
    area.value?.focus();
    document.execCommand('styleWithCSS', false, COLOURING.includes(command) ? 'true' : 'false');
    document.execCommand('defaultParagraphSeparator', false, 'p');
    document.execCommand(command, false, value);
    palette.value = null;
    changed();
}
</script>

<template>
    <UiFormField :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" v-slot="field">
        <div :class="[controlBase, controlState(field.invalid), 'h-auto p-0']">
            <div class="flex flex-wrap items-center gap-1 border-b border-line px-1 py-1" role="toolbar" :aria-controls="field.id">
                <UiIconButton size="sm" :label="props.labels.bold" data-test="rich-bold" @mousedown.prevent @click="apply('bold')"><Bold /></UiIconButton>
                <UiIconButton size="sm" :label="props.labels.italic" @mousedown.prevent @click="apply('italic')"><Italic /></UiIconButton>
                <UiIconButton size="sm" :label="props.labels.underline" @mousedown.prevent @click="apply('underline')"><Underline /></UiIconButton>
                <UiIconButton size="sm" :label="props.labels.color" :pressed="palette === 'color'" data-test="rich-color" @mousedown.prevent @click="palette = palette === 'color' ? null : 'color'"><Baseline /></UiIconButton>
                <UiIconButton size="sm" :label="props.labels.background" :pressed="palette === 'background'" @mousedown.prevent @click="palette = palette === 'background' ? null : 'background'"><Highlighter /></UiIconButton>
                <UiIconButton size="sm" :label="props.labels.clear" @mousedown.prevent @click="apply('removeFormat')"><RemoveFormatting /></UiIconButton>
                <span v-if="palette !== null" class="ml-1 flex items-center gap-1">
                    <button
                        v-for="colour in palette === 'color' ? TEXT_COLOURS : BACKGROUNDS"
                        :key="colour"
                        type="button"
                        class="h-5 w-5 rounded-full border border-line focus-visible:outline-2 focus-visible:outline-brand-600"
                        :style="{ backgroundColor: colour }"
                        :aria-label="colour"
                        data-test="rich-swatch"
                        @mousedown.prevent
                        @click="apply(palette === 'color' ? 'foreColor' : 'hiliteColor', colour)"
                    />
                </span>
            </div>
            <div
                :id="field.id"
                ref="area"
                contenteditable="true"
                role="textbox"
                aria-multiline="true"
                :aria-invalid="field.invalid || undefined"
                :aria-describedby="field.describedBy"
                :data-placeholder="props.placeholder"
                class="min-h-24 px-3 py-2 text-sm leading-6 outline-none empty:before:text-ink-subtle empty:before:content-[attr(data-placeholder)] [&_p]:my-1"
                data-test="rich-area"
                @input="changed"
            />
        </div>
    </UiFormField>
</template>
