<script setup lang="ts">
import UiIconButton from './UiIconButton.vue';
import { useTrans } from './kit';
import { CircleCheck, CircleX, Info, TriangleAlert } from '@lucide/vue';
import { computed } from 'vue';

type Variant = 'info' | 'warning' | 'success' | 'danger';

/** A message that stays on the page until the page changes or the reader dismisses it; a passing notice is a toast. */
const props = withDefaults(defineProps<{ variant?: Variant; title?: string | null; dismissible?: boolean }>(), {
    variant: 'info',
    title: null,
    dismissible: false,
});

const emit = defineEmits<{ dismiss: [] }>();

const t = useTrans();

const variants: Record<Variant, string> = {
    info: 'border-info/30 bg-info-surface text-info',
    warning: 'border-warning/30 bg-warning-surface text-warning',
    success: 'border-success/30 bg-success-surface text-success',
    danger: 'border-danger/30 bg-danger-surface text-danger',
};

const icons = { info: Info, warning: TriangleAlert, success: CircleCheck, danger: CircleX } as const;

const classes = computed(() => ['flex gap-3 rounded-control border px-4 py-3 text-sm', variants[props.variant]]);
</script>

<template>
    <div :class="classes" :role="props.variant === 'danger' ? 'alert' : 'status'" :data-variant="props.variant">
        <component :is="icons[props.variant]" class="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <div class="min-w-0 grow">
            <p v-if="props.title" class="font-semibold">{{ props.title }}</p>
            <div :class="props.title ? 'mt-0.5 text-ink' : ''"><slot /></div>
        </div>
        <UiIconButton v-if="props.dismissible" :label="t('ui.dismiss')" size="sm" class="-my-1 -mr-2 text-current hover:bg-black/5 hover:text-current" @click="emit('dismiss')">
            <CircleX class="h-4 w-4" />
        </UiIconButton>
    </div>
</template>
