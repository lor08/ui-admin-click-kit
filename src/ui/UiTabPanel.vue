<script setup lang="ts">
import { TabsContent } from 'reka-ui';

defineProps<{ value: string }>();
</script>

<template>
    <TabsContent :value="value" class="pt-4 focus:outline-none">
        <slot />
    </TabsContent>
</template>
