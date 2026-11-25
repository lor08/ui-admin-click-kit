<script setup lang="ts">
/** The phone's twelve keys, Click's DIALPAD; `letters` prints the letters under the digits, as the panel's keypad does. */
const props = withDefaults(defineProps<{ letters?: boolean }>(), { letters: false });
const emit = defineEmits<{ press: [digit: string] }>();

const KEYS = [
    ['1', ''],
    ['2', 'ABC'],
    ['3', 'DEF'],
    ['4', 'GHI'],
    ['5', 'JKL'],
    ['6', 'MNO'],
    ['7', 'PQRS'],
    ['8', 'TUV'],
    ['9', 'WXYZ'],
    ['*', ''],
    ['0', '+'],
    ['#', ''],
] as const;
</script>

<template>
    <div class="mb-2.5 grid grid-cols-3 gap-1.5">
        <button
            v-for="[digit, letters] in KEYS"
            :key="digit"
            type="button"
            class="cursor-pointer rounded-[6px] border border-slate-200 bg-slate-50 pt-2 pb-1.5 font-semibold text-slate-700"
            :data-test="`key-${digit}`"
            @click="emit('press', digit)"
        >
            {{ digit }}<small v-if="props.letters" class="block min-h-[11px] text-[9px] font-normal tracking-[1px] text-slate-400">{{ letters || '&nbsp;' }}</small>
        </button>
    </div>
</template>
