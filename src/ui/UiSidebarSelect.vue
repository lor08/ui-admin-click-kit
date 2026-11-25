<script setup lang="ts">
import type { UiSelectOption } from './UiSelect.vue';
import { ChevronDown } from 'lucide-vue-next';

/** A small native select drawn for the dark sidebar (the language switch); UiSelect is for light surfaces. */
const props = defineProps<{ modelValue: string; options: UiSelectOption[]; label: string }>();

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
</script>

<template>
    <div class="relative px-3 py-1">
        <select
            :value="props.modelValue"
            :aria-label="props.label"
            class="h-8 w-full appearance-none rounded-control border border-sidebar-line bg-sidebar-hover pl-2.5 pr-8 text-xs text-sidebar-ink focus-visible:outline-2 focus-visible:outline-white/70"
            data-test="sidebar-select"
            @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
        >
            <option v-for="option in props.options" :key="option.value" :value="option.value">{{ option.label }}</option>
        </select>
        <ChevronDown class="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-sidebar-muted" aria-hidden="true" />
    </div>
</template>
