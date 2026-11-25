<script setup lang="ts">
import UiFormField from './UiFormField.vue';
import { controlBase, controlSizes, controlState, type ControlSize } from './styles';
import { splitAttrs } from './attrs';
import { useTrans } from './kit';
import { Check, Eye, EyeOff } from 'lucide-vue-next';
import { computed, ref, useAttrs } from 'vue';

/**
 * A password control with the eye that reveals it. With `strength` it also
 * judges what is typed: a bar, a word and the list of
 * checks. Only the length is a rule of the application (`minLength`); the
 * other checks add to the strength without being required.
 */
const props = withDefaults(
    defineProps<{
        modelValue: string;
        label?: string;
        hint?: string | null;
        error?: string | null;
        id?: string;
        name?: string;
        size?: ControlSize;
        autocomplete?: 'current-password' | 'new-password';
        placeholder?: string;
        required?: boolean;
        optional?: boolean;
        disabled?: boolean;
        autofocus?: boolean;
        /** Show the bar, the word and the checks under the control. */
        strength?: boolean;
        /** The shortest password the application accepts; the first check. */
        minLength?: number;
    }>(),
    {
        label: undefined,
        hint: null,
        error: null,
        id: undefined,
        name: undefined,
        size: 'md',
        autocomplete: 'current-password',
        placeholder: undefined,
        required: false,
        optional: false,
        disabled: false,
        autofocus: false,
        strength: false,
        minLength: 12,
    },
);

const emit = defineEmits<{ 'update:modelValue': [value: string]; blur: [event: FocusEvent] }>();

defineOptions({ inheritAttrs: false });

const t = useTrans();
const { root: rootAttrs, control: controlAttrs } = splitAttrs(useAttrs());

const revealed = ref(false);

interface Check {
    key: 'length' | 'upper' | 'lower' | 'digit' | 'special';
    passes: boolean;
}

const checks = computed((): Check[] => [
    { key: 'length', passes: props.modelValue.length >= props.minLength },
    { key: 'upper', passes: /\p{Lu}/u.test(props.modelValue) },
    { key: 'lower', passes: /\p{Ll}/u.test(props.modelValue) },
    { key: 'digit', passes: /\d/.test(props.modelValue) },
    { key: 'special', passes: /[^\p{L}\d\s]/u.test(props.modelValue) },
]);

const passed = computed(() => checks.value.filter((check) => check.passes).length);

type Level = 'weak' | 'medium' | 'strong';

const level = computed((): Level => (passed.value <= 2 ? 'weak' : passed.value <= 3 ? 'medium' : 'strong'));

const bars: Record<Level, string> = { weak: 'bg-danger', medium: 'bg-warning', strong: 'bg-success' };
const words: Record<Level, string> = { weak: 'text-danger', medium: 'text-warning', strong: 'text-success' };

const toggleBox = 'absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-control text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-600 [&>svg]:h-4 [&>svg]:w-4';
</script>

<template>
    <UiFormField v-bind="rootAttrs" :label="props.label" :hint="props.hint" :error="props.error" :id="props.id" :required="props.required" :optional="props.optional" v-slot="field">
        <div class="relative">
            <input
                v-bind="controlAttrs"
                :id="field.id"
                :class="[controlBase, controlSizes[props.size], controlState(field.invalid), 'pr-10']"
                :value="props.modelValue"
                :type="revealed ? 'text' : 'password'"
                :name="props.name"
                :autocomplete="props.autocomplete"
                :placeholder="props.placeholder"
                :required="props.required"
                :disabled="props.disabled"
                :autofocus="props.autofocus"
                spellcheck="false"
                :aria-invalid="field.invalid ? 'true' : undefined"
                :aria-describedby="field.describedBy"
                @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
                @blur="emit('blur', $event)"
            />
            <button type="button" :class="toggleBox" tabindex="-1" :aria-pressed="revealed ? 'true' : 'false'" :aria-label="revealed ? t('ui.password.hide') : t('ui.password.show')" data-test="reveal" @click="revealed = !revealed">
                <EyeOff v-if="revealed" aria-hidden="true" />
                <Eye v-else aria-hidden="true" />
            </button>
        </div>
        <div v-if="props.strength && props.modelValue !== ''" class="mt-2 rounded-control bg-canvas px-3 py-2" data-test="strength">
            <div class="flex items-center gap-3">
                <div class="h-1 grow overflow-hidden rounded-full bg-line" role="meter" :aria-valuemin="0" :aria-valuemax="checks.length" :aria-valuenow="passed" :aria-label="t('ui.password.strength.label')">
                    <div class="h-full rounded-full transition-[width]" :class="bars[level]" :style="{ width: `${(passed / checks.length) * 100}%` }" />
                </div>
                <span class="text-xs font-semibold" :class="words[level]" data-test="strength-word">{{ t(`ui.password.strength.${level}`) }}</span>
            </div>
            <ul class="mt-1.5 space-y-0.5 text-xs">
                <li v-for="check in checks" :key="check.key" class="flex items-center gap-1.5" :class="check.passes ? 'text-success' : 'text-ink-subtle'" :data-test="`check-${check.key}`" :data-passes="check.passes ? 'true' : 'false'">
                    <Check class="h-3 w-3" :class="check.passes ? '' : 'opacity-40'" aria-hidden="true" />
                    {{ t(`ui.password.checks.${check.key}`, { min: props.minLength }) }}
                </li>
            </ul>
        </div>
    </UiFormField>
</template>
