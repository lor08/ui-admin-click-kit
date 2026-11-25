<script setup lang="ts">
/**
 * A choice in the softphone's settings, Click's `<label>` around a
 * full-width `<select>`: the label above, the options in their order;
 * a `placeholder` is Click's disabled first option, chosen while the
 * model is "". `focus` tells the choice is about to be made.
 */
const props = withDefaults(defineProps<{ label: string; options: { value: string; label: string }[]; placeholder?: string }>(), { placeholder: undefined });
const model = defineModel<string>({ required: true });
const emit = defineEmits<{ focus: [] }>();
</script>

<template>
    <label class="block">
        {{ props.label }}
        <select v-model="model" class="mt-0.5 block w-full rounded-[6px] border border-slate-300 bg-white px-2 py-[5px] text-slate-800" @focus="emit('focus')">
            <option v-if="props.placeholder !== undefined" value="" disabled>{{ props.placeholder }}</option>
            <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
    </label>
</template>
