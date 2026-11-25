<script setup lang="ts">
import { TooltipContent, TooltipPortal, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui';

/** A short hint over the element in the slot, on hover and on focus. */
withDefaults(defineProps<{ text: string; side?: 'top' | 'right' | 'bottom' | 'left' }>(), { side: 'top' });
</script>

<template>
    <TooltipProvider :delay-duration="300">
        <TooltipRoot>
            <TooltipTrigger as-child>
                <slot />
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent :side="side" :side-offset="6" class="z-50 max-w-xs rounded-control bg-ink px-2.5 py-1.5 text-xs text-white shadow-lg" data-test="tooltip">
                    {{ text }}
                </TooltipContent>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>
